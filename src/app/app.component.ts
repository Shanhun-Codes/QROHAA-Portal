import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageWrapperComponent } from './page-wrapper/page-wrapper.component';
import { DialogHostComponent } from './shared/components/dialog/components/dialog-host/dialog-host.component';
import { SnackbarHostComponent } from './shared/components/snackbar/snackbar-host/snackbar-host.component';
import { AppLoaderComponent } from './shared/components/app-loader/app-loader.component';
import { AppLoaderService } from './shared/components/app-loader/app-loader.service';
import { AuthComponent } from './auth/auth.component';

@Component({
  selector: 'aa-root',
  standalone: true,
  imports: [
    RouterOutlet,
    DialogHostComponent,
    AppLoaderComponent,
    SnackbarHostComponent,
    AuthComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly appLoaderService = inject(AppLoaderService);
  readonly isAppLoading = this.appLoaderService.isAppLoading;
}
