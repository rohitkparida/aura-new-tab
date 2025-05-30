/**
 * Settings Manager
 * 
 * Handles loading, saving, and managing extension settings
 * using chrome.storage.sync for synchronization across devices
 */

import { ClockSettings, FontFamily } from '../types';

// Default settings that will be used as fallback
const DEFAULT_SETTINGS: ClockSettings = {
    // Theme
    theme: 'system',
    // Time display
    timeFormat: '12',
    showAmPm: true,
    showDate: true,
    showDay: true,
    
    // Clock style
    clockStyle: 'digital',
    fontFamily: 'Inter' as FontFamily,
    fontSize: '4rem',
    fontWeight: '400',
    
    // Colors and theming
    textColor: '#ffffff',
    backgroundColor: '#000000',
    backgroundType: 'solid',
    gradientColors: ['#000000', '#1a1a1a'],
    gradientAngle: 180,
    gradientStyle: 'linear',
    backgroundImage: '',
    
    // Background effects
    backgroundBlur: 0,
    backgroundBrightness: 1,
    backgroundContrast: 1,
    backgroundSaturation: 1,
    backgroundHue: 0,
    backgroundGrayscale: false,
    backgroundInvert: false,
    backgroundSepia: false,
    backgroundOpacity: 1,
    
    // Animation properties
    animationSpeed: 'normal',
    animationType: 'fade',
    enableAnimations: true,
    
    // Grain effect
    showGrain: true,
    grainIntensity: 0.1,
    grainOpacity: 0.1,
    grainSize: 1,
    grainSpeed: 1,
    grainColor: '#ffffff',
    grainBlendMode: 'overlay',
    
    // Developer options
};

// Cache for settings to reduce storage API calls
let cachedSettings: Partial<ClockSettings> = { ...DEFAULT_SETTINGS };

// Callbacks to be notified when settings change
type SettingsChangeCallback = (settings: Partial<ClockSettings>) => void;
const settingsChangeCallbacks: SettingsChangeCallback[] = [];

/**
 * Loads clock settings from chrome.storage.sync
 * @returns Promise that resolves with the loaded settings
 */
export async function loadClockSettings(): Promise<ClockSettings> {
    try {
        const settings = await chrome.storage.sync.get(null) as Partial<ClockSettings>;
        
        // Merge with defaults to ensure all settings are present
        const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };
        
        // Update cache
        cachedSettings = { ...mergedSettings };
        
        return mergedSettings;
    } catch (error) {
        console.error('Error loading settings:', error);
        return { ...DEFAULT_SETTINGS };
    }
}

/**
 * Saves clock settings to chrome.storage.sync
 * @param settings - The settings to save
 * @returns Promise that resolves when settings are saved
 */
export async function saveClockSettings(settings: Partial<ClockSettings>): Promise<void> {
    try {
        await chrome.storage.sync.set(settings);
        
        // Update cache
        cachedSettings = { ...cachedSettings, ...settings };
        
        // Notify listeners
        notifySettingsChanged(settings);
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
}

/**
 * Gets a setting value from the cache
 * @param key - The setting key to get
 * @returns The setting value or undefined if not found
 */
export function getSetting<K extends keyof ClockSettings>(key: K): ClockSettings[K] | undefined {
    return cachedSettings[key];
}

/**
 * Updates a single setting and saves it
 * @param key - The setting key to update
 * @param value - The new value for the setting
 * @returns Promise that resolves when the setting is saved
 */
export async function updateSetting<K extends keyof ClockSettings>(
    key: K, 
    value: ClockSettings[K]
): Promise<void> {
    await saveClockSettings({ [key]: value });
}

/**
 * Registers a callback to be called when settings change
 * @param callback - The callback function
 * @returns A function to unregister the callback
 */
export function onSettingsChange(callback: SettingsChangeCallback): () => void {
    settingsChangeCallbacks.push(callback);
    
    // Return unregister function
    return () => {
        const index = settingsChangeCallbacks.indexOf(callback);
        if (index !== -1) {
            settingsChangeCallbacks.splice(index, 1);
        }
    };
}

/**
 * Notifies all registered callbacks about settings changes
 * @param changedSettings - The settings that changed
 */
function notifySettingsChanged(changedSettings: Partial<ClockSettings>): void {
    // Update cache with new settings
    cachedSettings = { ...cachedSettings, ...changedSettings };
    
    // Call all registered callbacks
    for (const callback of settingsChangeCallbacks) {
        try {
            callback(changedSettings);
        } catch (error) {
            console.error('Error in settings change callback:', error);
        }
    }
}

/**
 * Initializes the settings manager
 * Sets up storage change listener and loads initial settings
 * @returns Promise that resolves when initialization is complete
 */
export async function initSettingsManager(): Promise<ClockSettings> {
    try {
        // Set up storage change listener
        if (chrome?.storage?.onChanged) {
            chrome.storage.onChanged.addListener(handleStorageChange);
        }
        
        // Load initial settings
        return await loadClockSettings();
    } catch (error) {
        console.error('Error initializing settings manager:', error);
        return { ...DEFAULT_SETTINGS };
    }
}

/**
 * Handles storage change events
 * @param changes - Object containing the changes
 * @param namespace - The storage namespace that changed
 */
function handleStorageChange(
    changes: { [key: string]: chrome.storage.StorageChange },
    namespace: string
): void {
    if (namespace === 'sync') {
        const changedSettings: Partial<ClockSettings> = {};
        
        // Process each changed setting
        for (const [key, change] of Object.entries(changes)) {
            if (key in DEFAULT_SETTINGS) {
                (changedSettings as any)[key] = change.newValue;
            }
        }
        
        // If we have any valid settings changes, notify listeners
        if (Object.keys(changedSettings).length > 0) {
            notifySettingsChanged(changedSettings);
        }
    }
}

// Export the public API
export const settingsManager = {
    getSetting: getSetting as <K extends keyof ClockSettings>(key: K) => ClockSettings[K] | undefined,
    updateSetting,
    onSettingsChange,
    loadClockSettings,
    saveClockSettings,
    initSettingsManager,
    DEFAULT_SETTINGS: DEFAULT_SETTINGS as Readonly<ClockSettings>
};

export type { ClockSettings };
