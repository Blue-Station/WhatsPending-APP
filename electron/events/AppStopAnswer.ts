import { BaseEventStructure } from '../structures/index.js';
import { IpcMainEvent } from 'electron';
import { Backend } from '../backend.js';

export class AppStopAnswer extends BaseEventStructure {
  constructor(backend: Backend) {
    super('app.stop.answer', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent, ...arguments_: any[]): Promise<void> {
    if (!arguments_[0]) return;
    receivedEvent.reply('goodbye');
    this.backend.getMainWindow()!.destroy();
  }
}
