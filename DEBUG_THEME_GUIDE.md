# Theme Debug Guide

## What I Fixed

The theme selection issue was caused by several problems:

1. **Wrong Background Script**: The webpack config was using `background-simple.ts` instead of `background.ts`, which didn't handle theme data requests.
2. **Missing Storage Listener Logic**: The newtab page wasn't properly handling the `'theme'` key changes from the popup.
3. **Missing Immediate Activation**: Themes weren't being activated immediately when selected.

## Changes Made

### 1. Fixed Webpack Configuration
- Changed `webpack.config.js` to use `./src/background.ts` instead of `./src/background-simple.ts`

### 2. Enhanced Theme Change Handling
- Updated `src/newtab.ts` storage listener to specifically handle the `'theme'` key
- Added immediate theme background activation when themes are selected
- Added debugging logs to track theme selection process

### 3. Improved Theme Manager
- Added comprehensive debugging to `src/theme/themeManager.ts`
- Enhanced theme background activation logic

## How to Test

### Method 1: Use the Extension
1. Load the updated extension in Chrome
2. Open a new tab
3. Click the extension icon to open settings
4. Go to "Appearance" tab
5. Change the "Color Theme" dropdown
6. The background should change immediately

### Method 2: Use the Test File
1. Open `test-theme.html` in your browser
2. Click the different theme buttons
3. The background should change for each theme

### Method 3: Manual Console Testing
1. Open a new tab with the extension
2. Open Developer Tools (F12)
3. In the console, run:
```javascript
// Test direct theme activation
const themeBackgrounds = document.querySelectorAll('.theme-background');
themeBackgrounds.forEach(bg => bg.classList.remove('active'));
document.querySelector('.theme-background.aurora').classList.add('active');
```

## Debug Console Commands

If themes still aren't working, run these in the console:

```javascript
// Check if theme backgrounds exist
console.log('Theme backgrounds:', document.querySelectorAll('.theme-background').length);

// List all theme background classes
Array.from(document.querySelectorAll('.theme-background')).forEach((bg, i) => {
    console.log(`Background ${i}:`, bg.className);
});

// Check current storage
chrome.storage.sync.get('theme', (result) => {
    console.log('Current theme in storage:', result.theme);
});

// Manually activate a theme
function testTheme(themeName) {
    const bg = document.querySelector(`.theme-background.${themeName}`);
    if (bg) {
        document.querySelectorAll('.theme-background').forEach(b => b.classList.remove('active'));
        bg.classList.add('active');
        console.log(`Activated ${themeName} theme`);
    } else {
        console.log(`Theme ${themeName} not found`);
    }
}

// Test different themes
testTheme('aurora');
testTheme('pacific');
testTheme('sunrise');
```

## Expected Behavior

1. **Popup Selection**: When you select a theme in the popup, it should:
   - Save the theme to chrome.storage.sync
   - The newtab page should detect the storage change
   - The theme background should activate immediately

2. **Page Load**: When you open a new tab:
   - The extension should load the saved theme from storage
   - The appropriate theme background should be activated
   - The page should be visible with the correct theme

## Common Issues

1. **Extension Context**: Make sure you're testing on a new tab page, not a regular website
2. **Cache**: Try hard refresh (Ctrl+F5) if changes don't appear
3. **Console Errors**: Check the browser console for any JavaScript errors
4. **Storage**: Verify theme is being saved with: `chrome.storage.sync.get(console.log)`

## Debug Logs to Look For

The console should show logs like:
- `[AuraClock] Storage changes detected: ['theme']`
- `[AuraClock] Theme change detected: aurora`
- `[AuraClock] Immediately activating theme background: aurora`
- `[AuraClock] updateThemeBackground: Looking for theme 'aurora'`
- `[AuraClock] Found theme background element: <div class="theme-background aurora active">`

If you don't see these logs, the storage change listener might not be working properly. 