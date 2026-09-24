import { Component, HostListener, input, signal } from '@angular/core';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import { MatIcon } from '@angular/material/icon';
import { ActionMenuItem } from '../models/action-menu.model';

@Component({
  selector: 'aa-action-menu',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, MatIcon],
  templateUrl: './action-menu.component.html',
  styleUrl: './action-menu.component.scss',
})
export class ActionMenuComponent {
  readonly actions = input.required<ActionMenuItem[]>();

  readonly ariaLabel = input<string>('Actions');

  readonly isOpen = signal(false);

  readonly triggerIcon = input<string>('more_vert');

  readonly positions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 6,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -6,
    },
  ];

  toggle(event: MouseEvent): void {
    event.stopPropagation();

    this.isOpen.update((value) => !value);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onActionClick(event: MouseEvent, action: ActionMenuItem): void {
    event.stopPropagation();

    if (action.disabled) {
      return;
    }

    this.close();
    action.action();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.isOpen()) {
      return;
    }

    this.close();
  }
}
