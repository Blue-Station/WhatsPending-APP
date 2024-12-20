/* eslint-disable @typescript-eslint/no-unused-vars */
import { IpcMainEvent } from 'electron';
import { Backend } from '../backend.js';

export class BaseEventStructure {
  protected backend: Backend;
  protected name: string;
  protected once = false;
  protected runned = false;

  constructor(name: string, backend: Backend, once = false) {
    this.name = name;
    this.once = once;
    this.backend = backend;
  }

  public runOnce(): boolean {
    return this.once;
  }

  public getName(): string {
    return this.name;
  }

  public async preExecute(receivedEvent: IpcMainEvent, ...arguments_: any[]): Promise<void> {
    if (this.runned && this.once) return;
    this.runned = true;
    return this.execute(receivedEvent, ...arguments_);
  }

  protected async execute(receivedEvent: IpcMainEvent, ...arguments_: any[]): Promise<void> {
    throw new Error(`The run method has not been implemented for event ${this.name}`);
  }
}
