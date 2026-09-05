import { Component, input } from '@angular/core';
import { ButtonConfig } from './button.config';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'aa-button',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  public config = input<ButtonConfig>({
    label: 'Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
  });
}
