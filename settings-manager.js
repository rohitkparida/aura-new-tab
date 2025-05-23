/**
 * Settings Manager for Aura Clock Tab
 * Provides a consistent interface for managing extension settings
 */

class SettingsManager {
    constructor() {
        this.DEFAULT_SETTINGS = {
            // Clock settings
            clockStyle: 'digital',
            timeFormat: '24h',
            showAmPm: false,
            showDate: true,
            showDay: true,
            
            // Visual settings
            gradientStyle: 'dynamic',
            fontStyle: 'default',
            showGrain: true,
            showMarkers: true,
            smoothMotion: true,
            enableAnimations: true,
            
            // Advanced settings
            locale: navigator.language.split('-')[0] || 'en',
            debugMode: false,
            
            // UI State (not persisted)
            isSettingsOpen: false
        };
        
        this.settings = { ...this.DEFAULT_SETTINGS };
        this.listeners = new Set();
        this.initialized = false;
    }
    
    /**
     * Initialize settings from storage
     * @returns {Promise<void>}
     */
    async init() {
        if (this.initialized) return;
        
        try {
            const result = await chrome.storage.sync.get(null);
            
            // Filter out any invalid settings
            const validSettings = {};
            Object.keys(this.DEFAULT_SETTINGS).forEach(key => {
                if (result.hasOwnProperty(key)) {
                    validSettings[key] = result[key];
                }
            });
            
            this.settings = { ...this.DEFAULT_SETTINGS, ...validSettings };
            this.initialized = true;
            
            // Listen for changes from other contexts
            chrome.storage.onChanged.addListener(this.handleStorageChange.bind(this));
            
            console.log('Settings initialized:', this.settings);
        } catch (error) {
            console.error('Failed to initialize settings:', error);
            // Fall back to defaults
            this.settings = { ...this.DEFAULT_SETTINGS };
            this.initialized = true;
            throw error;
        }
    }
    
    /**
     * Handle storage change events
     * @param {Object} changes
     * @param {string} areaName
     */
    handleStorageChange(changes, areaName) {
        if (areaName !== 'sync') return;
        
        let hasChanges = false;
        
        // Update local settings
        Object.entries(changes).forEach(([key, { newValue }]) => {
            if (this.settings[key] !== newValue) {
                this.settings[key] = newValue;
                hasChanges = true;
            }
        });
        
        // Notify listeners if anything changed
        if (hasChanges) {
            this.notifyListeners();
        }
    }
    
    /**
     * Get a setting value
     * @param {string} key - Setting key
     * @param {*} [defaultValue] - Default value if not set
     * @returns {*}
     */
    get(key, defaultValue = undefined) {
        if (!this.initialized) {
            console.warn('Settings not initialized yet');
            return defaultValue !== undefined ? defaultValue : this.DEFAULT_SETTINGS[key];
        }
        return this.settings[key] !== undefined ? this.settings[key] : defaultValue;
    }
    
    /**
     * Set a setting value
     * @param {string} key - Setting key
     * @param {*} value - New value
     * @returns {Promise<void>}
     */
    async set(key, value) {
        if (!this.initialized) {
            throw new Error('Settings not initialized');
        }
        
        // Don't update if value hasn't changed
        if (this.settings[key] === value) return;
        
        // Update local state
        this.settings[key] = value;
        
        // Persist to storage
        try {
            await chrome.storage.sync.set({ [key]: value });
            this.notifyListeners();
        } catch (error) {
            console.error(`Failed to set setting '${key}':`, error);
            throw error;
        }
    }
    
    /**
     * Update multiple settings at once
     * @param {Object} updates - Key-value pairs of settings to update
     * @returns {Promise<void>}
     */
    async update(updates) {
        if (!this.initialized) {
            throw new Error('Settings not initialized');
        }
        
        const filteredUpdates = {};
        let hasChanges = false;
        
        // Filter out unchanged values
        Object.entries(updates).forEach(([key, value]) => {
            if (this.settings[key] !== value) {
                filteredUpdates[key] = value;
                this.settings[key] = value;
                hasChanges = true;
            }
        });
        
        // Only persist if there are changes
        if (hasChanges) {
            try {
                await chrome.storage.sync.set(filteredUpdates);
                this.notifyListeners();
            } catch (error) {
                console.error('Failed to update settings:', error);
                throw error;
            }
        }
    }
    
    /**
     * Reset all settings to defaults
     * @returns {Promise<void>}
     */
    async reset() {
        try {
            await chrome.storage.sync.clear();
            this.settings = { ...this.DEFAULT_SETTINGS };
            await chrome.storage.sync.set(this.settings);
            this.notifyListeners();
            return this.settings;
        } catch (error) {
            console.error('Failed to reset settings:', error);
            throw error;
        }
    }
    
    /**
     * Add a change listener
     * @param {Function} callback - Function to call when settings change
     * @returns {Function} Unsubscribe function
     */
    addListener(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Listener must be a function');
        }
        
        this.listeners.add(callback);
        
        // Return unsubscribe function
        return () => this.listeners.delete(callback);
    }
    
    /**
     * Notify all listeners of changes
     */
    notifyListeners() {
        const settings = { ...this.settings }; // Clone to prevent mutation
        this.listeners.forEach(callback => {
            try {
                callback(settings);
            } catch (error) {
                console.error('Error in settings listener:', error);
            }
        });
    }
}

// Export a singleton instance
const settingsManager = new SettingsManager();

// Initialize settings when imported
settingsManager.init().catch(console.error);

export default settingsManager;
