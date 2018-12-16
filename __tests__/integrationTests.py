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
import time

from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.chrome.options import Options as ChromeOptions

from dummy_web_server import DummyServer


def draw_on_canvas(driver, canvas):
    """Draw on a canvas."""
    drawing = (
        ActionChains(driver)
        .click_and_hold(canvas)
        .move_by_offset(-10, -15)
        .move_by_offset(20, 32)
        .move_by_offset(10, 25)
        .release()
    )
    drawing.perform()


class BaseTest(unittest.TestCase):
    USE_BROWSERSTACK = False
    SERVER_PORT = 8000
    HEADLESS = False
    CLIENT_PORT = 3000

    @classmethod
    def setUpClass(cls):
        if cls.USE_BROWSERSTACK:
            cls.drivers = build_remote_drivers()
        else:
            cls.drivers = build_drivers(cls.HEADLESS)

    @classmethod
    def tearDownClass(cls):
        for driver in cls.drivers:
            driver.quit()

    def tearDown(self):
        self.stop_server()

    def start_server(self, response_mappings={}, force_action=None):
        self.server = DummyServer(
            response_mappings, force_action, port=self.SERVER_PORT
        )
        self.server.start()

    def stop_server(self):
        self.server.stop()
        # Sleep for a short time to allow the port to be returned to
        # the OS
        time.sleep(2)

    def build_url(self, endpoint):
        return f"http://localhost:{self.CLIENT_PORT}/{endpoint}"


class HeaderTests(BaseTest):
    def test_press_hamburger(self):
        """Pressing the hamburger button should open the navigation menu."""
        self.start_server()
        for driver in self.drivers:
            driver.get(self.build_url("sign-in"))
            button = driver.find_element_by_id("navmenu-button")
            button.click()
            driver.find_element_by_id("navmenu-drawer")
        self.stop_server()

    def test_press_auth_circle(self):
        """Pressing the auth circle should display a drop down with the logged
        in user's email, name and a button to log out.

        """
        self.start_server()
        for driver in self.drivers:
            driver.get(self.build_url("sign-in"))
            auth_circle = driver.find_element_by_id("auth-button")
            auth_circle.click()
            info_list = driver.find_element_by_id("user-info-list")
            info_list.find_element_by_id("user-name")
            info_list.find_element_by_id("user-email")
            info_list.find_element_by_id("logout")
        self.stop_server()


class NavMenuTests(BaseTest):
    def test_highlight_current_page(self):
        """When open, the nav menu should have the current page's link with
        the class set to "active".

        """
        self.start_server()
        for driver in self.drivers:
            # for endpoint, name in (
            #     ("sign-in", "Sign In"),
            #     ("sign-out", "Sign Out"),
            #     ("settings", "Settings"),
            #     ("privacy", "Privacy"),
            # ):
            endpoint = "sign-in"
            name = "Sign In"
            wait = WebDriverWait(driver, 10)
            driver.get(self.build_url(endpoint))
            button = driver.find_element_by_id("navmenu-button")
            button.click()
            current = wait.until(EC.element_to_be_clickable((By.ID, "current")))
            self.assertEqual(current.text, name)
        self.stop_server()

    def test_display_links_to_all_pages(self):
        """The navigation menu should display links to all pages."""
        self.start_server()
        for driver in self.drivers:
            # endpoints = ("sign-in", "sign-out", "settings", "privacy")
            item_names = sorted(("Sign In", "Sign Out", "Settings", "Privacy"))
            # for endpoint in endpoints:
            endpoint = "sign-in"
            driver.get(self.build_url(endpoint))
            wait = WebDriverWait(driver, 10)
            wait.until(EC.element_to_be_clickable((By.ID, "navmenu-button"))).click()
            drawer = wait.until(
                EC.presence_of_element_located((By.ID, "navmenu-drawer"))
            )
            item_list = drawer.find_element_by_tag_name("ul")
            items = item_list.find_elements_by_tag_name("a")
            self.assertEqual(sorted([item.text for item in items]), item_names)
        self.stop_server()


