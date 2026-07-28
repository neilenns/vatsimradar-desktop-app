export interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: number;
}

export const IPC_CHANNELS = {
  REQUEST_BOOKMARKS: "bookmarks:request",
  RESPONSE_BOOKMARKS: "bookmarks:response",
} as const;

export interface BookmarksRequestMessage {
  type: "bookmarks:request";
}

export interface BookmarksResponseMessage {
  type: "bookmarks:response";
  bookmarks: Bookmark[];
}
