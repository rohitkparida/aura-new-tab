                // Utility function
const $ = (selector) => document.querySelector(selector);

// Constants
const ANIMATION_TIMEOUT_MS = 50;
const FAVICON_SIZE = 32; // Size of the favicon canvas
const OPACITY_TRANSPARENT = '0';
const OPACITY_VISIBLE = '1';
// Opacity is now controlled by CSS
const MSG_TYPE_REQUEST_CURRENT_THEME_DATA = 'requestCurrentThemeData';
const MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE = 'requestDynamicThemeUpdate';
const MSG_TYPE_SETTINGS_CHANGED = 'settingsChanged';
const MSG_TYPE_THEME_UPDATE = 'themeUpdate';

// Theme-related functions
function getTimeBasedTheme() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'sunrise';
    if (hour >= 12 && hour < 18) return 'horizon';
    if (hour >= 18 && hour < 21) return 'twilight';
    return 'midnight'; // Default or night theme
}

// Clock update functions
function updateDigitalClock(settings) {
    const now = new Date();
    const timeMainEl = $('.time-main');
    const ampmEl = $('.ampm');

    if (!timeMainEl) return;

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    let ampm = '';
    // Check for multiple 12-hour format variants for backward compatibility
    const is12HourFormat = ['12', '12h', '12hr'].includes(settings.timeFormat);
    const amPmVisible = is12HourFormat && !!settings.showAmPm; // Treat undefined showAmPm as false
    console.log('AM/PM Debug:', { is12HourFormat, showAmPm: settings.showAmPm, amPmVisible });

    if (is12HourFormat) {
        ampm = hours >= 12 ? 'PM' : 'AM';
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
        }
    }
}

function updateClock() {
    // Check if chrome.storage is still available
    if (!chrome.storage || !chrome.storage.sync) {
        console.error('Storage API not available');
        return;
    }
    
    chrome.storage.sync.get([
        'clockStyle',
        'timeFormat',
        'showAmPm',
        'showDate',
        'showDay',
        'smoothMotion' // for analog clock, handled by updateAnalogClock
    ], function(settings) {
        if (chrome.runtime.lastError) {
            console.error('Error loading settings:', chrome.runtime.lastError);
            return;
        }
        
        if (!settings) {
            settings = {}; // Ensure settings is an object
        }
        
        try {
            if (settings.clockStyle === 'digital') {
                updateDigitalClock(settings);
                if ($('.analog-clock')) $('.analog-clock').style.display = 'none';
                if ($('.clock-container .time')) $('.clock-container .time').style.display = 'flex';
            } else {
                // Analog clock updates are handled by updateAnalogClock and its interval
                // Ensure digital specific elements are hidden if necessary
                if ($('.analog-clock')) $('.analog-clock').style.display = 'block';
                if ($('.clock-container .time')) $('.clock-container .time').style.display = 'none';
            }
            updateVisibility(settings); // Update date/day visibility
        } catch (error) {
            console.error('Error updating clock:', error);
        }
    });
}

function updateVisibility(settings) {
    const dateEl = $('.date-container .date');
    const dayEl = $('.date-container .day');
    const dateContainerEl = $('.date-container');

    if (!dateContainerEl) return;

    let dateVisible = settings.showDate !== false;
    let dayVisible = settings.showDay !== false;

    if (dateEl) {
        if (dateVisible) {
            dateEl.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dateEl.style.display = 'inline';
        } else {
            dateEl.style.display = 'none';
        }
    }

    if (dayEl) {
        if (dayVisible) {
            dayEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            dayEl.style.display = 'inline';
        } else {
            dayEl.style.display = 'none';
        }
    }
    
    // Adjust layout based on visibility
    if (dateContainerEl) {
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
        if(timeMainEl){
            timeMainEl.classList.toggle('solo', !dateVisible && !dayVisible);
            timeMainEl.classList.toggle('with-date', dateVisible || dayVisible);
        }
    }
}