class SignInTests(BaseTest):
    def setUp(self):
        super().setUp()
        self.url = self.build_url("sign-in")

    def tearDown(self):
        self.stop_server()

    def test_proper_title(self):
        """On the sign in page the title should be "Carlton Cubs Attendance -
        Sign In".

        """
        self.start_server()
        for driver in self.drivers:
            driver.get(self.url)
            self.assertEqual(driver.title, "Carlton Cubs Attendance - Sign In")
        # self.stop_server()

    def test_proper_header_text(self):
        """On the sign in page, the header should display "Sign In"."""
        self.start_server()
        for driver in self.drivers:
            driver.get(self.url)
            title = driver.find_element_by_id("header-title")
            self.assertEqual(title.text, "Sign In")
        # self.stop_server()

    def test_failed_validation(self):
        """When validaton fails, it should show snackbars for each of the failed
        validation fields.
        """
        self.start_server()
        for driver in self.drivers:
            driver.get(self.url)
            submit = driver.find_element_by_class_name("submitButton")
            submit.click()
            snackbars = driver.find_elements_by_class_name("error-notification")
            self.assertEqual(len(snackbars), 3)

            driver.get(self.url)
            cub_name_txt = driver.find_element_by_id("cubName")
            cub_name_txt.send_keys("Cub Name")
            submit = driver.find_element_by_class_name("submitButton")
            submit.click()
            snackbars = driver.find_elements_by_class_name("error-notification")
            self.assertEqual(len(snackbars), 2)

            driver.get(self.url)
            cub_name_txt = driver.find_element_by_id("cubName")
            cub_name_txt.send_keys("Cub Name")
            cub_sig_pad = driver.find_element_by_class_name("signaturePad")
            draw_on_canvas(driver, cub_sig_pad.find_element_by_tag_name("canvas"))

            submit = driver.find_element_by_class_name("submitButton")
            submit.click()
            snackbars = driver.find_elements_by_class_name("error-notification")
            self.assertEqual(len(snackbars), 1)
        # self.stop_server()

    def test_passed_validation(self):
        """When validation passes, it should send a POST requests to the API
        with the sign in details.

        """
        self.start_server()
        for driver in self.drivers:
            driver.get(self.url)

            wait = WebDriverWait(driver, 10)

            cub_name_txt = wait.until(
                EC.presence_of_element_located((By.ID, "cubName"))
            )
            cub_name_txt.send_keys("Cub Name")
            cub_sig_pad = driver.find_element_by_class_name("signaturePad")
            draw_on_canvas(driver, cub_sig_pad.find_element_by_tag_name("canvas"))
            parent_sig_pad = driver.find_elements_by_class_name("signaturePad")[1]
            draw_on_canvas(driver, parent_sig_pad.find_element_by_tag_name("canvas"))

            submit = driver.find_element_by_class_name("submitButton")
            submit.click()

            time.sleep(10)

            data = self.server.last_request_data

            self.assertNotEqual(data["cubName"], None)
            self.assertNotEqual(data["cubSignature"], None)
            self.assertNotEqual(data["parentSignature"], None)

        # self.stop_server()

    def test_successful_signin(self):
        """When the server responds successfully, a snackbar should be
        displayed saying the cub has been signed in.

        """
        self.start_server(force_action="SUCCESS")
        for driver in self.drivers:
            driver.get(self.url)
            cub_name_txt = driver.find_element_by_id("cubName")
            cub_name_txt.send_keys("Cub Name")
            cub_sig_pad = driver.find_element_by_class_name("signaturePad")
            draw_on_canvas(driver, cub_sig_pad.find_element_by_tag_name("canvas"))
            parent_sig_pad = driver.find_elements_by_class_name("signaturePad")[1]
            draw_on_canvas(driver, parent_sig_pad.find_element_by_tag_name("canvas"))

            submit = driver.find_element_by_class_name("submitButton")
            submit.click()

            snackbars = driver.find_elements_by_class_name("success-notification")
            self.assertEqual(len(snackbars), 1)
        # self.stop_server()

    def test_failed_signin(self):
        """When the server responds in failure, a snackbar should be displayed
        saying the cub was not signed in.

        """
        self.start_server(force_action="FAIL")
        for driver in self.drivers:
            driver.get(self.url)
            cub_name_txt = driver.find_element_by_id("cubName")
            cub_name_txt.send_keys("Cub Name")
            cub_sig_pad = driver.find_element_by_class_name("signaturePad")
            draw_on_canvas(driver, cub_sig_pad.find_element_by_tag_name("canvas"))
            parent_sig_pad = driver.find_elements_by_class_name("signaturePad")[1]
            draw_on_canvas(driver, parent_sig_pad.find_element_by_tag_name("canvas"))

            submit = driver.find_element_by_class_name("submitButton")
            submit.click()

            snackbars = driver.find_elements_by_class_name("error-notification")
            self.assertEqual(len(snackbars), 1)
        # self.stop_server()

    def test_form_cleared_on_successful_submission(self):
        self.start_server(force_action="SUCCESS")
        for driver in self.drivers:
            driver.get(self.url)
            cub_name_txt = driver.find_element_by_id("cubName")
            cub_name_txt.send_keys("Cub Name")
            cub_sig_pad = driver.find_element_by_class_name("signaturePad")
            draw_on_canvas(driver, cub_sig_pad.find_element_by_tag_name("canvas"))
            parent_sig_pad = driver.find_elements_by_class_name("signaturePad")[1]
            draw_on_canvas(driver, parent_sig_pad.find_element_by_tag_name("canvas"))

            submit = driver.find_element_by_class_name("submitButton")
            submit.click()

            # wait = WebDriverWait(driver, 10)
            # wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, "canvas")))

            cub_sig_empty = driver.execute_script(
                """
let cub_sig_canvas = document.getElementsByTagName("canvas")[0];
let blank = document.createElement("canvas");
blank.width = cub_sig_canvas.width;
blank.height = cub_sig_canvas.height;

return cub_sig_canvas.toDataURL() == blank.toDataURL();
            """
            )

            parent_sig_empty = driver.execute_script(
                """
let parent_sig_canvas = document.getElementsByTagName("canvas")[1];
let blank = document.createElement("canvas");
blank.width = parent_sig_canvas.width;
blank.height = parent_sig_canvas.height;

return parent_sig_canvas.toDataURL() == blank.toDataURL();
            """
            )

            self.assertEqual(cub_name_txt.text, "")
            self.assertTrue(cub_sig_empty)
            self.assertTrue(parent_sig_empty)

        # self.stop_server()

    def test_autocompletion(self):
        """When the user starts typing in the cub name textbox, it should
        start autocompleting the name.

        """
        self.start_server()
        # self.assertTrue(False)


