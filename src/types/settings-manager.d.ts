declare class SettingsManager {
  constructor();
  
  // Default settings
  static DEFAULT_SETTINGS: {
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
    grainBlendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';
    theme: 'light' | 'dark' | 'system' | 'custom';
  };

  // Current settings
  settings: typeof SettingsManager.DEFAULT_SETTINGS;
  
  // Methods
  init(): Promise<void>;
  load(): Promise<void>;
  save(settings?: typeof SettingsManager.DEFAULT_SETTINGS): Promise<void>;
  get(key?: string): any;
  set(key: string, value: any): Promise<void>;
  reset(): Promise<void>;
  onChanged: {
    addListener(callback: (newSettings: any, oldSettings: any) => void): void;
    removeListener(callback: (newSettings: any, oldSettings: any) => void): void;
  };
}
