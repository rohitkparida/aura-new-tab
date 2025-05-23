// Aura Clock Tab - Popup (TypeScript)

// Import types from clock.ts
import { ClockSettings, TimeFormat, ClockStyle, ThemeName, FontFamily } from './types';

// Define an interface for the settings keys for better type safety
interface SettingsKeys {
    FONT_STYLE: 'font-style';
    GRADIENT_STYLE: 'gradient-style'; 
    CLOCK_STYLE: 'clock-style';
    SHOW_DATE: 'show-date';
    SHOW_DAY: 'show-day';
    TIME_FORMAT: 'time-format';
    SHOW_AM_PM: 'show-ampm';
    ENABLE_ANIMATIONS: 'enable-animations';
    SHOW_GRAIN: 'show-grain';
    SHOW_MARKERS: 'show-markers';
    SMOOTH_MOTION: 'smooth-motion';
}

// Define an interface for the settings object stored in chrome.storage
interface PopupSettings extends Partial<Omit<ClockSettings, 'timeFormat' | 'clockStyle' | 'theme' | 'fontFamily'>> {
    fontFamily?: FontFamily;
    theme?: ThemeName; 
    clockStyle?: ClockStyle;
    timeFormat?: TimeFormat | '12h' | '24h'; 
    showAmPm?: boolean;
    enableAnimations?: boolean;
    showGrain?: boolean;
    showMarkers?: boolean;
    smoothMotion?: boolean;
}

document.addEventListener('DOMContentLoaded', function () {
    const SETTINGS_KEYS: SettingsKeys = {
        FONT_STYLE: 'font-style',       
        GRADIENT_STYLE: 'gradient-style',// 
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

    function updateClockSettings(clockStyle: ClockStyle | undefined): void {
        const analogSettings = document.getElementById('analog-settings') as HTMLElement | null;
        const digitalSettings = document.getElementById('digital-settings') as HTMLElement | null;

        if (analogSettings && digitalSettings) {
            if (clockStyle === 'analog' || clockStyle === 'both') {
                analogSettings.style.display = 'block';
            } else {
                analogSettings.style.display = 'none';
            }
            
            if (clockStyle === 'digital' || clockStyle === 'both') {
                digitalSettings.style.display = 'block';
            } else {
                digitalSettings.style.display = 'none';
            }
        }
    }

    chrome.storage.sync.get('timeFormat', function (result) {
        const settings = result as { timeFormat?: TimeFormat | '12h' | '24h' };
        if (settings.timeFormat === undefined) {
            const defaultSettings = { timeFormat: '24h' as const };
            chrome.storage.sync.set(defaultSettings);
            const timeFormatElement = document.getElementById(SETTINGS_KEYS.TIME_FORMAT) as HTMLInputElement;
            if (timeFormatElement) {
                timeFormatElement.checked = false;
            }
        } else {
            const timeFormatElement = document.getElementById(SETTINGS_KEYS.TIME_FORMAT) as HTMLInputElement;
            if (timeFormatElement) {
                // Check against '12' (from TimeFormat) or '12h' (from PopupSettings flexibility)
                const is12h = settings.timeFormat === '12h' || settings.timeFormat === '12';
                timeFormatElement.checked = is12h;
            }
        }
    });

    const conceptualToStorageKeyMap: Record<keyof SettingsKeys, keyof ClockSettings | 'theme' | 'timeFormat' | 'showAmPm' | 'enableAnimations' | 'showGrain' | 'showMarkers' | 'smoothMotion' > = {
        FONT_STYLE: 'fontFamily',
        GRADIENT_STYLE: 'theme', // Conceptual GRADIENT_STYLE maps to 'theme' in storage
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
                        // For timeFormat, checked means '12h', unchecked means '24h'
                        if (conceptualKey === 'TIME_FORMAT') {
                            (element as HTMLInputElement).checked = settingValue === '12h' || settingValue === '12';
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

    function saveSettings(conceptualKey: keyof SettingsKeys, value: unknown): void {
        console.log(`saveSettings called. Conceptual Key: ${conceptualKey}, Value: ${value}`);
        
        const storageKey = conceptualToStorageKeyMap[conceptualKey]; 
        let processedValue = value;

        // Process value based on conceptual key if needed
        if (conceptualKey === 'TIME_FORMAT') {
            processedValue = (value as boolean) ? '12h' : '24h'; // UI checkbox: true for 12h, false for 24h
        } else if (conceptualKey === 'FONT_STYLE' || conceptualKey === 'GRADIENT_STYLE' || conceptualKey === 'CLOCK_STYLE') {
            processedValue = String(value);
        } 
        // For boolean checkboxes like SHOW_DATE, value is already boolean

        const settingToSave = { [storageKey]: processedValue };
        
        console.log('Saving setting:', settingToSave);

        chrome.storage.sync.set(settingToSave, function () {
            if (chrome.runtime.lastError) {
                console.error('Error saving setting:', settingToSave, chrome.runtime.lastError.message);
            }
            showStatus('Settings saved');
        });
    }

    function addCheckboxListener(conceptualKey: keyof SettingsKeys) {
        const elementId = SETTINGS_KEYS[conceptualKey];
        const element = document.getElementById(elementId) as HTMLInputElement | null;
        if (element) {
            console.log(`Attaching change listener to checkbox: ${elementId}`);
            element.addEventListener('change', (e: Event) => {
                console.log(`Change event on ${elementId}, new value: ${(e.target as HTMLInputElement).checked}`);
                saveSettings(conceptualKey, (e.target as HTMLInputElement).checked);
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
                saveSettings(conceptualKey, value);
                if (conceptualKey === 'CLOCK_STYLE') {
                    updateClockSettings(value as ClockStyle);
                }
            });
        } else {
            console.error(`Element not found for listener: ${elementId}`);
        }
    }

    addCheckboxListener('SHOW_DATE');
    addCheckboxListener('SHOW_DAY');
    addValueListener('CLOCK_STYLE'); 
    addValueListener('GRADIENT_STYLE'); 
    addValueListener('FONT_STYLE'); 
    
    const timeFormatElement = document.getElementById(SETTINGS_KEYS.TIME_FORMAT) as HTMLInputElement | null;
    if (timeFormatElement) {
         console.log(`Attaching change listener to timeFormatElement: ${SETTINGS_KEYS.TIME_FORMAT}`);
        timeFormatElement.addEventListener('change', (e: Event) => {
            saveSettings('TIME_FORMAT', (e.target as HTMLInputElement).checked);
        });
    } else {
        console.error(`Element not found for TIME_FORMAT listener: ${SETTINGS_KEYS.TIME_FORMAT}`);
    }

    addCheckboxListener('SHOW_AM_PM');
    addCheckboxListener('ENABLE_ANIMATIONS');
    addCheckboxListener('SHOW_GRAIN');
    addCheckboxListener('SHOW_MARKERS');
    addCheckboxListener('SMOOTH_MOTION');
});

function showStatus(message: string): void {
    const status = document.getElementById('status') as HTMLElement | null;
    if (status) {
        status.textContent = message;
        status.classList.add('visible');

        setTimeout(() => {
            status.classList.remove('visible');
        }, 2000);
    }
}