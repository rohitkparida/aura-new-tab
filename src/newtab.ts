console.log('[AuraClock] newtab.ts: Script start'); // VERY FIRST LINE

// Aura Clock Tab - New Tab Page (TypeScript)
import { applyTheme } from './theme';
import { 
    updateAnalogClock as updateAnalogClockFn,
    createHourMarkers as createHourMarkersFn,
    updateDayAndDate as updateDayAndDateFn
} from './clock';
import { settingsManager } from './utils';
import { setupFavicon as initFavicon } from './ui/faviconManager';
import { initI18n, t, formatDate, getCurrentLanguage } from './i18n';

// Utility function
const $ = (selector: string): HTMLElement | null => document.querySelector(selector);

// Constants from newtab.js
const ANIMATION_TIMEOUT_MS = 50;
const OPACITY_TRANSPARENT = '0';
const OPACITY_VISIBLE = '1';
// Opacity is now controlled by CSS

// Import types that will likely be needed
import {
    ClockSettings,
    ThemeData, // Ensure ThemeData is imported (from src/types/index.ts via ./types)
    ThemeName, // ThemeName from src/types/index.ts ('light', 'dark', etc.)
} from './types'; // Changed from './types/clock' to './types' to get main index definitions

// Import message types and constants
import {
    MSG_TYPE_THEME_UPDATE,
    MSG_TYPE_SETTINGS_CHANGED,
    MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE
} from './types/messages';

// Import message creation functions and sendMessage utility
import {
    createRequestCurrentThemeDataMessage,
    sendMessage
} from './types/messages';

// Utility to send messages to the background script
// Removed the sendMessage function definition

// Global variables

/**
 * Cached settings loaded from settings manager
 * Note: This is mutable and updated when settings change
 * @type {Partial<ClockSettings>}
 */
let cachedSettings: Partial<ClockSettings> = {};

/**
 * ID of the interval used for updating the clock
 * @type {number | undefined}
 */
let clockIntervalId: number | undefined;

/**
 * Flag to track if the extension is initialized
 * @type {boolean}
 */
let isInitialized = false;

/**
 * Handles language-specific font requirements
 */
function setupLanguageSpecificFonts(): void {
    const currentLang = getCurrentLanguage();
    const body = document.body;
    
    // Add language-specific CSS classes for font handling
    if (body) {
        // Remove existing language classes
        body.classList.remove('lang-ja', 'lang-ko', 'lang-zh', 'lang-zh-TW', 'lang-hi');
        
        // Add current language class
        switch (currentLang) {
            case 'ja':
                body.classList.add('lang-ja');
                break;
            case 'ko':
                body.classList.add('lang-ko');
                break;
            case 'zh':
                body.classList.add('lang-zh');
                break;
            case 'zh-TW':
                body.classList.add('lang-zh-TW');
                break;
            case 'hi':
                body.classList.add('lang-hi');
                break;
        }
    }
}

/**
 * Determines the appropriate theme based on the current time of day
 * @returns The name of the theme to use ('sunrise' | 'horizon' | 'twilight' | 'midnight')
 */
export function getTimeBasedTheme(): 'sunrise' | 'horizon' | 'twilight' | 'midnight' {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'sunrise';
    if (hour >= 12 && hour < 18) return 'horizon';
    if (hour >= 18 && hour < 21) return 'twilight';
    return 'midnight';
}

// Update the clock display based on current settings
function updateClockDisplay(): void {
    updateClock();
    const now = new Date();
    
    // Update digital clock
    updateDigitalClock(cachedSettings);
    
    // Update analog clock if needed
    if (cachedSettings.clockStyle === 'analog' || cachedSettings.clockStyle === 'both') {
        updateAnalogClock(true);
    }
    
    // Update date and day with localized formatting
    const dateElement = $('.date');
    const dayElement = $('.day');
    
    if (dateElement && cachedSettings.showDate) {
        dateElement.textContent = formatDate(now, { month: 'short', day: 'numeric' });
    }
    
    if (dayElement && cachedSettings.showDay) {
        dayElement.textContent = formatDate(now, { weekday: 'long' });
    }
}

// Individual setting handlers
function clockStyle(newValue: ClockSettings['clockStyle']): void {
    if (typeof newValue === 'undefined') return;
    const clockContainer = $('.clock-container');
    if (!clockContainer) return;
    
    // Remove all clock style classes
    clockContainer.classList.remove('clock-style-digital', 'clock-style-analog', 'clock-style-both');
    
    // Add the appropriate class
    clockContainer.classList.add(`clock-style-${newValue}`);
    
    // Update the clock display
    updateClock();
}

function timeFormat(newValue: ClockSettings['timeFormat']): void {
    if (typeof newValue === 'undefined') return;
    updateClock();
    updateClockDisplay();
}

function showAmPm(newValue: ClockSettings['showAmPm']): void {
    if (typeof newValue === 'undefined') return;
    updateClock();
    updateClockDisplay();
}

function showDate(newValue: ClockSettings['showDate']): void {
    if (typeof newValue === 'undefined') return;
    const dateElement = $('.date');
    if (dateElement) {
        dateElement.style.display = newValue ? 'block' : 'none';
    }
}

function showDay(newValue: ClockSettings['showDay']): void {
    if (typeof newValue === 'undefined') return;
    const dayElement = $('.day');
    if (dayElement) {
        dayElement.style.display = newValue ? 'block' : 'none';
    }
}

function gradientStyle(newValue: ClockSettings['gradientStyle']): void {
    if (typeof newValue === 'undefined') return;
    const root = document.documentElement;
    
    // Remove all gradient style classes
    root.classList.remove('gradient-style-sunrise', 'gradient-style-horizon', 
                         'gradient-style-twilight', 'gradient-style-midnight');
    
    // Add the appropriate class
    root.classList.add(`gradient-style-${newValue}`);
}

