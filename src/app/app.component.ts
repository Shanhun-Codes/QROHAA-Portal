import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogHostComponent } from './shared/components/dialog/components/dialog-host/dialog-host.component';
import { SnackbarHostComponent } from './shared/components/snackbar/snackbar-host/snackbar-host.component';
import { AppLoaderComponent } from './shared/components/app-loader/app-loader.component';
import { AppLoaderService } from './shared/components/app-loader/app-loader.service';

@Component({
  selector: 'aa-root',
  imports: [
    DialogHostComponent,
    AppLoaderComponent,
    SnackbarHostComponent,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly appLoaderService = inject(AppLoaderService);
  readonly isAppLoading = this.appLoaderService.isAppLoading;
}
