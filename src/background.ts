import { getSettings, onSettingsChange, saveSettings } from '@/utils/storage';
import { 
  DEFAULT_SETTINGS, 
  ThemeData, 
  ThemeName, 
  ClockSettings, 
  MSG_TYPE_REQUEST_CURRENT_THEME_DATA,
  MSG_TYPE_SETTINGS_CHANGED,
  MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE,
  Message // Added import for Message type
} from '@/types';

// Initialize settings if they don't exist
chrome.runtime.onInstalled.addListener(async () => {
  const settings = await getSettings();
  if (Object.keys(settings).length === 0) {
    await saveSettings(DEFAULT_SETTINGS);
  }
});

// Function to determine theme based on time, aligning with ThemeName from src/types/index.ts
function getTimeBasedTheme(): ThemeName { // This ThemeName is 'light' | 'dark' | 'system' | 'dynamic' | 'custom'
  const hour = new Date().getHours();
  // Simplified mapping for example
  if (hour >= 7 && hour < 19) return 'light'; // Daytime
  return 'dark'; // Nighttime
}

// Define a specific type for the values in DEFAULT_THEME_CONFIG
// This ThemeData is from src/types/index.ts and does NOT have a 'theme' property.
// The keys of DEFAULT_THEME_CONFIG must be ThemeName from src/types/index.ts
type ThemeConfigValue = ThemeData; // ThemeData from index.ts is already what we need for values

// Placeholder for theme configurations - should be more robust in the future
// Keys are ThemeName from src/types/index.ts
const DEFAULT_THEME_CONFIG: { [K in ThemeName]?: ThemeConfigValue } = { // Made values optional for safety
  light: { textColor: '#000000', backgroundColor: '#FFFFFF', gradientColors: ['#e0e0e0', '#f5f5f5'], gradientAngle: 90 },
  dark: { textColor: '#FFFFFF', backgroundColor: '#000000', gradientColors: ['#141E30', '#243B55'], gradientAngle: 90 },
  system: { textColor: '#000000', backgroundColor: '#FFFFFF' }, // Fallback, real system theme is complex
  dynamic: { textColor: '#000000', backgroundColor: '#FFFFFF' }, // Will be overridden by getTimeBasedTheme logic typically
  // 'custom' theme would be defined by user settings elsewhere
  graphite: { textColor: '#FFFFFF', backgroundColor: '#333333', gradientColors: ['#222222', '#444444'], gradientAngle: 135 },
  sunrise: { textColor: '#FFFFFF', backgroundColor: '#333333' },
  horizon: { textColor: '#FFFFFF', backgroundColor: '#333333' },
  twilight: { textColor: '#FFFFFF', backgroundColor: '#333333' },
  midnight: { textColor: '#FFFFFF', backgroundColor: '#333333' },
  aurora: { textColor: '#FFFFFF', backgroundColor: '#333333' },
  pacific: { textColor: '#FFFFFF', backgroundColor: '#333333' },
  sierra: { textColor: '#FFFFFF', backgroundColor: '#333333' },
  rose: { textColor: '#FFFFFF', backgroundColor: '#333333' },
  forest: { textColor: '#FFFFFF', backgroundColor: '#333333' },
  ocean: { textColor: '#FFFFFF', backgroundColor: '#333333' },
  desert: { textColor: '#FFFFFF', backgroundColor: '#333333' },
  lavender: { textColor: '#FFFFFF', backgroundColor: '#333333' },
  mint: { textColor: '#FFFFFF', backgroundColor: '#333333' },
  // custom: {} // Custom is user-defined, not in default config map
};

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  // Ensure request.type is handled as one of the known string literal types
  switch (request.type) {
    case MSG_TYPE_REQUEST_CURRENT_THEME_DATA: // Use the constant directly
      (async () => {
        console.log('[BACKGROUND] MSG_TYPE_REQUEST_CURRENT_THEME_DATA: Handler started.');
        try {
          const settings = await getSettings() as Partial<ClockSettings>; 
          console.log('[BACKGROUND] Settings loaded:', settings);
          console.log('[BACKGROUND] MSG_TYPE_REQUEST_CURRENT_THEME_DATA - Settings loaded for processing:', JSON.stringify(settings));
          console.log('[BACKGROUND] MSG_TYPE_REQUEST_CURRENT_THEME_DATA - settings.theme value:', settings.theme);
          let effectiveThemeName: ThemeName;
          const settingsTheme = settings.theme; // This is ThemeName from index.ts

          if (settingsTheme && settingsTheme !== 'dynamic' && settingsTheme !== 'system') {
            effectiveThemeName = settingsTheme;
          } else { // 'dynamic' or 'system'
            effectiveThemeName = getTimeBasedTheme(); // returns 'light' or 'dark'
          }
          console.log('[BACKGROUND] MSG_TYPE_REQUEST_CURRENT_THEME_DATA - effectiveThemeName determined:', effectiveThemeName);
          console.log('[BACKGROUND] effectiveThemeName determined:', effectiveThemeName);

          // Get base config; for 'system' or 'dynamic', this will be 'light' or 'dark' config
          let themeConfig = DEFAULT_THEME_CONFIG[effectiveThemeName];
          console.log('[BACKGROUND] Initial themeConfig based on effectiveThemeName:', themeConfig);
          
          if (!themeConfig) {
               // Fallback for unconfigured 'custom' or other cases
              const fallbackThemeName = getTimeBasedTheme(); // 'light' or 'dark'
              themeConfig = DEFAULT_THEME_CONFIG[fallbackThemeName] ?? DEFAULT_THEME_CONFIG.light!;
              console.log('[BACKGROUND] themeConfig fell back to:', fallbackThemeName, 'resulting in:', themeConfig);
          }
          
          const themeData: ThemeData = {
            textColor: settings.textColor ?? themeConfig.textColor,
            backgroundColor: settings.backgroundColor ?? themeConfig.backgroundColor,
            gradientColors: settings.gradientColors ?? themeConfig.gradientColors,
            gradientAngle: settings.gradientAngle ?? themeConfig.gradientAngle,
            backgroundImage: settings.backgroundImage,
            backgroundBlur: settings.backgroundBlur,
          };
          console.log('[BACKGROUND] Final themeData constructed:', themeData);

          const responsePayload = { themeData, effectiveThemeName }; // This is the correct structure
          console.log('[BACKGROUND] MSG_TYPE_REQUEST_CURRENT_THEME_DATA - Attempting to sendResponse with payload:', JSON.stringify(responsePayload));
          if (typeof sendResponse === 'function') {
            sendResponse(responsePayload); // Send the payload directly
            console.log('[BACKGROUND] MSG_TYPE_REQUEST_CURRENT_THEME_DATA - sendResponse for theme data was called.');
          } else {
            console.error('[BACKGROUND] MSG_TYPE_REQUEST_CURRENT_THEME_DATA - sendResponse is not a function!');
          }
        } catch (error) {
          console.error('[BACKGROUND] CRITICAL ERROR in RequestCurrentThemeData:', error);
          console.log('[BACKGROUND] Attempting to sendResponse with error...');
          sendResponse({ success: false, error: (error as Error).message, type: 'error' });
          console.log('[BACKGROUND] sendResponse for error was called.');
        }
      })();
      return true; // Required for async response

    case 'getSettings':
      getSettings().then(sendResponse);
      return true; // Required for async response

    case 'updateSettings':
      saveSettings(request.settings).then(() => {
        // Notify all tabs about settings change
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            if (tab.id) {
              chrome.tabs.sendMessage(tab.id, {
                type: MSG_TYPE_SETTINGS_CHANGED,
                settings: request.settings
              });
            }
          });
        });
        sendResponse({ success: true });
      });
      return true;

    default:
      console.warn('Unknown message type:', request.type);
      sendResponse({ success: false, error: `Unknown message type: ${request.type}` }); // Send a response for unknown types
      return false;
  }
});