function enableAnimations(newValue: ClockSettings['enableAnimations']): void {
    if (typeof newValue === 'undefined') return;
    const root = document.documentElement;
    
    if (newValue) {
        root.classList.add('animations-enabled');
        root.classList.remove('animations-disabled');
    } else {
        root.classList.add('animations-disabled');
        root.classList.remove('animations-enabled');
    }
}

function showGrain(newValue: ClockSettings['showGrain']): void {
    if (typeof newValue === 'undefined') return;
    const grainOverlay = $('.grain-overlay');
    if (grainOverlay) {
        grainOverlay.style.display = newValue ? 'block' : 'none';
    }
}

function showMarkers(newValue: ClockSettings['showMarkers']): void {
    if (typeof newValue === 'undefined') return;
    const markers = document.querySelectorAll('.hour-marker');
    markers.forEach(marker => {
        (marker as HTMLElement).style.display = newValue ? 'block' : 'none';
    });
}

function smoothMotion(newValue: ClockSettings['smoothMotion']): void {
    if (typeof newValue === 'undefined') return;
    const root = document.documentElement;
    
    if (newValue) {
        root.classList.add('smooth-motion');
        root.classList.remove('stepped-motion');
    } else {
        root.classList.add('stepped-motion');
        root.classList.remove('smooth-motion');
    }
}

function fontStyle(newValue: ClockSettings['fontStyle']): void {
    if (typeof newValue === 'undefined') return;
    const root = document.documentElement;
    
    // Remove all font style classes
    root.classList.remove('font-style-default', 'font-style-modern', 'font-style-classic', 'font-style-digital');
    
    // Add the appropriate class
    root.classList.add(`font-style-${newValue}`);
}

// Theme change handler
function handleThemeChange(newTheme: string): void {
    if (!newTheme) return;
    
    console.log('[AuraClock] Theme changed to:', newTheme);
    
    // Immediately activate the theme background if it exists (for instant visual feedback)
    const themeBackgrounds = document.querySelectorAll('.theme-background');
    themeBackgrounds.forEach(bg => bg.classList.remove('active'));
    
    const newThemeBackground = document.querySelector(`.theme-background.${newTheme}`);
    if (newThemeBackground) {
        console.log('[AuraClock] Immediately activating theme background:', newTheme);
        newThemeBackground.classList.add('transitions-enabled');
        requestAnimationFrame(() => {
            newThemeBackground.classList.add('active');
        });
    }
    
    // Also request updated theme data from background script for additional styling
    sendMessage(createRequestCurrentThemeDataMessage())
        .then(handleThemeDataResponse)
        .catch(error => {
            console.error('[AuraClock] Error requesting theme data on theme change:', error);
            handleThemeDataResponse({ error: error.message || 'Failed to fetch theme on change' });
        });
}

// Individual handlers for settings that need custom logic
function fontFamily(newValue: ClockSettings['fontFamily']): void {
    document.documentElement.style.setProperty('--font-family', newValue);
    updateClockDisplay();
}

function fontSize(newValue: ClockSettings['fontSize']): void {
    document.documentElement.style.setProperty('--font-size', newValue);
    updateClockDisplay();
}

function fontWeight(newValue: ClockSettings['fontWeight']): void {
    document.documentElement.style.setProperty('--font-weight', newValue);
    updateClockDisplay();
}

function textColor(newValue: ClockSettings['textColor']): void {
    document.documentElement.style.setProperty('--text-color', newValue);
}

function backgroundColor(newValue: ClockSettings['backgroundColor']): void {
    document.documentElement.style.setProperty('--background-color', newValue);
}

function backgroundType(newValue: ClockSettings['backgroundType']): void {
    const root = document.documentElement;
    root.classList.remove('bg-solid', 'bg-gradient', 'bg-image');
    root.classList.add(`bg-${newValue}`);
}

function gradientColors(newValue: ClockSettings['gradientColors']): void {
    if (Array.isArray(newValue) && newValue.length > 0) {
        const gradient = `linear-gradient(${cachedSettings.gradientAngle || 0}deg, ${newValue.join(', ')})`;
        document.documentElement.style.backgroundImage = gradient;
    }
}

function gradientAngle(newValue: ClockSettings['gradientAngle']): void {
    if (cachedSettings.gradientColors?.length && newValue !== undefined) {
        cachedSettings.gradientAngle = newValue;
        gradientColors(cachedSettings.gradientColors);
    }
}

function backgroundImage(newValue: ClockSettings['backgroundImage']): void {
    if (newValue) {
        document.documentElement.style.backgroundImage = `url("${newValue}")`;
    }
}

function animationSpeed(newValue: ClockSettings['animationSpeed']): void {
    const root = document.documentElement;
    root.classList.remove('animation-slow', 'animation-normal', 'animation-fast');
    if (newValue) {
        root.classList.add(`animation-${newValue}`);
    }
}

function animationType(newValue: ClockSettings['animationType']): void {
    const root = document.documentElement;
    root.classList.remove('animation-fade', 'animation-slide', 'animation-zoom');
    if (newValue && newValue !== 'none') {
        root.classList.add(`animation-${newValue}`);
    }
}

// Background effect handlers
function backgroundBlur(newValue: ClockSettings['backgroundBlur']): void {
    document.documentElement.style.setProperty('--background-blur', `${newValue}px`);
}

function backgroundBrightness(newValue: ClockSettings['backgroundBrightness']): void {
    document.documentElement.style.setProperty('--background-brightness', `${newValue}%`);
}

function backgroundContrast(newValue: ClockSettings['backgroundContrast']): void {
    document.documentElement.style.setProperty('--background-contrast', `${newValue}%`);
}

