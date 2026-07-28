import { ipcRenderer, contextBridge, IpcRendererEvent } from "electron";
import {
  IPC_CHANNELS,
  BookmarksRequestPayload,
  BookmarksResponsePayload,
  Bookmark,
} from "./shared/ipc";

const appOrigin = import.meta.env.VITE_DOMAIN
  ? new URL(import.meta.env.VITE_DOMAIN).origin
  : undefined;

window.addEventListener("message", (event) => {
  const isFromApp = event.origin === appOrigin;
  const isFromOfflinePage =
    window.location.protocol === "file:" &&
    event.origin === "null" &&
    event.source === window;

  if (!isFromApp && !isFromOfflinePage) return;

  if (event.data?.type === "reload") {
    ipcRenderer.send("reload");
  } else if (event.data?.type === "tray") {
    ipcRenderer.send("tray:set", event.data.value === true);
  }
});

ipcRenderer.on("efbX", (_event, action: "pause" | "resume") => {
  window.postMessage({ type: "efbX", action }, appOrigin ?? "*");
});

contextBridge.exposeInMainWorld("vatsimRadar", {
  getTrayValue: (): Promise<boolean> => ipcRenderer.invoke("tray:get"),

  onBookmarksRequested(callback: () => void): () => void {
    const listener = (_event: IpcRendererEvent) => callback();

    ipcRenderer.on(IPC_CHANNELS.REQUEST_BOOKMARKS, listener);
    // return an unsubscribe function
    return () =>
      ipcRenderer.removeListener(IPC_CHANNELS.REQUEST_BOOKMARKS, listener);
  },

  sendBookmarksResponse(bookmarks: Bookmark[]): void {
    ipcRenderer.send(IPC_CHANNELS.RESPONSE_BOOKMARKS, bookmarks);
  },
});