// Initial setup function
function init() {
    chrome.storage.sync.get([
        'fontStyle',
        'gradientStyle',
        'clockStyle',
        'showDate',
        'showDay',
        'timeFormat',
        'showAmPm',
        'enableAnimations',
        'showGrain',
        'showMarkers',
        'smoothMotion'
    ], function(settings) {
        // Update cached settings
        cachedSettings = { ...cachedSettings, ...settings };
        console.log('Initial settings loaded:', settings);
        console.log('Time format setting:', settings.timeFormat);
        console.log('is12HourFormat:', settings.timeFormat === '12hr' || settings.timeFormat === '12');
        if (chrome.runtime.lastError) {
            console.error('Error loading initial settings:', chrome.runtime.lastError);
            // Provide default settings or handle error appropriately
            settings = { /* reasonable defaults */ }; 
        }
        // Apply initial font (updateFont function expects {fontStyle: 'name', fontUrl: 'url'})
        // We'll need to map fontStyle to fontUrl or adjust updateFont if it's not already handled elsewhere
        // For now, assuming updateFont can handle just the name or is fetching URL itself.
        if (settings.fontStyle) {
            updateFont({ fontStyle: settings.fontStyle }); // Ensure updateFont can handle this structure
        }

        // Initial clock setup
        const analogClockElement = $('.analog-clock');
        const digitalClockTimeElement = $('.clock-container .time');

        if (settings.clockStyle === 'analog') {
            if (analogClockElement) {
                analogClockElement.style.display = 'block';
                if (settings.enableAnimations !== false) {
                    analogClockElement.style.opacity = OPACITY_TRANSPARENT;
                    setTimeout(() => { if (analogClockElement) analogClockElement.style.opacity = OPACITY_VISIBLE; }, ANIMATION_TIMEOUT_MS);
                } else {
                    if (analogClockElement) analogClockElement.style.opacity = OPACITY_VISIBLE;
                }
            }
            if (digitalClockTimeElement) digitalClockTimeElement.style.display = 'none';
            createHourMarkers(); // Existing function
            updateAnalogClock(settings.enableAnimations !== false); // Existing function, pass animation flag
        } else { // Digital clock
            if (analogClockElement) analogClockElement.style.display = 'none';
            if (digitalClockTimeElement) digitalClockTimeElement.style.display = 'flex';
            updateDigitalClock(settings);
        }

        updateVisibility(settings);

        // Fade in main elements if animations enabled
        if (settings.enableAnimations !== false) {
            const timeElement = $('.time');
            const timeMainElement = $('.time-main');
            const dateContainer = $('.date-container');
            
            // Apply visible class after a small delay to trigger the animation
            setTimeout(() => {
                if (timeElement) timeElement.classList.add('visible');
                if (timeMainElement) timeMainElement.classList.add('visible');
                if (dateContainer) dateContainer.classList.add('fade-in');
            }, 50);
        }

        startClockInterval(); // Existing function

        // Initial grain visibility
        const grainElement = $('.grain');
        if (grainElement && settings.showGrain !== false) {
            grainElement.classList.add('visible');
        }

        // Initial animations state
        document.body.classList.toggle('animations-disabled', settings.enableAnimations === false);

        // Request current theme data from background script to ensure authoritative theme is applied
        chrome.runtime.sendMessage({ type: MSG_TYPE_REQUEST_CURRENT_THEME_DATA }, response => {
            if (chrome.runtime.lastError) {
                console.error('Error requesting current theme data:', chrome.runtime.lastError);
            }
        });
    });
}

// DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupFavicon();
});

