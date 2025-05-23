declare class GrainEffect {
  constructor(container: HTMLElement);
  
  // Properties
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  frameId: number | null;
  patternCanvas: HTMLCanvasElement;
  patternCtx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  intensity: number;
  opacity: number;
  size: number;
  speed: number;
  color: string;
  blendMode: string;
  isAnimating: boolean;
  lastFrameTime: number;
  
  // Methods
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
  
  resize(): void;
  generateNoise(): void;
  render(timestamp: number): void;
  start(): void;
  stop(): void;
  destroy(): void;
}
