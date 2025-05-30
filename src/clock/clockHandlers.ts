/**
 * Clock Handlers Module
 * 
 * This module contains functions for handling analog clock functionality
 * including updating clock hands, creating hour markers, and managing the analog clock display.
 */

import { ClockElements, ClockSettings } from '../types';

/**
 * Updates the positions of the clock hands based on the current time
 * @param now - The current Date object
 * @param elements - Object containing references to clock elements
 * @param settings - Current clock settings
 * @returns {void}
 */
export function updateClockHands(
    now: Date,
    elements: ClockElements,
    settings: Pick<ClockSettings, 'smoothMotion' | 'enableAnimations'>
): void {
    if (!elements.analogHours || !elements.analogMinutes || !elements.analogSeconds) {
        console.warn('Clock hand elements not found');
        return;
    }

    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;
    const milliseconds = now.getMilliseconds();

    // Calculate hand positions with milliseconds for smooth motion if enabled
    const smoothSeconds = settings.smoothMotion ? seconds + milliseconds / 1000 : seconds;
    const smoothMinutes = settings.smoothMotion ? minutes + seconds / 60 : minutes;
    const smoothHours = settings.smoothMotion ? hours + minutes / 60 : hours;

    // Calculate rotation degrees
    const secondDegrees = (smoothSeconds / 60) * 360;
    const minuteDegrees = (smoothMinutes / 60) * 360;
    const hourDegrees = (smoothHours / 12) * 360 + (smoothMinutes / 60) * 30; // 30 degrees per hour (360/12)

    // Apply rotations with transition if animations are enabled
    const transition = settings.enableAnimations ? 'transform 0.3s ease-in-out' : 'none';
    
    elements.analogSeconds.style.transition = transition;
    elements.analogMinutes.style.transition = transition;
    elements.analogHours.style.transition = transition;
    
    elements.analogSeconds.style.transform = `rotate(${secondDegrees}deg)`;
    elements.analogMinutes.style.transform = `rotate(${minuteDegrees}deg)`;
    elements.analogHours.style.transform = `rotate(${hourDegrees}deg)`;
}

/**
 * Sets the initial positions of the clock hands
 * @param elements - Object containing references to clock elements
 * @param settings - Current clock settings
 * @returns {void}
 */
export function setClockHandsPositions(
    elements: ClockElements,
    settings: Pick<ClockSettings, 'enableAnimations'>
): void {
    if (!elements.analogHours || !elements.analogMinutes || !elements.analogSeconds) {
        console.warn('Clock hand elements not found');
        return;
    }

    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    // Calculate initial rotations without smooth motion
    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = (minutes / 60) * 360;
    const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;

    // Set initial positions without transition
    elements.analogSeconds.style.transition = 'none';
    elements.analogMinutes.style.transition = 'none';
    elements.analogHours.style.transition = 'none';
    
    elements.analogSeconds.style.transform = `rotate(${secondDegrees}deg)`;
    elements.analogMinutes.style.transform = `rotate(${minuteDegrees}deg)`;
    elements.analogHours.style.transform = `rotate(${hourDegrees}deg`;
    
    // Force reflow to ensure styles are applied before enabling transitions
    void elements.analogSeconds.offsetHeight;
    
    // Re-enable transitions if animations are enabled
    if (settings.enableAnimations) {
        const transition = 'transform 0.3s ease-in-out';
        elements.analogSeconds.style.transition = transition;
        elements.analogMinutes.style.transition = transition;
        elements.analogHours.style.transition = transition;
    }
}

/**
 * Updates the analog clock display
 * @param animate - Whether to animate the clock hands
 * @param elements - Object containing references to clock elements
 * @param settings - Current clock settings
 * @returns {void}
 */
export function updateAnalogClock(
    animate: boolean,
    elements: ClockElements,
    settings: Pick<ClockSettings, 'smoothMotion' | 'enableAnimations'>
): void {
    if (!elements.analog) {
        console.warn('Analog clock element not found');
        return;
    }

    const now = new Date();
    
    if (animate) {
        updateClockHands(now, elements, settings);
    } else {
        setClockHandsPositions(elements, settings);
    }
    
    // Update hour markers if they don't exist yet
    if (settings.enableAnimations && !elements.analog.querySelector('.hour-marker')) {
        createHourMarkers(elements.analog);
    }
}

/**
 * Creates hour markers for the analog clock
 * @param analogElement - The analog clock element
 * @returns {void}
 */
export function createHourMarkers(analogElement: HTMLElement): void {
    if (!analogElement) return;
    
    // Clear existing markers
    const existingMarkers = analogElement.querySelectorAll('.hour-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    // Create 12 hour markers
    for (let i = 0; i < 12; i++) {
        const marker = document.createElement('div');
        marker.className = 'hour-marker';
        
        // Position markers in a circle (30 degrees apart, starting at 0)
        const angle = (i * 30) * (Math.PI / 180);
        const radius = 40; // Percentage from center
        const x = 50 + Math.sin(angle) * radius;
        const y = 50 - Math.cos(angle) * radius;
        
        marker.style.position = 'absolute';
        marker.style.left = `${x}%`;
        marker.style.top = `${y}%`;
        marker.style.transform = 'translate(-50%, -50%)';
        marker.style.width = '4px';
        marker.style.height = '4px';
        marker.style.borderRadius = '50%';
        marker.style.backgroundColor = 'currentColor';
        
        analogElement.appendChild(marker);
    }
}

/**
 * Updates the day and date display
 * @param elements - Object containing references to date and day elements
 * @param settings - Current clock settings
 * @param date - Optional Date object to use (defaults to current date)
 * @returns {void}
 */
export function updateDayAndDate(
    elements: { date?: HTMLElement | null; day?: HTMLElement | null },
    settings: Pick<ClockSettings, 'showDate' | 'showDay'>,
    date: Date = new Date()
): void {
    if (elements.date && settings.showDate) {
        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        elements.date.textContent = date.toLocaleDateString(undefined, options);
    }
    
    if (elements.day && settings.showDay) {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
        elements.day.textContent = date.toLocaleDateString(undefined, options);
    }
}
