import { BaseEventStructure } from '../structures/index.js';
import { Backend } from '../backend.js';
import { IpcMainEvent } from 'electron';

export class Eval extends BaseEventStructure {
  constructor(backend: Backend) {
    super('eval', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent, ...args: any[]): Promise<void> {
    eval(args.join(' '));
  }
}
