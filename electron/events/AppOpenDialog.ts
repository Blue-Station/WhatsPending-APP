import { BaseEventStructure } from '../structures/index.js';
import { IpcMainEvent, dialog } from 'electron';
import { Backend } from '../backend.js';

export class AppOpenDialog extends BaseEventStructure {
  constructor(backend: Backend) {
    super('app.openDialog', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent, ...arguments_: any[]): Promise<void> {
    if (!arguments_[0] || typeof arguments_[0] !== 'object') return receivedEvent.reply('app.openDialog.error', 'Invalid arguments');

    const title = arguments_[0].title ?? 'Select a folder';

    const result = await dialog.showOpenDialog({
      properties: arguments_[0].properties,
      title,
    });

    if (result.canceled) {
      return receivedEvent.reply('app.openDialog.response', null);
    }

    return receivedEvent.reply('app.openDialog.response', result.filePaths);
  }
}
