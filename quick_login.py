"""
Quick login script for the kiosk system.
This script attempts to login with common element locator patterns.
"""

from kiosk_automation import KioskAutomation
import time

# Kiosk URL and credentials
KIOSK_URL = "https://arjun-up.ryarramsetti.axiadids.net:8442/user"
USERNAME = "arun10"
PASSWORD = "test"

def try_login():
    """Attempt to login with multiple locator strategies."""
    automation = KioskAutomation(url=KIOSK_URL, headless=False, wait_timeout=15)
    
    try:
        # Navigate to kiosk
        automation.navigate_to_kiosk()
        
        # Take initial screenshot
        automation.take_screenshot("01_initial_page.png")
        
        # Try to find username field with multiple strategies
        username_found = False
        password_found = False
        
        # Common username field locators
        username_locators = [
            ("id", "username"),
            ("name", "username"),
            ("name", "user"),
            ("id", "user"),
            ("xpath", "//input[@type='text']"),
            ("xpath", "//input[@placeholder='Username' or @placeholder='User']"),
            ("xpath", "//input[contains(@class, 'user')]"),
            ("css_selector", "input[type='text']"),
        ]
        
        # Common password field locators
        password_locators = [
            ("id", "password"),
            ("name", "password"),
            ("name", "pass"),
            ("id", "pass"),
            ("xpath", "//input[@type='password']"),
            ("xpath", "//input[@placeholder='Password' or @placeholder='Pass']"),
            ("css_selector", "input[type='password']"),
        ]
        
        # Try to find and fill username
        from selenium.webdriver.common.by import By
        for locator_type, locator_value in username_locators:
            by_map = {
                'id': By.ID,
                'name': By.NAME,
                'xpath': By.XPATH,
                'css_selector': By.CSS_SELECTOR,
            }
            by = by_map.get(locator_type)
            if by:
                element = automation.find_element_safe(by, locator_value, timeout=2)
                if element:
                    element.clear()
                    element.send_keys(USERNAME)
                    print(f"✓ Username entered using {locator_type}: {locator_value}")
                    username_found = True
                    automation.take_screenshot("02_username_entered.png")
                    break
        
        if not username_found:
            print("⚠ Could not find username field. Taking screenshot for inspection.")
            automation.take_screenshot("error_username_not_found.png")
            # Print page source for debugging
            print("\nPage title:", automation.driver.title)
            print("Current URL:", automation.driver.current_url)
        
        time.sleep(1)
        
        # Try to find and fill password
        for locator_type, locator_value in password_locators:
            by_map = {
                'id': By.ID,
                'name': By.NAME,
                'xpath': By.XPATH,
                'css_selector': By.CSS_SELECTOR,
            }
            by = by_map.get(locator_type)
            if by:
                element = automation.find_element_safe(by, locator_value, timeout=2)
                if element:
                    element.clear()
                    element.send_keys(PASSWORD)
                    print(f"✓ Password entered using {locator_type}: {locator_value}")
                    password_found = True
                    automation.take_screenshot("03_password_entered.png")
                    break
        
        if not password_found:
            print("⚠ Could not find password field. Taking screenshot for inspection.")
            automation.take_screenshot("error_password_not_found.png")
        
        time.sleep(1)
        
        # Try to find and click login button
        login_button_found = False
        login_button_locators = [
            ("xpath", "//button[@type='submit']"),
            ("xpath", "//input[@type='submit']"),
            ("xpath", "//button[contains(text(), 'Login') or contains(text(), 'Sign in') or contains(text(), 'Log in')]"),
            ("id", "login-button"),
            ("id", "login"),
            ("name", "login"),
            ("css_selector", "button[type='submit']"),
            ("css_selector", "input[type='submit']"),
            ("xpath", "//button[contains(@class, 'login')]"),
        ]
        
        for locator_type, locator_value in login_button_locators:
            by_map = {
                'id': By.ID,
                'name': By.NAME,
                'xpath': By.XPATH,
                'css_selector': By.CSS_SELECTOR,
            }
            by = by_map.get(locator_type)
            if by:
                element = automation.find_element_safe(by, locator_value, timeout=2)
                if element:
                    element.click()
                    print(f"✓ Login button clicked using {locator_type}: {locator_value}")
                    login_button_found = True
                    automation.take_screenshot("04_login_clicked.png")
                    break
        
        if not login_button_found:
            print("⚠ Could not find login button. Taking screenshot for inspection.")
            automation.take_screenshot("error_login_button_not_found.png")
        
        # Wait for page to load after login
        time.sleep(5)
        automation.take_screenshot("05_after_login.png")
        
        print("\n" + "="*50)
        print("Login attempt completed!")
        print("Check the screenshots to see what happened.")
        print("="*50)
        
        # Keep browser open for inspection
        input("\nPress Enter to close the browser...")
        
    except Exception as e:
        print(f"Error during login: {e}")
        import traceback
        traceback.print_exc()
        automation.take_screenshot("error_exception.png")
    
    finally:
        automation.close()


if __name__ == "__main__":
    try_login()
