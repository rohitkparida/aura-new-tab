/**
 * UI Manager for Aura Clock Tab
 * Handles UI components and interactions
 */

import settingsManager from './settings-manager.js';
import animationManager from './animation-manager.js';

export class UIManager {
    constructor() {
        this.components = new Map();
        this.modals = new Map();
        this.tooltips = [];
        
        // Bind methods
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleEscapeKey = this.handleEscapeKey.bind(this);
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    /**
     * Initialize event listeners
     * @private
     */
    initEventListeners() {
        // Handle clicks outside of modals
        document.addEventListener('click', this.handleClickOutside);
        
        // Handle escape key to close modals
        document.addEventListener('keydown', this.handleEscapeKey);
    }
    
    /**
     * Register a UI component
     * @param {string} id - Component ID
     * @param {Object} component - Component instance
     */
    registerComponent(id, component) {
        if (!id || !component) return;
        this.components.set(id, component);
    }
    
    /**
     * Unregister a UI component
     * @param {string} id - Component ID
     */
    unregisterComponent(id) {
        this.components.delete(id);
    }
    
    /**
     * Show a modal dialog
     * @param {string} id - Modal ID
     * @param {Object} [options] - Modal options
     */
    showModal(id, options = {}) {
        const modal = document.getElementById(id);
        if (!modal) {
            console.warn(`Modal with ID '${id}' not found`);
            return;
        }
        
        // Close any open modals
        this.closeAllModals();
        
        // Store modal reference
        this.modals.set(id, { element: modal, options });
        
        // Show the modal
        document.body.classList.add('modal-open');
        modal.style.display = 'block';
        
        // Focus the first focusable element
        this.focusFirstFocusable(modal);
        
        // Animate in
        animationManager.fadeIn(modal, 200);
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('modalOpened', { detail: { id } }));
    }
    
    /**
     * Close a modal dialog
     * @param {string} id - Modal ID
     */
    closeModal(id) {
        const modal = this.modals.get(id);
        if (!modal) return;
        
        // Animate out
        animationManager.fadeOut(modal.element, 200, () => {
            modal.element.style.display = 'none';
            
            // Remove from active modals
            this.modals.delete(id);
            
            // Update body class if no more modals
            if (this.modals.size === 0) {
                document.body.classList.remove('modal-open');
            }
            
            // Dispatch event
            document.dispatchEvent(new CustomEvent('modalClosed', { detail: { id } }));
        });
    }
    
    /**
     * Close all open modals
     */
    closeAllModals() {
        this.modals.forEach((_, id) => this.closeModal(id));
    }
    
    /**
     * Show a tooltip
     * @param {HTMLElement} element - Element to show tooltip for
     * @param {string} text - Tooltip text
     * @param {Object} [options] - Tooltip options
     */
    showTooltip(element, text, options = {}) {
        if (!element || !text) return;
        
        const {
            position = 'top',
            delay = 300,
            maxWidth = '200px',
            className = ''
        } = options;
        
        // Remove any existing tooltips for this element
        this.hideTooltip(element);
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = `tooltip ${className}`;
        tooltip.setAttribute('role', 'tooltip');
        tooltip.textContent = text;
        tooltip.style.maxWidth = maxWidth;
        
        // Position the tooltip
        element.style.position = 'relative';
        element.appendChild(tooltip);
        
        // Position the tooltip
        this.positionTooltip(element, tooltip, position);
        
        // Show the tooltip
        setTimeout(() => {
            tooltip.classList.add('show');
        }, delay);
        
        // Store reference
        this.tooltips.push({ element, tooltip });
    }
    
    /**
     * Hide a tooltip
     * @param {HTMLElement} element - Element with tooltip
     */
    hideTooltip(element) {
        const index = this.tooltips.findIndex(t => t.element === element);
        if (index === -1) return;
        
        const { tooltip } = this.tooltips[index];
        tooltip.remove();
        this.tooltips.splice(index, 1);
    }
    
    /**
     * Position a tooltip relative to its element
     * @private
     */
    positionTooltip(element, tooltip, position) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let top, left;
        
        switch (position) {
            case 'top':
                top = rect.top - tooltipRect.height - 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = rect.bottom + 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.left - tooltipRect.width - 8;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.right + 8;
                break;
            default:
                top = rect.top - tooltipRect.height - 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
        }
        
        tooltip.style.top = `${Math.max(0, top)}px`;
        tooltip.style.left = `${Math.max(0, left)}px`;
    }
    
    /**
     * Focus the first focusable element in a container
     * @private
     */
    focusFirstFocusable(container) {
        const focusable = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusable.length > 0) {
            focusable[0].focus();
        }
    }
    
    /**
     * Handle clicks outside of modals
     * @private
     */
    handleClickOutside(event) {
        // Close tooltips on outside click
        if (this.tooltips.length > 0) {
            const clickedOnTooltip = this.tooltips.some(({ tooltip }) => 
                tooltip === event.target || tooltip.contains(event.target)
            );
            
            if (!clickedOnTooltip) {
                this.tooltips.forEach(({ tooltip }) => tooltip.remove());
                this.tooltips = [];
            }
        }
        
        // Close modals on outside click
        this.modals.forEach(({ element }, id) => {
            if (event.target === element) {
                this.closeModal(id);
            }
        });
    }
    
    /**
     * Handle escape key press
     * @private
     */
    handleEscapeKey(event) {
        if (event.key === 'Escape' || event.key === 'Esc') {
            // Close the topmost modal
            const topModalId = Array.from(this.modals.keys()).pop();
            if (topModalId) {
                this.closeModal(topModalId);
                event.preventDefault();
            }
        }
    }
}

// Export a singleton instance
const uiManager = new UIManager();

export default uiManager;
