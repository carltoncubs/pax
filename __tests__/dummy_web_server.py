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
import multiprocessing

MOST_RECENT_DATA = {}


def _get_endpoint(url):
    return url.split("/")[-1]


def make_dummy_handler(response_mappings, force_action):
    get_mappings = response_mappings.get(
        "GET",
        {
            "settings": {
                "spreadsheetID": "",
                "attendanceSheet": "",
                "autocompleteSheet": "",
            },
            "names": {"names": ["name1", "name2", "name3"]},
        },
    )

    class DummyRequestHandler(BaseHTTPRequestHandler):
        def _set_headers(self):
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header(
                "Access-Control-Allow-Headers", "Content-Type, Authorization"
            )
            self.end_headers()

        def do_GET(self):
            if force_action == "FAIL":
                self.send_error(500)
            else:
                self._set_headers()
                self.wfile.write(
                    json.dumps(get_mappings.get(_get_endpoint(self.path))).encode()
                )

        def do_HEAD(self):
            if force_action == "FAIL":
                self.send_error(500)
            else:
                self._set_headers()

        def do_POST(self):
            if force_action == "FAIL":
                self.send_error(500)
            else:
                data = self.rfile.read(int(self.headers.get("content-length"))).decode(
                    "utf-8"
                )
                self._set_headers()
                MOST_RECENT_DATA = json.loads(data)

        def do_OPTIONS(self):
            self._set_headers()
            print("Received options request")

    return DummyRequestHandler


class DummyServer:
    def __init__(self, response_mappings={}, force_action=None):
        self.response_mappings = response_mappings
        self.force_action = force_action

    def start(self):
        server_address = ("", 8000)
        handler_class = make_dummy_handler(self.response_mappings, self.force_action)
        httpd = HTTPServer(server_address, handler_class)
        self.server_proc = multiprocessing.Process(target=httpd.serve_forever)
        self.server_proc.start()

    def stop(self):
        self.server_proc.terminate()

    def received_data(self, data):
        for k in data:
            if MOST_RECENT_DATA.get(k) != data[k]:
                return False
        return True


if __name__ == "__main__":
    srv = DummyServer()
    srv.start()
