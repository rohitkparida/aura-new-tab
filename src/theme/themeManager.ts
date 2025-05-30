/**
 * Theme management for Aura Clock Tab
 * Handles applying themes, updating theme-related styles, and managing theme transitions
 */

import { ThemeData, ThemeName } from '../types';

/**
 * Applies the specified theme to the application
 * @param themeData - The theme data to apply
 * @param effectiveThemeName - The name of the theme being applied (e.g., 'light', 'dark', 'dynamic')
 * @returns {void}
 * @throws {Error} If theme application fails critically
 */
export function applyTheme(themeData: ThemeData, effectiveThemeName: ThemeName): void {
    const logPrefix = '[AuraClock] Theme Application:';
    
    // Input validation
    if (!document.body) {
        console.error(`${logPrefix} Cannot apply theme, document.body is not available`);
        return;
    }
    
    if (!themeData || !effectiveThemeName) {
        console.warn(`${logPrefix} Invalid theme data or missing effective theme name`, { 
            themeData, 
            effectiveThemeName 
        });
        applyFallbackTheme();
        return;
    }

    try {
        // Log theme application attempt
        console.log(`${logPrefix} Applying theme '${effectiveThemeName}'`, {
            hasTextColor: !!themeData.textColor,
            hasBackgroundColor: !!themeData.backgroundColor,
            hasGradient: !!(themeData.gradientColors && themeData.gradientAngle)
        });

        // Batch DOM updates using requestAnimationFrame
        requestAnimationFrame(() => {
            try {
                // 1. Set up basic visibility and ready state
                document.body.classList.add('ready');
                document.body.style.opacity = '1'; // Using string '1' for consistency with OPACITY_VISIBLE

                // 2. Update theme classes
                updateThemeClasses(effectiveThemeName);

                // 3. Handle theme background elements
                const themeBackgroundUpdated = updateThemeBackground(effectiveThemeName);

                // 4. Apply theme colors and styles
                applyThemeStyles(themeData, themeBackgroundUpdated);
                
                console.log(`${logPrefix} Theme '${effectiveThemeName}' applied successfully`);
            } catch (error) {
                console.error(`${logPrefix} Error during theme application:`, error);
                applyFallbackTheme();
            }
        });
    } catch (error) {
        console.error(`${logPrefix} Critical error in theme application:`, error);
        applyFallbackTheme();
    }
}

/**
 * Updates the theme-related classes on the document body
 * @param effectiveThemeName - The name of the theme to apply
 */
export function updateThemeClasses(effectiveThemeName: string): void {
    // Remove any existing theme-* classes
    const themeClasses = Array.from(document.body.classList)
        .filter(cls => cls.startsWith('theme-'));
    document.body.classList.remove(...themeClasses);
    
    // Add the new theme class
    document.body.classList.add(`theme-${effectiveThemeName}`);
}

/**
 * Updates the theme background elements
 * @param effectiveThemeName - The name of the theme being applied
 * @returns {boolean} Whether a specific theme background was activated
 */
export function updateThemeBackground(effectiveThemeName: string): boolean {
    let themeBackgroundUpdated = false;
    const themeBackgrounds = document.querySelectorAll('.theme-background');
    
    console.log(`[AuraClock] updateThemeBackground: Looking for theme '${effectiveThemeName}'`);
    console.log(`[AuraClock] Found ${themeBackgrounds.length} theme background elements`);
    
    // Process all theme backgrounds
    themeBackgrounds.forEach((bg, index) => {
        // Only update classes if they actually need to change
        const isActive = bg.classList.contains('active');
        const needsTransition = !bg.classList.contains('transitions-enabled');
        
        console.log(`[AuraClock] Background ${index}: classes=${bg.className}, isActive=${isActive}`);
        
        if (isActive) {
            bg.classList.remove('active');
        }
        if (needsTransition) {
            bg.classList.add('transitions-enabled');
        }
    });
    
    // Activate the new theme background if it exists
    const newThemeBackground = document.querySelector(`.theme-background.${effectiveThemeName}`);
    console.log(`[AuraClock] Looking for selector: .theme-background.${effectiveThemeName}`);
    console.log(`[AuraClock] Found theme background element:`, newThemeBackground);
    
    if (newThemeBackground) {
        console.log(`[AuraClock] Activating theme background for '${effectiveThemeName}'`);
        // Use double requestAnimationFrame to ensure proper transition
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                newThemeBackground.classList.add('active');
                console.log(`[AuraClock] Added 'active' class to ${effectiveThemeName} background`);
            });
        });
        themeBackgroundUpdated = true;
    } else {
        console.warn(`[AuraClock] No theme background element found for '${effectiveThemeName}'`);
        // List all available theme backgrounds for debugging
        const availableThemes = Array.from(themeBackgrounds).map(bg => {
            const classes = Array.from(bg.classList);
            return classes.find(cls => cls !== 'theme-background' && cls !== 'active' && cls !== 'transitions-enabled') || 'unknown';
        });
        console.log(`[AuraClock] Available theme backgrounds: [${availableThemes.join(', ')}]`);
    }
    
    return themeBackgroundUpdated;
}

/**
 * Applies theme-specific styles
 * @param themeData - The theme data to apply
 * @param themeBackgroundUpdated - Whether a theme background was activated
 */
export function applyThemeStyles(themeData: ThemeData, themeBackgroundUpdated: boolean): void {
    // Apply text color if provided
    if (themeData.textColor) {
        document.documentElement.style.setProperty('--text-color', themeData.textColor);
    }
    
    // Handle background based on whether a theme background was activated
    if (!themeBackgroundUpdated && themeData.backgroundColor) {
        // Fallback to solid background color if no specific theme background
        document.documentElement.style.setProperty('--background-color', themeData.backgroundColor);
        document.body.style.backgroundImage = '';
    } else if (themeBackgroundUpdated) {
        // Clear any direct background styles when using theme background
        document.documentElement.style.removeProperty('--background-color');
        document.body.style.backgroundColor = 'transparent';
        document.body.style.backgroundImage = '';
    }
    
    // Apply gradient background if specified and no theme background was activated
    if (!themeBackgroundUpdated && themeData.gradientColors && themeData.gradientAngle !== undefined) {
        const gradient = `linear-gradient(${themeData.gradientAngle}deg, ${themeData.gradientColors.join(', ')})`;
        document.body.style.backgroundImage = gradient;
    }
}

/**
 * Applies a fallback theme when theme application fails
 */
export function applyFallbackTheme(): void {
    console.log('[AuraClock] Applying fallback theme');
    
    // Set a basic theme that should be readable in most cases
    document.documentElement.style.setProperty('--text-color', '#ffffff');
    document.documentElement.style.setProperty('--background-color', '#1a1a1a');
    
    // Ensure the body is visible
    document.body.style.opacity = '1';
    
    // Add a class to indicate fallback mode
    document.body.classList.add('theme-fallback');
}
