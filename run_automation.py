"""
Helper script to run kiosk automation from configuration file.
Usage: python run_automation.py [flow_name]
"""

import json
import sys
from kiosk_automation import KioskAutomation


def load_config(config_file: str = "config.json") -> dict:
    """Load configuration from JSON file."""
    try:
        with open(config_file, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Configuration file '{config_file}' not found.")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in configuration file: {e}")
        sys.exit(1)


def main():
    """Main function to run automation from config."""
    # Load configuration
    config = load_config()
    
    # Get flow name from command line or use default
    flow_name = sys.argv[1] if len(sys.argv) > 1 else "basic_flow"
    
    # Check if flow exists
    if flow_name not in config.get("automation_flows", {}):
        print(f"Error: Flow '{flow_name}' not found in configuration.")
        print(f"Available flows: {list(config.get('automation_flows', {}).keys())}")
        sys.exit(1)
    
    # Get flow configuration
    flow_config = config["automation_flows"][flow_name]
    kiosk_url = config.get("kiosk_url", "https://example-kiosk.com")
    headless = config.get("headless", False)
    wait_timeout = config.get("wait_timeout", 10)
    
    print(f"Running automation flow: {flow_name}")
    print(f"Description: {flow_config.get('description', 'No description')}")
    print(f"Kiosk URL: {kiosk_url}")
    print("-" * 50)
    
    # Initialize automation
    automation = KioskAutomation(
        url=kiosk_url,
        headless=headless,
        wait_timeout=wait_timeout
    )
    
    try:
        # Execute automation flow
        automation.execute_automation_flow(flow_config)
        
        # Take screenshot
        screenshot_name = f"kiosk_{flow_name}_result.png"
        automation.take_screenshot(screenshot_name)
        
        print("-" * 50)
        print("Automation completed successfully!")
        print(f"Screenshot saved: {screenshot_name}")
        
        # Keep browser open if not headless
        if not headless:
            input("Press Enter to close the browser...")
        
    except Exception as e:
        print(f"Error during automation: {e}")
        automation.take_screenshot(f"error_{flow_name}.png")
        raise
    
    finally:
        automation.close()


if __name__ == "__main__":
    main()