function backgroundSaturation(newValue: ClockSettings['backgroundSaturation']): void {
    document.documentElement.style.setProperty('--background-saturation', `${newValue}%`);
}

function backgroundHue(newValue: ClockSettings['backgroundHue']): void {
    document.documentElement.style.setProperty('--background-hue-rotate', `${newValue}deg`);
}

function backgroundGrayscale(newValue: ClockSettings['backgroundGrayscale']): void {
    document.documentElement.style.setProperty('--background-grayscale', newValue ? '100%' : '0%');
}

function backgroundInvert(newValue: ClockSettings['backgroundInvert']): void {
    document.documentElement.style.setProperty('--background-invert', newValue ? '100%' : '0%');
}

function backgroundSepia(newValue: ClockSettings['backgroundSepia']): void {
    document.documentElement.style.setProperty('--background-sepia', newValue ? '100%' : '0%');
}

function backgroundOpacity(newValue: ClockSettings['backgroundOpacity']): void {
    document.documentElement.style.setProperty('--background-opacity', `${newValue}%`);
}

// Grain effect handlers
function grainIntensity(newValue: ClockSettings['grainIntensity']): void {
    document.documentElement.style.setProperty('--grain-intensity', `${newValue}%`);
}

function grainOpacity(newValue: ClockSettings['grainOpacity']): void {
    document.documentElement.style.setProperty('--grain-opacity', `${newValue}%`);
}

function grainSize(newValue: ClockSettings['grainSize']): void {
    document.documentElement.style.setProperty('--grain-size', `${newValue}px`);
}

function grainSpeed(newValue: ClockSettings['grainSpeed']): void {
    document.documentElement.style.setProperty('--grain-speed', `${newValue}s`);
}

function grainColor(newValue: ClockSettings['grainColor']): void {
    document.documentElement.style.setProperty('--grain-color', newValue);
}

function grainBlendMode(newValue: ClockSettings['grainBlendMode']): void {
    document.documentElement.style.setProperty('--grain-blend-mode', newValue);
}

// Storage change listener for synced settings
chrome.storage.onChanged.addListener((changes: { [key: string]: chrome.storage.StorageChange }, namespace: string) => {
    if (namespace === 'sync') {
        console.log('[AuraClock] Storage changes detected:', Object.keys(changes));
        
        for (const [key, change] of Object.entries(changes)) {
            console.log(`[AuraClock] Processing storage change: ${key} = ${change.newValue}`);
            
            // Handle the 'theme' key specifically (this comes from popup's gradient-style selection)
            if (key === 'theme') {
                console.log('[AuraClock] Theme change detected:', change.newValue);
                handleThemeChange(change.newValue);
                continue;
            }
            
            // Handle other settings through the normal handler system
            const handler = settingsHandlers[key as keyof ClockSettings];
            if (handler) {
                try {
                    console.log(`[AuraClock] Calling handler for ${key}`);
                    handler(change.newValue);
                } catch (error) {
                    console.error(`Error handling storage change for '${key}':`, error);
                }
            } else {
                console.log(`[AuraClock] No handler found for setting: ${key}`);
            }
        }
    }
});

// Map of setting names to their handler functions
const settingsHandlers: Partial<Record<keyof ClockSettings, (value: any) => void>> = {
    // Clock display
    clockStyle,
    timeFormat,
    showAmPm,
    showDate,
    showDay,
    fontStyle,
    fontFamily,
    fontSize,
    fontWeight,
    textColor,
    
    // Background
    backgroundColor,
    backgroundType,
    gradientStyle,
    gradientColors,
    gradientAngle,
    backgroundImage,
    backgroundBlur,
    backgroundBrightness,
    backgroundContrast,
    backgroundSaturation,
    backgroundHue,
    backgroundGrayscale,
    backgroundInvert,
    backgroundSepia,
    backgroundOpacity,
    
    // Effects
    enableAnimations,
    animationSpeed,
    animationType,
    showGrain,
    grainIntensity,
    grainOpacity,
    grainSize,
    grainSpeed,
    grainColor,
    grainBlendMode,
    showMarkers,
    smoothMotion,
    
    // Theme
    theme: handleThemeChange
} as const;

// Clock update functions from newtab.js
function updateDigitalClock(settings: Partial<ClockSettings>): void {
    const now = new Date();
    const timeMainEl = $('.time-main');
    const ampmEl = $('.ampm');

    if (!timeMainEl) {
        console.warn("Element '.time-main' not found.");
        return;
    }

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    let ampm = '';

    const timeFormatValue = settings.timeFormat ?? '12'; // Default to '12' if undefined
    const showAmPmValue = settings.showAmPm ?? false;   // Default to false if undefined

    const is12HourFormat = ['12', '12h', '12hr'].includes(timeFormatValue);
    const amPmVisible = is12HourFormat && showAmPmValue;
    // console.log('AM/PM Debug:', { is12HourFormat, showAmPm: showAmPmValue, amPmVisible });

    if (is12HourFormat) {
        // Use localized AM/PM text
        ampm = hours >= 12 ? t('time.pm') : t('time.am');
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
    }

    timeMainEl.textContent = `${hours.toString().padStart(is12HourFormat ? 1 : 2, '0')}:${minutes}`;
    timeMainEl.classList.toggle('with-ampm', amPmVisible);

    if (ampmEl) {
        if (amPmVisible) {
            ampmEl.textContent = ampm;
            ampmEl.classList.add('visible');
        } else {
            ampmEl.classList.remove('visible');
            ampmEl.textContent = ''; // Clear content when not visible
        }
    } else {
        // console.warn("Element '.ampm' not found.");
    }
}

