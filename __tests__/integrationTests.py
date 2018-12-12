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

from dummy_web_server import DummyServer

EXPECTED_DATA_URI = """data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaIAAADRCAYAAACOyra0AAADAElEQVR4nO3drW5UURQF4PUI8wadJyA8AITRfQGQI3gALA6PqcCQIEbhMCgctaiSNHWtAIOj/AREEUXQhtBz9N0h+/uSa0Ytt7Ln7nNPAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA/2yT5F51CAB6epfk8uo5Lc4CQDOb/C2h6+dFZSAAenmQsYh+JdmrDAVAL18yltFhZSAAermfsYguk9ypDAVAL0cZi+hHaSIA2plNRa9KEwHQyrPMy8jiAgCL+ZmxiJwtAmAxDzOfivYrQwHQy1nGIvpemgiAVm5lPhU9rgwFQC/PMxbR19JEALTzOaYiAAqtklzk3yK6uPodABbxKONUdFyaCIB2jjOW0e3SRAC0cjdjEb0tTQRAOwcZy2hbGQiAXlYZ7y36EIsLACxotriwqwwEQD8fY3EBgEKzxYXzKCMAFjRbXDiJ90UALOh9xjJ6U5oIgFZWSb7F+yIACu3HQVcAis3eF20qAwHQyzrjQVdTEQCLmk1F3hUBsJh1xiI6LMwDQEMvM5aRc0UALGYvvkMHQLFdbNABUGgd54oAKOZcEQClZhfonZQmAqCd13GuCIBCszuLdpWBAOjn5jUR57VxAOhmG0sLABRaZyyig8pAAPRz8++5T7VxAOjmaWzPAVBotj33pDIQAP3YngOg1DbjVLQtzANAM6u4NA+AYrv4ygIAhVb5MwVdT0NubgUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABr4DaGH+jNwIkr6AAAAAElFTkSuQmCC"""


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

    @classmethod
    def setUpClass(cls):
        if cls.USE_BROWSERSTACK:
            cls.drivers = build_remote_drivers()
        else:
            cls.drivers = build_drivers()

    @classmethod
    def tearDownClass(cls):
        for driver in cls.drivers:
            driver.quit()

    def tearDown(self):
        self.stop_server()

    def start_server(self, response_mappings={}, force_action=None):
        self.server = DummyServer(response_mappings, force_action)
        self.server.start()

    def stop_server(self):
        self.server.stop()
        # Sleep for a short time to allow the port to be returned to
        # the OS
        time.sleep(2)


class HeaderTests(BaseTest):
    def test_press_hamburger(self):
        """Pressing the hamburger button should open the navigation menu."""
        self.start_server()
        for driver in self.drivers:
            driver.get("http://localhost:3000/sign-in")
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
            driver.get("http://localhost:3000/sign-in")
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
            wait = WebDriverWait(driver, 10)
            for endpoint, name in (
                ("sign-in", "Sign In"),
                ("sign-out", "Sign Out"),
                ("settings", "Settings"),
                ("privacy", "Privacy"),
            ):
                driver.get(f"http://localhost:3000/{endpoint}")
                button = driver.find_element_by_id("navmenu-button")
                button.click()
                current = wait.until(EC.element_to_be_clickable((By.ID, "current")))
                self.assertEqual(current.text, name)
        self.stop_server()

    def test_display_links_to_all_pages(self):
        """The navigation menu should display links to all pages."""
        self.start_server()
        for driver in self.drivers:
            endpoints = ("sign-in", "sign-out", "settings", "privacy")
            item_names = sorted(("Sign In", "Sign Out", "Settings", "Privacy"))
            for endpoint in endpoints:
                driver.get(f"http://localhost:3000/{endpoint}")
                button = driver.find_element_by_id("navmenu-button")
                button.click()
                drawer = driver.find_element_by_id("navmenu-drawer")
                item_list = drawer.find_element_by_tag_name("ul")
                items = item_list.find_elements_by_tag_name("a")
                self.assertEqual(sorted([item.text for item in items]), item_names)
        self.stop_server()


