import json
import os
import urllib.request
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent


class SkillNovaHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path in {"/", "/index.html"}:
            self._serve_file("index.html")
            return

        if self.path.startswith("/api/"):
            self._send_json({"error": "Method not allowed"}, status=HTTPStatus.METHOD_NOT_ALLOWED)
            return

        self._serve_file(self.path.lstrip("/"))

    def do_POST(self):
        if self.path != "/api/gemini":
            self._send_json({"error": "Not found"}, status=HTTPStatus.NOT_FOUND)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = self.rfile.read(length) if length else b"{}"
            body = json.loads(payload.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            self._send_json({"error": "Invalid JSON body"}, status=HTTPStatus.BAD_REQUEST)
            return

        prompt = (body.get("prompt") or "").strip()
        api_key = (body.get("apiKey") or "").strip()

        if not prompt or not api_key:
            self._send_json({"error": "Both prompt and apiKey are required"}, status=HTTPStatus.BAD_REQUEST)
            return

        try:
            request = urllib.request.Request(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}",
                data=json.dumps({
                    "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                }).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(request, timeout=30) as response:
                data = json.loads(response.read().decode("utf-8"))
        except Exception as exc:
            self._send_json({"error": str(exc)}, status=HTTPStatus.BAD_GATEWAY)
            return

        candidates = data.get("candidates", [])
        first_candidate = candidates[0] if candidates else {}
        first_part = first_candidate.get("content", {}).get("parts", [{}])[0]
        response_text = first_part.get("text") or "No response was returned by Gemini."

        self._send_json({"text": response_text})

    def _serve_file(self, relative_path: str):
        if not relative_path:
            relative_path = "index.html"

        file_path = (ROOT / relative_path).resolve()
        if ROOT not in file_path.parents and file_path != ROOT:
            self._send_json({"error": "Forbidden"}, status=HTTPStatus.FORBIDDEN)
            return

        if not file_path.exists() or not file_path.is_file():
            self._send_json({"error": "Not found"}, status=HTTPStatus.NOT_FOUND)
            return

        content_type = "text/html"
        if file_path.suffix == ".css":
            content_type = "text/css"
        elif file_path.suffix == ".js":
            content_type = "application/javascript"

        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(file_path.read_bytes())

    def _send_json(self, payload, status=HTTPStatus.OK):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8001"))
    server = ThreadingHTTPServer(("0.0.0.0", port), SkillNovaHandler)
    print(f"SkillNova server running on http://localhost:{port}")
    server.serve_forever()
