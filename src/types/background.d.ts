// Type definitions for background script

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
  grainBlendMode?: string;
}

export const DEFAULT_SETTINGS: {
  clockStyle: 'digital' | 'analog' | 'both';
  timeFormat: '12' | '24';
  showSeconds: boolean;
  showDate: boolean;
  showDay: boolean;
  showAmPm: boolean;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  textColor: string;
  backgroundColor: string;
  backgroundType: 'solid' | 'gradient' | 'image';
  gradientColors: string[];
  gradientAngle: number;
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
  animationSpeed: 'slow' | 'normal' | 'fast';
  animationType: 'fade' | 'slide' | 'none';
  showGrain: boolean;
  grainIntensity: number;
  grainOpacity: number;
  grainSize: number;
  grainSpeed: number;
  grainColor: string;
  grainBlendMode: string;
  theme: 'light' | 'dark' | 'system' | 'custom';
};

// Global variables
export declare let currentSettings: typeof DEFAULT_SETTINGS;
export declare let themeData: ThemeData;

// Functions
export declare function applyThemeSettings(settings: typeof DEFAULT_SETTINGS): void;
export declare function updateThemeData(settings: typeof DEFAULT_SETTINGS): ThemeData;
export declare function sendThemeUpdate(tabId?: number): void;
export declare function updateBadge(settings: typeof DEFAULT_SETTINGS): void;
export declare function handleAlarm(alarm: chrome.alarms.Alarm): void;
export declare function scheduleNextUpdate(settings: typeof DEFAULT_SETTINGS): void;
export declare function handleTabUpdate(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): void;
export declare function handleTabRemoved(tabId: number, removeInfo: { windowId: number; isWindowClosing: boolean }): void;

// Event listeners
export declare function onMessage(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
): boolean | void;

// Chrome extension lifecycle events
export declare function onCommand(command: string): void;
export declare function onStartup(): void;
export declare function onInstalled(details: chrome.runtime.InstalledDetails): void;

// Initialize
export declare function init(): void;
