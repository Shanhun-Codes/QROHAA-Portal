import { Injectable, signal } from '@angular/core';
import { SnackbarMessage, SnackbarType } from '../models/snackbar.model';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly _messages = signal<SnackbarMessage[]>([]);
  readonly messages = this._messages.asReadonly();
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  show(message: string, type: SnackbarType = 'info', duration = 4000): void {
    const id = crypto.randomUUID();
    console.log('SNACKBAR SHOW:', message, type);
    const snackbar: SnackbarMessage = {
      id,
      message,
      type,
      duration,
    };

    this._messages.update((messages) => [...messages, snackbar]);

    if (duration > 0) {
      const timer = setTimeout(() => {
        this.dismiss(id);
      }, duration);

      this.timers.set(id, timer);
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
    const timer = this.timers.get(id);

    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this._messages.update((messages) =>
      messages.filter((message) => message.id !== id),
    );
  }

  clear(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }

    this.timers.clear();
    this._messages.set([]);
  }
}
