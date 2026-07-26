import { WebSocketServer, WebSocket } from 'ws';
import { handleWebSocketMessage, WebSocketMessage } from './websocket';

let wsServer: WebSocketServer | undefined;
let connectedClients: Set<WebSocket> = new Set();

const WS_PORT = 8443;

/**
 * Start the WebSocket server
 */
export function startWebSocketServer(): void {
    try {
        wsServer = new WebSocketServer({ port: WS_PORT });

        wsServer.on('connection', (ws: WebSocket) => {
            console.log(`[WebSocket] Client connected. Total clients: ${connectedClients.size + 1}`);
            connectedClients.add(ws);

            ws.on('message', async (data: Buffer) => {
                try {
                    const message: WebSocketMessage = JSON.parse(data.toString());
                    await handleWebSocketMessage(message, ws);
                } catch (error) {
                    console.error('[WebSocket] Error parsing message:', error);
                    ws.send(JSON.stringify({
                        type: 'error',
                        error: 'Invalid message format',
                    }));
                }
            });

            ws.on('close', () => {
                connectedClients.delete(ws);
                console.log(`[WebSocket] Client disconnected. Total clients: ${connectedClients.size}`);
            });

            ws.on('error', (error) => {
                console.error('[WebSocket] Client error:', error);
            });
        });

        wsServer.on('error', (error) => {
            console.error('[WebSocket] Server error:', error);
        });

        console.log(`[WebSocket] Server started on ws://localhost:${WS_PORT}`);
    } catch (error) {
        console.error('[WebSocket] Failed to start server:', error);
    }
}

/**
 * Stop the WebSocket server
 */
export function stopWebSocketServer(): void {
    if (!wsServer) return;

    try {
        // Close all client connections
        for (const client of connectedClients) {
            client.close();
        }
        connectedClients.clear();

        // Close server
        wsServer.close(() => {
            console.log('[WebSocket] Server stopped');
        });
        wsServer = undefined;
    } catch (error) {
        console.error('[WebSocket] Error stopping server:', error);
    }
}

/**
 * Get the set of connected WebSocket clients
 */
export function getConnectedClients(): Set<WebSocket> {
    return new Set(connectedClients);
}

/**
 * Get server status
 */
export function isWebSocketServerRunning(): boolean {
    return wsServer !== undefined;
}

/**
 * Get number of connected clients
 */
export function getConnectedClientCount(): number {
    return connectedClients.size;
}
