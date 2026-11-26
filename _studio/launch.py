"""Serve the portfolio editor on a private loopback address for one session."""

import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import secrets
import webbrowser

STUDIO = Path(__file__).resolve().parent
ROOT = STUDIO.parent
FILES = {
    "": (STUDIO / "index.html", "text/html; charset=utf-8"),
    "studio.css": (STUDIO / "studio.css", "text/css; charset=utf-8"),
    "studio.js": (STUDIO / "studio.js", "text/javascript; charset=utf-8"),
    "style.css": (ROOT / "style.css", "text/css; charset=utf-8"),
    "projects.js": (ROOT / "projects.js", "text/javascript; charset=utf-8"),
    "fonts/dm-sans.woff2": (ROOT / "fonts/dm-sans.woff2", "font/woff2"),
    "fonts/dm-mono.woff2": (ROOT / "fonts/dm-mono.woff2", "font/woff2"),
    "fonts/instrument-serif-italic.woff2": (ROOT / "fonts/instrument-serif-italic.woff2", "font/woff2"),
}


def run(open_browser):
    prefix = f"/edit/{secrets.token_urlsafe(24)}/"

    class StudioHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            if self.headers.get("Host") != host or not self.path.startswith(prefix):
                self.send_error(404)
                return
            entry = FILES.get(self.path[len(prefix):])
            if not entry:
                self.send_error(404)
                return
            path, content_type = entry
            try:
                content = path.read_bytes()
            except OSError:
                self.send_error(404)
                return
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("X-Frame-Options", "DENY")
            self.send_header("Referrer-Policy", "no-referrer")
            self.send_header(
                "Content-Security-Policy",
                "default-src 'none'; connect-src https://api.github.com; "
                "script-src 'self'; style-src 'self'; font-src 'self'; "
                "img-src blob: data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
            )
            self.end_headers()
            self.wfile.write(content)

        def log_message(self, *_):
            pass

    with ThreadingHTTPServer(("127.0.0.1", 0), StudioHandler) as server:
        host = f"127.0.0.1:{server.server_port}"
        url = f"http://{host}{prefix}"
        print(f"Project editor: {url}", flush=True)
        print("Close this window or press Ctrl+C to stop the editor.", flush=True)
        if open_browser:
            webbrowser.open(url)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--no-open", action="store_true", help="Print the session URL without opening a browser.")
    run(not parser.parse_args().no_open)
