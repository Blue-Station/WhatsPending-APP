import Electron, { app, Tray, nativeImage, IpcMainEvent, ipcMain, Menu, MenuItem } from 'electron';
import { BaseEventStructure } from './structures/index.js';
import { Window } from './helpers/index.js';
import { events } from './events/index.js';
import isDev from 'electron-is-dev';
import serve from 'electron-serve';
import { getWindowSettings } from './helpers/WindowDecorationHelper.js';
import { IWindowFrameSettings } from './helpers/interfaces/IWindowDecorationHelpers.js';

export class Backend {
  private mainWindow?: Window;
  private systemTray?: Tray;
  private _windowSettings: IWindowFrameSettings;

  public get windowSettings(): IWindowFrameSettings { return this._windowSettings; }
  

  public static main(): Backend {
    return new Backend();
  }

  constructor() {
    if (!isDev) {
      serve({ directory: 'app' });
    } else {
      app.setPath('userData', `${app.getPath('userData')} (development)`);
    }

    app.on('window-all-closed', () => {
      app.quit();
    });

    app.once('ready', async () => {
      await this.registerEvents();
      await this.start();
    });
  }

  private async start(): Promise<void> {
    this._windowSettings = await getWindowSettings();
    const icon = nativeImage.createFromPath('resources/icon.png');
    this.systemTray = new Tray(icon);
    this.systemTray.setTitle('WhatsPending');
    this.systemTray.setToolTip('WhatsPending');

    const trayMenu = new Menu();
    const trayMenuItem1 = new MenuItem({
      label: 'Close',
      type: 'normal',
      click: (): void => {
        process.exit(0);
      },
    });
    trayMenu.append(trayMenuItem1);

    this.systemTray.addListener('click', () => {
      this.mainWindow.windowInstance.show();
    });

    this.systemTray.setContextMenu(trayMenu);

    this.mainWindow = new Window(this, 'controller', {
      width: 800,
      height: 600,
      frame: !this.windowSettings.canUseCustomFrame,
      titleBarOverlay: false,
      titleBarStyle: this.windowSettings.canUseCustomFrame ? 'hidden' : 'default',
      minWidth: 800,
      minHeight: 600,
    });

    this.mainWindow.windowInstance.removeMenu();

    this.mainWindow.windowInstance.on('close', (event: Electron.Event) => {
      event.preventDefault();
      this.mainWindow.windowInstance.hide();
    });

    this.mainWindow.loadURL(isDev ? 'http://localhost:4200' : 'TODO: FIXME: Builded html path here!');
  }

  private async registerEvents(): Promise<void> {
    for await (const eventClass of events) {
      try {
        console.log('Registering event ' + eventClass.name);
        const event: BaseEventStructure = new eventClass(this);
        if (event.runOnce()) {
          ipcMain.once(event.getName(), (receivedEvent: IpcMainEvent, ...arguments_: any[]) => 
            event.preExecute(receivedEvent, ...arguments_).catch((error: any) => {
              console.error(`An error occurred while executing single-run event ${event.getName()}`, error);
            }));
        } else {
          ipcMain.on(event.getName(), (receivedEvent: IpcMainEvent, ...arguments_: any[]) => 
            event.preExecute(receivedEvent, ...arguments_).catch((error: any) => {
              console.error(`An error occurred while executing event ${event.getName()}`, error);
            }));
        }
      } catch (error) {
        console.error(`An error occurred while registering event ${eventClass.name}`, error);
      }
    }
  }

  public getMainWindow(): Window | undefined {
    return this.mainWindow;
  }

  public setMainWindow(window: Window): void {
    this.mainWindow = window;
  }

  public isProduction(): boolean {
    return !isDev;
  }

  public getApp(): Electron.App {
    return app;
  }
}

Backend.main();
