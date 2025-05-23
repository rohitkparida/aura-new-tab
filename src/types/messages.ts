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

// Helper functions for creating messages
export function createRequestCurrentThemeDataMessage(): RequestCurrentThemeDataMessage {
  return { type: MSG_TYPE_REQUEST_CURRENT_THEME_DATA };
}

export function createRequestDynamicThemeUpdateMessage(): RequestDynamicThemeUpdateMessage {
  return { type: MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE };
}

export function createSettingsChangedMessage(changedKey: string, newValue: any): SettingsChangedMessage {
  return {
    type: MSG_TYPE_SETTINGS_CHANGED,
    payload: {
      changedKey,
      newValue
    }
  };
}

export function createThemeUpdateMessage(theme: import('./index').ThemeData): ThemeUpdateMessage {
  return {
    type: MSG_TYPE_THEME_UPDATE,
    theme
  };
}

// Type guard functions
export function isRequestCurrentThemeDataMessage(
  message: any
): message is RequestCurrentThemeDataMessage {
  return message?.type === MSG_TYPE_REQUEST_CURRENT_THEME_DATA;
}

export function isRequestDynamicThemeUpdateMessage(
  message: any
): message is RequestDynamicThemeUpdateMessage {
  return message?.type === MSG_TYPE_REQUEST_DYNAMIC_THEME_UPDATE;
}

export function isSettingsChangedMessage(
  message: any
): message is SettingsChangedMessage {
  return (
    message?.type === MSG_TYPE_SETTINGS_CHANGED &&
    typeof message.payload === 'object' &&
    message.payload !== null &&
    'changedKey' in message.payload &&
    'newValue' in message.payload
  );
}

export function isThemeUpdateMessage(
  message: any
): message is ThemeUpdateMessage {
  return message?.type === MSG_TYPE_THEME_UPDATE && 'theme' in message;
}

// Message sending utilities
export async function sendMessage<T = any>(
  message: Message
): Promise<T | undefined> {
  return new Promise((resolve) => {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(message, (response) => {
        console.log('[MESSAGES] sendMessage: Raw response received from chrome.runtime.sendMessage:', JSON.stringify(response));
        if (chrome.runtime.lastError) {
          console.error('[MESSAGES] sendMessage: Error sending message:', chrome.runtime.lastError.message);
          resolve(undefined);
        } else {
          resolve(response as T);
        }
      });
    } else {
      console.error('[MESSAGES] sendMessage: chrome.runtime.sendMessage is not available.');
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

// Message response utilities
export function createSuccessResponse<T = any>(data?: T) {
  return { success: true, data };
}

export function createErrorResponse(error: string, code?: string) {
  return { success: false, error, code };
}

export type SuccessResponse<T = any> = {
  success: true;
  data: T;
};

export type ErrorResponse = {
  success: false;
  error: string;
  code?: string;
};

export type Response<T = any> = SuccessResponse<T> | ErrorResponse;

// Type guard for response
export function isSuccessResponse(response: any): response is SuccessResponse {
  return response?.success === true;
}

export function isErrorResponse(response: any): response is ErrorResponse {
  return response?.success === false && 'error' in response;
}
