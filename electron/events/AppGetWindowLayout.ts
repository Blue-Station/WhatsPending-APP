import { BaseEventStructure } from '../structures/index.js';
import { IpcMainEvent } from 'electron';
import { Backend } from '../backend.js';

export class AppGetWindowLayout extends BaseEventStructure {
  constructor(backend: Backend) {
    super('app.getWindowLayout', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent): Promise<void> {
    receivedEvent.reply('app.getScreens.return', this.backend.windowSettings);
  }
}
