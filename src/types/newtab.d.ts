// Type definitions for newtab script

interface ThemeData {
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
  grainBlendMode?: string;
}

interface ClockElements {
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
}

declare class ClockManager {
  constructor(container: HTMLElement);
  elements: ClockElements;
  init(settings: any): void;
  updateTime(): void;
  updateDigitalClock(hours: string, minutes: string, seconds: string, ampm: string): void;
  updateAnalogClock(hours: number, minutes: number, seconds: number, milliseconds: number): void;
  updateDate(date: Date): void;
  updateDay(date: Date): void;
  destroy(): void;
}

declare class GrainEffect {
  constructor(container: HTMLElement);
  init(settings: {
    intensity?: number;
    opacity?: number;
    size?: number;
    speed?: number;
    color?: string;
    blendMode?: string;
  }): void;
  updateSettings(settings: {
    intensity?: number;
    opacity?: number;
    size?: number;
    speed?: number;
    color?: string;
    blendMode?: string;
  }): void;
  start(): void;
  stop(): void;
  destroy(): void;
}

// Global variables
declare let clockManager: ClockManager | null;
declare let grainEffect: GrainEffect | null;
declare let currentSettings: any;

// Functions
declare function applySettings(settings: any): void;
declare function updateClockStyle(style: string): void;
declare function updateTimeFormat(format: string): void;
declare function updateShowSeconds(show: boolean): void;
declare function updateShowDate(show: boolean): void;
declare function updateShowDay(show: boolean): void;
declare function updateShowAmPm(show: boolean): void;
declare function updateFontFamily(font: string): void;
declare function updateFontSize(size: string): void;
declare function updateFontWeight(weight: string): void;
declare function updateTextColor(color: string): void;
declare function updateBackgroundColor(color: string): void;
declare function updateBackgroundType(type: string): void;
declare function updateGradientColors(colors: string[]): void;
declare function updateGradientAngle(angle: number): void;
declare function updateBackgroundImage(image: string): void;
declare function updateBackgroundBlur(blur: number): void;
declare function updateBackgroundBrightness(brightness: number): void;
declare function updateBackgroundContrast(contrast: number): void;
declare function updateBackgroundSaturation(saturation: number): void;
declare function updateBackgroundHue(hue: number): void;
declare function updateBackgroundGrayscale(grayscale: boolean): void;
declare function updateBackgroundInvert(invert: boolean): void;
declare function updateBackgroundSepia(sepia: boolean): void;
declare function updateBackgroundOpacity(opacity: number): void;
declare function updateAnimationSpeed(speed: string): void;
declare function updateAnimationType(type: string): void;
declare function updateShowGrain(show: boolean): void;
declare function updateGrainIntensity(intensity: number): void;
declare function updateGrainOpacity(opacity: number): void;
declare function updateGrainSize(size: number): void;
declare function updateGrainSpeed(speed: number): void;
declare function updateGrainColor(color: string): void;
declare function updateGrainBlendMode(blendMode: string): void;
declare function updateTheme(theme: string): void;

// Event listeners
declare function onMessage(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): void;
declare function onVisibilityChange(): void;

// Initialize
declare function init(): void;
