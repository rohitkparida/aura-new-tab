// Type definitions for Chrome extension development
// Project: Aura Clock Tab
// Definitions by: Aura Clock Team

/// <reference types="chrome" />

declare namespace chrome {
  namespace storage {
    interface StorageArea {
      get(keys: string | string[] | object): Promise<{ [key: string]: any }>;
      set(items: object): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
      clear(): Promise<void>;
      onChanged: {
        addListener: (callback: (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void) => void;
        removeListener: (callback: Function) => void;
      };
      QUOTA_BYTES: number;
    }

    interface StorageChange {
      newValue?: any;
      oldValue?: any;
    }
  }

  namespace runtime {
    interface InstalledDetails {
      id?: string;
      previousVersion?: string;
      reason: 'install' | 'update' | 'chrome_update' | 'shared_module_update';
    }

    interface MessageSender {
      tab?: chrome.tabs.Tab;
      frameId?: number;
      id?: string;
      url?: string;
      tlsChannelId?: string;
      origin?: string;
    }
  }

  namespace tabs {
    interface Tab {
      id?: number;
      index: number;
      windowId: number;
      openerTabId?: number;
      selected: boolean;
      highlighted: boolean;
      active: boolean;
      pinned: boolean;
      url?: string;
      title?: string;
      favIconUrl?: string;
      status?: string;
      incognito: boolean;
      width?: number;
      height?: number;
      sessionId?: string;
    }
  }

  namespace action {
    interface BadgeBackgroundColorDetails {
      color: string | chrome.types.ChromeSetting;
      tabId?: number;
    }

    interface BadgeTextDetails {
      text: string;
      tabId?: number;
    }
  }

  namespace types {
    interface ChromeSetting {
      get(details: { [key: string]: any }, callback: (details: { [key: string]: any }) => void): void;
      set(details: { [key: string]: any }, callback?: () => void): void;
      clear(details: { [key: string]: any }, callback?: () => void): void;
    }
  }

  namespace events {
    interface Event<T extends Function> {
      addListener(callback: T): void;
      removeListener(callback: T): void;
      hasListener(callback: T): boolean;
      hasListeners(): boolean;
    }
  }
}

// Global Chrome type
type Chrome = typeof chrome;
declare const chrome: Chrome;

// Extend the Window interface to include our custom properties
interface Window {
  i18n?: any; // Will be properly typed when we convert i18n.js to TypeScript
  errorLogger?: any; // Will be properly typed when we convert error-logger.js to TypeScript
  chrome?: Chrome;
}
