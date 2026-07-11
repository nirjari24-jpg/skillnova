import json
import os
import subprocess
import urllib.error
import urllib.request
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent

TOOLS = [
    {
        "functionDeclarations": [
            {
                "name": "list_files",
                "description": "List all workspace files recursively.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {}
                }
            },
            {
                "name": "read_file",
                "description": "Read the contents of a file in the workspace.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "path": {
                            "type": "STRING",
                            "description": "The relative file path."
                        }
                    },
                    "required": ["path"]
                }
            },
            {
                "name": "write_file",
                "description": "Create or overwrite a workspace file.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "path": {
                            "type": "STRING",
                            "description": "The relative file path."
                        },
                        "content": {
                            "type": "STRING",
                            "description": "The contents to write to the file."
                        }
                    },
                    "required": ["path", "content"]
                }
            },
            {
                "name": "run_command",
                "description": "Run a shell command in the workspace.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "command": {
                            "type": "STRING",
                            "description": "The shell command to execute."
                        }
                    },
                    "required": ["command"]
                }
            }
        ]
    }
]


def list_files():
    files = []
    exclude_dirs = {
        ".git", ".venv", ".vscode", "__pycache__",
        ".pytest_cache", "skillnova.egg-info"
    }
    for path in ROOT.rglob("*"):
        if any(part in exclude_dirs for part in path.relative_to(ROOT).parts):
            continue
        if path.is_file():
            files.append(str(path.relative_to(ROOT).as_posix()))
    return {"files": files}


def read_file(path_str):
    target_path = (ROOT / path_str).resolve()
    if ROOT not in target_path.parents and target_path != ROOT:
        return {"error": "Access denied: outside workspace"}
    if not target_path.exists():
        return {"error": f"File not found: {path_str}"}
    if not target_path.is_file():
        return {"error": f"Not a file: {path_str}"}
    try:
        content = target_path.read_text(encoding="utf-8")
        return {"content": content}
    except Exception as e:
        return {"error": str(e)}


def write_file(path_str, content):
    target_path = (ROOT / path_str).resolve()
    if ROOT not in target_path.parents and target_path != ROOT:
        return {"error": "Access denied: outside workspace"}
    try:
        target_path.parent.mkdir(parents=True, exist_ok=True)
        target_path.write_text(content, encoding="utf-8")
        return {
            "status": "success",
            "message": f"File {path_str} written successfully"
        }
    except Exception as e:
        return {"error": str(e)}


def run_command(command_str):
    try:
        res = subprocess.run(
            command_str,
            shell=True,
            cwd=str(ROOT),
            capture_output=True,
            text=True,
            timeout=30
        )
        return {
            "stdout": res.stdout,
            "stderr": res.stderr,
            "exit_code": res.returncode
        }
    except Exception as e:
        return {"error": str(e)}


def handle_tool_call(name, args):
    if name == "list_files":
        return list_files()
    elif name == "read_file":
        return read_file(args.get("path", ""))
    elif name == "write_file":
        return write_file(args.get("path", ""), args.get("content", ""))
    elif name == "run_command":
        return run_command(args.get("command", ""))
    else:
        return {"error": f"Unknown tool: {name}"}


def call_gemini(contents, tools, api_key):
    url = (
        "https://generativelanguage.googleapis.com/v1beta/"
        f"models/gemini-1.5-flash:generateContent?key={api_key}"
    )
    payload = {
        "contents": contents,
    }
    if tools:
        payload["tools"] = tools

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            return json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as err:
        error_body = err.read().decode("utf-8")
        try:
            err_json = json.loads(error_body)
            msg = (
                err_json.get("error", {}).get("message")
                or error_body
            )
        except Exception:
            msg = error_body
        raise Exception(f"Gemini API Error ({err.code}): {msg}")


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

    def do_POST(self):
        if self.path != "/api/gemini":
            self._send_json(
                {"error": "Not found"},
                status=HTTPStatus.NOT_FOUND
            )
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = self.rfile.read(length) if length else b"{}"
            body = json.loads(payload.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            self._send_json(
                {"error": "Invalid JSON body"},
                status=HTTPStatus.BAD_REQUEST
            )
            return

        prompt = (body.get("prompt") or "").strip()
        api_key = (body.get("apiKey") or "").strip()
        history = body.get("history") or []

        if not api_key:
            self._send_json(
                {"error": "apiKey is required"},
                status=HTTPStatus.BAD_REQUEST
            )
            return

        contents = list(history)
        if prompt:
            contents.append({"role": "user", "parts": [{"text": prompt}]})

        trace = []
        max_turns = 12
        turn = 0

        try:
            while turn < max_turns:
                response_data = call_gemini(contents, TOOLS, api_key)

                candidates = response_data.get("candidates", [])
                if not candidates:
                    raise Exception("No candidates returned from Gemini API")

                first_candidate = candidates[0]
                content = first_candidate.get("content")
                if not content:
                    raise Exception("No content returned in candidate")

                parts = content.get("parts") or []

                # Check for function calls
                function_calls = []
                for part in parts:
                    if "functionCall" in part:
                        function_calls.append(part["functionCall"])

                # Append model message to history
                contents.append(content)

                if not function_calls:
                    # No tool calls, we are done!
                    break

                # We have function calls, execute them
                response_parts = []
                for call in function_calls:
                    name = call.get("name")
                    args = call.get("args") or {}

                    trace.append({
                        "action": name,
                        "args": args,
                        "status": "running"
                    })

                    result = handle_tool_call(name, args)

                    trace[-1]["status"] = "completed"
                    if "error" in result:
                        trace[-1]["error"] = result["error"]
                    elif name == "list_files":
                        count = len(result.get('files', []))
                        trace[-1]["result"] = f"Listed {count} files"
                    elif name == "read_file":
                        length = len(result.get('content', ''))
                        path = args.get('path')
                        trace[-1]["result"] = f"Read {length} ch from {path}"
                    elif name == "write_file":
                        trace[-1]["result"] = f"Wrote to {args.get('path')}"
                    elif name == "run_command":
                        code = result.get('exit_code')
                        trace[-1]["result"] = f"Cmd exited with code {code}"

                    response_parts.append({
                        "functionResponse": {
                            "name": name,
                            "response": result
                        }
                    })

                # Append tool responses to history
                contents.append({
                    "role": "tool",
                    "parts": response_parts
                })

                turn += 1
            else:
                raise Exception("Max turns reached in tool call loop")

            # Extract the final text response
            response_text = ""
            for part in contents[-1].get("parts") or []:
                if "text" in part:
                    response_text += part["text"]

            if not response_text:
                response_text = (
                    "Action completed, but no response text was returned."
                )

            self._send_json({
                "text": response_text,
                "history": contents,
                "trace": trace
            })

        except Exception as exc:
            self._send_json(
                {"error": str(exc)},
                status=HTTPStatus.BAD_GATEWAY
            )

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
