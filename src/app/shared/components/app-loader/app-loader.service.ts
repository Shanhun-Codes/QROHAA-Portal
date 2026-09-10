import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppLoaderService {
  private readonly _isAppLoading = signal(true);

  readonly isAppLoading = this._isAppLoading.asReadonly();

  stopLoading(): void {
    this._isAppLoading.set(false);
  }
}
