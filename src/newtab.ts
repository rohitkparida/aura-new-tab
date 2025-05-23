// Aura Clock Tab - New Tab Page (TypeScript)

// Utility function
const $ = (selector: string): HTMLElement | null => document.querySelector(selector);

// Constants from newtab.js
const ANIMATION_TIMEOUT_MS = 50;
const FAVICON_SIZE = 32; // Size of the favicon canvas
const OPACITY_TRANSPARENT = '0';
const OPACITY_VISIBLE = '1';
// Opacity is now controlled by CSS

// Import types that will likely be needed
import {
    ClockSettings,
    ThemeData, // Ensure ThemeData is imported (from src/types/index.ts via ./types)
    ThemeName, // ThemeName from src/types/index.ts ('light', 'dark', etc.)
    MSG_TYPE_THEME_UPDATE,
    MSG_TYPE_SETTINGS_CHANGED,
    MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE,
} from './types'; // Changed from './types/clock' to './types' to get main index definitions

// Import message creation functions and sendMessage utility
import {
    createRequestCurrentThemeDataMessage,
    sendMessage // Restoring import
} from './types/messages'; // Direct import if not re-exported by src/types/index.ts

// Utility to send messages to the background script
// Removed the sendMessage function definition

// Cached settings (will be populated from storage)
let cachedSettings: Partial<ClockSettings> = {};
let clockIntervalId: number | undefined;

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

// Initial setup function from newtab.js
async function init(): Promise<void> {
    if (!chrome || !chrome.storage || !chrome.storage.sync) {
        console.error('Chrome Storage API not available. Cannot initialize.');
        return;
    }

    chrome.storage.sync.get([
        'fontStyle', // TODO: Relates to updateFont
        'gradientStyle',
        'clockStyle',
        'showDate',
        'showDay',
        'timeFormat',
        'showAmPm',
        'enableAnimations',
        'showGrain',
        'showMarkers', // TODO: Relates to createHourMarkers
        'smoothMotion' // TODO: Relates to updateAnalogClock
    ], (settings: Partial<ClockSettings>) => {
        if (chrome.runtime.lastError) {
            console.error('Error loading initial settings:', chrome.runtime.lastError.message);
            // Provide default settings or handle error appropriately
            cachedSettings = {}; // Or some sensible defaults
        } else {
            cachedSettings = { ...cachedSettings, ...settings };
        }
        console.log('Initial settings loaded:', cachedSettings);
        // console.log('Time format setting:', cachedSettings.timeFormat);
        // console.log('is12HourFormat:', cachedSettings.timeFormat === '12hr' || cachedSettings.timeFormat === '12');

        // TODO: Port and call updateFont function if settings.fontStyle exists
        // if (cachedSettings.fontStyle) {
        //     updateFont({ fontStyle: cachedSettings.fontStyle });
        // }

        // Initial clock setup
        const analogClockElement = $('.analog-clock');
        const digitalClockTimeElement = $('.clock-container .time');

        if (cachedSettings.clockStyle === 'analog') {
            if (analogClockElement) {
                analogClockElement.style.display = 'block';
                if (cachedSettings.enableAnimations !== false) {
                    analogClockElement.style.opacity = OPACITY_TRANSPARENT;
                    setTimeout(() => { if (analogClockElement) analogClockElement.style.opacity = OPACITY_VISIBLE; }, ANIMATION_TIMEOUT_MS);
                } else {
                    if (analogClockElement) analogClockElement.style.opacity = OPACITY_VISIBLE;
                }
            }
            if (digitalClockTimeElement) digitalClockTimeElement.style.display = 'none';
            createHourMarkers(); // Call ported function
            updateAnalogClock(cachedSettings.enableAnimations !== false); // Call ported function
            console.log('Analog clock setup: createHourMarkers and updateAnalogClock called.');
        } else { // Digital clock (default or explicit)
            if (analogClockElement) analogClockElement.style.display = 'none';
            if (digitalClockTimeElement) digitalClockTimeElement.style.display = 'flex';
            updateDigitalClock(cachedSettings);
        }

        updateVisibility(cachedSettings);

        // Fade in main elements if animations enabled
        if (cachedSettings.enableAnimations !== false) {
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

        startClockInterval(); // Call ported function

        // Initial grain visibility
        const grainElement = $('.grain');
        if (grainElement && cachedSettings.showGrain !== false) {
            grainElement.classList.add('visible');
        }

        // Initial animations state
        if (document.body) {
            document.body.classList.toggle('animations-disabled', cachedSettings.enableAnimations === false);
        }

        // Request current theme data from background script
        const browserSendMessage = globalThis.chrome?.runtime?.sendMessage;
        if (browserSendMessage as any) { 
            console.log('[AuraClock] Requesting current theme data from background script...');
            sendMessage(
                createRequestCurrentThemeDataMessage()
            )
            .then(handleThemeDataResponse)
            .catch(error => {
                console.error('[AuraClock] Error requesting current theme data (init catch):', error);
                handleThemeDataResponse({ error: error.message || 'Failed to fetch initial theme' });
            });
        } else {
            console.error('[AuraClock] chrome.runtime.sendMessage is not available.');
            // Fallback: Make body visible even if theme application fails
            console.log('[AuraClock] Applying fallback visibility due to error.');
            document.body.classList.add
            document.body.style.opacity = OPACITY_VISIBLE;
            return;
        }
    });
}

// Define a reusable handler for the theme data response
function handleThemeDataResponse(response: any) {
    // Check if the response itself indicates an error (e.g., from our .catch block)
    if (response && response.error) {
        console.error('[AuraClock] Error received by handleThemeDataResponse:', response.error);
        // Fallback visibility logic if needed
        document.body.classList.add('ready');
        document.body.style.opacity = OPACITY_VISIBLE;
        return;
    }

    // Proceed if it's a valid theme data structure
    // The background script's MSG_TYPE_REQUEST_CURRENT_THEME_DATA handler directly calls sendResponse({ themeData, effectiveThemeName })
    // So, 'response' here should be that object when successful.
    if (response && response.themeData && response.effectiveThemeName) {
        console.log('[AuraClock] Theme data response received. Applying theme...', response);
        applyTheme(response.themeData as ThemeData, response.effectiveThemeName as ThemeName);
    } else {
        console.warn('[AuraClock] Received incomplete or unexpected theme data in handleThemeDataResponse:', response);
        // Fallback visibility for unexpected structure
        document.body.classList.add('ready');
        document.body.style.opacity = OPACITY_VISIBLE;
    }
}

// DOMContentLoaded listener from newtab.js
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupFavicon(); // Call the ported function
    console.log('DOMContentLoaded: init() and setupFavicon() called.');
});

