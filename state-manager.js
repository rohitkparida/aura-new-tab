// Simple State Management using Observer Pattern
// Provides centralized state management with change notifications

class StateManager {
    constructor(initialState = {}) {
        this.state = initialState;
        this.subscribers = [];
        
        // Bind methods
        this.getState = this.getState.bind(this);
        this.setState = this.setState.bind(this);
        this.subscribe = this.subscribe.bind(this);
    }
    
    /**
     * Get current state or a specific part of it
     * @param {string} [key] - Optional key to get specific state property
     * @returns {*} The current state or state property
     */
    getState(key) {
        if (key) {
            return this.state[key];
        }
        return this.state;
    }
    
    /**
     * Update the state and notify subscribers
     * @param {Object|Function} update - Object with new state values or function that receives current state
     * @param {boolean} [silent] - If true, don't notify subscribers
     */
    setState(update, silent = false) {
        const prevState = { ...this.state };
        
        // Handle function updates (like React's setState)
        if (typeof update === 'function') {
            this.state = { ...this.state, ...update(this.state) };
        } else {
            this.state = { ...this.state, ...update };
        }
        
        // Notify subscribers if not silent
        if (!silent) {
            this.notify(prevState, this.state);
        }
    }
    
    /**
     * Subscribe to state changes
     * @param {Function} callback - Function to call when state changes
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Subscriber must be a function');
        }
        
        this.subscribers.push(callback);
        
        // Return unsubscribe function
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }
    
    /**
     * Notify all subscribers of state changes
     * @private
     */
    notify(prevState, newState) {
        // Create immutable copies of states
        const prevStateCopy = Object.freeze({ ...prevState });
        const newStateCopy = Object.freeze({ ...newState });
        
        // Notify all subscribers
        this.subscribers.forEach(callback => {
            try {
                callback(prevStateCopy, newStateCopy);
            } catch (error) {
                console.error('Error in state subscriber:', error);
                if (window.errorLogger) {
                    window.errorLogger.logError(error, { context: 'stateManager:notify' });
                }
            }
        });
    }
}

// Create a singleton instance
const stateManager = new StateManager({
    // Initial state
    clockStyle: 'digital',
    timeFormat: '24h',
    showAmPm: false,
    showDate: true,
    showDay: true,
    showGrain: true,
    showMarkers: true,
    smoothMotion: true,
    enableAnimations: true,
    fontStyle: 'default',
    gradientStyle: 'dynamic',
    // Add other default settings here
});

// Export the singleton
window.stateManager = stateManager;
