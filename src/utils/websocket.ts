import type { BrowserWindow } from 'electron';

/**
 * Represents a WebSocket message that external apps can send
 */
export interface WebSocketMessage {
    type: string;
    [key: string]: any;
}

/**
 * Represents a WebSocket message handler
 */
export type WebSocketMessageHandler = (message: WebSocketMessage, client: WebSocket) => Promise<void> | void;

/**
 * WebSocket message handlers registry
 */
const messageHandlers = new Map<string, WebSocketMessageHandler>();

/**
 * Register a handler for a specific message type
 */
export function registerWebSocketHandler(type: string, handler: WebSocketMessageHandler): void {
    messageHandlers.set(type, handler);
}

/**
 * Unregister a handler for a specific message type
 */
export function unregisterWebSocketHandler(type: string): void {
    messageHandlers.delete(type);
}

/**
 * Get all registered handlers
 */
export function getWebSocketHandlers(): Map<string, WebSocketMessageHandler> {
    return new Map(messageHandlers);
}

/**
 * Handle incoming WebSocket message
 */
export async function handleWebSocketMessage(message: WebSocketMessage, client: WebSocket): Promise<void> {
    const { type } = message;

    if (!type) {
        console.warn('[WebSocket] Received message without type');
        return;
    }

    const handler = messageHandlers.get(type);

    if (!handler) {
        console.warn(`[WebSocket] No handler registered for message type: ${type}`);
        return;
    }

    try {
        await handler(message, client);
    } catch (error) {
        console.error(`[WebSocket] Error handling message type '${type}':`, error);
    }
}

/**
 * Send a message to a WebSocket client
 */
export function sendWebSocketMessage(client: WebSocket, message: WebSocketMessage): void {
    try {
        client.send(JSON.stringify(message));
    } catch (error) {
        console.error('[WebSocket] Error sending message:', error);
    }
}

/**
 * Broadcast a message to all connected WebSocket clients
 */
export function broadcastWebSocketMessage(message: WebSocketMessage, clients: Set<WebSocket>): void {
    const messageStr = JSON.stringify(message);
    for (const client of clients) {
        try {
            client.send(messageStr);
        } catch (error) {
            console.error('[WebSocket] Error broadcasting message:', error);
        }
    }
}
