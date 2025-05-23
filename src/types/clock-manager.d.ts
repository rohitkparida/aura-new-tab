declare class ClockManager {
  constructor(container: HTMLElement);
  
  // Element references
  elements: {
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
  };

  // Time formatting
  formatTimeUnit(unit: number, pad: boolean = true): string;
  getFormattedTime(date: Date, is24Hour: boolean): { hours: string; minutes: string; seconds: string; ampm: string };
  
  // Clock updates
  updateTime(): void;
  updateDigitalClock(hours: string, minutes: string, seconds: string, ampm: string): void;
  updateAnalogClock(hours: number, minutes: number, seconds: number, milliseconds: number): void;
  updateDate(date: Date): void;
  updateDay(date: Date): void;
  
  // Initialization
  init(settings: any): void;
  
  // Event handlers
  handleVisibilityChange(): void;
  
  // Cleanup
  destroy(): void;
}