function updateClock(): void {
    // Check if chrome.storage is still available
    if (!chrome || !chrome.storage || !chrome.storage.sync) {
        console.error('Chrome Storage API not available. Cannot update clock.');
        // Potentially set a default state or show an error message to the user
        return;
    }

    chrome.storage.sync.get([
        'clockStyle',
        'timeFormat',
        'showAmPm',
        'showDate',
        'showDay',
        'smoothMotion' // for analog clock, will be handled by updateAnalogClock
    ], (settings: Partial<ClockSettings>) => {
        if (chrome.runtime.lastError) {
            console.error('Error loading settings in updateClock:', chrome.runtime.lastError.message);
            // It might be useful to use default settings or inform the user
            return;
        }

        // Ensure settings is an object, even if empty or some keys are missing
        const currentSettings = settings || {};

        try {
            if (currentSettings.clockStyle === 'digital') {
                updateDigitalClock(currentSettings);
                const analogClockElement = $('.analog-clock');
                if (analogClockElement) analogClockElement.style.display = 'none';
                const digitalClockTimeElement = $('.clock-container .time');
                if (digitalClockTimeElement) digitalClockTimeElement.style.display = 'flex';
            } else {
                // Analog or both clock styles
                const analogClockElement = $('.analog-clock');
                if (analogClockElement) analogClockElement.style.display = 'block';
                const digitalClockTimeElement = $('.clock-container .time');
                if (digitalClockTimeElement) digitalClockTimeElement.style.display = 'none';
                
                // Only animate on the first load or when clock style changes
                const shouldAnimate = !clockIntervalId && (currentSettings.enableAnimations !== false);
                updateAnalogClock(shouldAnimate);
            }
            updateVisibility(currentSettings); // Call updateVisibility
        } catch (error) {
            console.error('Error updating clock display:', error);
        }
    });
}

function updateVisibility(settings: Partial<ClockSettings>): void {
    const dateEl = $('.date-container .date');
    const dayEl = $('.date-container .day');
    const dateContainerEl = $('.date-container');

    if (!dateContainerEl) {
        // console.warn("Element '.date-container' not found.");
        return;
    }

    // Default to true if undefined or null, explicitly false to hide
    let dateVisible = settings.showDate !== false;
    let dayVisible = settings.showDay !== false;

    const now = new Date();

    if (dateEl) {
        if (dateVisible) {
            // Use localized date formatting
            dateEl.textContent = formatDate(now, { month: 'short', day: 'numeric' });
            dateEl.style.display = 'inline';
        } else {
            dateEl.style.display = 'none';
        }
    }

    if (dayEl) {
        if (dayVisible) {
            // Use localized day formatting
            dayEl.textContent = formatDate(now, { weekday: 'long' });
            dayEl.style.display = 'inline';
        } else {
            dayEl.style.display = 'none';
        }
    }

    // Adjust layout based on visibility
    if (!dateVisible && !dayVisible) {
        dateContainerEl.style.display = 'none';
    } else {
        dateContainerEl.style.display = 'block';
    }
    // Class for styling adjustments
    dateContainerEl.classList.toggle('solo', (dateVisible && !dayVisible) || (!dateVisible && dayVisible));
    dateContainerEl.classList.toggle('both-visible', dateVisible && dayVisible);
    dateContainerEl.classList.toggle('single-item', (dateVisible && !dayVisible) || (!dateVisible && dayVisible));

    const timeMainEl = $('.time-main');
    if (timeMainEl) {
        timeMainEl.classList.toggle('solo', !dateVisible && !dayVisible);
        timeMainEl.classList.toggle('with-date', dateVisible || dayVisible);
    }
}

/**
 * Initializes the clock extension
 */
