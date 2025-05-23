// Message types
export enum MessageType {
  RequestCurrentThemeData = 'requestCurrentThemeData',
  RequestDynamicThemeUpdate = 'requestDynamicThemeUpdate',
  SettingsChanged = 'settingsChanged',
  ThemeUpdate = 'themeUpdate'
}

export type TimeFormat = '12' | '24' | '12h' | '12hr';
export type ClockStyle = 'digital' | 'analog' | 'both';
export type ThemeName = 'sunrise' | 'horizon' | 'twilight' | 'midnight' | 'system';
export type FontFamily = 'Inter' | 'Roboto' | 'Open Sans' | 'Arial' | 'sans-serif' | string;
export type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate';
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';

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
  gradientStyle: string;
  enableAnimations: boolean;
  showGrain: boolean;
  showMarkers: boolean;
  smoothMotion: boolean;
  fontFamily: FontFamily;
  fontSize: string;
  fontWeight: string;
  
  // Theme
  theme: string;
  textColor: string;
  backgroundColor: string;
  gradientColors: string[];
  gradientAngle: number;
  
  // Advanced settings
  animationType: AnimationType;
  grainIntensity: number;
  grainOpacity: number;
  grainBlendMode: BlendMode;
}

// Theme data interface
export interface ThemeData {
  theme: ThemeName;
  textColor: string;
  backgroundColor: string;
  gradientColors: string[];
  gradientAngle: number;
}

// DOM Elements interface
export interface ClockElements {
  // Digital clock elements
  timeMain: HTMLElement | null;
  ampm: HTMLElement | null;
  day: HTMLElement | null;
  date: HTMLElement | null;
  
  // Analog clock elements
  analogClock: HTMLElement | null;
  hourHand: HTMLElement | null;
  minuteHand: HTMLElement | null;
  secondHand: HTMLElement | null;
  clockCenter: HTMLElement | null;
  analogDay: HTMLElement | null;
  analogDate: HTMLElement | null;
  
  // Effects
  grain: HTMLElement | null;
  
  // Layout
  body: HTMLElement | null;
}

// Chrome types are defined in chrome.d.ts
