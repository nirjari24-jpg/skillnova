import json
import os
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent

class SkillNovaHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path in {"/", "/index.html"}:
            self._serve_file("index.html")
            return

        if self.path.startswith("/api/"):
            self._send_json(
                {"error": "Method not allowed"},
                status=HTTPStatus.METHOD_NOT_ALLOWED
            )
            return

        self._serve_file(self.path.lstrip("/"))

    def _serve_file(self, relative_path: str):
        if not relative_path:
            relative_path = "index.html"

        file_path = (ROOT / relative_path).resolve()
        if ROOT not in file_path.parents and file_path != ROOT:
            self._send_json(
                {"error": "Forbidden"},
                status=HTTPStatus.FORBIDDEN
            )
            return

        if not file_path.exists() or not file_path.is_file():
            self._send_json(
                {"error": "Not found"},
                status=HTTPStatus.NOT_FOUND
            )
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
        if not relative_path:
            relative_path = "index.html"

        file_path = (ROOT / relative_path).resolve()
        if ROOT not in file_path.parents and file_path != ROOT:
            self._send_json(
                {"error": "Forbidden"},
                status=HTTPStatus.FORBIDDEN
            )
            return

        if not file_path.exists() or not file_path.is_file():
            self._send_json(
                {"error": "Not found"},
                status=HTTPStatus.NOT_FOUND
            )
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


def nova_response(prompt: str) -> str:
    lower_prompt = prompt.lower()
    if not prompt.strip():
        return "Hi there! I'm NOVA, your friendly personal AI assistant. How can I help you today?"

    if any(greeting in lower_prompt for greeting in ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"]):
        return "Hello! I'm NOVA, your friendly assistant. I'm here to help you build, learn, and ship great code. What would you like to do next?"

    if any(keyword in lower_prompt for keyword in ["project", "structure", "repo", "folder", "module"]):
        return "I can help you understand your project structure, suggest next steps, or improve your code. Tell me which part you'd like to explore."

    if any(keyword in lower_prompt for keyword in ["test", "pytest", "unit test", "suite"]):
        return "I can help you write tests, verify behavior, and explain what your code should do. Share the function or module you'd like to cover."

    if any(keyword in lower_prompt for keyword in ["code", "function", "python", "javascript", "cli", "command"]):
        return "I can help you write code, improve functions, or build a CLI. Describe the feature you want and I'll suggest the next steps."

    if "help" in lower_prompt or "assist" in lower_prompt:
        return "Absolutely! I'm NOVA, your friendly helper. Ask me anything about your project, code, testing, or design and I'll guide you through it."

    return (
        "Thanks for asking! I'm NOVA, your friendly AI helper. "
        "I can assist with planning, coding, tests, and design. "
        "Tell me more about what you'd like to do, and I'll help you get there."
    )


def log_message(self, format, *args):
    return


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8001"))
    server = ThreadingHTTPServer(("0.0.0.0", port), SkillNovaHandler)
    print(f"SkillNova server running on http://localhost:{port}")
    server.serve_forever()
