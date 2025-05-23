/**
 * Utility functions for the Aura Clock Tab extension
 * 
 * This module re-exports all utility functions from individual modules
 * to provide a single import point for all utilities.
 */

// DOM manipulation utilities
export * from './dom';

// Date and time utilities
export * from './date-time';

// Storage utilities
export * from './storage';

// Add more utility exports here as needed

// Re-export common types
export type { ClockElements } from '@/types';

// Export a default object with all utilities for easier access
export default {
  // DOM utilities
  ...require('./dom'),
  // Date/Time utilities
  ...require('./date-time'),
  // Storage utilities
  ...require('./storage'),
  // Add more utilities here as needed
} as const;
