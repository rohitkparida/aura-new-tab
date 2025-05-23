document.addEventListener('DOMContentLoaded', function() {
    // Constants for settings keys (element IDs are assumed to match these)
    const SETTINGS_KEYS = {
        FONT_STYLE: 'fontStyle',
        GRADIENT_STYLE: 'gradientStyle',
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

    const TIME_FORMAT_24HR = '24hr';
    const ACTIVE_TAB_CLASS = 'active';
    const TAB_BUTTON_SELECTOR = '.tab';
    const TAB_CONTENT_SELECTOR = '.tab-content';

    // Tab switching
    const tabs = document.querySelectorAll(TAB_BUTTON_SELECTOR);
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => t.classList.remove(ACTIVE_TAB_CLASS));
            tab.classList.add(ACTIVE_TAB_CLASS);

            // Show corresponding content
            const tabContents = document.querySelectorAll(TAB_CONTENT_SELECTOR);
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            document.getElementById(tab.dataset.tab).style.display = 'block';
        });
    });

    // Add function to toggle visibility of clock-specific settings
    function updateClockSettings(clockStyle) {
        const analogSettings = document.getElementById('analog-settings');
        const digitalSettings = document.getElementById('digital-settings');
        
        if (clockStyle === 'analog') {
            analogSettings.style.display = 'block';
            digitalSettings.style.display = 'none';
        } else {
            analogSettings.style.display = 'none';
            digitalSettings.style.display = 'block';
        }
    }

    // Set default time format if not set
    chrome.storage.sync.get('timeFormat', function(result) {
        if (result.timeFormat === undefined) {
            chrome.storage.sync.set({ timeFormat: '24h' });
        } else if (['12', '12hr'].includes(result.timeFormat)) {
            // Convert old format to new format
            chrome.storage.sync.set({ timeFormat: '12h' });
        }
    });

    // Load settings
    chrome.storage.sync.get(Object.values(SETTINGS_KEYS), function(settings) {
        console.log('Popup loaded settings:', settings);
        if (chrome.runtime.lastError) {
            console.error('Error loading settings:', chrome.runtime.lastError.message);
            return;
        }
        for (const key in SETTINGS_KEYS) {
            const settingKey = SETTINGS_KEYS[key];
            const element = document.getElementById(settingKey);
            if (element) {
                if (settings[settingKey] !== undefined) {
                    if (element.type === 'checkbox') {
                        // Special handling for time format toggle
                        if (settingKey === 'timeFormat') {
                            element.checked = ['12', '12h', '12hr'].includes(settings[settingKey]);
                        } else {
                            element.checked = settings[settingKey];
                        }
                    } else {
                        element.value = settings[settingKey];
                    }
                }
            }
        }
        // Initialize visibility of clock-specific settings
        updateClockSettings(settings.clockStyle);
    });

    // Save settings on change
    function saveSettings(key, value) {
        console.log('Saving setting:', key, '=', value);
        let setting = {};
        setting[key] = value;
        chrome.storage.sync.set(setting, function() {
            if (chrome.runtime.lastError) {
                console.error('Error saving setting:', key, chrome.runtime.lastError.message);
            }
            showStatus('Settings saved');
        });
    }

    // Add change listeners
    document.getElementById('time-format').addEventListener('change', (e) => {
        // Save '12h' when checked (12-hour format), '24h' when unchecked (24-hour format)
        saveSettings('timeFormat', e.target.checked ? '12h' : '24h');
    });

    document.getElementById('show-date').addEventListener('change', (e) => {
        saveSettings('showDate', e.target.checked);
    });

    document.getElementById('show-day').addEventListener('change', (e) => {
        saveSettings('showDay', e.target.checked);
    });

    document.getElementById('show-ampm').addEventListener('change', (e) => {
        saveSettings('showAmPm', e.target.checked);
    });

    document.getElementById('clock-style').addEventListener('change', (e) => {
        saveSettings('clockStyle', e.target.value);
        updateClockSettings(e.target.value);
    });

    document.getElementById('gradient-style').addEventListener('change', (e) => {
        saveSettings('gradientStyle', e.target.value);
    });

    document.getElementById('enable-animations').addEventListener('change', (e) => {
        saveSettings('enableAnimations', e.target.checked);
    });

    document.getElementById('show-grain').addEventListener('change', (e) => {
        saveSettings('showGrain', e.target.checked);
    });

    document.getElementById('show-markers').addEventListener('change', (e) => {
        saveSettings('showMarkers', e.target.checked);
    });

    document.getElementById('smooth-motion').addEventListener('change', (e) => {
        saveSettings('smoothMotion', e.target.checked);
    });

    document.getElementById('font-style').addEventListener('change', (e) => {
        saveSettings('fontStyle', e.target.value);
    });
});

function showStatus(message) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.classList.add('visible');
    
    setTimeout(() => {
        status.classList.remove('visible');
    }, 2000);
}