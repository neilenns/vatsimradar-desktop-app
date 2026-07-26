/**
 * WebSocket message type definitions
 * Use these types for type-safe WebSocket communication
 */

/**
 * Ping message - used to keep connection alive
 */
export interface PingMessage {
    type: 'ping';
}

/**
 * Pong message - response to ping
 */
export interface PongMessage {
    type: 'pong';
    timestamp: string;
}

/**
 * Echo test message
 */
export interface EchoMessage {
    type: 'echo';
    data: string;
}

/**
 * Echo response message
 */
export interface EchoResponseMessage {
    type: 'echo-response';
    data: string;
    timestamp: string;
}

/**
 * Error message
 */
export interface ErrorMessage {
    type: 'error';
    error: string;
    code?: string;
}

/**
 * Union type of all known WebSocket messages
 */
export type KnownWebSocketMessage =
    | PingMessage
    | PongMessage
    | EchoMessage
    | EchoResponseMessage
    | ErrorMessage;
