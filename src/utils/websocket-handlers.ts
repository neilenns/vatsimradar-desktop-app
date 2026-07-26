/**
 * Built-in WebSocket message handlers
 * Extend this file to add new handlers or integrate with existing app functionality
 */

import { registerWebSocketHandler } from "./websocket";
import type { WebSocketMessage } from "./websocket";
import { EchoResponse, GetBookmarksResponse } from "./websocket-types";

/**
 * Initialize built-in WebSocket handlers
 */
export function initializeWebSocketHandlers(): void {
  // Example: Echo handler for testing
  registerWebSocketHandler(
    "echo",
    async (message: WebSocketMessage, client) => {
      console.log("[WebSocket] Received echo message:", message.data);
      const response = {
        type: "echo-response",
        data: message.data,
        timestamp: new Date().toISOString(),
      } as EchoResponse;
      client.send(JSON.stringify(response));
    },
  );

  registerWebSocketHandler(
    "get-bookmarks",
    async (message: WebSocketMessage, client) => {
      console.log("[WebSocket] Received get-bookmarks message");
      const response = {
        type: "get-bookmarks-response",
        data: ["hi", "hello", "test"],
        timestamp: new Date().toISOString(),
      } as GetBookmarksResponse;
      client.send(JSON.stringify(response));
    },
  );

  console.log("[WebSocket] Built-in handlers initialized");
}