// Setup favicon and system color scheme listener
function setupFavicon() {
    // Skip if no favicon element found
    const favicon = document.getElementById('favicon');
    if (!favicon) return;
    
    // Create canvas for favicon
    const canvas = document.createElement('canvas');
    canvas.width = FAVICON_SIZE;
    canvas.height = FAVICON_SIZE;
    const ctx = canvas.getContext('2d');
    
    // Cache for optimization and state
    let lastMinute = -1;
    let lastHour = -1;
    let isOnBattery = false;
    
    // Check battery status if supported
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            isOnBattery = !battery.charging;
            
            // Update when charging state changes
            battery.addEventListener('chargingchange', () => {
                isOnBattery = !battery.charging;
                // Force redraw when power state changes
                lastMinute = -1;
                updateFavicon();
            });
        }).catch(() => {
            // If battery API fails, assume not on battery
            isOnBattery = false;
        });
    }
    
    // Initial favicon setup
    updateFavicon();
    
    // Update favicon when system color scheme changes
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addEventListener('change', updateFavicon);
    
    // Update interval based on battery status
    function updateInterval() {
        // Clear any existing interval
        if (window.faviconUpdateInterval) {
            clearInterval(window.faviconUpdateInterval);
        }
        
        // Update more frequently when on AC power (show seconds)
        // Update less frequently when on battery (hide seconds)
        window.faviconUpdateInterval = setInterval(
            updateFavicon, 
            isOnBattery ? 30000 : 1000 // 30s on battery, 1s on AC
        );
    }
    
    // Initial interval setup
    updateInterval();
    
    // Update interval when power state changes
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            battery.addEventListener('chargingchange', updateInterval);
        });
    }
    
    function updateFavicon() {

        const now = new Date();
        const second = now.getSeconds();
        const minute = now.getMinutes();
        const hour = now.getHours() % 12;
        
        // Only redraw clock face and hour/minute hands once per minute
        const needsFullRedraw = (minute !== lastMinute || hour !== lastHour);
        
        if (needsFullRedraw) {
            // Clear canvas for full redraw
            ctx.clearRect(0, 0, FAVICON_SIZE, FAVICON_SIZE);
            
            // Draw clock face
            drawClockFace();
            
            // Draw hour and minute hands
            const hourAngle = (hour + minute / 60) * (Math.PI / 6) - Math.PI / 2;
            const minuteAngle = (minute + second / 60) * (Math.PI / 30) - Math.PI / 2;
            
            drawHand(hourAngle, FAVICON_SIZE * 0.15, 2);
            drawHand(minuteAngle, FAVICON_SIZE * 0.25, 1.5);
            
            lastMinute = minute;
            lastHour = hour;
        } else {
            // For second updates, just clear the second hand area
            const center = FAVICON_SIZE / 2;
            ctx.clearRect(
                center - FAVICON_SIZE * 0.3, 
                center - FAVICON_SIZE * 0.3, 
                FAVICON_SIZE * 0.6, 
                FAVICON_SIZE * 0.6
            );
            
            // Redraw the minute hand tip that might be covered by second hand
            if (minute !== lastMinute) {
                const minuteAngle = (minute + second / 60) * (Math.PI / 30) - Math.PI / 2;
                drawHand(minuteAngle, FAVICON_SIZE * 0.25, 1.5);
                lastMinute = minute;
            }
        }
        
        // Only show second hand when not on battery
        if (!isOnBattery) {
            const secondAngle = second * (Math.PI / 30) - Math.PI / 2;
            ctx.save();
            ctx.strokeStyle = '#ff4444';
            drawHand(secondAngle, FAVICON_SIZE * 0.3, 1);
            ctx.restore();
        }
        
        // Update favicon
        favicon.href = canvas.toDataURL('image/png');
    }
    
    function drawClockFace() {
        const center = FAVICON_SIZE / 2;
        ctx.beginPath();
        ctx.arc(center, center, FAVICON_SIZE * 0.4, 0, 2 * Math.PI);
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    function drawHand(angle, length, width) {
        const center = FAVICON_SIZE / 2;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(
            center + Math.cos(angle) * length,
            center + Math.sin(angle) * length
        );
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#ffffff';
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}

// Update the theme every minute to catch time changes
setInterval(() => {
    chrome.storage.sync.get('gradientStyle', function(data) {
        if (chrome.runtime.lastError) {
            console.error('Error getting gradientStyle for interval update:', chrome.runtime.lastError);
            return;
        }
        if (data.gradientStyle === 'dynamic') {
            const currentThemeName = getTimeBasedTheme();
            if (document.body.className !== currentThemeName) {
                chrome.runtime.sendMessage({ type: MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE, themeName: currentThemeName }, response => {
                    if (chrome.runtime.lastError) {
                        console.error('Error requesting dynamic theme update:', chrome.runtime.lastError);
                    }
                });
            }
        }
    });
}, 60000);

// Add this function to create hour markers
function createHourMarkers() {
    chrome.storage.sync.get('showMarkers', function(data) {
        if (chrome.runtime.lastError) {
            console.error('Error getting showMarkers for createHourMarkers:', chrome.runtime.lastError);
            return;
        }
        const analogClock = document.querySelector('.analog-clock');
        const existingMarkers = analogClock.querySelectorAll('.hour-marker');
        
        // Remove existing markers
        existingMarkers.forEach(marker => marker.remove());

        // Create new markers if enabled
        if (data.showMarkers !== false) {
            for (let i = 0; i < 60; i++) {
                const marker = document.createElement('div');
                marker.className = 'hour-marker';
                
                if (i % 15 === 0) {
                    marker.className += ' major';
                }
                
                marker.style.transform = `rotate(${i * 6}deg)`;
                analogClock.appendChild(marker);
            }
        }
    });
}

// Update the updateAnalogClock function
function updateAnalogClock(animate = false) {
    chrome.storage.sync.get([
        'showMarkers',
        'smoothMotion',
        'showDay',
        'showDate',
        'enableAnimations'
    ], function(data) {
        if (chrome.runtime.lastError) {
            console.error('Error getting settings for updateAnalogClock:', chrome.runtime.lastError);
            return;
        }
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();

        // Calculate angles based on movement style
        let hourDegrees, minuteDegrees, secondDegrees;
        
        if (data.smoothMotion !== false) {
            hourDegrees = (hours % 12) * 30 + minutes * 0.5 + seconds * (0.5/60);
            minuteDegrees = minutes * 6 + seconds * 0.1;
            secondDegrees = seconds * 6 + milliseconds * (6/1000);
        } else {
            hourDegrees = (hours % 12) * 30 + minutes * 0.5;
            minuteDegrees = minutes * 6;
            secondDegrees = seconds * 6;
        }

        const hourHand = document.querySelector('.hour-hand');
        const minuteHand = document.querySelector('.minute-hand');
        const secondHand = document.querySelector('.second-hand');
        const analogClock = document.querySelector('.analog-clock');
        const analogDay = document.querySelector('.analog-day');
        const analogDate = document.querySelector('.analog-date');

        if (!hourHand || !minuteHand || !secondHand) return;

        analogClock.classList.toggle('continuous-motion', data.smoothMotion !== false);

        // Only do sweep animation if animations are enabled
        if (animate && data.enableAnimations !== false) {
            // Set the final rotation as a CSS variable for the animation
            hourHand.style.setProperty('--final-rotation', `${hourDegrees}deg`);
            minuteHand.style.setProperty('--final-rotation', `${minuteDegrees}deg`);
            secondHand.style.setProperty('--final-rotation', `${secondDegrees}deg`);

            // Add the sweep-in animation class
            hourHand.classList.add('sweep-in');
            minuteHand.classList.add('sweep-in');
            secondHand.classList.add('sweep-in');

            // Remove the animation classes after they complete
            setTimeout(() => {
                hourHand.classList.remove('sweep-in');
                minuteHand.classList.remove('sweep-in');
                secondHand.classList.remove('sweep-in');
                
                // Set the final positions
                hourHand.style.transform = `rotate(${hourDegrees}deg)`;
                minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
                secondHand.style.transform = `rotate(${secondDegrees}deg)`;
                
                // Start the regular updates immediately after animation
                startClockInterval();
            }, 650);
        } else {
            // Directly set positions without animation
            hourHand.style.transform = `rotate(${hourDegrees}deg)`;
            minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
            secondHand.style.transform = `rotate(${secondDegrees}deg)`;
        }

        // Update day and date display
        if (analogDay) {
            analogDay.style.display = data.showDay !== false ? 'block' : 'none';
            if (data.showDay !== false) {
                analogDay.textContent = now.toLocaleDateString('en-US', { weekday: 'long' });
            }
        }

        if (analogDate) {
            analogDate.style.display = data.showDate !== false ? 'block' : 'none';
            if (data.showDate !== false) {
                analogDate.textContent = now.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                });
            }
        }
    });
}

