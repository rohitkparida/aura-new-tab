// Global type declarations for the Aura Clock Tab extension
declare const MSG_TYPE_SETTINGS_CHANGED = 'settingsChanged';
declare const MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE = 'requestDynamicThemeUpdate';
declare const MSG_TYPE_REQUEST_CURRENT_THEME_DATA = 'requestCurrentThemeData';
declare const MSG_TYPE_THEME_UPDATE = 'themeUpdate';

type ClockStyle = 'digital' | 'analog';
type ThemeName = 'light' | 'dark' | 'system' | 'dynamic' | 'custom';
type GradientStyle = 'solid' | 'linear' | 'radial' | 'conic';
type AnimationType = 'fade' | 'slide' | 'zoom' | 'none';
type FontFamily = 'Inter' | 'Roboto' | 'Open Sans' | 'Lato' | 'Montserrat' | 'Arial' | 'sans-serif';

interface Settings {
  theme: ThemeName;
  gradientStyle: GradientStyle;
  timeFormat24h: boolean;
  showSeconds: boolean;
  showDate: boolean;
  showDay: boolean;
  clockStyle: ClockStyle;
  fontStyle: FontFamily;
  animationsEnabled: boolean;
  grainEffect: boolean;
  grainIntensity: number;
  grainOpacity: number;
  grainSize: number;
  grainSpeed: number;
  grainColor: string;
  grainBlendMode: string;
  grainZIndex: number;
  grainEnabled: boolean;
}

interface ThemeData {
  background: string;
  textColor: string;
  gradient?: string;
  gradientAngle?: number;
  gradientColors?: string[];
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
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

interface AnimationState {
  isAnimating: boolean;
  animationStartTime: number;
  animationDuration: number;
  currentAnimation: AnimationType | null;
  animationCallback: (() => void) | null;
}

declare global {
  // Extend the Window interface with our custom properties
  interface Window {
    i18n: {
      init: () => Promise<void>;
      getMessage: (key: string, placeholders?: Record<string, string>) => string;
      getCurrentLanguage: () => string;
      setLanguage: (langCode: string) => Promise<void>;
      onLanguageChanged: (callback: (langCode: string) => void) => void;
    };
    
    errorLogger: {
      logError: (error: Error | string, context?: Record<string, unknown>) => void;
      getErrors: () => Promise<Array<{error: string; timestamp: number; context?: unknown}>>;
      clearErrors: () => Promise<void>;
    };

    // Add any other global variables here
    settings: Settings;
    currentTheme: ThemeData;
    clockElements: ClockElements;
    animationState: AnimationState;
  }

  // Utility types
  type Nullable<T> = T | null;
  type Undefinable<T> = T | undefined;
  type Maybe<T> = T | null | undefined;
  
  // Dictionary types
  interface Dictionary<T> {
    [key: string]: T;
  }
  
  interface StringMap<T> extends Dictionary<T> {
    [key: string]: T;
  }
  
  // Type utilities
  type ValueOf<T> = T[keyof T];
  
  type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
  };
  
  // Promise result type for better error handling
  type Result<T, E = Error> = 
    | { success: true; data: T; error?: never }
    | { success: false; error: E; data?: never };
  
  // Async function that returns a Result
  type AsyncResult<T, E = Error> = Promise<Result<T, E>>;
  
  // Make all properties partial and nullable
  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] | null;
  };
  
  // Make all properties required and non-nullable
  type DeepRequired<T> = {
    [P in keyof T]-?: NonNullable<T[P]>;
  };
  
  // Make all properties writable (remove readonly)
  type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
  };
  
  // Event handler type
  type EventHandler<T = Event> = (event: T) => void;
  
  // CSS style object
  type CSSProperties = {
    [key in keyof CSSStyleDeclaration]?: string | number | null | undefined;
  };
}

export {}; // This file is a module
