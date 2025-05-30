# Internationalization (i18n) Guide - Aura Clock Tab

## Overview

The Aura Clock Tab Chrome extension now supports multiple languages with full internationalization (i18n) capabilities. Users can select their preferred language from the popup settings, and the extension will display localized text throughout the interface.

## Supported Languages

- **English** (`en`) - Default
- **Spanish** (`es`) - Español
- **French** (`fr`) - Français
- **German** (`de`) - Deutsch
- **Japanese** (`ja`) - 日本語
- **Korean** (`ko`) - 한국어
- **Portuguese** (`pt`) - Português (Brazil)
- **Chinese (Simplified)** (`zh`) - 简体中文
- **Chinese (Traditional)** (`zh-TW`) - 繁體中文 (Taiwan)
- **Hindi** (`hi`) - हिंदी

## Features

### Localized Elements

1. **Settings Interface** (Popup)
   - All UI labels, buttons, and options
   - Theme names
   - Status messages
   - Error messages

2. **Clock Display** (New Tab Page)
   - AM/PM indicators
   - Day names (Monday, Tuesday, etc.)
   - Date formatting
   - Month names

3. **Language-Specific Font Support**
   - Optimized font stacks for each language
   - Proper rendering of non-Latin scripts
   - Adjusted spacing for different writing systems

### Automatic Features

1. **Language Detection**
   - Automatically detects browser language on first use
   - Falls back to English if language not supported

2. **Persistent Settings**
   - Language preference saved in Chrome storage
   - Syncs across devices with Chrome Sync

3. **Dynamic Updates**
   - Interface updates immediately when language is changed
   - No extension restart required

## Technical Implementation

### File Structure

```
src/i18n/
├── index.ts          # Main i18n module with all translations
├── types.ts          # TypeScript interfaces
└── utils.ts          # Utility functions
```

### Key Functions

- `initI18n()`: Initialize i18n system and load saved language
- `setLanguage(lang)`: Change current language and save preference
- `t(key)`: Translate a key to current language
- `formatDate()`: Format dates according to current locale
- `formatTime()`: Format time according to current locale

### Translation Keys Structure

```typescript
interface Translations {
  time: {
    am: string;
    pm: string;
    monday: string;
    // ... other time-related strings
  };
  settings: {
    title: string;
    basic: string;
    // ... other settings strings
  };
  themes: {
    dynamic: string;
    light: string;
    // ... other theme names
  };
}
```

### Language-Specific Font Handling

The extension automatically applies appropriate font stacks for different languages:

- **Japanese**: Hiragino Sans, Yu Gothic, Meiryo
- **Korean**: Apple SD Gothic Neo, Malgun Gothic, Nanum Gothic  
- **Chinese (Simplified)**: PingFang SC, Microsoft YaHei
- **Chinese (Traditional)**: PingFang TC, Microsoft JhengHei
- **Hindi**: Noto Sans Devanagari, Mangal, Kokila

### CSS Classes for Language Support

```css
body.lang-ja { /* Japanese styles */ }
body.lang-ko { /* Korean styles */ }
body.lang-zh { /* Simplified Chinese styles */ }
body.lang-zh-TW { /* Traditional Chinese styles */ }
body.lang-hi { /* Hindi styles */ }
```

## Usage

### For Users

1. **Changing Language**:
   - Open the extension popup
   - Select desired language from dropdown
   - Changes apply immediately

2. **Supported Browsers**:
   - Chrome 88+
   - Edge 88+
   - Any Chromium-based browser

### For Developers

#### Adding a New Language

1. **Add Translation Object**:
```typescript
export const newLang: Translations = {
  time: { am: '...', pm: '...', /* ... */ },
  settings: { title: '...', /* ... */ },
  themes: { dynamic: '...', /* ... */ }
};
```

2. **Register in translations map**:
```typescript
const translations: Record<string, Translations> = {
  // ... existing languages
  'new-lang': newLang
};
```

3. **Add to popup HTML**:
```html
<option value="new-lang">Language Name</option>
```

4. **Add font support (if needed)**:
```css
body.lang-new-lang {
  font-family: 'Mattone', 'Language-Font', sans-serif;
}
```

#### Using Translations

```typescript
// In TypeScript files
import { t } from './i18n';
const translatedText = t('settings.title');
```

```html
<!-- In HTML files -->
<span data-i18n="settings.title">Clock Settings</span>
```

## Localization Guidelines

### Text Guidelines

1. **Keep translations concise** - UI space is limited
2. **Maintain consistent terminology** - Use same terms throughout
3. **Consider cultural context** - Some concepts may need adaptation
4. **Test with longer text** - Some languages are more verbose

### Technical Considerations

1. **Date/Time Formatting**:
   - Uses browser's `Intl.DateTimeFormat`
   - Respects local conventions
   - Handles RTL languages properly

2. **Font Loading**:
   - Primary font (Mattone) loads first
   - Language-specific fonts are fallbacks
   - Web fonts are preloaded for performance

3. **Storage**:
   - Language preference stored in `chrome.storage.sync`
   - Automatically syncs across devices
   - Falls back gracefully if storage unavailable

## Testing

### Manual Testing Checklist

- [ ] Language selection updates immediately
- [ ] All UI elements display translated text
- [ ] Date/time formats correctly for locale
- [ ] Font rendering is appropriate
- [ ] Settings persist across browser restarts
- [ ] No console errors during language switching

### Test Different Languages

1. Test a Latin script language (Spanish, French)
2. Test a non-Latin script (Japanese, Korean, Hindi)
3. Test a right-to-left language (if/when Arabic is added)
4. Test with very long translations
5. Test fallback behavior with invalid language codes

## Troubleshooting

### Common Issues

1. **Text not updating**: Check if `data-i18n` attribute is set correctly
2. **Font issues**: Verify language-specific CSS is applied
3. **Date formatting**: Ensure `formatDate()` is used instead of native methods
4. **Storage errors**: Check Chrome extension permissions

### Debug Mode

Enable debug logging:
```javascript
localStorage.setItem('i18n-debug', 'true');
```

## Future Enhancements

### Planned Features

1. **Additional Languages**:
   - Arabic (RTL support)
   - Russian
   - Italian
   - Dutch

2. **Enhanced Localization**:
   - Number formatting
   - Currency formatting
   - Relative time display

3. **Accessibility**:
   - Screen reader compatibility
   - Language announcement
   - Keyboard navigation

### Contributing Translations

To contribute translations for a new language:

1. Create translation object following the `Translations` interface
2. Test with actual speakers of the language
3. Ensure cultural appropriateness
4. Submit via GitHub pull request

## Performance Notes

- **Bundle Size**: Each language adds ~2KB to bundle
- **Runtime Impact**: Minimal - translations loaded once at startup
- **Memory Usage**: All translations kept in memory for fast access
- **Font Loading**: Language fonts only load when needed

## Browser Compatibility

| Feature | Chrome | Edge | Firefox* | Safari* |
|---------|--------|------|----------|---------|
| Basic i18n | ✅ 88+ | ✅ 88+ | ❌ | ❌ |
| Font fallbacks | ✅ | ✅ | ❌ | ❌ |
| Storage sync | ✅ | ✅ | ❌ | ❌ |

*Firefox and Safari support planned for future versions

---

*Last updated: December 2024*
*Version: 1.0.0* 