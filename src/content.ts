// Content script that runs on all pages
// Can be used for features that need to interact with web pages

console.log('Aura Clock Tab content script loaded');

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message: any) => {
  if (message.type === 'settingsChanged') {
    // Handle settings changes if needed
    console.log('Settings changed:', message.settings);
  }
  return true;
});

// Send a message to the background script to get settings
chrome.runtime.sendMessage(
  { type: 'getSettings' },
  (settings) => {
    console.log('Current settings:', settings);
    // Initialize content script with settings
  }
);

export {}; // Make this file a module
