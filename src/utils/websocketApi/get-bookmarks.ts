import { ipcMain, IpcMainEvent } from "electron";
import { getMainWindow } from "src/app";
import { IPC_CHANNELS, Bookmark } from "src/shared/ipc";
import type { WebSocketMessage } from "./websocket";

const DEFAULT_TIMEOUT_MS = 5000;

export async function handleGetBookmarks(
  message: WebSocketMessage,
  client: WebSocket,
): Promise<void> {
  console.log("[WebSocket] Received get-bookmarks message");

  const timeout = setTimeout(() => {
    ipcMain.removeListener(IPC_CHANNELS.RESPONSE_BOOKMARKS, onResponse);
    console.error(
      "[WebSocket] Timeout waiting for bookmarks response from main process",
    );
  }, DEFAULT_TIMEOUT_MS);

  function onResponse(_event: IpcMainEvent, bookmarks: Bookmark[]): void {
    clearTimeout(timeout);
    ipcMain.removeListener(IPC_CHANNELS.RESPONSE_BOOKMARKS, onResponse);
    console.log("[WebSocket] Received bookmarks from main process:", bookmarks);
  }

  console.log("[WebSocket] Sending IPC message");
  getMainWindow().webContents.send(IPC_CHANNELS.REQUEST_BOOKMARKS);
}
