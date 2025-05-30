# Extension Testing Guide

## Quick Test Steps

### 1. Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist/` folder from this project
5. The extension should load without errors

### 2. Test New Tab Page
1. Open a new tab (Ctrl+T)
2. You should see the Aura Clock interface
3. Verify the clock is displaying and updating

### 3. Test Popup (MAIN FIX)
1. Click the Aura Clock extension icon in the toolbar
2. **The popup should now open** (this was the main issue)
3. Verify you can see the settings interface with tabs:
   - Basic (Date, Day, Time format, AM/PM)
   - Appearance (Clock style, Theme, Font)
   - Advanced (Animations, Grain effect, Analog features)

### 4. Test Settings
1. Toggle various settings in the popup
2. Changes should be saved automatically
3. Check that settings persist after closing/reopening popup
4. Verify changes are reflected on the new tab page

## Expected Behavior
- ✅ Extension icon appears in toolbar
- ✅ Clicking icon opens popup (was broken, now fixed)
- ✅ Popup shows loading state briefly
- ✅ Settings load and display correctly
- ✅ Changes save automatically with "Settings saved" message
- ✅ New tab page reflects setting changes

## If Issues Persist
1. Check Chrome DevTools console for errors
2. Inspect the extension popup (right-click popup → Inspect)
3. Check Chrome Extensions page for error messages
4. Reload the extension and try again

## Files Modified
- `manifest.json` - Added action field and fixed background script path
- `popup.html` - Fixed script path and added loading/error states
- `src/popup.ts` - Added proper error handling and loading states
- `webpack.config.js` - Fixed asset copying for icons

## Recent Fix
**Background Script Error Fixed**: The manifest.json now correctly points to `background.js` (not `dist/background.js`) since the built files are in the root of the dist directory.

## Troubleshooting
If you see "Could not load background script" error:
1. Make sure you're loading the `dist/` folder (not the root project folder)
2. Check that `dist/background.js` exists (should be ~6.7KB)
3. Verify `dist/manifest.json` points to `"service_worker": "background.js"` 