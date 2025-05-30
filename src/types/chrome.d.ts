// Type definitions for Chrome extension development
// Project: Aura Clock Tab
// Definitions by: Aura Clock Team

/// <reference types="chrome" />

// Extend the existing chrome namespace
declare global {
  // Extend the Window interface
  interface Window {
    i18n?: any; // Will be properly typed when we convert i18n.js to TypeScript
    errorLogger?: any; // Will be properly typed when we convert error-logger.js to TypeScript
  }

  // Extend the Chrome namespace with our custom types
  namespace chrome {
    // Add any Chrome API extensions here if needed
    // For now, we'll use the default Chrome types
  }
}

export {}; // This file is a module