// Listen for storage changes to keep settings up-to-date across components
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    console.log('[BACKGROUND] chrome.storage.onChanged detected changes:', JSON.stringify(changes)); // Log the full changes object

    for (const key in changes) {
      const storageChange = changes[key];
      if (storageChange) { // Guard against undefined storageChange
        console.log(`[BACKGROUND] Storage key "${key}" changed. Old: ${JSON.stringify(storageChange.oldValue)}, New: ${JSON.stringify(storageChange.newValue)}`);

        // Define keys that are critical for theme or UI updates
        const criticalKeysForThemeUpdate = ['theme', 'clockStyle', 'fontFamily', 'showAmPm', 'timeFormat', 'enableAnimations', 'showGrain', 'showMarkers', 'smoothMotion'];

        if (criticalKeysForThemeUpdate.includes(key)) {
          console.log(`[BACKGROUND] Relevant setting "${key}" changed. Broadcasting MSG_TYPE_SETTINGS_CHANGED.`);
          // Notify all tabs that a setting has changed so they can re-fetch if necessary
          // or re-evaluate based on the specific key.
          broadcastMessageToAllTabs({
            type: MSG_TYPE_SETTINGS_CHANGED,
            payload: { changedKey: key, newValue: storageChange.newValue } // newValue is safe here due to the if (storageChange) check
          });

          // Specifically, if the 'theme' itself or a setting that might affect dynamic theme calculation changes,
          // trigger a dynamic theme update.
          // For example, if timeFormat changes from 12h to 24h, 'dynamic' theme might need to re-evaluate day/night.
          if (key === 'theme' || key === 'timeFormat' || key === 'enableAnimations') { // Add other keys if they influence dynamic theme logic
            console.log(`[BACKGROUND] Key "${key}" is critical for dynamic themes. Broadcasting MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE.`);
            broadcastMessageToAllTabs({ type: MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE });
          }
        }
      } else {
        console.warn(`[BACKGROUND] Received change for key "${key}" but storageChange was undefined.`);
      }
    }
  }
});

// Helper function to broadcast a message to all new tab pages
async function broadcastMessageToAllTabs(message: Message) {
  console.log('[BACKGROUND] Broadcasting message to all tabs:', JSON.stringify(message)); // Log message being broadcast
  const tabs = await chrome.tabs.query({});
  tabs.forEach(tab => {
    if (tab.id && (tab.url?.startsWith('chrome-extension://') || tab.url?.startsWith('chrome://newtab'))) {
      // It's good practice to check if the tab still exists and is accessible
      chrome.tabs.sendMessage(tab.id, message).catch(error => {
        // This catch is important because a tab might have been closed or is not a content script context
        console.log(`[BACKGROUND] Could not send message to tab ${tab.id} (${tab.url || 'URL not available'}): ${error.message}`); // Uncommented and improved log
      });
    }
  });
}

// Listen for settings changes from the popup
onSettingsChange((newSettings, oldSettings) => {
  // Handle any background-specific settings changes
  console.log('Settings changed:', { oldSettings, newSettings });
});

console.log('Aura Clock Tab background script loaded');

export {}; // Make this file a module
