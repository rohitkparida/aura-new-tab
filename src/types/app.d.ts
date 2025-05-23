// Core type definitions for Aura Clock Tab

// Message types
export const MSG_TYPE_REQUEST_CURRENT_THEME_DATA = 'requestCurrentThemeData' as const;
export const MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE = 'requestDynamicThemeUpdate' as const;
export const MSG_TYPE_SETTINGS_CHANGED = 'settingsChanged' as const;
export const MSG_TYPE_THEME_UPDATE = 'themeUpdate' as const;
// Time and display types
export type TimeFormat = '12' | '24';
export type ClockStyle = 'digital' | 'analog' | 'both';
export type ThemeName = 'light' | 'dark' | 'system' | 'dynamic' | 'custom';
export type GradientStyle = 'solid' | 'linear' | 'radial' | 'conic';
export type AnimationType = 'fade' | 'slide' | 'zoom' | 'none';
export type FontFamily = 'Inter' | 'Roboto' | 'Open Sans' | 'Lato' | 'Montserrat' | 'Arial' | 'sans-serif';
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';

// Theme related interfaces
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

// Clock settings interface
export interface ClockSettings {
  // Time display
  timeFormat: TimeFormat;
  showAmPm: boolean;
  showDate: boolean;
  showDay: boolean;
  showSeconds: boolean;
  
  // Clock style
  clockStyle: ClockStyle;
  fontFamily: FontFamily;
  fontSize: string;
  fontWeight: string;
  
  // Colors and theming
  textColor: string;
  backgroundColor: string;
  backgroundType: 'solid' | 'gradient' | 'image';
  gradientColors: string[];
  gradientAngle: number;
  backgroundImage: string;
  
  // Background effects
  backgroundBlur: number;
  backgroundBrightness: number;
  backgroundContrast: number;
  backgroundSaturation: number;
  backgroundHue: number;
  backgroundGrayscale: boolean;
  backgroundInvert: boolean;
  backgroundSepia: boolean;
  backgroundOpacity: number;
  
  // Animations
  animationSpeed: 'slow' | 'normal' | 'fast';
  animationType: AnimationType;
  
  // Grain effect
  showGrain: boolean;
  grainIntensity: number;
  grainOpacity: number;
  grainSize: number;
  grainSpeed: number;
  grainColor: string;
  grainBlendMode: BlendMode;
  
  // Theme
  theme: ThemeName;
}

// DOM elements for the clock
export interface ClockElements {
  // Digital clock elements
  hours: HTMLElement | null;
  minutes: HTMLElement | null;
  seconds: HTMLElement | null;
  ampm: HTMLElement | null;
  date: HTMLElement | null;
  day: HTMLElement | null;
  
  // Analog clock elements
  analog: HTMLElement | null;
  analogHours: HTMLElement | null;
  analogMinutes: HTMLElement | null;
  analogSeconds: HTMLElement | null;
  analogCenter: HTMLElement | null;
  analogDot: HTMLElement | null;
  analogMarkers: NodeListOf<HTMLElement> | [];
  analogNumbers: NodeListOf<HTMLElement> | [];
  
  // Container elements
  digital: HTMLElement | null;
  digitalTime: HTMLElement | null;
  digitalDate: HTMLElement | null;
  digitalDay: HTMLElement | null;
  digitalAmpm: HTMLElement | null;
}

// Message types
export type MessageType = 
  | typeof MSG_TYPE_REQUEST_CURRENT_THEME_DATA
  | typeof MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE
  | typeof MSG_TYPE_SETTINGS_CHANGED
  | typeof MSG_TYPE_THEME_UPDATE;

// Message handler type
export type MessageHandler = (
  message: { type: MessageType; [key: string]: any },
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => boolean | void;

// Default settings
export const DEFAULT_SETTINGS: ClockSettings = {
  timeFormat: '12',
  showAmPm: true,
  showDate: true,
  showDay: true,
  showSeconds: false,
  clockStyle: 'digital',
  fontFamily: 'Inter',
  fontSize: '1rem',
  fontWeight: '400',
  textColor: '#ffffff',
  backgroundColor: '#000000',
  backgroundType: 'solid',
  gradientColors: ['#000000', '#1a1a1a'],
  gradientAngle: 135,
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
  animationSpeed: 'normal',
  animationType: 'fade',
  showGrain: true,
  grainIntensity: 20,
  grainOpacity: 10,
  grainSize: 1,
  grainSpeed: 1,
  grainColor: '#ffffff',
  grainBlendMode: 'overlay',
  theme: 'dynamic'
};

// Extend Window interface
declare global {
  interface Window {
    // Add any global variables here
  }
}

export {};
