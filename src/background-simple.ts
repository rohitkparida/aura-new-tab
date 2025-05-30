// Simplified background script for testing
console.log('Aura Clock Tab background script loaded');

// Make this a module
export {};

// Simple default settings
const DEFAULT_SETTINGS = {
  timeFormat: '12',
  showAmPm: true,
  showDate: true,
  showDay: true,
  clockStyle: 'digital',
  theme: 'dynamic'
};

// Initialize settings if they don't exist
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed');
  
  try {
    const result = await chrome.storage.sync.get();
    if (Object.keys(result).length === 0) {
      await chrome.storage.sync.set(DEFAULT_SETTINGS);
      console.log('Default settings saved');
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
});

// Listen for messages
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log('Message received:', request);
  
  switch (request.type) {
    case 'getSettings':
      chrome.storage.sync.get().then(sendResponse);
      return true;
      
    case 'updateSettings':
      chrome.storage.sync.set(request.settings).then(() => {
        sendResponse({ success: true });
      });
      return true;
      
    default:
      sendResponse({ success: false, error: 'Unknown message type' });
      return false;
  }
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    console.log('Storage changed:', changes);
  }
}); 