class SignOutTests(BaseTest):
    def setUp(self):
        super().setUp()
        self.url = self.build_url("sign-out")

    def tearDown(self):
        self.stop_server()

    def test_proper_title(self):
        """On the sign in page the title should be "Carlton Cubs Attendance -
        Sign Out".

        """
        self.start_server()
        for driver in self.drivers:
            driver.get(self.url)
            self.assertEqual(driver.title, "Carlton Cubs Attendance - Sign Out")
        self.stop_server()

    def test_proper_header_text(self):
        """On the sign in page, the header should display "Sign Out"."""
        self.start_server()
        for driver in self.drivers:
            driver.get(self.url)
            title = driver.find_element_by_id("header-title")
            self.assertEqual(title.text, "Sign Out")
        self.stop_server()

    def test_failed_validation(self):
        """When validaton fails, it should show snackbars for each of the
        failed validation fields.

        """
        self.start_server()
        for driver in self.drivers:
            driver.get(self.url)
            submit = driver.find_element_by_class_name("submitButton")
            submit.click()
            snackbars = driver.find_elements_by_class_name("error-notification")
            self.assertEqual(len(snackbars), 2)

            driver.get(self.url)
            cub_name_txt = driver.find_element_by_id("cubName")
            cub_name_txt.send_keys("Cub Name")
            submit = driver.find_element_by_class_name("submitButton")
            submit.click()
            snackbars = driver.find_elements_by_class_name("error-notification")
            self.assertEqual(len(snackbars), 1)
        self.stop_server()

    def test_passed_validation(self):
        """When validation passes, it should send a POST requests to the API
        with the sign in details.

        """
        self.start_server()
        for driver in self.drivers:
            driver.get(self.url)
            cub_name_txt = driver.find_element_by_id("cubName")
            cub_name_txt.send_keys("Cub Name")
            parent_sig_pad = driver.find_element_by_class_name("signaturePad")
            draw_on_canvas(driver, parent_sig_pad.find_element_by_tag_name("canvas"))
            submit = driver.find_element_by_class_name("submitButton")
            submit.click()

            data = self.server.last_request_data

            self.assertNotEqual(data["cubName"], None)
            self.assertNotEqual(data["parentSignature"], None)

    def test_successful_signout(self):
        """When the server responds successfully, a snackbar should be
        displayed saying the cub has been signed out.

        """
        self.start_server(force_action="SUCCESS")
        for driver in self.drivers:
            driver.get(self.url)
            cub_name_txt = driver.find_element_by_id("cubName")
            cub_name_txt.send_keys("Cub Name")
            parent_sig_pad = driver.find_element_by_class_name("signaturePad")
            draw_on_canvas(driver, parent_sig_pad.find_element_by_tag_name("canvas"))

            submit = driver.find_element_by_class_name("submitButton")
            submit.click()

            snackbars = driver.find_elements_by_class_name("success-notification")
            self.assertEqual(len(snackbars), 1)

    def test_failed_signout(self):
        """When the server responds in failure, a snackbar should be displayed
        saying the cub was not signed out.

        """
        self.start_server(force_action="FAIL")
        for driver in self.drivers:
            driver.get(self.url)
            cub_name_txt = driver.find_element_by_id("cubName")
            cub_name_txt.send_keys("Cub Name")
            parent_sig_pad = driver.find_element_by_class_name("signaturePad")
            draw_on_canvas(driver, parent_sig_pad.find_element_by_tag_name("canvas"))

            submit = driver.find_element_by_class_name("submitButton")
            submit.click()

            snackbars = driver.find_elements_by_class_name("error-notification")
            self.assertEqual(len(snackbars), 1)

    def test_form_cleared_on_successful_submission(self):
        self.start_server(force_action="SUCCESS")
        for driver in self.drivers:
            driver.get(self.url)
            cub_name_txt = driver.find_element_by_id("cubName")
            cub_name_txt.send_keys("Cub Name")
            parent_sig_pad = driver.find_element_by_class_name("signaturePad")
            draw_on_canvas(driver, parent_sig_pad.find_element_by_tag_name("canvas"))

            submit = driver.find_element_by_class_name("submitButton")
            submit.click()

            parent_sig_empty = driver.execute_script(
                """
let parent_sig_canvas = document.getElementsByTagName("canvas")[0];
let blank = document.createElement("canvas");
blank.width = parent_sig_canvas.width;
blank.height = parent_sig_canvas.height;

return parent_sig_canvas.toDataURL() == blank.toDataURL();
            """
            )

            self.assertEqual(cub_name_txt.text, "")
            self.assertTrue(parent_sig_empty)

    def test_autocompletion(self):
        """When the user starts typing in the cub name textbox, it should
        start autocompleting the name.

        """
        self.start_server()


