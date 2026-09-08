import { Type } from '@angular/core';
import { DialogRef } from '../dialog-ref';

export interface DialogConfig {
  title?: string;
  subtitle?: string;

  // Content
  message?: string;
  data?: unknown;

  // Later allows dynamic content/components/forms
  contentComponent?: Type<unknown>;

  // Sizing
  width?: string;
  maxWidth?: string;

  // Behavior
  disableBackdropClose?: boolean;
  disableEscapeClose?: boolean;

  // Actions
  actions?: DialogAction[];

  // Optional styling/identification
  cssClass?: string;
  ariaLabel?: string;
}

export interface DialogAction {
  label: string;
  type?: 'primary' | 'secondary' | 'danger';
  closeOnClick?: boolean;
  disabled?: boolean;
  value?: unknown;
  submit?: boolean;
}

export interface DialogInstance<TResult = any> {
  id: string;
  config: DialogConfig;
  ref: DialogRef<TResult>;
}