class SignInTests(BaseTest):
    def tearDown(self):
        self.stop_server()

    def test_proper_title(self):
        """On the sign in page the title should be "Carlton Cubs Attendance -
        Sign In".

        """
        self.start_server()
        for driver in self.drivers:
            driver.get("http://localhost:3000/sign-in")
            self.assertEqual(driver.title, "Carlton Cubs Attendance - Sign In")
        # self.stop_server()

    def test_proper_header_text(self):
        """On the sign in page, the header should display "Sign In"."""
        self.start_server()
        for driver in self.drivers:
            driver.get("http://localhost:3000/sign-in")
            title = driver.find_element_by_id("header-title")
            self.assertEqual(title.text, "Sign In")
        # self.stop_server()

    def test_failed_validation(self):
        """When validaton fails, it should show snackbars for each of the failed
        validation fields.
        """
        self.start_server()
        for driver in self.drivers:
            driver.get("http://localhost:3000/sign-in")
            submit = driver.find_element_by_class_name("submitButton")
            submit.click()
            snackbars = driver.find_elements_by_class_name("error-notification")
            self.assertEqual(len(snackbars), 3)

            driver.get("http://localhost:3000/sign-in")
            cub_name_txt = driver.find_element_by_id("cubName")
            cub_name_txt.send_keys("Cub Name")
            submit = driver.find_element_by_class_name("submitButton")
            submit.click()
            snackbars = driver.find_elements_by_class_name("error-notification")
            self.assertEqual(len(snackbars), 2)

            driver.get("http://localhost:3000/sign-in")
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
            driver.get("http://localhost:3000/sign-in")
            cub_name_txt = driver.find_element_by_id("cubName")
            cub_name_txt.send_keys("Cub Name")
            cub_sig_pad = driver.find_element_by_class_name("signaturePad")
            draw_on_canvas(driver, cub_sig_pad.find_element_by_tag_name("canvas"))
            parent_sig_pad = driver.find_elements_by_class_name("signaturePad")[1]
            draw_on_canvas(driver, parent_sig_pad.find_element_by_tag_name("canvas"))

            submit = driver.find_element_by_class_name("submitButton")
            submit.click()

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
            driver.get("http://localhost:3000/sign-in")
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
            driver.get("http://localhost:3000/sign-in")
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
            driver.get("http://localhost:3000/sign-in")
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
    def tearDown(self):
        self.stop_server()

    def test_proper_title(self):
        """On the sign in page the title should be "Carlton Cubs Attendance -
        Sign Out".

        """
        self.start_server()
        for driver in self.drivers:
            driver.get("http://localhost:3000/sign-out")
            self.assertEqual(driver.title, "Carlton Cubs Attendance - Sign Out")
        self.stop_server()

    def test_proper_header_text(self):
        """On the sign in page, the header should display "Sign Out"."""
        self.start_server()
        for driver in self.drivers:
            driver.get("http://localhost:3000/sign-out")
            title = driver.find_element_by_id("header-title")
            self.assertEqual(title.text, "Sign Out")
        self.stop_server()

    def test_failed_validation(self):
        """When validaton fails, it should show snackbars for each of the
        failed validation fields.

        """
        self.start_server()
        for driver in self.drivers:
            driver.get("http://localhost:3000/sign-out")
            submit = driver.find_element_by_class_name("submitButton")
            submit.click()
            snackbars = driver.find_elements_by_class_name("error-notification")
            self.assertEqual(len(snackbars), 2)

            driver.get("http://localhost:3000/sign-out")
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
            driver.get("http://localhost:3000/sign-out")
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
            driver.get("http://localhost:3000/sign-out")
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
            driver.get("http://localhost:3000/sign-out")
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
            driver.get("http://localhost:3000/sign-out")
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
    def tearDown(self):
        self.stop_server()

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
    BaseTest.USE_BROWSERSTACK = use_browserstack
    loader = unittest.defaultTestLoader
    # suite = loader.loadTestsFromTestCase(SignInTests)
    suite = loader.loadTestsFromName(__name__)
    runner = unittest.TextTestRunner(verbosity=2)
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
    main(args.browserstack)