def SettingsTests(BaseTest):
    def setUp(self):
        super().setUp()
        self.url = self.build_url("settings")

    def tearDown(self):
        self.stop_server()

    def test_proper_title(self):
        """The page title should be "Carlton Cubs Attendance - Settings"

        """
        self.start_server()
        for driver in self.drivers:
            driver.get(self.url)
            self.assertEqual(driver.title, "Carlton Cubs Attendance - Settings")

    def test_proper_header_text(self):
        """The page header should contain "Settings"."""
        self.start_server()
        for driver in self.drivers:
            driver.get(self.url)
            title = driver.find_element_by_id("header-title")
            self.assertEqual(title.text, "Settings")

    def test_failed_validation(self):
        """When validation fails the user should be notified with snackbars
        for each validation failure.

        """
        self.start_server()
        for driver in self.drivers:
            driver.get(self.url)
            submit = driver.find_element_by_class_name("submitButton")
            submit.click()
            snackbars = driver.find_elements_by_class_name("error-notification")
            self.assertEqual(len(snackbars), 2)

            driver.get(self.url)
            cub_name_txt = driver.find_element_by_id("spreadsheetId")
            cub_name_txt.send_keys("spreadsheet")
            submit = driver.find_element_by_class_name("submitButton")
            submit.click()
            snackbars = driver.find_elements_by_class_name("error-notification")
            self.assertEqual(len(snackbars), 1)

    def test_passed_validation(self):
        """When validation passes, the data should be submitted to the API."""
        self.start_server()
        for driver in self.drivers:
            driver.get(self.url)
            spreadsheet_id_txt = driver.find_element_by_id("spreadsheetId")
            spreadsheet_id_txt.send_keys("spreadsheetId")

            attendance_txt = driver.find_element_by_id("attendanceSheet")
            attendance_txt.send_keys("attendance")

            submit = driver.find_element_by_class_name("submitButton")
            submit.click()

            data = self.server.last_request_data

            self.assertNotEqual(data["spreadsheetId"], None)
            self.assertNotEqual(data["attendanceSheet"], None)

            driver.get(self.url)
            spreadsheet_id_txt = driver.find_element_by_id("spreadsheetId")
            spreadsheet_id_txt.send_keys("spreadsheetId")

            attendance_txt = driver.find_element_by_id("attendanceSheet")
            attendance_txt.send_keys("attendance")

            autocomplete_txt = driver.find_element_by_id("autocompleteSheet")
            autocomplete_txt.send_keys("autocomplete")

            submit = driver.find_element_by_class_name("submitButton")
            submit.click()

            data = self.server.last_request_data

            self.assertNotEqual(data["spreadsheetId"], None)
            self.assertNotEqual(data["attendanceSheet"], None)
            self.assertNotEqual(data["autocompleteSheet"], None)

    def test_successful_submission(self):
        """When the settings are successfully submitted, the user should be
        notified by a snackbar.

        """
        self.start_server(force_action="SUCCESS")
        for driver in self.drivers:
            driver.get(self.url)

            spreadsheet_id_txt = driver.find_element_by_id("spreadsheetId")
            spreadsheet_id_txt.send_keys("spreadsheetId")

            attendance_txt = driver.find_element_by_id("attendanceSheet")
            attendance_txt.send_keys("attendance")

            autocomplete_txt = driver.find_element_by_id("autocompleteSheet")
            autocomplete_txt.send_keys("autocomplete")

            submit = driver.find_element_by_class_name("submitButton")
            submit.click()

            snackbars = driver.find_elements_by_class_name("success-notification")
            self.assertEqual(len(snackbars), 1)

    def test_failed_submission(self):
        """When sthe settings fail to be submitted, the user should be
        notified by a snackbar.

        """
        self.start_server(force_action="FAIL")
        for driver in self.drivers:
            driver.get(self.url)

            spreadsheet_id_txt = driver.find_element_by_id("spreadsheetId")
            spreadsheet_id_txt.send_keys("spreadsheetId")

            attendance_txt = driver.find_element_by_id("attendanceSheet")
            attendance_txt.send_keys("attendance")

            autocomplete_txt = driver.find_element_by_id("autocompleteSheet")
            autocomplete_txt.send_keys("autocomplete")

            submit = driver.find_element_by_class_name("submitButton")
            submit.click()

            snackbars = driver.find_elements_by_class_name("error-notification")
            self.assertEqual(len(snackbars), 1)

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


