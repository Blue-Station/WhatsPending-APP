import Electron, { app, Tray, nativeImage, IpcMainEvent, ipcMain } from 'electron';
import { NextUrlWithParsedQuery } from 'next/dist/server/request-meta.js';
import { Logger, ConsoleEngine } from '@promisepending/logger.js';
import { BaseEventStructure } from './structures/index.js';
import isDev from 'electron-is-dev';
import { createServer } from 'node:http';
import { Window } from './helpers/index.js';
import serve from 'electron-serve';
import { events } from './events/index.js';
import { parse } from 'node:url';
import next from 'next';
import path from 'node:path';

export class Backend {
  private readonly isProd: boolean = process.env.NODE_ENV === 'production';
  private mainWindow?: Window;
  private systemTray?: Tray;
  private logger: Logger;

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

    this.mainWindow = new Window(this, 'controller', {
      width: 800,
      height: 600,
      frame: false,
      minWidth: 800,
      minHeight: 600,
    });

    this.mainWindow.windowInstance.removeMenu();

    this.mainWindow.windowInstance.on('close', (event: Electron.Event) => {
      event.preventDefault();
      // Ask user if he really wants to close the application
      this.mainWindow!.windowInstance.webContents.send('app.stop.ask');
      this.logger.debug('Main window close event received');
    });

    this.mainWindow.windowInstance.once('closed', () => {
      process.exit(0);
    });

    console.log(app.getAppPath());
    // @ts-expect-error
    const nextApp = next({
      dev: isDev,
      dir: path.resolve(app.getAppPath(), '..', 'renderer'),
    });
    const requestHandler = nextApp.getRequestHandler();

    // Build the renderer code and watch the files
    await nextApp.prepare();

    this.logger.info('> Starting on http://localhost:' + (process.env.SMP_PORT || 3000));
    // Create a new native HTTP server (which supports hot code reloading)
    createServer((request: any, res: any) => {
      console.log(request);
      const parsedUrl = parse(request.url);
      requestHandler(request, res, parsedUrl);
    }).listen(process.env.SMP_PORT || 3000, () => {
      this.logger.info('> Ready on http://localhost:' + (process.env.SMP_PORT || 3000));
      this.mainWindow.loadURL('/');
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
}
