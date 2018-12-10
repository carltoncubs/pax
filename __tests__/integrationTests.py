#!/usr/bin/env python3
"""Integration tests for frontend.

This script starts up a dummy server on port 8000 that records
requests and asserts that they are as expected. It uses Selelnium to
cause the frontend to make requests and also allows us to assert
things about the interface.

"""

import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities


def main(driver):
    driver.get("http://www.google.com")
    if not "Google" in driver.title:
        raise Exception("Unable to load google page!")
    elem = driver.find_element_by_name("q")
    elem.send_keys("BrowserStack")
    elem.submit()
    print(driver.title)


if __name__ == "__main__":
    desired_cap = {
        "browserName": "iPhone",
        "device": "iPhone 8 Plus",
        "realMobile": "true",
        "os_version": "11.0",
    }
    driver = webdriver.Remote(
        command_executor="http://{os.getenv('BROWSERSTACK_USERNAME)}:{os.getenv('BROWSERSTACK_PASSWORD')}@hub.browserstack.com:80/wd/hub",
        desired_capabilities=desired_cap,
    )
    try:
        main(driver)
    finally:
        driver.quit()
