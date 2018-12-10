#!/usr/bin/env python
"""
Very simple HTTP server in python.

Usage::
    ./dummy-web-server.py [<port>]

Send a GET request::
    curl http://localhost

Send a HEAD request::
    curl -I http://localhost

Send a POST request::
    curl -d "foo=bar&bin=baz" http://localhost

"""
from http.server import BaseHTTPRequestHandler, HTTPServer
import socketserver 
import json

class DummyServer(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        host, _ = self.client_address
        # print('Request payload:', self.rfile.read())
        self._set_headers()
        self.wfile.write(json.dumps({"this": "that"}))

    def do_HEAD(self):
        host, _ = self.client_address
        self._set_headers()
        
    def do_POST(self):
        # print('Request payload:', self.rfile.read())
        host, _ = self.client_address
        self._set_headers()
        self.wfile.write(json.dumps({"token": "dummy-token"}).encode())
        # self.wfile.close()

    def do_OPTIONS(self):
        host, _ = self.client_address
        self._set_headers()
        
def run(server_class=HTTPServer, handler_class=DummyServer, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print('Starting httpd...')
    httpd.serve_forever()

if __name__ == "__main__":
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()
