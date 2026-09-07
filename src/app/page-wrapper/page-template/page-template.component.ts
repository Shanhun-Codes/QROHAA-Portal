import { Component, input } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ButtonConfig } from '../../shared/components/button/button.config';

@Component({
  selector: 'aa-page-template',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './page-template.component.html',
  styleUrl: './page-template.component.scss',
})
export class PageTemplateComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly hasTemplateButton = input<boolean>(false);
  readonly buttonConfig = input.required<ButtonConfig>();
}
