import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { SystemDecorationsService } from '../services/systemDecorations/SystemDecorations.service';
import { EWindowFrameButtons } from '../../../../../common/interfaces/ISystemDecorations';

interface IButtonProps {
  color: string,
  icon: string,
}

@Component({
  selector: 'app-system-decorations',
  imports: [],
  templateUrl: './system-decorations.component.html',
  styleUrl: './system-decorations.component.css',
})
export class SystemDecorationsComponent {
  public sysDec: SystemDecorationsService = inject(SystemDecorationsService);
  public leftButtons: IButtonProps[] = [];
  public rightButtons: IButtonProps[] = [];

  private processButton(buttonId: number): IButtonProps {
    switch (buttonId) {
      case (EWindowFrameButtons.CLOSE): {
        return { color: 'ff0000', icon: 'X' }
      }
    }

    return { color: '000000', icon: '' };
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.sysDec.onData(() => {
      this.sysDec.leftButtons.forEach((button) => {
        this.leftButtons.push(this.processButton(button));
      });
      this.sysDec.rightButtons.forEach((button) => {
        this.rightButtons.push(this.processButton(button));
      });
      changeDetectorRef.detectChanges();
    });
  }
}
