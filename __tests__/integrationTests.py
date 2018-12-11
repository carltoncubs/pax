#!/usr/bin/env python3
"""Integration tests for frontend.

This script starts up a dummy server on port 8000 that records
requests and asserts that they are as expected. It uses Selelnium to
cause the frontend to make requests and also allows us to assert
things about the interface.

"""

import os
import argparse
import unittest
import multiprocessing
import time
import subprocess

from selenium import webdriver

from dummy_web_server import run as run_server


class SignInTests(unittest.TestCase):
    USE_BROWSERSTACK = False

    def setUp(self):
        if self.USE_BROWSERSTACK:
            self.drivers = build_remote_drivers()
        else:
            self.drivers = build_drivers()

    def tearDown(self):
        for driver in self.drivers:
            driver.quit()

    def test_google_search(self):
        for driver in self.drivers:
            driver.get("http://localhost:3000/sign-in")


def build_remote_drivers():
    """For multiplatform testing with BrowserStack.

    This builds a driver that will allow us to test using multiple
    platforms on BrowserStack.

    """
    username = os.getenv("BROWSERSTACK_USERNAME")
    password = os.getenv("BROWSERSTACK_PASSWORD")
    desired_cap = {
        "browserName": "iPhone",
        "device": "iPhone 8 Plus",
        "realMobile": "true",
        "os_version": "11.0",
    }
    driver = webdriver.Remote(
        command_executor=f"http://{username}:{password}@hub.browserstack.com:80/wd/hub",
        desired_capabilities=desired_cap,
    )
    return [driver]


def build_drivers():
    """For local testing.

    This builds a driver to use on the machine running this script.

    """
    firefox = webdriver.Firefox()
    chrome = webdriver.Chrome()
    return [firefox, chrome]


def main(use_browserstack):
    SignInTests.USE_BROWSERSTACK = use_browserstack
    suite = unittest.TestSuite()
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(SignInTests)
    runner = unittest.TextTestRunner()
    runner.run(suite)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Integration test runner.")
    parser.add_argument(
        "--browserstack",
        type=bool,
        default=False,
        required=False,
        help="use a remove driver for BrowserStack",
    )
    args = parser.parse_args()
    backend = multiprocessing.Process(target=run_server)
    backend.start()
    main(args.browserstack)
    backend.terminate()
