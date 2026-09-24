import { Component, input, output } from '@angular/core';

export interface ViewToggleOption {
  label: string;
  value: string;
}

@Component({
  selector: 'aa-view-toggle',
  imports: [],
  templateUrl: './view-toggle.component.html',
  styleUrl: './view-toggle.component.scss',
})
export class ViewToggleComponent {
  readonly options = input.required<ViewToggleOption[]>();

  readonly value = input.required<string>();

  readonly valueChange = output<string>();

  select(value: string): void {
    if (value === this.value()) {
      return;
    }

    this.valueChange.emit(value);
  }
}