// Update the clock more frequently for smoother motion
let clockInterval = null;

function startClockInterval() {
    // Clear any existing interval to prevent duplicates
    if (clockInterval) {
        clearInterval(clockInterval);
    }
    
    // Initial update
    safeUpdateClock();
    
    // Set up interval with error handling
    clockInterval = setInterval(safeUpdateClock, 1000);
}

function safeUpdateClock() {
    // Check if extension context is still valid
    if (!chrome || !chrome.runtime || !chrome.runtime.id) {
        if (clockInterval) {
            clearInterval(clockInterval);
            clockInterval = null;
        }
        return;
    }
    
    try {
        updateClock();
    } catch (error) {
        // Check for extension context invalidation
        const isContextInvalid = error.message && (
            error.message.includes('Extension context invalidated') ||
            error.message.includes('context invalidated') ||
            error.message.includes('Extension context') ||
            error.message.includes('extension has been uninstalled')
        );
        
        if (isContextInvalid) {
            // Clean up and stop the interval
            if (clockInterval) {
                clearInterval(clockInterval);
                clockInterval = null;
            }
            // Don't log to console as the extension is being unloaded
            return;
        }
        
        // Log other errors
        console.error('Error in clock update:', error);
    }
}

// Initialize cached settings
let cachedSettings = {};

