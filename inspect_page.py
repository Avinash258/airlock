"""
Page inspector to help identify element locators for the kiosk system.
This script opens the page and helps you find the correct selectors.
"""

from kiosk_automation import KioskAutomation
from selenium.webdriver.common.by import By
import time

KIOSK_URL = "https://arjun-up.ryarramsetti.axiadids.net:8442/user"

def inspect_page():
    """Inspect the page and print available elements."""
    automation = KioskAutomation(url=KIOSK_URL, headless=False, wait_timeout=15)
    
    try:
        automation.navigate_to_kiosk()
        time.sleep(3)
        
        print("="*70)
        print("PAGE INSPECTION REPORT")
        print("="*70)
        print(f"\nPage Title: {automation.driver.title}")
        print(f"Current URL: {automation.driver.current_url}")
        print(f"Page Source Length: {len(automation.driver.page_source)} characters")
        
        # Find all input fields
        print("\n" + "-"*70)
        print("INPUT FIELDS FOUND:")
        print("-"*70)
        
        inputs = automation.driver.find_elements(By.TAG_NAME, "input")
        for i, inp in enumerate(inputs, 1):
            input_type = inp.get_attribute("type") or "text"
            input_id = inp.get_attribute("id") or "N/A"
            input_name = inp.get_attribute("name") or "N/A"
            input_class = inp.get_attribute("class") or "N/A"
            input_placeholder = inp.get_attribute("placeholder") or "N/A"
            
            print(f"\nInput #{i}:")
            print(f"  Type: {input_type}")
            print(f"  ID: {input_id}")
            print(f"  Name: {input_name}")
            print(f"  Class: {input_class}")
            print(f"  Placeholder: {input_placeholder}")
            
            # Suggest locator
            if input_id and input_id != "N/A":
                print(f"  → Suggested locator: id='{input_id}'")
            elif input_name and input_name != "N/A":
                print(f"  → Suggested locator: name='{input_name}'")
            else:
                xpath = f"//input[@type='{input_type}']"
                if input_placeholder and input_placeholder != "N/A":
                    xpath = f"//input[@placeholder='{input_placeholder}']"
                print(f"  → Suggested locator: xpath='{xpath}'")
        
        # Find all buttons
        print("\n" + "-"*70)
        print("BUTTONS FOUND:")
        print("-"*70)
        
        buttons = automation.driver.find_elements(By.TAG_NAME, "button")
        for i, btn in enumerate(buttons, 1):
            button_id = btn.get_attribute("id") or "N/A"
            button_name = btn.get_attribute("name") or "N/A"
            button_class = btn.get_attribute("class") or "N/A"
            button_text = btn.text or "N/A"
            button_type = btn.get_attribute("type") or "N/A"
            
            print(f"\nButton #{i}:")
            print(f"  ID: {button_id}")
            print(f"  Name: {button_name}")
            print(f"  Class: {button_class}")
            print(f"  Text: {button_text}")
            print(f"  Type: {button_type}")
            
            # Suggest locator
            if button_id and button_id != "N/A":
                print(f"  → Suggested locator: id='{button_id}'")
            elif button_text and button_text != "N/A" and len(button_text.strip()) > 0:
                print(f"  → Suggested locator: xpath=\"//button[contains(text(), '{button_text}')]\"")
            elif button_type and button_type != "N/A":
                print(f"  → Suggested locator: xpath=\"//button[@type='{button_type}']\"")
        
        # Find submit inputs
        submit_inputs = automation.driver.find_elements(By.XPATH, "//input[@type='submit']")
        if submit_inputs:
            print("\n" + "-"*70)
            print("SUBMIT INPUTS FOUND:")
            print("-"*70)
            for i, inp in enumerate(submit_inputs, 1):
                input_id = inp.get_attribute("id") or "N/A"
                input_name = inp.get_attribute("name") or "N/A"
                input_value = inp.get_attribute("value") or "N/A"
                print(f"\nSubmit Input #{i}:")
                print(f"  ID: {input_id}")
                print(f"  Name: {input_name}")
                print(f"  Value: {input_value}")
                print(f"  → Suggested locator: xpath=\"//input[@type='submit']\"")
        
        # Take screenshot
        automation.take_screenshot("page_inspection.png")
        print("\n" + "="*70)
        print("Screenshot saved as: page_inspection.png")
        print("="*70)
        
        print("\n💡 TIP: Use the suggested locators above to update your config.json")
        print("   Keep the browser open to inspect elements manually using DevTools (F12)")
        
        input("\nPress Enter to close the browser...")
        
    except Exception as e:
        print(f"Error during inspection: {e}")
        import traceback
        traceback.print_exc()
        automation.take_screenshot("error_inspection.png")
    
    finally:
        automation.close()


if __name__ == "__main__":
    inspect_page()
