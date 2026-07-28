import { ipcRenderer, contextBridge, IpcRendererEvent } from "electron";
import {
  IPC_CHANNELS,
  Bookmark,
  BookmarksRequestMessage,
  BookmarksResponseMessage,
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
  } else if (event.data?.type === "bookmarks:response") {
    const message: BookmarksResponseMessage = {
      type: "bookmarks:response",
      bookmarks: event.data.bookmarks as Bookmark[],
    };
    ipcRenderer.send(IPC_CHANNELS.RESPONSE_BOOKMARKS, message);
  }
});

ipcRenderer.on("efbX", (_event, action: "pause" | "resume") => {
  console.log(`[Preload] Received ${action} action from main process`);
  window.postMessage({ type: "efbX", action }, appOrigin ?? "*");
});

ipcRenderer.on(IPC_CHANNELS.REQUEST_BOOKMARKS, (_event: IpcRendererEvent) => {
  console.log("[Preload] Received request for bookmarks from main process");
  const msg: BookmarksRequestMessage = { type: "bookmarks:request" };
  window.postMessage(msg, appOrigin ?? "*");
});

contextBridge.exposeInMainWorld("vatsimRadar", {
  getTrayValue: (): Promise<boolean> => ipcRenderer.invoke("tray:get"),
});