async function init(): Promise<void> {
    try {
        // Initialize i18n first
        await initI18n();
        console.log('i18n initialized');
        
        // Setup language-specific fonts
        setupLanguageSpecificFonts();
        
        // Initialize settings manager
        await settingsManager.initSettingsManager();
        
        // Load settings
        const settings = await settingsManager.loadClockSettings();
        
        // Update cached settings
        cachedSettings = { ...cachedSettings, ...settings };
        console.log('Initial settings loaded:', cachedSettings);

        // Apply initial font if specified
        if (cachedSettings.fontStyle) {
            try {
                updateFont({ fontStyle: cachedSettings.fontStyle });
            } catch (error) {
                console.error('Error applying font:', error);
            }
        }

        // Setup clock based on settings
        setupClock(cachedSettings);

        // Setup initial visibility and animations
        setupInitialUI(cachedSettings);

        // Request current theme data
        requestThemeData();

        // Mark as initialized
        isInitialized = true;
        console.log('Aura Clock initialized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
        isInitialized = false;
        applyFallbackVisibility();
    }
}

/**
 * Sets up the clock based on the provided settings
 * @param settings - The clock settings to apply
 */
function setupClock(settings: Partial<ClockSettings>): void {
    const analogClockElement = $('.analog-clock');
    const digitalClockTimeElement = $('.clock-container .time');

    if (settings.clockStyle === 'analog') {
        // Setup analog clock
        if (analogClockElement) {
            analogClockElement.style.display = 'block';
            const animationsEnabled = settings.enableAnimations !== false;
            
            if (animationsEnabled) {
                analogClockElement.style.opacity = OPACITY_TRANSPARENT;
                setTimeout(() => {
                    if (analogClockElement) {
                        analogClockElement.style.opacity = OPACITY_VISIBLE;
                    }
                }, ANIMATION_TIMEOUT_MS);
            } else {
                analogClockElement.style.opacity = OPACITY_VISIBLE;
            }
            
            if (analogClockElement) {
                createHourMarkersFn(analogClockElement);
            }
            updateAnalogClock(animationsEnabled);
        }
        
        if (digitalClockTimeElement) {
            digitalClockTimeElement.style.display = 'none';
        }
    } else {
        // Setup digital clock (default)
        if (analogClockElement) analogClockElement.style.display = 'none';
        if (digitalClockTimeElement) digitalClockTimeElement.style.display = 'flex';
        updateDigitalClock(settings);
    }

    updateVisibility(settings);
}

/**
 * Sets up the initial UI state including animations and visibility
 * @param settings - The current clock settings
 */
function setupInitialUI(settings: Partial<ClockSettings>): void {
    console.log('[AuraClock] setupInitialUI: Starting UI setup');
    
    // Ensure body is visible
    if (document.body) {
        document.body.classList.add('ready');
        document.body.style.opacity = '1';
    }

    // Make sure clock elements are visible based on clock style
        const timeElement = $('.time');
        const timeMainElement = $('.time-main');
    const ampmElement = $('.ampm');
        const dateContainer = $('.date-container');
    const analogClockElement = $('.analog-clock');

    // Handle clock style switching
    const clockStyle = settings.clockStyle || 'digital';
    console.log('[AuraClock] setupInitialUI: Clock style:', clockStyle);
    
    if (clockStyle === 'analog') {
        // Setup analog clock visibility
        if (analogClockElement) {
            analogClockElement.style.display = 'block';
            analogClockElement.style.opacity = '1';
            console.log('[AuraClock] setupInitialUI: Analog clock made visible');
        }
        
        // Hide digital clock
        if (timeElement) {
            timeElement.style.display = 'none';
            console.log('[AuraClock] setupInitialUI: Digital clock hidden');
        }
    } else {
        // Setup digital clock visibility (default)
        if (timeElement) {
            timeElement.classList.add('visible');
            timeElement.style.display = 'flex';
            console.log('[AuraClock] setupInitialUI: Digital time element made visible');
        }
        if (timeMainElement) {
            timeMainElement.classList.add('visible');
            console.log('[AuraClock] setupInitialUI: Time main element made visible');
        }
        
        // Hide analog clock
        if (analogClockElement) {
            analogClockElement.style.display = 'none';
            console.log('[AuraClock] setupInitialUI: Analog clock hidden');
        }
    }

    // Handle animations if enabled
    if (settings.enableAnimations !== false) {
        // Apply animation classes after a small delay for smooth transitions
        setTimeout(() => {
            if (ampmElement && (settings.timeFormat === '12' || settings.showAmPm)) {
                ampmElement.classList.add('visible');
            }
            if (dateContainer) {
                dateContainer.classList.add('fade-in');
                // Ensure date container becomes visible after animation
                setTimeout(() => {
                    dateContainer.style.opacity = '1';
                    dateContainer.style.filter = 'blur(0)';
                    dateContainer.style.transform = 'scale(1)';
                }, 600); // Wait for animation to complete
            }
        }, 50);
    } else {
        // Show immediately if animations disabled
        if (ampmElement && (settings.timeFormat === '12' || settings.showAmPm)) {
            ampmElement.classList.add('visible');
        }
        if (dateContainer) {
            dateContainer.style.opacity = '1';
            dateContainer.style.filter = 'blur(0)';
            dateContainer.style.transform = 'scale(1)';
        }
    }

    // Start the clock update interval
    startClockInterval();

    // Setup grain effect if enabled
    const grainElement = $('.grain');
    if (grainElement) {
        if (settings.showGrain !== false) {
            grainElement.classList.add('visible');
            console.log('[AuraClock] setupInitialUI: Grain effect enabled');
        } else {
            grainElement.classList.remove('visible');
        }
    }

    // Set initial animations state
    if (document.body) {
        document.body.classList.toggle('animations-disabled', settings.enableAnimations === false);
    }

    console.log('[AuraClock] setupInitialUI: UI setup completed');
}

/**
 * Requests theme data from the background script
 */
function requestThemeData(): void {
    if (!chrome?.runtime?.sendMessage) {
        console.error('chrome.runtime.sendMessage is not available');
        applyFallbackVisibility();
        return;
    }

    console.log('[AuraClock] Requesting current theme data from background script...');
    
    // First, try to get the current theme from storage for immediate activation
    chrome.storage.sync.get('theme', (result) => {
        if (result['theme'] && !chrome.runtime.lastError) {
            console.log('[AuraClock] Found theme in storage:', result['theme']);
            // Immediately activate the theme background for instant visual feedback
            const themeBackgrounds = document.querySelectorAll('.theme-background');
            themeBackgrounds.forEach(bg => {
                bg.classList.remove('active');
                bg.classList.add('transitions-enabled');
            });
            
            const themeBackground = document.querySelector(`.theme-background.${result['theme']}`);
            if (themeBackground) {
                console.log('[AuraClock] Immediately activating theme background:', result['theme']);
                requestAnimationFrame(() => {
                    themeBackground.classList.add('active');
                });
            }
        }
    });
    
    // Then request full theme data from background script
    sendMessage(createRequestCurrentThemeDataMessage())
        .then(handleThemeDataResponse)
        .catch(error => {
            console.error('[AuraClock] Error requesting theme data:', error);
            handleThemeDataResponse({ error: error.message || 'Failed to fetch theme data' });
        });
}

/**
 * Applies fallback visibility when initialization fails
 */
function applyFallbackVisibility(): void {
    console.log('[AuraClock] Applying fallback visibility');
    if (document.body) {
        document.body.style.opacity = OPACITY_VISIBLE;
    }
}

/**
 * Handles the theme data response from the background script
 * @param response - The response containing theme data or an error
 */
function handleThemeDataResponse(response: { error?: string; themeData?: ThemeData; effectiveThemeName?: ThemeName }): void {
    // Check if the response indicates an error
    if (response?.error) {
        console.error('[AuraClock] Error in theme data response:', response.error);
        applyFallbackVisibility();
        return;
    }

    // Process the theme data if available
    if (response?.themeData && response.effectiveThemeName) {
        applyTheme(response.themeData, response.effectiveThemeName);
    } else {
        console.warn('[AuraClock] Incomplete theme data in response:', response);
        applyFallbackVisibility();
    }
    // The background script's MSG_TYPE_REQUEST_CURRENT_THEME_DATA handler directly calls sendResponse({ themeData, effectiveThemeName })
    // So, 'response' here should be that object when successful.
    if (response && response.themeData && response.effectiveThemeName) {
        console.log('[AuraClock] Theme data response received. Applying theme...', response);
        applyTheme(response.themeData as ThemeData, response.effectiveThemeName as ThemeName);
    } else {
        console.warn('[AuraClock] Received incomplete or unexpected theme data in handleThemeDataResponse:', response);
        document.body.classList.add('ready');
        document.body.style.opacity = OPACITY_VISIBLE;
    }
}

// DOMContentLoaded listener from newtab.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('[AuraClock] DOMContentLoaded: Starting theme setup.');

    const themeBackgrounds = document.querySelectorAll('.theme-background');
    console.log('[AuraClock] DOMContentLoaded: Found theme backgrounds:', themeBackgrounds.length);

    // Apply immediate UI visibility fixes
    const timeElement = $('.time');
    const timeMainElement = $('.time-main');
    const dateContainer = $('.date-container');
    
    if (timeElement) timeElement.classList.add('visible');
    if (timeMainElement) timeMainElement.classList.add('visible');
    
    // Ensure date container is visible immediately
    if (dateContainer) {
        dateContainer.style.opacity = '1';
        dateContainer.style.filter = 'blur(0)';
        dateContainer.style.transform = 'scale(1)';
    }
    
    console.log('[AuraClock] DOMContentLoaded: Applied immediate visibility fixes');

    chrome.storage.sync.get(['theme'], (settings) => {
        const currentTheme = settings['theme'] as ThemeName | undefined;
        console.log('[AuraClock] DOMContentLoaded: Theme from storage:', currentTheme);

        if (currentTheme) {
            console.log(`[AuraClock] DOMContentLoaded: Attempting to activate theme: ${currentTheme}`);
            // Deactivate all
            themeBackgrounds.forEach(bg => bg.classList.remove('active'));
            // Activate target
            const targetBackground = document.querySelector(`.theme-background.${currentTheme}`);
            if (targetBackground) {
                targetBackground.classList.add('active');
                console.log(`[AuraClock] DOMContentLoaded: Successfully activated theme: ${currentTheme}`);
            } else {
                console.warn(`[AuraClock] DOMContentLoaded: Theme background .${currentTheme} not found.`);
                // Fallback to graphite if stored theme element doesn't exist
                const graphiteBg = document.querySelector('.theme-background.graphite');
                if (graphiteBg) graphiteBg.classList.add('active');
            }
        } else {
            console.log('[AuraClock] DOMContentLoaded: No theme in storage. Activating default (graphite).');
            themeBackgrounds.forEach(bg => bg.classList.remove('active'));
            const graphiteBg = document.querySelector('.theme-background.graphite');
            if (graphiteBg) {
                 graphiteBg.classList.add('active');
                 console.log('[AuraClock] DOMContentLoaded: Default graphite theme activated.');
            }
        }
        
        // Make body visible
        document.body.classList.add('ready');
        document.body.style.opacity = '1';
        
        // Get clockStyle from storage before setting up initial UI
        chrome.storage.sync.get(['clockStyle', 'enableAnimations', 'showGrain', 'timeFormat', 'showAmPm'], (clockSettings) => {
            // Initialize with actual settings including clockStyle
            const initialSettings = {
                clockStyle: clockSettings['clockStyle'] || 'digital',
                enableAnimations: clockSettings['enableAnimations'] !== false,
                showGrain: clockSettings['showGrain'] || false,
                timeFormat: (clockSettings['timeFormat'] || '12') as '12' | '24',
                showAmPm: clockSettings['showAmPm'] !== false
            };
            
            console.log('[AuraClock] DOMContentLoaded: Initial settings for UI setup:', initialSettings);
            setupInitialUI(initialSettings);
            
            // Proceed with full initialization
    if (!isInitialized) {
        init();
                setupFavicon();
    } else {
                console.log('[AuraClock] DOMContentLoaded: Aura Clock was already initialized (unexpected). Re-running init.');
                init();
                setupFavicon();
    }
            console.log('[AuraClock] DOMContentLoaded: Full initialization sequence called.');
        });
    });
});

