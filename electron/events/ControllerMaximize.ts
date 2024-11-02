import { BaseEventStructure } from '../structures/index.js';
import { Backend } from '../backend.js';

export class ControllerMaximize extends BaseEventStructure {
  constructor(backend: Backend) {
    super('controller.maximize', backend, false);
  }

  override async execute(): Promise<void> {
    if (this.backend.getMainWindow()!.windowInstance.isMaximized()) {
      this.backend.getMainWindow()!.unmaximize();
    } else {
      this.backend.getMainWindow()!.maximize();
    }
  }
}