// Define interfaces for Battery API
interface BatteryManager {
    readonly charging: boolean;
    readonly chargingTime: number;
    readonly dischargingTime: number;
    readonly level: number;
    onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
    onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
    ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
    onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    dispatchEvent(event: Event): boolean;
}

interface NavigatorWithBattery extends Navigator {
    getBattery?(): Promise<BatteryManager>;
}

// Setup favicon and system color scheme listener from newtab.js
function setupFavicon(): void {
    const favicon = document.getElementById('favicon') as HTMLLinkElement | null;
    if (!favicon) {
        console.warn('Favicon element #favicon not found.');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = FAVICON_SIZE;
    canvas.height = FAVICON_SIZE;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        console.error('Could not get 2D context for favicon canvas.');
        return;
    }

    let lastMinute = -1;
    let lastHour = -1;
    let isOnBattery = false;
    let faviconUpdateInterval: number | undefined;

    if ('getBattery' in navigator && typeof (navigator as NavigatorWithBattery).getBattery === 'function') {
        (navigator as NavigatorWithBattery).getBattery!().then((battery: BatteryManager) => {
            isOnBattery = !battery.charging;
            battery.addEventListener('chargingchange', () => {
                isOnBattery = !battery.charging;
                lastMinute = -1; // Force redraw
                updateFavicon();
                updateInterval(); // Adjust interval speed based on power state
            });
            updateInterval(); // Initial interval setup after getting battery status
        }).catch(() => {
            isOnBattery = false;
            updateInterval(); // Still set up interval even if battery API fails
        });
    } else {
        updateInterval(); // Set up interval if battery API is not supported
    }

    updateFavicon(); // Initial draw

    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addEventListener('change', updateFavicon);

    function updateInterval(): void {
        if (faviconUpdateInterval) {
            clearInterval(faviconUpdateInterval);
        }
        faviconUpdateInterval = window.setInterval(
            updateFavicon,
            isOnBattery ? 30000 : 1000 // 30s on battery, 1s on AC
        );
    }

    function updateFavicon(): void {
        if (!ctx) return;
        const now = new Date();
        const second = now.getSeconds();
        const minute = now.getMinutes();
        const hour = now.getHours() % 12; // 12-hour format for favicon clock

        const needsFullRedraw = (minute !== lastMinute || hour !== lastHour);

        if (needsFullRedraw) {
            ctx.clearRect(0, 0, FAVICON_SIZE, FAVICON_SIZE);
            drawClockFace();
            const hourAngle = (hour + minute / 60) * (Math.PI / 6) - Math.PI / 2;
            const minuteAngle = (minute + second / 60) * (Math.PI / 30) - Math.PI / 2;
            drawHand(hourAngle, FAVICON_SIZE * 0.15, 2);
            drawHand(minuteAngle, FAVICON_SIZE * 0.25, 1.5);
            lastMinute = minute;
            lastHour = hour;
        } else {
            // For second updates, clear a smaller area around the center if needed
            // This optimization might be complex if hands overlap significantly
            // For simplicity, we could redraw minute hand if it changed
            // Or, if not showing seconds, this branch might not be hit often
        }

        if (!isOnBattery) {
            // Clear previous second hand before drawing new one if not doing full redraw
            if (!needsFullRedraw) {
                 // A more precise clear would be ideal, but clearing center might be enough
                 // For now, let's assume full redraw handles clearing sufficiently or accept minor artifacts
            }
            const secondAngle = second * (Math.PI / 30) - Math.PI / 2;
            ctx.save();
            ctx.strokeStyle = '#ff4444'; // Or a theme-based color
            drawHand(secondAngle, FAVICON_SIZE * 0.3, 1);
            ctx.restore();
        }

        if (favicon) {
            favicon.href = canvas.toDataURL('image/png');
        }
    }

    function drawClockFace(): void {
        if (!ctx) return;
        const center = FAVICON_SIZE / 2;
        ctx.beginPath();
        ctx.arc(center, center, FAVICON_SIZE * 0.4, 0, 2 * Math.PI);
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    function drawHand(angle: number, length: number, width: number): void {
        if (!ctx) return;
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

// Function to create hour markers from newtab.js
function createHourMarkers(): void {
    if (!chrome || !chrome.storage || !chrome.storage.sync) {
        console.warn('Chrome Storage API not available for createHourMarkers.');
        return;
    }
    chrome.storage.sync.get('showMarkers', (data: Partial<ClockSettings>) => {
        if (chrome.runtime.lastError) {
            console.error('Error getting showMarkers for createHourMarkers:', chrome.runtime.lastError.message);
            return;
        }
        const analogClock = $('.analog-clock');
        if (!analogClock) {
            // console.warn("Element '.analog-clock' not found for markers.");
            return;
        }
        const existingMarkers = analogClock.querySelectorAll('.hour-marker');

        // Remove existing markers
        existingMarkers.forEach(marker => marker.remove());

        // Create new markers if enabled
        if (data.showMarkers !== false) { // Default to true if undefined
            for (let i = 0; i < 60; i++) {
                const marker = document.createElement('div');
                marker.className = 'hour-marker';

                if (i % 15 === 0) { // Major marker every 15 minutes (0, 15, 30, 45)
                    marker.className += ' major';
                }

                marker.style.transform = `rotate(${i * 6}deg)`;
                analogClock.appendChild(marker);
            }
        }
    });
}

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
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    let hourDegrees: number, minuteDegrees: number, secondDegrees: number;

    const smoothMotionEnabled = settings.smoothMotion !== false; // Default to true
    const animationsEnabled = settings.enableAnimations !== false; // Default to true

    // Calculate hand positions based on smooth motion setting
    if (smoothMotionEnabled) {
        hourDegrees = (hours % 12) * 30 + minutes * 0.5 + seconds * (0.5 / 60);
        minuteDegrees = minutes * 6 + seconds * 0.1;
        secondDegrees = seconds * 6 + milliseconds * (6 / 1000);
    } else {
        hourDegrees = (hours % 12) * 30 + minutes * 0.5;
        minuteDegrees = minutes * 6;
        secondDegrees = seconds * 6;
    }

    const hourHand = $('.hour-hand') as HTMLElement | null;
    const minuteHand = $('.minute-hand') as HTMLElement | null;
    const secondHand = $('.second-hand') as HTMLElement | null;
    const analogDay = $('.analog-day') as HTMLElement | null;
    const analogDate = $('.analog-date') as HTMLElement | null;

    if (!hourHand || !minuteHand || !secondHand) {
        console.warn('Analog clock hands not found');
        return;
    }

    // Toggle smooth motion class on the clock face
    analogClock.classList.toggle('continuous-motion', smoothMotionEnabled);
    
    // Update the clock hands with or without animation
    updateClockHands(
        hourHand, 
        minuteHand, 
        secondHand, 
        hourDegrees, 
        minuteDegrees, 
        secondDegrees, 
        animate && animationsEnabled
    );

    // Update day and date displays if they exist
    updateDayAndDate(analogDay, analogDate, now, settings);
}

/**
 * Updates the clock hands with smooth animation if enabled
 */
function updateClockHands(
    hourHand: HTMLElement,
    minuteHand: HTMLElement,
    secondHand: HTMLElement,
    hourDegrees: number,
    minuteDegrees: number,
    secondDegrees: number,
    shouldAnimate: boolean
): void {
    if (shouldAnimate) {
        // Set up the final rotation for the animation
        hourHand.style.setProperty('--final-rotation', `${hourDegrees}deg`);
        minuteHand.style.setProperty('--final-rotation', `${minuteDegrees}deg`);
        secondHand.style.setProperty('--final-rotation', `${secondDegrees}deg`);

        // Add animation classes
        hourHand.classList.add('sweep-in');
        minuteHand.classList.add('sweep-in');
        secondHand.classList.add('sweep-in');

        // Remove animation classes after animation completes
        setTimeout(() => {
            hourHand.classList.remove('sweep-in');
            minuteHand.classList.remove('sweep-in');
            secondHand.classList.remove('sweep-in');

            // Ensure final position is set
            setClockHandsPositions(hourHand, minuteHand, secondHand, hourDegrees, minuteDegrees, secondDegrees);
        }, 650); // Match this with CSS animation duration + buffer
    } else {
        // Update positions immediately without animation
        setClockHandsPositions(hourHand, minuteHand, secondHand, hourDegrees, minuteDegrees, secondDegrees);
    }
}

/**
 * Sets the rotation of all clock hands
 */
function setClockHandsPositions(
    hourHand: HTMLElement,
    minuteHand: HTMLElement,
    secondHand: HTMLElement,
    hourDegrees: number,
    minuteDegrees: number,
    secondDegrees: number
): void {
    hourHand.style.transform = `rotate(${hourDegrees}deg)`;
    minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
    secondHand.style.transform = `rotate(${secondDegrees}deg)`;
}

/**
 * Updates the day and date display on the analog clock
 */
function updateDayAndDate(
    analogDay: HTMLElement | null,
    analogDate: HTMLElement | null,
    now: Date,
    settings: Partial<ClockSettings>
): void {
    // Update day display if element exists
    if (analogDay) {
        const showDayEnabled = settings.showDay !== false; // Default to true
        analogDay.style.display = showDayEnabled ? 'block' : 'none';
        if (showDayEnabled) {
            analogDay.textContent = now.toLocaleDateString('en-US', { weekday: 'long' });
        }
    }

    // Update date display if element exists
    if (analogDate) {
        const showDateEnabled = settings.showDate !== false; // Default to true
        analogDate.style.display = showDateEnabled ? 'block' : 'none';
        if (showDateEnabled) {
            analogDate.textContent = now.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    }
}

// Function to start the clock interval from newtab.js
function startClockInterval(): void {
    if (clockIntervalId) {
        clearInterval(clockIntervalId);
    }
    
    // Initial call to display time immediately
    updateClock();
    
    // Set up interval for updates
    clockIntervalId = window.setInterval(() => {
        const now = new Date();
        const seconds = now.getSeconds();
        
        // For analog clock, update the hands directly without animation
        if (cachedSettings.clockStyle === 'analog' || cachedSettings.clockStyle === 'both') {
            updateAnalogClock(false); // false to disable animation on tick
            
            // Update hour markers on the hour
            if (seconds === 0) {
                createHourMarkers();
            }
        } else {
            // For digital clock, update normally
            updateDigitalClock(cachedSettings);
        }
        
        // Update date and day visibility if needed
        updateVisibility(cachedSettings);
    }, 1000);
}

// Function to apply theme data (ported and adapted from legacy newtab.js)
// ThemeData is from src/types/index.ts (no 'theme' property)
// effectiveThemeName is like 'light', 'dark', 'dynamic' etc. (ThemeName from src/types/index.ts)
function applyTheme(themeData: ThemeData, effectiveThemeName: ThemeName): void {
    console.log('[AuraClock] applyTheme called with themeData:', JSON.stringify(themeData), 'and effectiveThemeName:', effectiveThemeName);
    if (!document.body) {
        console.error('[AuraClock] Cannot apply theme, document.body is not available.');
        return;
    }
    if (!themeData || !effectiveThemeName) {
        console.warn('[AuraClock] applyTheme called with invalid themeData or missing effectiveThemeName:', themeData, effectiveThemeName);
        return;
    }

    document.body.classList.add('ready');
    document.body.style.opacity = OPACITY_VISIBLE;

    // Manage body theme classes
    // Remove any existing theme-* classes
    const themeClasses = Array.from(document.body.classList).filter(cls => cls.startsWith('theme-'));
    document.body.classList.remove(...themeClasses);
    // Add the new theme class
    document.body.classList.add(`theme-${effectiveThemeName}`);

    // Remove active class from all theme-background divs and ensure transitions are enabled
    let specificThemeDivActivated = false;
    document.querySelectorAll('.theme-background').forEach(bg => {
        // Only remove active class if it exists to prevent unnecessary repaints
        if (bg.classList.contains('active')) {
            bg.classList.remove('active');
        }
        bg.classList.add('transitions-enabled'); // Ensure transitions are on for theme changes
    });

    // Add active class to new theme background using effectiveThemeName
    const newThemeBackground = document.querySelector(`.theme-background.${effectiveThemeName}`);
    if (newThemeBackground) {
        // Use requestAnimationFrame to ensure the browser has time to process the class changes
        requestAnimationFrame(() => {
            // Small delay to ensure the transitions-enabled class is applied
            requestAnimationFrame(() => {
                newThemeBackground.classList.add('active');
            });
        });
        specificThemeDivActivated = true;
    }

    // Update text colors if provided in themeData
    if (themeData.textColor) {
        document.documentElement.style.setProperty('--text-color', themeData.textColor);
    }

    // Apply background color from themeData ONLY if no specific theme div was activated
    // or as a general fallback for the body itself if needed by your CSS.
    // If your .theme-background divs are meant to be the sole background, you might not need this.
    if (!specificThemeDivActivated && themeData.backgroundColor) {
         document.documentElement.style.setProperty('--background-color', themeData.backgroundColor);
         // If you want to clear any body gradient if a solid color is applied:
         document.body.style.backgroundImage = ''; 
    } else if (specificThemeDivActivated) {
        // If a specific theme div is active, ensure body's direct background doesn't interfere.
        // You might want to set body's background to transparent or a neutral color.
        document.documentElement.style.removeProperty('--background-color'); // Remove if set
        document.body.style.backgroundColor = 'transparent'; // Or a base color
        document.body.style.backgroundImage = '';
    }

    // If you intend to use themeData.gradientColors and gradientAngle as a fallback 
    // when no specificThemeDivActivated is true AND backgroundType is 'gradient'
    // you would add logic here. For now, focusing on CSS theme divs.

    // Ensure opacity is set again after all class and style manipulations
    document.body.style.opacity = OPACITY_VISIBLE; 
}

// Add message listener for theme updates from background.js
if (chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((message: any, _sender: chrome.runtime.MessageSender, sendResponse?: (response: any) => void) => {
        console.log('[AuraClock] newtab.ts: LISTENER INVOKED. Raw message type:', message && message.type); // New basic log
        console.log('[AuraClock] newtab.ts: LISTENER INVOKED. Full raw message object:', message); // New basic log

        console.log('[AuraClock] newtab.ts: Message received (stringified):', JSON.stringify(message)); // DEBUG
        try {
            if (message.type === MSG_TYPE_THEME_UPDATE) {
                console.log('[AuraClock] newtab.ts: MSG_TYPE_THEME_UPDATE received.'); // DEBUG
                if (message.data && message.data.themeData && message.data.effectiveThemeName) {
                    console.log('[AuraClock] Theme update received via onMessage listener. Applying theme...', message.data);
                    applyTheme(message.data.themeData as ThemeData, message.data.effectiveThemeName as ThemeName);
                } else {
                    console.warn('[AuraClock] Received incomplete theme data response:', message.data);
                }
                if (typeof sendResponse === 'function') sendResponse({ success: true });
                return true; // Indicate async response if sendResponse might be called later
            } else if (message.type === MSG_TYPE_SETTINGS_CHANGED) {
                console.log('[AuraClock] newtab.ts: MSG_TYPE_SETTINGS_CHANGED received.', message.payload);
                if (message.payload && message.payload.changedKey === 'theme') {
                    console.log('[AuraClock] newtab.ts: Theme setting changed, requesting full theme data...');
                    sendMessage(createRequestCurrentThemeDataMessage())
                    .then(handleThemeDataResponse)
                    .catch(error => {
                        console.error('[AuraClock] Error requesting current theme data (settings change catch):', error);
                        handleThemeDataResponse({ error: error.message || 'Failed to fetch theme on change' });
                    });
                }
                // Potentially handle other settings changes here if needed by newtab.ts directly
                if (typeof sendResponse === 'function') sendResponse({ success: true, note: 'Settings change noted.' });
                return false; // No async response expected from this branch directly by newtab
            } else if (message.type === MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE) {
                console.log('[AuraClock] newtab.ts: MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE received.');
                console.log('[AuraClock] newtab.ts: Dynamic theme update requested, requesting full theme data...');
                sendMessage(createRequestCurrentThemeDataMessage())
                .then(handleThemeDataResponse)
                .catch(error => {
                    console.error('[AuraClock] Error requesting theme data on dynamic theme update (catch):', error);
                    handleThemeDataResponse({ error: error.message || 'Failed to fetch theme on dynamic update' });
                });
                if (typeof sendResponse === 'function') sendResponse({ success: true, note: 'Dynamic theme update acknowledged.' });
                return false; // No async response expected from this branch directly by newtab
            }
        } catch (error) {
            console.error('[AuraClock] Error in newtab.ts message handler:', error);
            if (typeof sendResponse === 'function') {
                sendResponse({ success: false, error: (error as Error).message });
            }
            return false;
        }
        // Default return for unhandled messages or if sendResponse is not used in a branch.
        // If you intend to use sendResponse asynchronously in some branches, return true from those.
        // For synchronous handling or no response, false is fine (or undefined).
        return false;
    });
} else {
    console.warn('chrome.runtime.onMessage is not available in this context.');
}

// Add a storage change listener directly in newtab.ts to detect theme changes
if (chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync' && changes['theme']) { 
            console.log('[AuraClock] newtab.ts: Detected theme change in chrome.storage:', changes['theme']); 
            console.log('[AuraClock] newtab.ts: Requesting updated theme data from background script due to storage change.');
            sendMessage(createRequestCurrentThemeDataMessage())
            .then(handleThemeDataResponse)
            .catch(error => {
                console.error('[AuraClock] Error requesting theme data on storage change (catch):', error);
                handleThemeDataResponse({ error: error.message || 'Failed to fetch theme on change' });
            });
        }
    });
} else {
    console.warn('chrome.storage.onChanged is not available in this context.');
}

// Porting from newtab.js complete. Review TODOs for any further actions.