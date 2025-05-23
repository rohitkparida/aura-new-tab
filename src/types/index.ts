/**
 * Core type definitions for Aura Clock Tab
 * 
 * This file serves as the main entry point for all type definitions used in the application.
 */

// Re-export all message types and utilities
export * from './messages';

// Time and display types
export type TimeFormat = '12' | '24';
export type ClockStyle = 'digital' | 'analog' | 'both';
export type ThemeName = 
    'light' | 
    'dark' | 
    'system' | 
    'dynamic' | 
    'custom' | 
    'graphite' | 
    'sunrise' | 
    'horizon' | 
    'twilight' | 
    'midnight' | 
    'aurora' | 
    'pacific' | 
    'sierra' | 
    'rose' | 
    'forest' | 
    'ocean' | 
    'desert' | 
    'lavender' | 
    'mint';
export type GradientStyle = 'solid' | 'linear' | 'radial' | 'conic';
export type AnimationType = 'fade' | 'slide' | 'zoom' | 'none';
export type FontFamily = 'Inter' | 'Roboto' | 'Open Sans' | 'Lato' | 'Montserrat' | 'Arial' | 'sans-serif';
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';

// Theme related interface
export interface ThemeData {
  backgroundColor: string;
  textColor: string;
  gradientColors?: string[];
  gradientAngle?: number;
  backgroundImage?: string;
  backgroundBlur?: number;
  backgroundBrightness?: number;
  backgroundContrast?: number;
  backgroundSaturation?: number;
  backgroundHue?: number;
  backgroundGrayscale?: boolean;
  backgroundInvert?: boolean;
  backgroundSepia?: boolean;
  backgroundOpacity?: number;
  grainIntensity?: number;
  grainOpacity?: number;
  grainSize?: number;
  grainSpeed?: number;
  grainColor?: string;
  grainBlendMode?: BlendMode;
}

export interface ClockSettings {
  timeFormat: TimeFormat;
  showAmPm: boolean;
  showDate: boolean;
  showDay: boolean;
  clockStyle: ClockStyle;
  fontFamily: FontFamily;
  fontSize: string;
  fontWeight: string;
  textColor: string;
  backgroundColor: string;
  backgroundType: 'solid' | 'gradient' | 'image';
  gradientColors: string[];
  gradientAngle: number;
  gradientStyle?: GradientStyle;
  backgroundImage: string;
  backgroundBlur: number;
  backgroundBrightness: number;
  backgroundContrast: number;
  backgroundSaturation: number;
  backgroundHue: number;
  backgroundGrayscale: boolean;
  backgroundInvert: boolean;
  backgroundSepia: boolean;
  backgroundOpacity: number;
  enableAnimations?: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  animationType: AnimationType;
  showGrain: boolean;
  grainIntensity: number;
  grainOpacity: number;
  grainSize: number;
  grainSpeed: number;
  grainColor: string;
  grainBlendMode: BlendMode;
  theme: ThemeName;
  showMarkers?: boolean;
  smoothMotion?: boolean;
}

export interface ClockElements {
  hours: HTMLElement | null;
  minutes: HTMLElement | null;
  seconds: HTMLElement | null;
  ampm: HTMLElement | null;
  date: HTMLElement | null;
  day: HTMLElement | null;
  analog: HTMLElement | null;
  analogHours: HTMLElement | null;
  analogMinutes: HTMLElement | null;
  analogSeconds: HTMLElement | null;
  analogCenter: HTMLElement | null;
  analogDot: HTMLElement | null;
  analogMarkers: NodeListOf<HTMLElement> | [];
  analogNumbers: NodeListOf<HTMLElement> | [];
  digital: HTMLElement | null;
  digitalTime: HTMLElement | null;
  digitalDate: HTMLElement | null;
  digitalDay: HTMLElement | null;
  digitalAmpm: HTMLElement | null;
  body: HTMLElement;
  timeMain?: HTMLElement | null; // For backward compatibility
}

// Default settings
export const DEFAULT_SETTINGS: ClockSettings = {
  timeFormat: '12',
  showAmPm: true,
  showDate: true,
  showDay: true,
  clockStyle: 'digital',
  fontFamily: 'Inter',
  fontSize: '1rem',
  fontWeight: '400',
  textColor: '#ffffff',
  backgroundColor: '#000000',
  backgroundType: 'solid',
  gradientColors: ['#000000', '#1a1a1a'],
  gradientAngle: 135,
  gradientStyle: 'linear',
  backgroundImage: '',
  backgroundBlur: 0,
  backgroundBrightness: 100,
  backgroundContrast: 100,
  backgroundSaturation: 100,
  backgroundHue: 0,
  backgroundGrayscale: false,
  backgroundInvert: false,
  backgroundSepia: false,
  backgroundOpacity: 100,
  enableAnimations: true,
  animationSpeed: 'normal',
  animationType: 'fade',
  showGrain: true,
  grainIntensity: 20,
  grainOpacity: 10,
  grainSize: 1,
  grainSpeed: 1,
  grainColor: '#ffffff',
  grainBlendMode: 'overlay',
  theme: 'dynamic',
  showMarkers: true,
  smoothMotion: true
};

// Extend Window interface
declare global {
  interface Window {
    // Add any global variables here
  }
}
