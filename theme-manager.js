/**
 * Theme Manager for Aura Clock Tab
 * Handles dynamic theming and color calculations
 */

import settingsManager from './settings-manager.js';

class ThemeManager {
    constructor() {
        this.themes = {
            light: {
                name: 'Light',
                colors: {
                    primary: '#ffffff',
                    secondary: '#f5f5f5',
                    text: '#333333',
                    accent: '#4a90e2',
                    shadow: 'rgba(0, 0, 0, 0.1)'
                },
                isDark: false
            },
            dark: {
                name: 'Dark',
                colors: {
                    primary: '#121212',
                    secondary: '#1e1e1e',
                    text: '#ffffff',
                    accent: '#64b5f6',
                    shadow: 'rgba(0, 0, 0, 0.3)'
                },
                isDark: true
            },
            midnight: {
                name: 'Midnight',
                colors: {
                    primary: '#0a0f1e',
                    secondary: '#141a2e',
                    text: '#e0e0e0',
                    accent: '#7c4dff',
                    shadow: 'rgba(0, 0, 0, 0.4)'
                },
                isDark: true
            },
            sunset: {
                name: 'Sunset',
                colors: {
                    primary: '#2c3e50',
                    secondary: '#34495e',
                    text: '#ecf0f1',
                    accent: '#e74c3c',
                    shadow: 'rgba(0, 0, 0, 0.25)'
                },
                isDark: true
            },
            forest: {
                name: 'Forest',
                colors: {
                    primary: '#1b5e20',
                    secondary: '#2e7d32',
                    text: '#e8f5e9',
                    accent: '#69f0ae',
                    shadow: 'rgba(0, 0, 0, 0.2)'
                },
                isDark: true
            },
            ocean: {
                name: 'Ocean',
                colors: {
                    primary: '#01579b',
                    secondary: '#0277bd',
                    text: '#e1f5fe',
                    accent: '#4fc3f7',
                    shadow: 'rgba(0, 0, 0, 0.25)'
                },
                isDark: true
            },
            dynamic: {
                name: 'Dynamic',
                isDynamic: true
            }
        };
        
        this.currentTheme = null;
        this.dynamicThemeInterval = null;
        
        // Bind methods
        this.updateTheme = this.updateTheme.bind(this);
        this.getTimeBasedTheme = this.getTimeBasedTheme.bind(this);
        
        // Initialize when settings are ready
        settingsManager.addListener(this.handleSettingsChange.bind(this));
    }
    
    /**
     * Initialize the theme manager
     */
    async init() {
        // Set up dynamic theme updates if needed
        this.setupDynamicTheming();
        
        // Apply initial theme
        const themeId = settingsManager.get('theme', 'dynamic');
        await this.updateTheme(themeId);
    }
    
    /**
     * Handle settings changes
     */
    handleSettingsChange(settings) {
        if (settings.theme && settings.theme !== this.currentTheme?.id) {
            this.updateTheme(settings.theme);
        }
    }
    
    /**
     * Update the current theme
     * @param {string} themeId - Theme ID to apply
     */
    async updateTheme(themeId) {
        // Clear any existing dynamic theming
        this.clearDynamicTheming();
        
        const theme = this.themes[themeId] || this.themes.dynamic;
        
        // Handle dynamic theme
        if (theme.isDynamic) {
            this.setupDynamicTheming();
            return;
        }
        
        this.currentTheme = { id: themeId, ...theme };
        this.applyTheme(theme);
    }
    
    /**
     * Apply theme colors to the document
     * @private
     */
    applyTheme(theme) {
        if (!theme || !theme.colors) return;
        
        const { colors } = theme;
        const root = document.documentElement;
        
        // Update CSS custom properties
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
        
        // Update meta theme color for mobile browsers
        this.updateMetaThemeColor(colors.primary);
        
        // Dispatch event for components that need to know about theme changes
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { themeId: this.currentTheme.id, theme: this.currentTheme } 
        }));
    }
    
    /**
     * Update the browser's theme color meta tag
     * @private
     */
    updateMetaThemeColor(color) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = color;
    }
    
    /**
     * Set up dynamic theming based on time of day
     * @private
     */
    setupDynamicTheming() {
        // Clear any existing interval
        this.clearDynamicTheming();
        
        // Update immediately
        this.updateDynamicTheme();
        
        // Update every minute
        this.dynamicThemeInterval = setInterval(() => {
            this.updateDynamicTheme();
        }, 60000);
    }
    
    /**
     * Clear dynamic theming interval
     * @private
     */
    clearDynamicTheming() {
        if (this.dynamicThemeInterval) {
            clearInterval(this.dynamicThemeInterval);
            this.dynamicThemeInterval = null;
        }
    }
    
    /**
     * Update the theme based on the current time
     * @private
     */
    updateDynamicTheme() {
        const now = new Date();
        const hours = now.getHours();
        
        // Determine which theme to use based on time of day
        let themeId;
        
        if (hours >= 5 && hours < 8) {
            themeId = 'sunrise';
        } else if (hours >= 8 && hours < 16) {
            themeId = 'light';
        } else if (hours >= 16 && hours < 18) {
            themeId = 'sunset';
        } else {
            themeId = 'midnight';
        }
        
        // Only update if the theme has changed
        if (!this.currentTheme || this.currentTheme.id !== themeId) {
            this.currentTheme = { id: themeId, ...this.themes[themeId] };
            this.applyTheme(this.currentTheme);
        }
    }
    
    /**
     * Get a time-based theme for the current time
     * @returns {Object} Theme object
     */
    getTimeBasedTheme() {
        const now = new Date();
        const hours = now.getHours();
        
        // This is a simplified version - you can expand this with more complex logic
        if (hours >= 5 && hours < 18) {
            return this.themes.light;
        } else {
            return this.themes.dark;
        }
    }
    
    /**
     * Get the current theme
     * @returns {Object} Current theme
     */
    getCurrentTheme() {
        return this.currentTheme || this.themes.dynamic;
    }
    
    /**
     * Get all available themes
     * @returns {Object} Available themes
     */
    getAvailableThemes() {
        return { ...this.themes };
    }
    
    /**
     * Check if the current theme is dark
     * @returns {boolean}
     */
    isDarkTheme() {
        // For dynamic theme, check the current time
        if (this.currentTheme?.isDynamic) {
            const timeBasedTheme = this.getTimeBasedTheme();
            return timeBasedTheme.isDark;
        }
        
        return this.currentTheme?.isDark || false;
    }
}

// Export a singleton instance
const themeManager = new ThemeManager();

// Initialize when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => themeManager.init());
} else {
    themeManager.init();
}

export default themeManager;
