import { WebSocketServer, WebSocket as WsWebSocket } from "ws";
import {
  handleWebSocketMessage,
  registerWebSocketHandler,
  WebSocketMessage,
} from "./websocket";
import { handleGetBookmarks } from "./get-bookmarks";

let wsServer: WebSocketServer | undefined;
let connectedClients: Set<WsWebSocket> = new Set();

function initializeWebSocketHandlers() {
  registerWebSocketHandler("get-bookmarks", handleGetBookmarks);
}

/**
 * Start the WebSocket server
 */
export function startWebSocketServer() {
  try {
    initializeWebSocketHandlers();

    wsServer = new WebSocketServer({
      port: 8443,
    });

    wsServer.on("connection", (ws: WsWebSocket) => {
      console.log(
        `[WebSocket] Client connected. Total clients: ${connectedClients.size + 1}`,
      );
      connectedClients.add(ws);

      ws.on("message", async (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          await handleWebSocketMessage(message, ws as any);
        } catch (error) {
          console.error("[WebSocket] Error parsing message:", error);
          ws.send(
            JSON.stringify({
              type: "error",
              error: "Invalid message format",
            }),
          );
        }
      });

      ws.on("close", () => {
        connectedClients.delete(ws);
        console.log(
          `[WebSocket] Client disconnected. Total clients: ${connectedClients.size}`,
        );
      });

      ws.on("error", (error) => {
        console.error("[WebSocket] Client error:", error);
      });
    });

    wsServer.on("error", (error) => {
      console.error("[WebSocket] Server error:", error);
    });

    console.log(`[WebSocket] Server started on ws://localhost:8443`);
  } catch (error) {
    console.error("[WebSocket] Failed to start server:", error);
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
      console.log("[WebSocket] Server stopped");
    });
    wsServer = undefined;
  } catch (error) {
    console.error("[WebSocket] Error stopping server:", error);
  }
}

/**
 * Get number of connected clients
 */
export function getConnectedClientCount(): number {
  return connectedClients.size;
}