def build_remote_drivers():
    """For multiplatform testing with BrowserStack.

    This builds a driver that will allow us to test using multiple
    platforms on BrowserStack.

    """
    project = "Cub Attendance"
    username = os.getenv("BROWSERSTACK_USERNAME")
    access_key = os.getenv("BROWSERSTACK_ACCESS_KEY")
    desired_caps = [
        {
            "project": project,
            "browserName": "iPad",
            "device": "iPad 6th",
            "realMobile": "true",
            "os_version": "11.3",
            "browserstack.local": os.getenv("BROWSERSTACK_LOCAL"),
            "browserstack.localIdentifier": os.getenv("BROWSERSTACK_LOCAL_IDENTIFIER"),
        },
        {
            "project": project,
            "browserName": "iPad",
            "device": "iPad 5th",
            "realMobile": "true",
            "os_version": "11.0",
            "browserstack.local": os.getenv("BROWSERSTACK_LOCAL"),
            "browserstack.localIdentifier": os.getenv("BROWSERSTACK_LOCAL_IDENTIFIER"),
        },
        {
            "project": project,
            "device": "iPad 6th",
            "browser": "chrome",
            "browserstack.local": os.getenv("BROWSERSTACK_LOCAL"),
            "browserstack.localIdentifier": os.getenv("BROWSERSTACK_LOCAL_IDENTIFIER"),
        },
        {
            "project": project,
            "device": "iPad 5th",
            "browser": "chrome",
            "browserstack.local": os.getenv("BROWSERSTACK_LOCAL"),
            "browserstack.localIdentifier": os.getenv("BROWSERSTACK_LOCAL_IDENTIFIER"),
        },
    ]

    def build_remote_driver(desired_capabilities):
        return webdriver.Remote(
            command_executor=f"http://{username}:{access_key}@hub.browserstack.com:80/wd/hub",
            desired_capabilities=desired_capabilities,
        )

    return [build_remote_driver(desired_cap) for desired_cap in desired_caps]


