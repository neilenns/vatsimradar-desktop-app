/**
 * Built-in WebSocket message handlers
 * Extend this file to add new handlers or integrate with existing app functionality
 */

import { registerWebSocketHandler } from './websocket';
import type { WebSocketMessage } from './websocket';

/**
 * Initialize built-in WebSocket handlers
 */
export function initializeWebSocketHandlers(): void {
    // Example: Test/ping handler
    registerWebSocketHandler('ping', async (message: WebSocketMessage) => {
        console.log('[WebSocket] Received ping from client');
    });

    // Example: Echo handler for testing
    registerWebSocketHandler('echo', async (message: WebSocketMessage, client) => {
        console.log('[WebSocket] Echo message:', message.data);
        client.send(JSON.stringify({
            type: 'echo-response',
            data: message.data,
            timestamp: new Date().toISOString(),
        }));
    });

    console.log('[WebSocket] Built-in handlers initialized');
}

/**
 * Example handler for future Discord presence updates via WebSocket
 * Uncomment and implement when needed
 */
/*
export function registerDiscordPresenceHandler(): void {
    registerWebSocketHandler('set-discord-presence', async (message: WebSocketMessage) => {
        // Implement Discord presence handling
        const { details, state, pilotCallsign, atcCallsign } = message;
        // Forward to existing Discord RPC functionality
    });
}
*/
