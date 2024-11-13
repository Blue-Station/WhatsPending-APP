import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import path from 'node:path';
import fs from 'node:fs';

let Store;

// eslint-disable-next-line unicorn/prefer-top-level-await
(async (): Promise<void> => {
  Store = await import('electron-store');
})();

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

const store = {
  createStore(options: any): {
    get: (key: string) => unknown;
    set: (key: string, value: unknown) => void;
    delete: (key: string) => void;
    clear: () => void;
  } {
    const createdStore = new Store.default(options) as any;

    return {
      get: (key: string): unknown => { return createdStore.get(key); },
      set: (key: string, value: unknown) => createdStore.set(key, value),
      delete: (key: string) => createdStore.delete(key),
      clear: () => createdStore.clear(),
    };
  },
};

contextBridge.exposeInMainWorld('store', store);
contextBridge.exposeInMainWorld('ipc', handler);
contextBridge.exposeInMainWorld('path', path);
contextBridge.exposeInMainWorld('fs', fs);

export type IpcHandler = typeof handler
export type BackendStore = typeof store
