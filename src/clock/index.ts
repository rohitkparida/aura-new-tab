/**
 * Clock Module
 * 
 * This module handles all clock-related functionality including:
 * - Analog clock hand positioning and animation
 * - Hour marker generation
 * - Date and time display updates
 */

// Export all clock handler functions
export { 
    updateClockHands,
    setClockHandsPositions,
    updateAnalogClock,
    createHourMarkers,
    updateDayAndDate 
} from './clockHandlers';

// Re-export clock-related types for convenience
export type { ClockElements, ClockSettings } from '../types';
