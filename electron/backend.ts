import Electron, { app, Tray, nativeImage, IpcMainEvent, ipcMain, Menu, MenuItem } from 'electron';
import { BaseEventStructure } from './structures/index.js';
import { Window } from './helpers/index.js';
import { events } from './events/index.js';
import { createServer } from 'node:http';
import isDev from 'electron-is-dev';
import serve from 'electron-serve';
import path from 'node:path';
import next from 'next';
import tcpPortUsed from 'tcp-port-used';

export class Backend {
  private mainWindow?: Window;
  private systemTray?: Tray;
  private port: number;

  public static main(): Backend {
    return new Backend();
  }

  public constructor() {
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
      // frame: false,
      minWidth: 800,
      minHeight: 600,
    });

    this.mainWindow.windowInstance.removeMenu();

    this.mainWindow.windowInstance.on('close', (event: Electron.Event) => {
      event.preventDefault();
      this.mainWindow.windowInstance.hide();
    });

    this.port = Number(process.env.SMP_PORT) || Math.floor(Math.random() * (65535 - 49152) + 49152);
    
    let isPortValid = await tcpPortUsed.check(this.port).catch(() => false);

    while (isPortValid) {
      this.port = Math.floor(Math.random() * (65535 - 49152) + 49152);
      isPortValid = await tcpPortUsed.check(this.port).catch(() => false);
    }

    console.log('Next App path:', app.getAppPath());

    const nextApp = (next as unknown as typeof next.default)({
      dev: isDev,
      dir: isDev ? path.resolve(app.getAppPath(), '..', 'renderer') : path.resolve(app.getAppPath(), '..', 'app.asar.unpacked', 'renderer'),
    });
    const requestHandler = nextApp.getRequestHandler();

    // Build the renderer code and watch the files
    await nextApp.prepare();

    console.log('> Starting on http://localhost:' + this.port);
    // Create a new native HTTP server (which supports hot code reloading)
    createServer((request: any, res: any) => {
      requestHandler(request, res);
    }).listen(this.port, () => {
      console.log('> Ready on http://localhost:' + this.port);
      this.mainWindow.loadURL(`/${app.getSystemLocale()}/home`);
    });
  }

  private async registerEvents(): Promise<void> {
    for await (const eventClass of events) {
      try {
        console.log('Registering event ' + eventClass.name);
        const event: BaseEventStructure = new eventClass(this);
        if (event.runOnce()) {
          ipcMain.once(event.getName(), (receivedEvent: IpcMainEvent, ...arguments_: any[]) => event.preExecute(receivedEvent, ...arguments_).catch((error: any) => {
            console.error('An error occurred while executing single-run event ' + event.getName(), error);
          }));
        } else {
          ipcMain.on(event.getName(), (receivedEvent: IpcMainEvent, ...arguments_: any[]) => event.preExecute(receivedEvent, ...arguments_).catch((error: any) => {
            console.error('An error occurred while executing event ' + event.getName(), error);
          }));
        }
      } catch (error) {
        console.error('An error occurred while registering event ' + eventClass.name, error);
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

  public getPort(): number {
    return this.port;
  }
}

Backend.main();
