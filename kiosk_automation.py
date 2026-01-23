"""
Kiosk System Automation with Selenium
This script automates interactions with a kiosk system using Selenium WebDriver.
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
import time
import json
from typing import Optional, Dict, List


class KioskAutomation:
    """Main class for automating kiosk system interactions."""
    
    def __init__(self, url: str, headless: bool = False, wait_timeout: int = 10):
        """
        Initialize the kiosk automation.
        
        Args:
            url: The URL of the kiosk system
            headless: Run browser in headless mode (default: False)
            wait_timeout: Maximum wait time for elements (default: 10 seconds)
        """
        self.url = url
        self.wait_timeout = wait_timeout
        self.driver: Optional[webdriver.Chrome] = None
        self.wait: Optional[WebDriverWait] = None
        
        # Setup Chrome options
        chrome_options = Options()
        if headless:
            chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument('--ignore-certificate-errors')
        chrome_options.add_argument('--ignore-ssl-errors')
        chrome_options.add_argument('--ignore-certificate-errors-spki-list')
        chrome_options.add_argument('--allow-insecure-localhost')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        chrome_options.add_experimental_option('acceptInsecureCerts', True)
        
        # Initialize WebDriver
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.wait = WebDriverWait(self.driver, wait_timeout)
        
        # Maximize window for kiosk-like experience
        self.driver.maximize_window()
    
    def navigate_to_kiosk(self):
        """Navigate to the kiosk system URL."""
        print(f"Navigating to {self.url}")
        self.driver.get(self.url)
        time.sleep(2)  # Wait for page to load
    
    def find_element_safe(self, by: By, value: str, timeout: Optional[int] = None):
        """
        Safely find an element with error handling.
        
        Args:
            by: Selenium By locator strategy
            value: Locator value
            timeout: Optional custom timeout
            
        Returns:
            WebElement if found, None otherwise
        """
        try:
            wait_time = timeout or self.wait_timeout
            wait = WebDriverWait(self.driver, wait_time)
            return wait.until(EC.presence_of_element_located((by, value)))
        except TimeoutException:
            print(f"Element not found: {by}={value}")
            return None
    
    def click_element(self, by: By, value: str, timeout: Optional[int] = None):
        """
        Click an element after waiting for it to be clickable.
        
        Args:
            by: Selenium By locator strategy
            value: Locator value
            timeout: Optional custom timeout
        """
        try:
            wait_time = timeout or self.wait_timeout
            wait = WebDriverWait(self.driver, wait_time)
            element = wait.until(EC.element_to_be_clickable((by, value)))
            element.click()
            print(f"Clicked element: {value}")
            time.sleep(1)  # Brief pause after click
        except TimeoutException:
            print(f"Could not click element: {by}={value}")
    
    def input_text(self, by: By, value: str, text: str, timeout: Optional[int] = None):
        """
        Input text into a field.
        
        Args:
            by: Selenium By locator strategy
            value: Locator value
            text: Text to input
            timeout: Optional custom timeout
        """
        try:
            wait_time = timeout or self.wait_timeout
            wait = WebDriverWait(self.driver, wait_time)
            element = wait.until(EC.presence_of_element_located((by, value)))
            element.clear()
            element.send_keys(text)
            print(f"Entered text into {value}: {text}")
            time.sleep(0.5)
        except TimeoutException:
            print(f"Could not input text into element: {by}={value}")
    
    def select_dropdown(self, by: By, value: str, option_text: str, timeout: Optional[int] = None):
        """
        Select an option from a dropdown.
        
        Args:
            by: Selenium By locator strategy
            value: Locator value
            option_text: Text of the option to select
            timeout: Optional custom timeout
        """
        from selenium.webdriver.support.ui import Select
        
        try:
            wait_time = timeout or self.wait_timeout
            wait = WebDriverWait(self.driver, wait_time)
            element = wait.until(EC.presence_of_element_located((by, value)))
            select = Select(element)
            select.select_by_visible_text(option_text)
            print(f"Selected '{option_text}' from dropdown: {value}")
            time.sleep(1)
        except TimeoutException:
            print(f"Could not select from dropdown: {by}={value}")
    
    def wait_for_element(self, by: By, value: str, timeout: Optional[int] = None):
        """
        Wait for an element to be present.
        
        Args:
            by: Selenium By locator strategy
            value: Locator value
            timeout: Optional custom timeout
        """
        try:
            wait_time = timeout or self.wait_timeout
            wait = WebDriverWait(self.driver, wait_time)
            wait.until(EC.presence_of_element_located((by, value)))
            print(f"Element found: {value}")
            return True
        except TimeoutException:
            print(f"Element not found within timeout: {value}")
            return False
    
    def get_text(self, by: By, value: str, timeout: Optional[int] = None) -> Optional[str]:
        """
        Get text from an element.
        
        Args:
            by: Selenium By locator strategy
            value: Locator value
            timeout: Optional custom timeout
            
        Returns:
            Text content or None if element not found
        """
        element = self.find_element_safe(by, value, timeout)
        if element:
            return element.text
        return None
    
    def take_screenshot(self, filename: str = "screenshot.png"):
        """
        Take a screenshot of the current page.
        
        Args:
            filename: Name of the screenshot file
        """
        try:
            self.driver.save_screenshot(filename)
            print(f"Screenshot saved: {filename}")
        except Exception as e:
            print(f"Error taking screenshot: {e}")
    
    def execute_automation_flow(self, flow_config: Dict):
        """
        Execute a predefined automation flow based on configuration.
        
        Args:
            flow_config: Dictionary containing automation steps
        """
        print("Starting automation flow...")
        
        # Navigate to kiosk
        self.navigate_to_kiosk()
        
        # Execute steps from configuration
        steps = flow_config.get('steps', [])
        for step in steps:
            action = step.get('action')
            element_type = step.get('element_type', 'id')  # id, name, xpath, css_selector, etc.
            element_value = step.get('element_value')
            value = step.get('value')  # For input text, select options, etc.
            wait_time = step.get('wait_time', 2)
            
            # Map element type to By strategy
            by_map = {
                'id': By.ID,
                'name': By.NAME,
                'xpath': By.XPATH,
                'css_selector': By.CSS_SELECTOR,
                'class_name': By.CLASS_NAME,
                'tag_name': By.TAG_NAME,
                'link_text': By.LINK_TEXT,
                'partial_link_text': By.PARTIAL_LINK_TEXT
            }
            
            by = by_map.get(element_type, By.ID)
            
            if action == 'click':
                self.click_element(by, element_value)
            elif action == 'input':
                self.input_text(by, element_value, value)
            elif action == 'select':
                self.select_dropdown(by, element_value, value)
            elif action == 'wait':
                self.wait_for_element(by, element_value, wait_time)
            elif action == 'get_text':
                text = self.get_text(by, element_value)
                print(f"Retrieved text: {text}")
            
            time.sleep(wait_time)
        
        print("Automation flow completed!")
    
    def close(self):
        """Close the browser and cleanup."""
        if self.driver:
            self.driver.quit()
            print("Browser closed")


def main():
    """Example usage of the KioskAutomation class."""
    
    # Configuration - Update these values for your kiosk system
    KIOSK_URL = "https://example-kiosk.com"  # Replace with your kiosk URL
    
    # Example automation flow configuration
    automation_flow = {
        "steps": [
            {
                "action": "wait",
                "element_type": "id",
                "element_value": "main-content",
                "wait_time": 3
            },
            {
                "action": "click",
                "element_type": "id",
                "element_value": "start-button",
                "wait_time": 2
            },
            {
                "action": "input",
                "element_type": "id",
                "element_value": "user-input",
                "value": "test_user",
                "wait_time": 1
            },
            {
                "action": "click",
                "element_type": "id",
                "element_value": "submit-button",
                "wait_time": 3
            }
        ]
    }
    
    # Initialize automation
    automation = KioskAutomation(url=KIOSK_URL, headless=False)
    
    try:
        # Execute automation flow
        automation.execute_automation_flow(automation_flow)
        
        # Take a screenshot
        automation.take_screenshot("kiosk_result.png")
        
        # Keep browser open for a few seconds to see results
        time.sleep(5)
        
    except Exception as e:
        print(f"Error during automation: {e}")
        automation.take_screenshot("error_screenshot.png")
    
    finally:
        automation.close()


if __name__ == "__main__":
    main()
