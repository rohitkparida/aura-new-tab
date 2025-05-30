// Aura Clock Tab - Popup (TypeScript)

// Import types from clock.ts
import { ClockSettings, TimeFormat, ClockStyle, ThemeName, FontFamily } from './types';
import { initI18n, t, setLanguage, getCurrentLanguage } from './i18n';

// UI State Management
interface UIState {
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string;
}

let uiState: UIState = {
    isLoading: true,
    hasError: false,
    errorMessage: ''
};

// UI Helper Functions
function showLoading(show: boolean = true): void {
    const loadingEl = document.getElementById('loading');
    const mainContent = document.querySelector('.header')?.parentElement;
    
    if (loadingEl && mainContent) {
        loadingEl.style.display = show ? 'flex' : 'none';
        (mainContent as HTMLElement).style.display = show ? 'none' : 'block';
    }
    uiState.isLoading = show;
}

function showError(message: string): void {
    const errorEl = document.getElementById('error');
    const errorMessageEl = document.getElementById('error-message');
    
    if (errorEl && errorMessageEl) {
        errorMessageEl.textContent = message;
        errorEl.style.display = 'block';
    uiState.hasError = true;
    uiState.errorMessage = message;
    }
}

function hideError(): void {
    const errorEl = document.getElementById('error');
    if (errorEl) {
        errorEl.style.display = 'none';
    uiState.hasError = false;
    uiState.errorMessage = '';
}
}

function showStatus(message: string): void {
    const statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.classList.add('visible');
        setTimeout(() => {
            statusEl.classList.remove('visible');
        }, 2000);
    }
}

// Visual feedback for setting changes
function showSettingChanged(element: HTMLElement): void {
    const option = element.closest('.option');
    if (option) {
        option.classList.add('changed');
        setTimeout(() => {
            option.classList.remove('changed');
        }, 300);
    }
}

// i18n helper functions
function updateTexts(): void {
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    elementsToTranslate.forEach((element) => {
        const key = element.getAttribute('data-i18n');
        if (key) {
            if (element.tagName === 'OPTION') {
                element.textContent = t(key);
            } else {
                element.textContent = t(key);
            }
        }
    });
}

// Initialize popup functionality
document.addEventListener('DOMContentLoaded', async function (): Promise<void> {
    console.log('Popup DOM loaded, initializing...');
        showLoading(true);
        hideError();
        
    try {
        // Initialize i18n
        await initI18n();
        
        // Set up language selector
        setupLanguageSelector();
        
        // Update all texts
        updateTexts();
        
        // Continue with existing initialization
        await initializePopup();
        
    } catch (error) {
        console.error('Error initializing popup:', error);
        showError('Failed to initialize settings. Please refresh and try again.');
    } finally {
        showLoading(false);
    }
});

function setupLanguageSelector(): void {
    const languageSelect = document.getElementById('language-select') as HTMLSelectElement;
    if (languageSelect) {
        // Set current language
        languageSelect.value = getCurrentLanguage();
        
        // Add change listener
        languageSelect.addEventListener('change', (e) => {
            const newLang = (e.target as HTMLSelectElement).value;
            setLanguage(newLang);
            updateTexts();
            showStatus(t('settings.settingsSaved'));
        });
    }
}

