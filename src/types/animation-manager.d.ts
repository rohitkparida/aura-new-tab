declare class AnimationManager {
  constructor();
  
  // Methods
  init(settings: any): void;
  handleAnimationFrame(timestamp: number): void;
  start(): void;
  stop(): void;
  
  // Animation types
  enable(animationType: string): void;
  disable(animationType: string): void;
  
  // Animation controls
  startAnimation(animationType: string, duration: number, callback: () => void): void;
  stopAnimation(animationType: string): void;
  
  // Utils
  getEasingProgress(progress: number, easingType?: string): number;
  
  // Properties
  isAnimating: boolean;
  animationStartTime: number;
  currentAnimation: string | null;
  animationDuration: number;
  animationCallback: (() => void) | null;
  enabledAnimations: Set<string>;
  animationFrameId: number | null;
}
