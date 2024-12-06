import { Backend } from '../backend.js';
import path from 'node:path';
import fs from 'node:fs';

export class Storage {
  constructor(private path: string) {}

  public set(key: string, value: unknown): void {
    const data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
    data[key] = value;
    fs.writeFileSync(this.path, JSON.stringify(data));
  }

  public get(key: string, defaultValue?: unknown): unknown {
    const data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
    return data[key] ?? defaultValue;
  }

  public delete(key: string): void {
    const data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
    delete data[key];
    fs.writeFileSync(this.path, JSON.stringify(data));
  }

  public clear(): void {
    fs.writeFileSync(this.path, '{}');
  }
}

export class Store {
  constructor(private backend: Backend) {}

  public create(name: string): Storage {
    const userData = this.backend.getApp().getPath('userData');
    const storagePath = path.join(userData, name + '.json');
    if (!fs.existsSync(storagePath)) {
      fs.writeFileSync(storagePath, '{}');
    }

    return new Storage(storagePath);
  }
}