async function initializePopup(): Promise<void> {
    // ... existing code ...

    // Settings key mappings (keeping existing logic)
    interface SettingsKeys {
        FONT_STYLE: string;
        GRADIENT_STYLE: string;
        CLOCK_STYLE: string;
        SHOW_DATE: string;
        SHOW_DAY: string;
        TIME_FORMAT: string;
        SHOW_AM_PM: string;
        ENABLE_ANIMATIONS: string;
        SHOW_GRAIN: string;
        SHOW_MARKERS: string;
        SMOOTH_MOTION: string;
    }

    const SETTINGS_KEYS: SettingsKeys = {
        FONT_STYLE: 'font-style',       
        GRADIENT_STYLE: 'gradient-style',
        CLOCK_STYLE: 'clock-style',
        SHOW_DATE: 'show-date',
        SHOW_DAY: 'show-day',
        TIME_FORMAT: 'time-format',
        SHOW_AM_PM: 'show-ampm',
        ENABLE_ANIMATIONS: 'enable-animations',
        SHOW_GRAIN: 'show-grain',
        SHOW_MARKERS: 'show-markers',
        SMOOTH_MOTION: 'smooth-motion'
    } as const;

    const ACTIVE_TAB_CLASS = 'active';
    const TAB_BUTTON_SELECTOR = '.tab';
    const TAB_CONTENT_SELECTOR = '.tab-content';

    const tabs = document.querySelectorAll<HTMLElement>(TAB_BUTTON_SELECTOR);
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove(ACTIVE_TAB_CLASS));
            tab.classList.add(ACTIVE_TAB_CLASS);

            const tabContents = document.querySelectorAll<HTMLElement>(TAB_CONTENT_SELECTOR);
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            const targetTabContent = document.getElementById(tab.dataset['tab']!); 
            if (targetTabContent) {
                targetTabContent.style.display = 'block';
            }
        });
    });

    function updateClockSettings(clockStyle?: ClockStyle): void {
        const analogSettings = document.getElementById('analog-settings') as HTMLElement | null;

        if (analogSettings) {
            if (clockStyle === 'analog') {
                analogSettings.classList.remove('hidden');
            } else {
                analogSettings.classList.add('hidden');
            }
        }
    }

    chrome.storage.sync.get('timeFormat', function (result) {
        const settings = result as { timeFormat?: TimeFormat };
        if (settings.timeFormat === undefined) {
            const defaultSettings = { timeFormat: '24' as const };
            chrome.storage.sync.set(defaultSettings);
            const timeFormatElement = document.getElementById(SETTINGS_KEYS.TIME_FORMAT) as HTMLInputElement;
            if (timeFormatElement) {
                timeFormatElement.checked = false;
            }
        } else {
            const timeFormatElement = document.getElementById(SETTINGS_KEYS.TIME_FORMAT) as HTMLInputElement;
            if (timeFormatElement) {
                const is12h = settings.timeFormat === '12';
                timeFormatElement.checked = is12h;
            }
        }
    });

    type PopupSettings = {
        fontFamily?: FontFamily;
        theme?: ThemeName;
        clockStyle?: ClockStyle;
        showDate?: boolean;
        showDay?: boolean;
        timeFormat?: TimeFormat;
        showAmPm?: boolean;
        enableAnimations?: boolean;
        showGrain?: boolean;
        showMarkers?: boolean;
        smoothMotion?: boolean;
    };

    const conceptualToStorageKeyMap: Record<keyof SettingsKeys, keyof ClockSettings | 'theme' | 'timeFormat' | 'showAmPm' | 'enableAnimations' | 'showGrain' | 'showMarkers' | 'smoothMotion' > = {
        FONT_STYLE: 'fontFamily',
        GRADIENT_STYLE: 'theme',
        CLOCK_STYLE: 'clockStyle',
        SHOW_DATE: 'showDate',
        SHOW_DAY: 'showDay',
        TIME_FORMAT: 'timeFormat',
        SHOW_AM_PM: 'showAmPm',
        ENABLE_ANIMATIONS: 'enableAnimations',
        SHOW_GRAIN: 'showGrain',
        SHOW_MARKERS: 'showMarkers',
        SMOOTH_MOTION: 'smoothMotion'
    };

    const storageKeysToLoadFromChrome = Object.values(conceptualToStorageKeyMap);

    chrome.storage.sync.get(storageKeysToLoadFromChrome, function (result) {
        const loadedSettings = result as Partial<PopupSettings>; 
        console.log('Popup loaded settings:', loadedSettings);
        if (chrome.runtime.lastError) {
            console.error('Error loading settings:', chrome.runtime.lastError.message);
            showError('Failed to load settings: ' + chrome.runtime.lastError.message);
            return;
        }

        (Object.keys(SETTINGS_KEYS) as Array<keyof SettingsKeys>).forEach(conceptualKey => {
            const elementId = SETTINGS_KEYS[conceptualKey]; 
            const element = document.getElementById(elementId) as HTMLInputElement | HTMLSelectElement | null;
            
            if (element) {
                const storageKey = conceptualToStorageKeyMap[conceptualKey]; 
                const settingValue = loadedSettings[storageKey as keyof PopupSettings];

                if (settingValue !== undefined) {
                    if (element.type === 'checkbox') {
                        if (conceptualKey === 'TIME_FORMAT') {
                            (element as HTMLInputElement).checked = settingValue === '12';
                        } else {
                            (element as HTMLInputElement).checked = Boolean(settingValue);
                        }
                    } else {
                        element.value = String(settingValue);
                    }
                }
            } else {
                console.warn(`Element with ID '${elementId}' not found for conceptual key '${conceptualKey}'.`);
            }
        });
        updateClockSettings(loadedSettings.clockStyle);
    });

    function saveSettings(conceptualKey: keyof SettingsKeys, value: unknown, element?: HTMLElement): void {
        console.log(`saveSettings called. Conceptual Key: ${conceptualKey}, Value: ${value}`);
        
        const storageKey = conceptualToStorageKeyMap[conceptualKey]; 
        let processedValue = value;

        if (conceptualKey === 'TIME_FORMAT') {
            processedValue = (value as boolean) ? '12' : '24';
        } else if (conceptualKey === 'FONT_STYLE' || conceptualKey === 'GRADIENT_STYLE' || conceptualKey === 'CLOCK_STYLE') {
            processedValue = String(value);
        } 

        const settingToSave = { [storageKey]: processedValue };
        
        console.log('Saving setting:', settingToSave);

        chrome.storage.sync.set(settingToSave, function () {
            if (chrome.runtime.lastError) {
                console.error('Error saving setting:', settingToSave, chrome.runtime.lastError.message);
                showError('Failed to save setting: ' + chrome.runtime.lastError.message);
            } else {
                showStatus(t('settings.settingsSaved'));
                if (element) {
                    showSettingChanged(element);
                }
            }
        });
    }

    function addCheckboxListener(conceptualKey: keyof SettingsKeys) {
        const elementId = SETTINGS_KEYS[conceptualKey];
        const element = document.getElementById(elementId) as HTMLInputElement | null;
        if (element) {
            console.log(`Attaching change listener to checkbox: ${elementId}`);
            element.addEventListener('change', (e: Event) => {
                console.log(`Change event on ${elementId}, new value: ${(e.target as HTMLInputElement).checked}`);
                saveSettings(conceptualKey, (e.target as HTMLInputElement).checked, element);
            });
        } else {
            console.error(`Checkbox element not found for listener: ${elementId}`);
        }
    }

    function addValueListener(conceptualKey: keyof SettingsKeys) {
        const elementId = SETTINGS_KEYS[conceptualKey];
        const element = document.getElementById(elementId) as HTMLSelectElement | HTMLInputElement | null;
        if (element) {
            console.log(`Attaching change listener to element: ${elementId}`);
            element.addEventListener('change', (e: Event) => {
                const value = (e.target as HTMLSelectElement | HTMLInputElement).value;
                console.log(`Change event on ${elementId}, new value: ${value}`);
                saveSettings(conceptualKey, value, element);
                if (conceptualKey === 'CLOCK_STYLE') {
                    updateClockSettings(value as ClockStyle);
                }
            });
        } else {
            console.error(`Element not found for listener: ${elementId}`);
        }
    }

    // Add event listeners for checkboxes
    addCheckboxListener('SHOW_DATE');
    addCheckboxListener('SHOW_DAY');
    addCheckboxListener('TIME_FORMAT');
    addCheckboxListener('SHOW_AM_PM');
    addCheckboxListener('ENABLE_ANIMATIONS');
    addCheckboxListener('SHOW_GRAIN');
    addCheckboxListener('SHOW_MARKERS');
    addCheckboxListener('SMOOTH_MOTION');
    
    // Add event listeners for dropdowns
    addValueListener('FONT_STYLE');
    addValueListener('GRADIENT_STYLE');
    addValueListener('CLOCK_STYLE');

    console.log('Popup initialization completed');
}