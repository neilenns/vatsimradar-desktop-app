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
