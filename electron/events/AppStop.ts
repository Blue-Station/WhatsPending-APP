import { BaseEventStructure } from '../structures/index.js';
import { Backend } from '../backend.js';

export class AppStop extends BaseEventStructure {
  constructor(backend: Backend) {
    super('app.stop', backend, false);
  }

  override async execute(): Promise<void> {
    this.backend.getMainWindow()!.close();
  }
}
