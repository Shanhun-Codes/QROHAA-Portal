import { Signal, signal } from '@angular/core';

export class DialogRef<TResult = unknown> {
  private readonly _closed = signal(false);
  private readonly _result = signal<TResult | undefined>(undefined);

  private resolveClosed!: (result: TResult | undefined) => void;

  private readonly closedPromise = new Promise<TResult | undefined>(
    (resolve) => {
      this.resolveClosed = resolve;
    },
  );

  private submitHandler?: () => void;

  readonly closed: Signal<boolean> = this._closed.asReadonly();
  readonly result: Signal<TResult | undefined> = this._result.asReadonly();

  constructor(
    readonly id: string,
    private readonly closeHandler: (id: string, result?: TResult) => void,
  ) {}

  close(result?: TResult): void {
    if (this._closed()) {
      return;
    }
    console.log('DIALOG REF CLOSE:', result);

    this._result.set(result);
    this._closed.set(true);

    this.resolveClosed(result);
    this.closeHandler(this.id, result);
  }

  afterClosed(): Promise<TResult | undefined> {
    return this.closedPromise;
  }

  registerSubmitHandler(handler: () => void): void {
    this.submitHandler = handler;
  }

  submit(): void {
    if (!this.submitHandler) {
      return;
    }

    this.submitHandler();
  }
}