// Setup favicon with current settings
function setupFavicon(): void {
    initFavicon(cachedSettings);
}

// Function to create hour markers has been moved to the clock module

/**
 * Updates the analog clock display with the current time
 * @param animate - Whether to animate the clock hands (only on first load or mode change)
 */
function updateAnalogClock(animate: boolean = false): void {
    const analogClock = $('.analog-clock');
    if (!analogClock) {
        console.warn('Analog clock element not found');
        return;
    }
    
    // If animations are disabled globally, override the animate flag
    if (cachedSettings.enableAnimations === false) {
        animate = false;
    }
    
    // Use cached settings
    const settings = cachedSettings || {};
    
    // Get clock hands
    const hourHand = $('.hour-hand') as HTMLElement | null;
    const minuteHand = $('.minute-hand') as HTMLElement | null;
    const secondHand = $('.second-hand') as HTMLElement | null;
    const analogDay = $('.analog-day') as HTMLElement | null;
    const analogDate = $('.analog-date') as HTMLElement | null;
    
    if (!hourHand || !minuteHand || !secondHand) {
        console.warn('Analog clock hands not found');
        return;
    }
    
    // Call the imported function from the clock module
    const clockElements = {
        // Required properties
        hours: null,
        minutes: null,
        seconds: null,
        ampm: null,
        date: analogDate,
        day: analogDay,
        analog: analogClock as HTMLElement,
        analogHours: hourHand,
        analogMinutes: minuteHand,
        analogSeconds: secondHand,
        analogCenter: null,
        analogDot: null,
        analogMarkers: document.querySelectorAll('.clock-mark') as NodeListOf<HTMLElement>,
        analogNumbers: document.querySelectorAll('.clock-number') as NodeListOf<HTMLElement>,
        digital: null,
        digitalTime: null,
        digitalDate: null,
        digitalDay: null,
        digitalAmpm: null,
        body: document.body
    };
    
    // Call the updateAnalogClock function from the clock module
    updateAnalogClockFn(animate, clockElements, {
        smoothMotion: settings.smoothMotion !== false,
        enableAnimations: settings.enableAnimations !== false
    });
    
    // Update day and date separately since they're not part of the clock settings
    updateDayAndDateFn({
        date: clockElements.date,
        day: clockElements.day
    }, {
        showDate: settings.showDate !== false,
        showDay: settings.showDay !== false
    });
}

