import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import path from 'node:path';
import fs from 'node:fs';

const handler = {
  send(channel: string, value: unknown): void {
    ipcRenderer.send(channel, value);
  },

  on(channel: string, callback: (...arguments_: unknown[]) => void): () => void {
    const subscription = (_event: IpcRendererEvent, ...arguments_: unknown[]): void => {
      callback(arguments_);
    };
    ipcRenderer.on(channel, subscription);

    return (): void => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  once(channel: string, callback: (...arguments_: unknown[]) => void): () => void {
    const subscription = (_event: IpcRendererEvent, ...arguments_: unknown[]): void => {
      callback(arguments_);
    };
    ipcRenderer.once(channel, subscription);

    return (): void => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  removeEventListener(channel: string, callback: (...arguments_: unknown[]) => void): void {
    ipcRenderer.removeListener(channel, callback);
  },

  removeAllListeners(channel: string): void {
    ipcRenderer.removeAllListeners(channel);
  },
};

contextBridge.exposeInMainWorld('ipc', handler);
contextBridge.exposeInMainWorld('path', path);
contextBridge.exposeInMainWorld('fs', fs);

export type IpcHandler = typeof handler;
