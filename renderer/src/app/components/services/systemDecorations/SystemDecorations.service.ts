import { Injectable, Optional, SkipSelf } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SystemDecorationsService {
  private eventSubscribers: (() => void)[] = [];
  public leftButtons: number[] = [];
  public rightButtons: number[] = [];
  public canUseCustomFrame = false;
  public hasFrame = false;
  public gotData = false;

  constructor(@Optional() @SkipSelf() parentModule?: SystemDecorationsService) {
    if (parentModule) {
      throw new Error(
        'SystemDecorationsService is already loaded. Import it in the AppModule only');
    }

    (window as any).ipc.on('app.getScreens.return', (data: any) => {
      this.canUseCustomFrame = data[0].canUseCustomFrame;
      this.hasFrame = data[0].hasFrame;
      this.leftButtons = data[0].buttons.leftButtons;
      this.rightButtons = data[0].buttons.rightButtons;

      this.gotData = true;

      this.eventSubscribers.forEach((callback) => {
        callback();
      });
    });

    (window as any).ipc.send('app.getWindowLayout');
  }

  public onData(callback: () => void): () => void {
    if (this. gotData) {
      callback();
    }
    const index = this.eventSubscribers.push(callback);
    return () => {
      this.eventSubscribers.splice(index, 1);
    };
  }
}