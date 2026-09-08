import { computed, Injectable, signal } from '@angular/core';

import { DialogConfig, DialogInstance } from './models/dialog.model';
import { DialogRef } from './dialog-ref';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly _dialogs = signal<DialogInstance[]>([]);

  readonly dialogs = this._dialogs.asReadonly();

  readonly topDialog = computed(() => {
    const dialogs = this._dialogs();
    return dialogs.at(-1) ?? null;
  });

  open<TResult = unknown>(config: DialogConfig): DialogRef<TResult> {
    const id = crypto.randomUUID();

    const ref = new DialogRef<TResult>(id, (dialogId) => this.remove(dialogId));

    this._dialogs.update((dialogs) => [
      ...dialogs,
      {
        id,
        config,
        ref,
      },
    ]);

    return ref;
  }

  close<TResult = unknown>(id: string, result?: TResult): void {
    const dialog = this._dialogs().find((dialog) => dialog.id === id);

    if (!dialog) {
      return;
    }

    (dialog.ref as DialogRef<TResult>).close(result);
  }

  closeTop(): void {
    const top = this.topDialog();

    if (top) {
      top.ref.close();
    }
  }

  closeAll(): void {
    const dialogs = [...this._dialogs()];

    for (const dialog of dialogs.reverse()) {
      dialog.ref.close();
    }
  }

  private remove(id: string): void {
    this._dialogs.update((dialogs) =>
      dialogs.filter((dialog) => dialog.id !== id),
    );
  }
}
