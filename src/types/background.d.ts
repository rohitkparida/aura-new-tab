// Type definitions for background script

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

declare const DEFAULT_SETTINGS: {
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
declare let currentSettings: typeof DEFAULT_SETTINGS;
declare let themeData: ThemeData;

// Functions
declare function applyThemeSettings(settings: typeof DEFAULT_SETTINGS): void;
declare function updateThemeData(settings: typeof DEFAULT_SETTINGS): ThemeData;
declare function sendThemeUpdate(tabId?: number): void;
declare function updateBadge(settings: typeof DEFAULT_SETTINGS): void;
declare function handleAlarm(alarm: chrome.alarms.Alarm): void;
declare function scheduleNextUpdate(settings: typeof DEFAULT_SETTINGS): void;
declare function handleTabUpdate(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): void;
declare function handleTabRemoved(tabId: number, removeInfo: { windowId: number; isWindowClosing: boolean }): void;

// Event listeners
declare function onMessage(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
): boolean | void;

declare function onCommand(command: string): void;
declare function onStartup(): void;
declare function onInstalled(details: chrome.runtime.InstalledDetails): void;

// Initialize
declare function init(): void;
