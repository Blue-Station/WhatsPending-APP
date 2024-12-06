import { BaseEventStructure } from '../structures/index.js';
import { Backend } from '../backend.js';
import { IpcMainEvent } from 'electron';

export class SetTitleBarOverlay extends BaseEventStructure {
  constructor(backend: Backend) {
    super('setTitleBarOverlay', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent, arg: any): Promise<void> {
    this.backend.getMainWindow().windowInstance.setTitleBarOverlay(arg);
  }
}
