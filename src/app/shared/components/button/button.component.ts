import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { ButtonConfig } from './button.config';

@Component({
    selector: 'aa-button',
    imports: [MatIcon],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class ButtonComponent {
  public config = input<ButtonConfig>({
    label: 'Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
  });

  onClick(): void {
    if (this.config().disabled) {
      return;
    }

    this.config().click?.();
  }
}
