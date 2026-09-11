import { NgComponentOutlet } from '@angular/common';
import { Component, effect, HostListener, inject, DOCUMENT } from '@angular/core';

import { DialogService } from '../../dialog.service';
import { DialogAction } from '../../models/dialog.model';
import { ButtonComponent } from '../../../button/button.component';

@Component({
    selector: 'aa-dialog-host',
    imports: [ButtonComponent, NgComponentOutlet],
    templateUrl: './dialog-host.component.html',
    styleUrl: './dialog-host.component.scss'
})
export class DialogHostComponent {
  readonly dialogService = inject(DialogService);

  private readonly document = inject(DOCUMENT);

  private previouslyFocusedElement: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const dialogs = this.dialogService.dialogs();
      const hasOpenDialogs = dialogs.length > 0;

      this.document.body.style.overflow = hasOpenDialogs ? 'hidden' : '';

      if (hasOpenDialogs) {
        this.focusTopDialog();
      } else {
        this.restorePreviousFocus();
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key === 'Escape') {
      this.onEscape();
      return;
    }

    if (keyboardEvent.key === 'Enter') {
      this.onEnter(keyboardEvent);
      return;
    }

    if (keyboardEvent.key === 'Tab') {
      this.onTab(keyboardEvent);
    }
  }

  onBackdropClick(id: string): void {
    const top = this.dialogService.topDialog();

    if (!top || top.id !== id || top.config.disableBackdropClose) {
      return;
    }

    top.ref.close();
  }

  onActionClick(id: string, action: DialogAction): void {
    if (action.disabled) {
      return;
    }

    const dialog = this.dialogService
      .dialogs()
      .find((dialog) => dialog.id === id);

    if (!dialog) {
      return;
    }

    if (action.submit) {
      dialog.ref.submit();
      return;
    }

    if (action.closeOnClick !== false) {
      this.dialogService.close(id, action.value);
    }
  }

  private onEscape(): void {
    const top = this.dialogService.topDialog();

    if (!top || top.config.disableEscapeClose) {
      return;
    }

    top.ref.close();
  }

  private onTab(event: KeyboardEvent): void {
    const top = this.dialogService.topDialog();

    if (!top) {
      return;
    }

    const dialog = this.document.querySelector<HTMLElement>(
      `[data-dialog-id="${top.id}"]`,
    );

    if (!dialog) {
      return;
    }

    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        [
          'button:not([disabled])',
          '[href]',
          'input:not([disabled])',
          'select:not([disabled])',
          'textarea:not([disabled])',
          '[tabindex]:not([tabindex="-1"])',
        ].join(','),
      ),
    );

    if (!focusableElements.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements.at(-1)!;
    const active = this.document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private onEnter(event: KeyboardEvent): void {
    const top = this.dialogService.topDialog();

    if (!top) {
      return;
    }

    const activeElement = this.document.activeElement;

    if (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement instanceof HTMLSelectElement
    ) {
      return;
    }

    const primaryAction = top.config.actions?.find(
      (action) => action.type === 'primary' && !action.disabled,
    );

    if (!primaryAction) {
      return;
    }

    event.preventDefault();

    this.onActionClick(top.id, primaryAction);
  }

  private focusTopDialog(): void {
    const top = this.dialogService.topDialog();

    if (!top) {
      return;
    }

    if (!this.previouslyFocusedElement) {
      this.previouslyFocusedElement = this.document
        .activeElement as HTMLElement;
    }

    setTimeout(() => {
      const dialog = this.document.querySelector<HTMLElement>(
        `[data-dialog-id="${top.id}"]`,
      );

      if (!dialog) {
        return;
      }

      const firstFormControl = dialog.querySelector<HTMLElement>(
        [
          'input:not([disabled]):not([type="hidden"])',
          'select:not([disabled])',
          'textarea:not([disabled])',
        ].join(','),
      );

      const primaryButton = dialog.querySelector<HTMLButtonElement>(
        '.dialog-primary-action button',
      );

      const firstFocusable = dialog.querySelector<HTMLElement>(
        [
          'button:not([disabled])',
          '[href]',
          '[tabindex]:not([tabindex="-1"])',
        ].join(','),
      );

      (firstFormControl ?? primaryButton ?? firstFocusable ?? dialog).focus();
    });
  }

  private restorePreviousFocus(): void {
    this.previouslyFocusedElement?.focus();
    this.previouslyFocusedElement = null;
  }

  getActionButtonConfig(id: string, action: DialogAction) {
    return {
      label: action.label,
      variant: action.type ?? 'secondary',
      disabled: action.disabled ?? false,
      click: () => this.onActionClick(id, action),
    };
  }
}