// Update the storage change listener
const settingHandlers = {
    clockStyle: (value) => {
        const digitalClockContainer = $('.clock-container');
        const analogClockEl = $('.analog-clock');
        const digitalTimeEl = $('#clock'); // This is inside .clock-container

        const animationsEnabled = cachedSettings.enableAnimations !== false;
        const fadeDuration = animationsEnabled ? (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fade-duration') || '0.6') * 1000) : 0;

        if (value === 'analog') {
            if (animationsEnabled && digitalClockContainer.style.display !== 'none') {
                digitalClockContainer.style.opacity = OPACITY_TRANSPARENT;
                setTimeout(() => {
                    digitalClockContainer.style.display = 'none';
                    analogClockEl.style.display = 'flex'; // Or 'block' if that's its default
                    analogClockEl.style.opacity = OPACITY_TRANSPARENT;
                    setTimeout(() => analogClockEl.style.opacity = OPACITY_VISIBLE, ANIMATION_TIMEOUT_MS); // Fade in
                    updateAnalogClock();
                    updateVisibility(); // Ensure date/day visibility is correct for analog
                }, fadeDuration);
            } else {
                digitalClockContainer.style.display = 'none';
                analogClockEl.style.display = 'flex'; // Or 'block'
                analogClockEl.style.opacity = OPACITY_VISIBLE;
                updateAnalogClock();
                updateVisibility();
            }
        } else { // Digital
            if (animationsEnabled && analogClockEl.style.display !== 'none') {
                analogClockEl.style.opacity = OPACITY_TRANSPARENT;
                setTimeout(() => {
                    analogClockEl.style.display = 'none';
                    digitalClockContainer.style.display = 'flex'; // Or 'block'
                    digitalClockContainer.style.opacity = OPACITY_TRANSPARENT;
                    setTimeout(() => digitalClockContainer.style.opacity = OPACITY_VISIBLE, ANIMATION_TIMEOUT_MS); // Fade in
                    updateDigitalClock(cachedSettings);
                    updateVisibility(); // Ensure date/day visibility is correct for digital
                }, fadeDuration);
            } else {
                analogClockEl.style.display = 'none';
                digitalClockContainer.style.display = 'flex'; // Or 'block'
                digitalClockContainer.style.opacity = OPACITY_VISIBLE;
                updateDigitalClock(cachedSettings);
                updateVisibility();
            }
        }
        cachedSettings.clockStyle = value;
    },
    timeFormat: function(newValue) {
        updateClock();
    },
    showAmPm: function(newValue) {
        updateClock();
    },
    showDate: function(newValue) {
        updateClock(); // updateClock calls updateVisibility
    },
    showDay: function(newValue) {
        updateClock(); // updateClock calls updateVisibility
    },
    gradientStyle: function(newValue) {
        cachedSettings.gradientStyle = newValue;
        // Inform background.js. Background.js will then calculate the full theme
        // and send a 'themeUpdate' message back, which will be handled by the onMessage listener.
        chrome.runtime.sendMessage({
            type: MSG_TYPE_SETTINGS_CHANGED,
            newSettings: { gradientStyle: newValue }
        }, response => {
            if (chrome.runtime.lastError) {
                console.error('Error sending gradientStyle changed message:', chrome.runtime.lastError);
            }
        });
        // No direct call to applyTheme here anymore.
    },
    enableAnimations: function(newValue) {
        document.body.classList.toggle('animations-disabled', !newValue);
        if (!newValue) { // Animations disabled
            ['.time', '.time-main', '.grain', '.date-container', '.analog-clock'].forEach(sel => {
                const el = $(sel);
                if (el) {
                    el.classList.remove('fade-in');
                    // Reset styles affected by fade-in if necessary
                    Object.assign(el.style, {
                        opacity: el.classList.contains('grain') ? '0.3' : '1', // Keep grain's base opacity
                        filter: 'none',
                        transform: 'none',
                        scale: '1'
                    });
                }
            });
        } else { // Animations enabled
            // Re-trigger fade-in for elements that should be visible and animated
            const elementsToAnimate = ['.time-main', '.date-container', '.analog-clock'];
            elementsToAnimate.forEach(selector => {
                const el = $(selector);
                // Check if element exists and is supposed to be visible based on current clock style
                if (el && ((selector === '.analog-clock' && cachedSettings.clockStyle === 'analog') || 
                           (selector !== '.analog-clock' && cachedSettings.clockStyle !== 'analog'))) {
                    if (el.style.display !== 'none' && el.style.opacity !== '1') { // if not already fully visible
                        el.style.opacity = OPACITY_TRANSPARENT; // Reset opacity
                    }
                }
            });
            // Special handling for grain if it's supposed to be shown
            if (cachedSettings.showGrain) {
                const grainEl = $('.grain');
                if (grainEl && grainEl.style.display === 'block') {
                    grainEl.classList.add('visible');
                }
            }
        }
    },
    showGrain: function(newValue) {
        const grainEl = $('.grain');
        if (grainEl) {
            if (newValue) {
                grainEl.classList.add('visible');
            } else {
                grainEl.classList.remove('visible');
            }
        }
        cachedSettings.showGrain = newValue;
    },
    showMarkers: function(newValue) {
        createHourMarkers(); // This function already fetches the setting internally
    },
    smoothMotion: function(newValue) {
        updateAnalogClock(); // This function fetches settings and updates class/styles
    },
    fontStyle: function(newValue) {
        updateFont({ fontStyle: newValue });
        chrome.runtime.sendMessage({ type: MSG_TYPE_SETTINGS_CHANGED, newSettings: { fontStyle: newValue } }, response => {
            if (chrome.runtime.lastError) {
                console.error('Error sending fontStyle changed message:', chrome.runtime.lastError);
            }
        });
    }
};

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync') {
        for (let key in changes) {
            if (settingHandlers[key]) {
                settingHandlers[key](changes[key].newValue);
            }
        }
    }
});