// updateClockHands function has been moved to the clock module

// setClockHandsPositions function has been moved to the clock module

/**
 * Safely updates the clock with error handling for extension context invalidation
 */
function safeUpdateClock(): void {
    // Check if extension context is still valid
    if (!chrome?.runtime?.id) {
        if (clockIntervalId) {
            clearInterval(clockIntervalId);
            clockIntervalId = undefined;
        }
        return;
    }
    
    try {
        const now = new Date();
        const seconds = now.getSeconds();
        
        // Update the clock display
        updateClock();
        
        // For analog clock, update the hands directly without animation
        if (cachedSettings.clockStyle === 'analog' || cachedSettings.clockStyle === 'both') {
            updateAnalogClock(false); // false to disable animation on tick
            
            // Update hour markers on the hour
            if (seconds === 0) {
                const analogClockElement = document.querySelector('.analog-clock');
                if (analogClockElement) {
                    createHourMarkersFn(analogClockElement as HTMLElement);
                }
            }
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // Check for extension context invalidation
        const isContextInvalid = errorMessage && (
            errorMessage.includes('Extension context invalidated') ||
            errorMessage.includes('context invalidated') ||
            errorMessage.includes('Extension context') ||
            errorMessage.includes('extension has been uninstalled')
        );
        
        if (isContextInvalid) {
            // Clean up and stop the interval
            if (clockIntervalId) {
                clearInterval(clockIntervalId);
                clockIntervalId = undefined;
            }
            // Don't log to console as the extension is being unloaded
            return;
        }
        
        // Log other errors
        console.error('Error in clock update:', error);
    }
}

/**
 * Function to start the clock interval
 */
function startClockInterval(): void {
    // Clear any existing interval
    if (clockIntervalId) {
        clearInterval(clockIntervalId);
        clockIntervalId = undefined;
    }
    
    // Initial call to display time immediately
    updateClock();
    
    // Set up interval with error handling
    clockIntervalId = window.setInterval(safeUpdateClock, 1000);
    console.log('[AuraClock] Clock interval started');
}

// Initial call to start the clock interval
startClockInterval();

/**
 * Updates the font style based on the provided font data
 * @param fontData - Object containing font style information
 */
export function updateFont(fontData: { fontStyle?: string }): void {
    if (!fontData?.fontStyle) return;
    
    // Apply the font style to the body
    document.body.style.fontFamily = `'${fontData.fontStyle}', sans-serif`;
    
    // Also update the clock display if needed
    updateClockDisplay();
}

// Listen for settings changes from the settings manager
settingsManager.onSettingsChange((changes) => {
    const logPrefix = '[AuraClock:SettingsChange]';
    
    try {
        console.debug(`${logPrefix} Detected changes:`, Object.keys(changes));
        
        Object.entries(changes).forEach(([key, newValue]) => {
            try {
                const settingKey = key as keyof ClockSettings;
                const handler = settingsHandlers[settingKey];
                
                if (handler) {
                    console.debug(`${logPrefix} Applying change for '${key}':`, newValue);
                    
                    // Update cached settings
                    if (newValue !== undefined) {
                        (cachedSettings as any)[key] = newValue;
                    }
                    
                    // Call the handler
                    handler(newValue as never);
                } else {
                    console.debug(`${logPrefix} No handler for setting: ${key}`);
                }
            } catch (error) {
                console.error(`${logPrefix} Error processing change for '${key}':`, error);
            }
        });

        // Update the clock display after all changes are processed
        requestAnimationFrame(() => {
            updateClockDisplay();
        });
        
    } catch (error) {
        console.error(`${logPrefix} Error in settings change handler:`, error);
    }
});

console.log('[AuraClock] Settings change listener initialized');

/**
 * Cleanup function for when the page unloads
 */
const handleUnload = () => {
    // Clear all intervals
    if (clockIntervalId) {
        clearInterval(clockIntervalId);
        clockIntervalId = undefined;
        console.log('[AuraClock] Clock interval cleared');
    }
    
    if (themeUpdateIntervalId) {
        clearInterval(themeUpdateIntervalId);
        themeUpdateIntervalId = null;
        console.log('[AuraClock] Theme update interval cleared');
    }
    
    // Reset initialization flag
    isInitialized = false;
    console.log('[AuraClock] Cleanup complete');
};

// Set up cleanup on page unload
window.addEventListener('beforeunload', handleUnload);

// Time-based theme update interval
/**
 * ID of the interval used for theme updates
 * @type {number | null}
 */
let themeUpdateIntervalId: number | null = null;

/**
 * Checks if the theme should be updated based on the current time
 */
function checkAndUpdateTheme(): void {
    chrome.storage.sync.get('gradientStyle', (data: { gradientStyle?: string }) => {
        if (chrome.runtime.lastError) {
            console.error('Error getting gradientStyle for interval update:', chrome.runtime.lastError);
            return;
        }
        
        if (data.gradientStyle === 'dynamic') {
            const currentThemeName = getTimeBasedTheme();
            if (document.body.className !== currentThemeName) {
                // Request theme update from background script
                chrome.runtime.sendMessage({
                    type: MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE,
                    themeName: currentThemeName
                }, (_response) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error requesting dynamic theme update:', chrome.runtime.lastError);
                    }
                });
            }
        }
    });
}

