import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageWrapperComponent } from './page-wrapper/page-wrapper.component';
import { DialogHostComponent } from './shared/components/dialog/components/dialog-host/dialog-host.component';
import { SnackbarHostComponent } from './shared/components/snackbar/snackbar-host/snackbar-host.component';
import { AppLoaderComponent } from './shared/components/app-loader/app-loader.component';
import { AppLoadingService } from './shared/services/app-loading.service';

@Component({
  selector: 'aa-root',
  standalone: true,
  imports: [
    RouterOutlet,
    DialogHostComponent,
    SnackbarHostComponent,
    AppLoaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly appLoadingService = inject(AppLoadingService);
  readonly isAppLoading = this.appLoadingService.isAppLoading;
}
