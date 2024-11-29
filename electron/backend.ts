import Electron, { app, Tray, nativeImage, IpcMainEvent, ipcMain, Menu, MenuItem } from 'electron';
import { Logger, ConsoleEngine } from '@promisepending/logger.js';
import { BaseEventStructure } from './structures/index.js';
import { Window } from './helpers/index.js';
import { events } from './events/index.js';
import { createServer } from 'node:http';
import tcpPortUsed from 'tcp-port-used';
import isDev from 'electron-is-dev';
import serve from 'electron-serve';
import path from 'node:path';
import next from 'next';

export class Backend {
  private readonly isProd: boolean = process.env.NODE_ENV === 'production';
  private mainWindow?: Window;
  private systemTray?: Tray;
  private logger: Logger;
  private port: number;

  public static main(logger?: Logger): Backend {
    return new Backend(logger);
  }

  public constructor(logger?: Logger) {
    this.logger = logger || new Logger({
      prefixes: ['Backend'],
      disableFatalCrash: true,
      allLineColored: true,
    });
    this.logger.registerListener(new ConsoleEngine({ debug: !this.isProd }));

    if (this.isProd) {
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

    const nextApp = (next as unknown as typeof next.default)({
      dev: isDev,
      dir: path.resolve(app.getAppPath(), '..', 'renderer'),
    });
    const requestHandler = nextApp.getRequestHandler();

    // Build the renderer code and watch the files
    await nextApp.prepare();

    this.logger.info('> Starting on http://localhost:' + this.port);
    // Create a new native HTTP server (which supports hot code reloading)
    createServer((request: any, res: any) => {
      requestHandler(request, res);
    }).listen(this.port, () => {
      this.logger.info('> Ready on http://localhost:' + this.port);
      this.mainWindow.loadURL(`/${app.getSystemLocale().replace('-', '_')}/home`);
    });
  }

  private async registerEvents(): Promise<void> {
    for await (const eventClass of events) {
      try {
        this.logger.debug('Registering event ' + eventClass.name);
        const event: BaseEventStructure = new eventClass(this);
        if (event.runOnce()) {
          ipcMain.once(event.getName(), (receivedEvent: IpcMainEvent, ...arguments_: any[]) => event.preExecute(receivedEvent, ...arguments_).catch((error: any) => {
            this.logger.error('An error occurred while executing single-run event ' + event.getName(), error);
          }));
        } else {
          ipcMain.on(event.getName(), (receivedEvent: IpcMainEvent, ...arguments_: any[]) => event.preExecute(receivedEvent, ...arguments_).catch((error: any) => {
            this.logger.error('An error occurred while executing event ' + event.getName(), error);
          }));
        }
      } catch (error) {
        this.logger.error('An error occurred while registering event ' + eventClass.name, error);
      }
    }
  }

  public getLogger(): Logger {
    return this.logger;
  }

  public getMainWindow(): Window | undefined {
    return this.mainWindow;
  }

  public setMainWindow(window: Window): void {
    this.mainWindow = window;
  }

  public isProduction(): boolean {
    return this.isProd;
  }

  public getPort(): number {
    return this.port;
  }
}