// Add listener for system theme changes - handled by the favicon setup function

// Add this function near the top with other initialization functions
function updateFont(fontData) {
    if (!fontData || !fontData.fontStyle) return;
    
    document.body.style.fontFamily = `'${fontData.fontStyle}', sans-serif`;
}

// Remove the existing theme-related functions and add this near the top
function applyTheme(themeData) {
    if (!themeData || !themeData.theme) {
        console.warn('applyTheme called with invalid themeData:', themeData);
        return;
    }

    // Remove active class from all backgrounds and ensure transitions are enabled
    document.querySelectorAll('.theme-background').forEach(bg => {
        bg.classList.remove('active');
        bg.classList.add('transitions-enabled'); // Ensure transitions are on for theme changes
    });
    
    // Add active class to new theme background
    const newThemeBackground = document.querySelector(`.theme-background.${themeData.theme}`);
    if (newThemeBackground) {
        // Using a minimal timeout to ensure the 'transitions-enabled' class is applied first,
        // and the opacity transition occurs smoothly.
        setTimeout(() => {
            newThemeBackground.classList.add('active');
        }, 0); // A timeout of 0 or 1 is often enough for the browser to process the class change.
    }

    // Update text colors if provided in themeData
    if (themeData.textColor) {
        document.documentElement.style.setProperty('--text-color', themeData.textColor);
    }
    if (themeData.textColorSecondary) {
        document.documentElement.style.setProperty('--text-color-secondary', themeData.textColorSecondary);
    }
    // Also update body class to reflect the current theme name, for any direct CSS rules.
    document.body.className = themeData.theme;
}

// Add message listener for theme updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
        if (message.type === MSG_TYPE_THEME_UPDATE) {
            applyTheme(message.data);
            // Send response if sendResponse is a function
            if (typeof sendResponse === 'function') {
                sendResponse({ success: true });
            }
            return false; // No need to keep the message channel open
        }
        if (message.type === 'fontUpdate') {
            updateFont(message.data);
            if (typeof sendResponse === 'function') {
                sendResponse({ success: true });
            }
            return false; // No need to keep the message channel open
        }
    } catch (error) {
        console.error('Error in message handler:', error);
        if (typeof sendResponse === 'function') {
            sendResponse({ success: false, error: error.message });
        }
        return false;
    }
    // For unhandled message types, don't keep the channel open
    return false;
});

// Add performance monitoring
const perfMetrics = {
    timeToFirstByte: performance.now(),
    firstPaint: 0,
    firstContentfulPaint: 0,
    domInteractive: 0
};

// Monitor critical rendering metrics
new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-paint') {
            perfMetrics.firstPaint = entry.startTime;
        }
        if (entry.name === 'first-contentful-paint') {
            perfMetrics.firstContentfulPaint = entry.startTime;
        }
    }
}).observe({ entryTypes: ['paint'] });

// Keep track of DOM interactive time
document.addEventListener('DOMContentLoaded', () => {
    perfMetrics.domInteractive = performance.now();
});