def build_drivers(headless=False):
    """For local testing.

    This builds a driver to use on the machine running this script.

    """
    ff_opts = FirefoxOptions()
    chrome_opts = ChromeOptions()

    if headless:
        ff_opts.set_headless(True)
        chrome_opts.set_headless(True)

    firefox = webdriver.Firefox(options=ff_opts)
    chrome = webdriver.Chrome(options=chrome_opts)

    firefox.implicitly_wait(3)
    chrome.implicitly_wait(3)
    return [firefox, chrome]


def main(port=8000, use_browserstack=False, headless=False, client_port=3000):
    BaseTest.USE_BROWSERSTACK = use_browserstack
    BaseTest.SERVER_PORT = port
    BaseTest.HEADLESS = headless
    BaseTest.CLIENT_PORT = client_port
    loader = unittest.defaultTestLoader
    suite = loader.loadTestsFromName(__name__)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Integration test runner.")
    parser.add_argument(
        "--headless",
        type=bool,
        default=False,
        required=False,
        help="Whether to run tests in headless mode or not",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        required=False,
        help="Port to run dummy server on",
    )
    parser.add_argument(
        "--browserstack",
        type=bool,
        default=False,
        required=False,
        help="Use a remove driver for BrowserStack",
    )
    parser.add_argument(
        "--client-port",
        type=int,
        default=3000,
        required=False,
        help="Port the client is running on",
    )
    args = parser.parse_args()
    main(
        port=args.port,
        use_browserstack=args.browserstack,
        headless=args.headless,
        client_port=args.client_port,
    )
