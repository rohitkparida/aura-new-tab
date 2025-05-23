export interface Settings {
  // Clock settings
  timeFormat: '12' | '24';
  showSeconds: boolean;
  showDate: boolean;
  showDay: boolean;
  
  // Theme settings
  theme: string;
  customBackground: string | null;
  
  // Animation settings
  animationsEnabled: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  
  // Font settings
  fontFamily: string;
  fontSize: string;
  fontWeight: string | number;
  
  // Layout settings
  horizontalAlignment: 'left' | 'center' | 'right';
  verticalAlignment: 'top' | 'center' | 'bottom';
  
  // Developer options
  debugMode: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  timeFormat: '12',
  showSeconds: true,
  showDate: true,
  showDay: true,
  theme: 'graphite',
  customBackground: null,
  animationsEnabled: true,
  animationSpeed: 'normal',
  fontFamily: 'Mattone, sans-serif',
  fontSize: '1em',
  fontWeight: 400,
  horizontalAlignment: 'center',
  verticalAlignment: 'center',
  debugMode: false
};
