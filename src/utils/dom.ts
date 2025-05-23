export interface ClockElements {
  timeMain: HTMLElement | null;
  ampm: HTMLElement | null;
  date: HTMLElement | null;
  day: HTMLElement | null;
  analogClock: HTMLElement | null;
  hourHand: HTMLElement | null;
  minuteHand: HTMLElement | null;
  secondHand: HTMLElement | null;
  clockCenter: HTMLElement | null;
  analogDay: HTMLElement | null;
  analogDate: HTMLElement | null;
  grain: HTMLElement | null;
}

/**
 * Utility functions for DOM manipulation
 */

/**
 * Safely query a single element in the DOM
 */
export function $<T extends HTMLElement = HTMLElement>(
  selector: string,
  parent: ParentNode = document
): T | null {
  return parent.querySelector<T>(selector);
}

/**
 * Safely query multiple elements in the DOM
 */
export function $$<T extends HTMLElement = HTMLElement>(
  selector: string,
  parent: ParentNode = document
): NodeListOf<T> {
  return parent.querySelectorAll<T>(selector);
}

/**
 * Create a new DOM element with optional attributes and children
 */
export function createElement<T extends HTMLElement = HTMLElement>(
  tagName: string,
  attributes: Record<string, string> = {},
  ...children: (Node | string)[]
): T {
  const element = document.createElement(tagName) as T;
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, value);
    }
  });
  
  // Append children
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child) {
      element.appendChild(child);
    }
  });
  
  return element;
}

/**
 * Toggle a class on an element
 */
export function toggleClass(
  element: Element,
  className: string,
  force?: boolean
): boolean {
  if (force === undefined) {
    return element.classList.toggle(className);
  }
  element.classList.toggle(className, force);
  return force;
}

/**
 * Add one or more classes to an element
 */
export function addClass(element: Element, ...classNames: string[]): void {
  element.classList.add(...classNames);
}

/**
 * Remove one or more classes from an element
 */
export function removeClass(element: Element, ...classNames: string[]): void {
  element.classList.remove(...classNames);
}

/**
 * Check if an element has a specific class
 */
export function hasClass(element: Element, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * Set multiple styles on an element
 */
export function setStyles(
  element: HTMLElement,
  styles: Partial<CSSStyleDeclaration>
): void {
  Object.entries(styles).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // @ts-ignore - We know this is a valid style property
      element.style[key] = value;
    }
  });
}

/**
 * Get computed styles for an element
 */
export function getComputedStyles(
  element: Element,
  ...properties: string[]
): Record<string, string> {
  const computed = window.getComputedStyle(element);
  return properties.reduce((acc, prop) => {
    acc[prop] = computed.getPropertyValue(prop);
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Wait for the DOM to be fully loaded
 */
export function domReady(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => resolve());
    } else {
      resolve();
    }
  });
}

/**
 * Initialize clock elements by querying the DOM
 */
export function initClockElements(): ClockElements {
  const elements: ClockElements = {
    timeMain: document.querySelector('.time-main'),
    ampm: document.querySelector('.ampm'),
    date: document.querySelector('.date'),
    day: document.querySelector('.day'),
    analogClock: document.querySelector('.analog-clock'),
    hourHand: document.querySelector('.hour-hand'),
    minuteHand: document.querySelector('.minute-hand'),
    secondHand: document.querySelector('.second-hand'),
    clockCenter: document.querySelector('.clock-center'),
    analogDay: document.querySelector('.analog-day'),
    analogDate: document.querySelector('.analog-date'),
    grain: document.querySelector('.grain')
  };
  
  return elements;
}

/**
 * Debounce a function call
 */
type AnyFunction = (...args: any[]) => any;

export function debounce<T extends AnyFunction>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function call
 */
export function throttle<T extends AnyFunction>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Create a CSS variable
 */
export function setCssVariable(
  name: string,
  value: string,
  element: HTMLElement = document.documentElement
): void {
  element.style.setProperty(`--${name}`, value);
}

/**
 * Get a CSS variable value
 */
export function getCssVariable(
  name: string,
  element: HTMLElement = document.documentElement
): string {
  return getComputedStyle(element).getPropertyValue(`--${name}`).trim();
}

/**
 * Animate an element using the Web Animations API
 */
export function animateElement(
  element: HTMLElement,
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  options?: number | KeyframeAnimationOptions
): Animation {
  return element.animate(keyframes, options);
}

/**
 * Check if an element is in the viewport
 */
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Add an event listener with options
 */
type EventTargetElement = HTMLElement | Document | Window;

export function on<T extends EventTargetElement, K extends keyof HTMLElementEventMap>(
  target: T,
  event: K,
  handler: (this: T, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void {
  target.addEventListener(event, handler as EventListener, options);
  return () => target.removeEventListener(event, handler as EventListener, options);
}

/**
 * Remove all child nodes from an element
 */
export function empty(element: Element): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Check if an element is visible
 */
export function isVisible(element: Element): boolean {
  const htmlElement = element as HTMLElement;
  return !!(htmlElement.offsetWidth || htmlElement.offsetHeight || element.getClientRects().length);
}

/**
 * Toggle visibility of an element
 */
export function toggleVisibility(
  element: HTMLElement,
  show?: boolean
): void {
  if (show === undefined) {
    show = element.style.display === 'none';
  }
  
  element.style.display = show ? '' : 'none';
}

/**
 * Fade in an element
 */
export function fadeIn(
  element: HTMLElement,
  duration: number = 300,
  display: string = 'block'
): Promise<void> {
  return new Promise((resolve) => {
    element.style.display = display;
    element.style.opacity = '0';
    
    const start = performance.now();
    
    function step(timestamp: number) {
      const elapsed = timestamp - start;
      const opacity = Math.min(elapsed / duration, 1);
      
      element.style.opacity = opacity.toString();
      
      if (opacity < 1) {
        window.requestAnimationFrame(step);
      } else {
        resolve();
      }
    }
    
    window.requestAnimationFrame(step);
  });
}

/**
 * Fade out an element
 */
export function fadeOut(
  element: HTMLElement,
  duration: number = 300
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const startOpacity = parseFloat(window.getComputedStyle(element).opacity) || 1;
    
    function step(timestamp: number) {
      const elapsed = timestamp - start;
      const opacity = Math.max(1 - elapsed / duration, 0);
      
      element.style.opacity = (opacity * startOpacity).toString();
      
      if (opacity > 0) {
        window.requestAnimationFrame(step);
      } else {
        element.style.display = 'none';
        resolve();
      }
    }
    
    window.requestAnimationFrame(step);
  });
}

/**
 * Toggle fade effect on an element
 */
export async function toggleFade(
  element: HTMLElement,
  show?: boolean,
  duration: number = 300,
  display: string = 'block'
): Promise<void> {
  if (show === undefined) {
    show = window.getComputedStyle(element).display === 'none';
  }
  
  if (show) {
    await fadeIn(element, duration, display);
  } else {
    await fadeOut(element, duration);
  }
}
