import { BaseEventStructure } from '../structures/index.js';
import { Backend } from '../backend.js';

export class ControllerMinimize extends BaseEventStructure {
  constructor(backend: Backend) {
    super('controller.minimize', backend, false);
  }

  override async execute(): Promise<void> {
    this.backend.getMainWindow()!.minimize();
  }
}
