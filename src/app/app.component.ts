import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageWrapperComponent } from './page-wrapper/page-wrapper.component';
import { DialogHostComponent } from './shared/components/dialog/components/dialog-host/dialog-host.component';
import { SnackbarHostComponent } from './shared/components/snackbar/snackbar-host/snackbar-host.component';

@Component({
  selector: 'aa-root',
  standalone: true,
  imports: [RouterOutlet, DialogHostComponent, SnackbarHostComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'qrohaa-portal';
}
