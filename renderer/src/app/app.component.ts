import { Component, inject, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SystemDecorationsComponent } from "./components/system-decorations/system-decorations.component";
import { SystemDecorationsService } from './components/services/systemDecorations/SystemDecorations.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SystemDecorationsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
}
