import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageWrapperComponent } from './page-wrapper/page-wrapper.component';
import { DialogHostComponent } from './shared/components/dialog/components/dialog-host/dialog-host.component';

@Component({
  selector: 'aa-root',
  standalone: true,
  imports: [RouterOutlet, DialogHostComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'qrohaa-portal';
}
