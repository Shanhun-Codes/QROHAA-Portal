import { Injectable, signal } from '@angular/core';
import { SnackbarMessage, SnackbarType } from '../models/snackbar.model';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly _messages = signal<SnackbarMessage[]>([]);
  readonly messages = this._messages.asReadonly();

  show(message: string, type: SnackbarType = 'info', duration = 4000): void {
    const id = crypto.randomUUID();

    const snackbar: SnackbarMessage = {
      id,
      message,
      type,
      duration,
    };

    this._messages.update((messages) => [...messages, snackbar]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  dismiss(id: string): void {
    this._messages.update((messages) =>
      messages.filter((message) => message.id !== id),
    );
  }

  clear(): void {
    this._messages.set([]);
  }
}
