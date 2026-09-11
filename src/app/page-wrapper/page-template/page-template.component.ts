import { Component, input, TemplateRef } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ButtonConfig } from '../../shared/components/button/button.config';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'aa-page-template',
    imports: [ButtonComponent, NgTemplateOutlet],
    templateUrl: './page-template.component.html',
    styleUrl: './page-template.component.scss'
})
export class PageTemplateComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();

  readonly hasTemplateButton = input<boolean>(false);
  readonly buttonConfig = input<ButtonConfig>();

  readonly headerActions = input<TemplateRef<unknown>>();
}
