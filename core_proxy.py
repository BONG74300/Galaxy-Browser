import os
import json
import urllib.request
from http.server import HTTPServer, BaseHTTPRequestHandler

class LinuxProxyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/proxy/'):
            target = self.path[7:]
            if not target.startswith('http'):
                target = 'https://' + target
            try:
                req = urllib.request.Request(target, headers={'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)'})
                with urllib.request.urlopen(req) as res:
                    self.send_response(200)
                    self.send_header('Content-Type', res.headers.get('Content-Type', 'text/html'))
                    self.end_headers()
                    self.wfile.write(res.read())
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"Proxy Gateway Error: {str(e)}".encode())
        else:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "Python Core Active", "tunnel": "SECURE"}).encode())

if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', 8080), LinuxProxyHandler)
    print("Python Proxy Core running on port 8080...")
    server.serve_forever()
