import { ClockSettings } from '../types';

// Define interfaces for Battery API
declare global {
    interface Navigator {
        getBattery?(): Promise<BatteryManager>;
    }

    interface BatteryManager extends EventTarget {
        readonly charging: boolean;
        readonly chargingTime: number;
        readonly dischargingTime: number;
        readonly level: number;
        onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
        onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
        ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
        onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;
    }
}

// Constants
const FAVICON_SIZE = 32; // Size of the favicon canvas
const BATTERY_UPDATE_INTERVAL = 60000; // Update battery status every minute

// State
let batteryLevel: number | null = null;
let isCharging = false;
let batteryUpdateInterval: number | null = null;

/**
 * Updates the favicon with the current time and battery status
 */
function updateFavicon(settings: Partial<ClockSettings>): void {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = FAVICON_SIZE;
        canvas.height = FAVICON_SIZE;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, FAVICON_SIZE, FAVICON_SIZE);
        
        // Draw background
        ctx.fillStyle = settings.backgroundColor || '#121212';
        ctx.fillRect(0, 0, FAVICON_SIZE, FAVICON_SIZE);
        
        // Draw time
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeStr = `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}`;
        
        ctx.fillStyle = settings.textColor || '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(timeStr, FAVICON_SIZE / 2, FAVICON_SIZE / 2 - 2);
        
        // Draw battery indicator if available
        if (batteryLevel !== null) {
            const batteryWidth = 20;
            const batteryHeight = 8;
            const batteryX = (FAVICON_SIZE - batteryWidth) / 2;
            const batteryY = FAVICON_SIZE - 6;
            
            // Battery outline
            ctx.strokeStyle = settings.textColor || '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(batteryX, batteryY, batteryWidth, batteryHeight);
            
            // Battery tip
            ctx.fillStyle = settings.textColor || '#ffffff';
            ctx.fillRect(batteryX + batteryWidth, batteryY + 2, 1, batteryHeight - 4);
            
            // Battery level
            if (batteryLevel > 0) {
                ctx.fillStyle = isCharging ? '#4caf50' : 
                                   batteryLevel < 0.2 ? '#f44336' : 
                                   settings.textColor || '#ffffff';
                const fillWidth = Math.max(2, (batteryWidth - 2) * batteryLevel);
                ctx.fillRect(batteryX + 1, batteryY + 1, fillWidth, batteryHeight - 2);
            }
        }
        
        // Update favicon
        const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || 
                    document.createElement('link');
        link.type = 'image/png';
        link.rel = 'icon';
        link.href = canvas.toDataURL('image/png');
        
        const head = document.querySelector('head');
        if (head && !document.querySelector("link[rel*='icon']")) {
            head.appendChild(link);
        }
    } catch (error) {
        console.error('Error updating favicon:', error);
    }
}

/**
 * Updates the battery status and triggers favicon update
 */
async function updateBatteryStatus(settings: Partial<ClockSettings>): Promise<void> {
    try {
        if (!navigator.getBattery) {
            console.debug('Battery Status API not supported');
            return;
        }

        const battery = await navigator.getBattery();
        
        const updateBatteryInfo = () => {
            batteryLevel = battery.level;
            isCharging = battery.charging;
            updateFavicon(settings);
        };
        
        // Set up event listeners
        battery.addEventListener('chargingchange', updateBatteryInfo);
        battery.addEventListener('levelchange', updateBatteryInfo);
        
        // Initial update
        updateBatteryInfo();
        
        // Set up periodic updates
        if (batteryUpdateInterval) {
            clearInterval(batteryUpdateInterval);
        }
        
        batteryUpdateInterval = window.setInterval(() => {
            updateBatteryInfo();
        }, BATTERY_UPDATE_INTERVAL);
        
        return Promise.resolve();
    } catch (error) {
        console.error('Error getting battery status:', error);
        return Promise.reject(error);
    }
}

/**
 * Initializes the favicon management
 */
function setupFavicon(settings: Partial<ClockSettings>): void {
    try {
        // Initial favicon setup
        updateFavicon(settings);
        
        // Set up battery monitoring
        if ('getBattery' in navigator) {
            updateBatteryStatus(settings).catch(error => {
                console.error('Failed to initialize battery monitoring:', error);
            });
        }
        
        // Update favicon every minute
        setInterval(() => updateFavicon(settings), 60000);
    } catch (error) {
        console.error('Error initializing favicon:', error);
    }
}

export { setupFavicon, updateFavicon };
