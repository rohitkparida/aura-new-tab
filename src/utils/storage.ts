import { Settings, DEFAULT_SETTINGS } from '@/types/settings';

/**
 * Utility functions for working with Chrome storage
 */

/**
 * Get a value from Chrome's sync storage
 */
export async function getStorage<T>(key: string): Promise<T | undefined> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => {
      resolve(result[key] as T);
    });
  });
}

/**
 * Set a value in Chrome's sync storage
 */
export async function setStorage<T>(key: string, value: T): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, resolve);
  });
}

/**
 * Remove a key from Chrome's sync storage
 */
export async function removeStorage(key: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.remove(key, resolve);
  });
}

/**
 * Clear all data from Chrome's sync storage
 */
export async function clearStorage(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.clear(resolve);
  });
}

/**
 * Get all settings from storage or return defaults
 */
export async function getSettings(): Promise<Settings> {
  console.log('[STORAGE] getSettings: Using DEFAULT_SETTINGS for retrieval:', JSON.stringify(DEFAULT_SETTINGS));
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
      console.log('[STORAGE] getSettings: Raw items received from chrome.storage.sync.get:', JSON.stringify(items));
      const resolvedSettings = items as Settings;
      console.log('[STORAGE] getSettings: Final resolved settings:', JSON.stringify(resolvedSettings));
      resolve(resolvedSettings);
    });
  });
}

/**
 * Save settings to storage
 */
export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  const currentSettings = await getSettings();
  const newSettings = { ...currentSettings, ...settings };
  await setStorage('settings', newSettings);
}

/**
 * Reset settings to defaults
 */
export async function resetSettings(): Promise<void> {
  await setStorage('settings', DEFAULT_SETTINGS);
}

/**
 * Listen for changes to storage
 */
export function onStorageChange(
  callback: (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void
): () => void {
  chrome.storage.onChanged.addListener(callback);
  return () => chrome.storage.onChanged.removeListener(callback);
}

/**
 * Listen for changes to settings
 */
export function onSettingsChange(
  callback: (newSettings: Settings, oldSettings: Partial<Settings>) => void
): () => void {
  return onStorageChange(async (changes, areaName) => {
    if (areaName === 'sync' && changes['settings']) {
      const oldSettings = (changes['settings'].oldValue || {}) as Partial<Settings>;
      const newSettings = (changes['settings'].newValue || {}) as Settings;
      callback(newSettings, oldSettings);
    }
  });
}

/**
 * Get a specific setting value
 */
export async function getSetting<K extends keyof Settings>(
  key: K
): Promise<Settings[K]> {
  const settings = await getSettings();
  return settings[key];
}

/**
 * Set a specific setting value
 */
export async function setSetting<K extends keyof Settings>(
  key: K,
  value: Settings[K]
): Promise<void> {
  const settings = await getSettings();
  settings[key] = value;
  await saveSettings(settings);
}

/**
 * Toggle a boolean setting
 */
export async function toggleSetting<K extends keyof Settings>(
  key: K
): Promise<void> {
  if (typeof DEFAULT_SETTINGS[key] !== 'boolean') {
    throw new Error(`Cannot toggle non-boolean setting: ${String(key)}`);
  }
  const currentValue = await getSetting(key) as boolean;
  await setSetting(key, !currentValue as Settings[K]);
}

export default {
  get: getStorage,
  set: setStorage,
  remove: removeStorage,
  clear: clearStorage,
  getSettings,
  saveSettings,
  resetSettings,
  onStorageChange,
  onSettingsChange,
  getSetting,
  setSetting,
  toggleSetting,
};
