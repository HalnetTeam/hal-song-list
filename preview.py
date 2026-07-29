from __future__ import annotations

import threading
import webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


PROJECT_DIR = Path(__file__).resolve().parent
HOST = "127.0.0.1"


class PreviewServer(ThreadingHTTPServer):
    daemon_threads = True


def main() -> None:
    handler = partial(SimpleHTTPRequestHandler, directory=str(PROJECT_DIR))

    # Port 0 asks Windows to choose an available local port automatically.
    with PreviewServer((HOST, 0), handler) as server:
        port = server.server_address[1]
        url = f"http://{HOST}:{port}/"

        print()
        print("Haru Song List preview is running:")
        print(f"  {url}")
        print()
        print("Keep this window open while previewing.")
        print("Press Ctrl+C or close this window to stop.")
        print()

        threading.Timer(0.5, webbrowser.open, args=(url,)).start()

        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nPreview stopped.")


if __name__ == "__main__":
    main()
