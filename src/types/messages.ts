/**
 * Message types used for communication between different parts of the extension
 */

// Message type constants
export const MSG_TYPE_REQUEST_CURRENT_THEME_DATA = 'requestCurrentThemeData' as const;
export const MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE = 'requestDynamicThemeUpdate' as const;
export const MSG_TYPE_SETTINGS_CHANGED = 'settingsChanged' as const;
export const MSG_TYPE_THEME_UPDATE = 'themeUpdate' as const;

// Union type of all possible message types
export type MessageType =
  | typeof MSG_TYPE_REQUEST_CURRENT_THEME_DATA
  | typeof MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE
  | typeof MSG_TYPE_SETTINGS_CHANGED
  | typeof MSG_TYPE_THEME_UPDATE;

// Message handler type
export type MessageHandler = (
  message: { type: MessageType; [key: string]: any },
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => boolean | void;

// Message interfaces
export interface RequestCurrentThemeDataMessage {
  type: typeof MSG_TYPE_REQUEST_CURRENT_THEME_DATA;
}

export interface RequestDynamicThemeUpdateMessage {
  type: typeof MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE;
}

export interface SettingsChangedMessage {
  type: typeof MSG_TYPE_SETTINGS_CHANGED;
  payload: {
    changedKey: string;
    newValue: any;
  };
}

export interface ThemeUpdateMessage {
  type: typeof MSG_TYPE_THEME_UPDATE;
  theme: import('./index').ThemeData;
}

// Union of all message types
export type Message =
  | RequestCurrentThemeDataMessage
  | RequestDynamicThemeUpdateMessage
  | SettingsChangedMessage
  | ThemeUpdateMessage;

// Simplified message creation
export const createMessage = {
  requestThemeData: (): RequestCurrentThemeDataMessage => ({ 
    type: MSG_TYPE_REQUEST_CURRENT_THEME_DATA 
  }),
  requestDynamicThemeUpdate: (): RequestDynamicThemeUpdateMessage => ({ 
    type: MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE 
  }),
  settingsChanged: (changedKey: string, newValue: any): SettingsChangedMessage => ({
    type: MSG_TYPE_SETTINGS_CHANGED,
    payload: { changedKey, newValue }
  }),
  themeUpdate: (theme: import('./index').ThemeData): ThemeUpdateMessage => ({
    type: MSG_TYPE_THEME_UPDATE,
    theme
  })
};

// Simplified type guard
export function isMessageType<T extends Message>(
  message: any,
  type: T['type']
): message is T {
  return message?.type === type;
}

// Message sending utilities
export async function sendMessage<T = any>(
  message: Message
): Promise<T | undefined> {
  return new Promise((resolve) => {
    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          console.error('[MESSAGES] Error:', chrome.runtime.lastError.message);
          resolve(undefined);
        } else {
          resolve(response as T);
        }
      });
    } else {
      console.error('[MESSAGES] chrome.runtime.sendMessage not available');
      resolve(undefined);
    }
  });
}

export function addMessageListener(handler: MessageHandler): void {
  chrome.runtime.onMessage.addListener(handler);
}

export function removeMessageListener(handler: MessageHandler): void {
  chrome.runtime.onMessage.removeListener(handler);
}

// Response utilities
export const createResponse = {
  success: <T = any>(data?: T) => ({ success: true, data }),
  error: (error: string, code?: string) => ({ success: false, error, code })
};

export type Response<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export function isSuccessResponse(response: any): response is { success: true; data: any } {
  return response?.success === true;
}

// Legacy exports for backward compatibility
export const createRequestCurrentThemeDataMessage = createMessage.requestThemeData;
export const createRequestDynamicThemeUpdateMessage = createMessage.requestDynamicThemeUpdate;
export const createSettingsChangedMessage = createMessage.settingsChanged;
export const createThemeUpdateMessage = createMessage.themeUpdate;