// Start the theme update interval
function startThemeUpdateInterval(): void {
    // Clear any existing interval
    if (themeUpdateIntervalId) {
        clearInterval(themeUpdateIntervalId);
    }
    
    // Check immediately and then every minute
    checkAndUpdateTheme();
    themeUpdateIntervalId = window.setInterval(checkAndUpdateTheme, 60000);
}

// Start the theme update interval when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startThemeUpdateInterval);
} else {
    startThemeUpdateInterval();
}


/**
 * Message handling for communication with the background script
 */

// Define message types and interfaces
interface ThemeUpdateMessage {
    type: typeof MSG_TYPE_THEME_UPDATE;
    data: {
        themeData: ThemeData;
        effectiveThemeName: ThemeName;
    };
}

interface SettingsChangedMessage {
    type: typeof MSG_TYPE_SETTINGS_CHANGED;
    payload: unknown;
}

interface DynamicThemeUpdateMessage {
    type: typeof MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE;
    themeName?: string;
}

type ExtensionMessage = ThemeUpdateMessage | SettingsChangedMessage | DynamicThemeUpdateMessage;

// Type guard to check if a message is a valid extension message
function isExtensionMessage(message: unknown): message is ExtensionMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'type' in message &&
        typeof (message as { type: unknown }).type === 'string'
    );
}

// Message handler functions
function handleThemeUpdate(message: ThemeUpdateMessage, sendResponse: (response: unknown) => void): boolean {
    const { themeData, effectiveThemeName } = message.data;
    const logPrefix = '[AuraClock] Theme Update:';
    
    if (!themeData || !effectiveThemeName) {
        console.warn(`${logPrefix} Incomplete theme data received`);
        sendResponse({ success: false, error: 'Incomplete theme data' });
        return false;
    }

    try {
        console.log(`${logPrefix} Applying theme: ${effectiveThemeName}`);
        applyTheme(themeData, effectiveThemeName);
        sendResponse({ success: true });
        return true;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error applying theme';
        console.error(`${logPrefix} Error applying theme:`, error);
        sendResponse({ success: false, error: errorMessage });
        return false;
    }
}

function handleSettingsChanged(_message: SettingsChangedMessage, sendResponse: (response: unknown) => void): boolean {
    console.log('[AuraClock] Settings changed notification received');
    // Settings changes are handled by the storage change listener
    sendResponse({ success: true, note: 'Settings change noted' });
    return false;
}

function handleDynamicThemeUpdate(message: DynamicThemeUpdateMessage, sendResponse: (response: unknown) => void): boolean {
    const logPrefix = '[AuraClock] Dynamic Theme Update:';
    
    if (message.themeName) {
        console.log(`${logPrefix} Updating to theme: ${message.themeName}`);
        handleThemeChange(message.themeName);
        sendResponse({ success: true });
        return false;
    }

    // If no theme name provided, get it from storage
    chrome.storage.sync.get('theme', (result: { theme?: string }) => {
        if (result?.theme) {
            console.log(`${logPrefix} Found theme in storage: ${result.theme}`);
            handleThemeChange(result.theme);
        } else {
            console.warn(`${logPrefix} No theme found in storage`);
        }
    });

    sendResponse({ success: true, note: 'Theme update in progress' });
    return false;
}

// Main message handler
function handleExtensionMessage(
    message: unknown,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
): boolean {
    const logPrefix = '[AuraClock] Message Handler:';
    console.log(`${logPrefix} Received message:`, message);

    // Wrapper to safely handle sendResponse
    const safeSendResponse = (response: unknown = { success: true }): void => {
        try {
            if (typeof sendResponse === 'function') {
                sendResponse(response);
            }
        } catch (error) {
            console.error(`${logPrefix} Error sending response:`, error);
        }
    };

    // Validate message
    if (!isExtensionMessage(message)) {
        console.warn(`${logPrefix} Invalid message format:`, message);
        safeSendResponse({ success: false, error: 'Invalid message format' });
        return false;
    }

    // Route message to appropriate handler
    try {
        switch (message.type) {
            case MSG_TYPE_THEME_UPDATE:
                return handleThemeUpdate(message, safeSendResponse);
                
            case MSG_TYPE_SETTINGS_CHANGED:
                return handleSettingsChanged(message, safeSendResponse);
                
            case MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE:
                return handleDynamicThemeUpdate(message, safeSendResponse);
                
            default:
                // This should never happen due to the type guard, but kept for safety
                console.warn(`${logPrefix} Unhandled message type:`, (message as { type: string }).type);
                safeSendResponse({ success: false, error: 'Unhandled message type' });
                return false;
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`${logPrefix} Error processing message:`, error);
        safeSendResponse({ success: false, error: errorMessage });
        return false;
    }
}

// Initialize message listener
if (chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener(handleExtensionMessage);
    console.log('[AuraClock] Message listener initialized');
} else {
    console.warn('[AuraClock] chrome.runtime.onMessage is not available in this context');
}

// Porting from newtab.js complete. Review TODOs for any further actions.
