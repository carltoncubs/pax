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


class BaseTest(unittest.TestCase):
    USE_BROWSERSTACK = False

    def setUp(self):
        if self.USE_BROWSERSTACK:
            self.drivers = build_remote_drivers()
        else:
            self.drivers = build_drivers()

    def tearDown(self):
        for driver in self.drivers:
            driver.quit()


class HeaderTests(BaseTest):
    def test_press_hamburger(self):
        """Pressing the hamburger button should open the navigation menu."""
        pass

    def test_press_auth_circle(self):
        """Pressing the auth circle should display a drop down with the logged
        in user's email, name and a button to log out.

        """
        pass


class NavMenuTests(BaseTest):
    def test_highlight_current_page(self):
        """When open, the nav menu should have the current page's link with
        the class set to "active".

        """
        pass

    def test_display_links_to_all_pages(self):
        """The navigation menu should display links to all pages."""
        pass


class SignInTests(BaseTest):
    def test_proper_title(self):
        """On the sign in page the title should be "Carlton Cubs Attendance -
        Sign Out".

        """
        pass

    def test_proper_header_text(self):
        """On the sign in page, the header should display "Sign In"."""
        pass

    def test_failed_validation(self):
        """When validaton fails, it should show snackbars for each of the failed
        validation fields.
        """
        pass

    def test_passed_validation(self):
        """When validation passes, it should send a POST requests to the API
        with the sign in details.

        """
        pass

    def test_successful_signin(self):
        """When the server responds successfully, a snackbar should be
        displayed saying the cub has been signed in.

        """
        pass

    def test_failed_signin(self):
        """When the server responds in failure, a snackbar should be displayed
        saying the cub was not signed in.

        """
        pass

    def test_autocompletion(self):
        """When the user starts typing in the cub name textbox, it should
        start autocompleting the name.

        """
        pass


class SignOutTests(BaseTest):
    def test_proper_title(self):
        """On the sign in page the title should be "Carlton Cubs Attendance -
        Sign Out".

        """
        pass

    def test_proper_header_text(self):
        """On the sign in page, the header should display "Sign Out"."""
        pass

    def test_failed_validation(self):
        """When validaton fails, it should show snackbars for each of the failed
        validation fields.
        """
        pass

    def test_passed_validation(self):
        """When validation passes, it should send a POST requests to the API
        with the sign in details.

        """
        pass

    def test_successful_signout(self):
        """When the server responds successfully, a snackbar should be
        displayed saying the cub has been signed out.

        """
        pass

    def test_failed_signout(self):
        """When the server responds in failure, a snackbar should be displayed
        saying the cub was not signed out.

        """
        pass

    def test_autocompletion(self):
        """When the user starts typing in the cub name textbox, it should
        start autocompleting the name.

        """
        pass


def SettingsTests(BaseTest):
    def test_proper_title(self):
        """The page title should be "Carlton Cubs Attendance - Settings"

        """
        pass

    def test_proper_header_text(self):
        """The page header should contain "Settings"."""
        pass

    def test_failed_validation(self):
        """When validation fails the user should be notified with snackbars
        for each validation failure.

        """
        pass

    def test_passed_validation(self):
        """When validation passes, the data should be submitted to the API."""
        pass

    def test_successful_submission(self):
        """When the settings are successfully submitted, the user should be
        notified by a snackbar.

        """
        pass

    def test_failed_submission(self):
        """When sthe settings fail to be submitted, the user should be
        notified by a snackbar.

        """
        pass

    def test_successful_autofill(self):
        """When the server responds with previous settings they should be fill
        into the fields and the user notified with a snackbar.

        """
        pass

    def test_failed_autofill(self):
        """When the server responds in failure to retreiving settings, the
        user should be notified with a snackbar.

        """
        pass

    def test_non_existant_autofill(self):
        """When previous settings do not exist, the fields should not be
        filled in and the user should not be notified.

        """
        pass


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
