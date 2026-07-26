/**
 * WebSocket message type definitions
 * Use these types for type-safe WebSocket communication
 */

export interface GetBookmarksMessage {
  type: "get-bookmarks";
}

export interface GetBookmarksResponse {
  type: "get-bookmarks-response";
  data: string[];
  timestamp: string;
}
/**
 * Echo test message
 */
export interface EchoMessage {
  type: "echo";
  data: string;
}

/**
 * Echo response message
 */
export interface EchoResponse {
  type: "echo-response";
  data: string;
  timestamp: string;
}
