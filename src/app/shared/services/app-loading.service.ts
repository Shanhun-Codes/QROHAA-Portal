import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppLoadingService {
  private readonly _isAppLoading = signal(true);

  readonly isAppLoading = this._isAppLoading.asReadonly();

  startLoading(): void {
    this._isAppLoading.set(true);
  }

  stopLoading(): void {
    this._isAppLoading.set(false);
  }
}
