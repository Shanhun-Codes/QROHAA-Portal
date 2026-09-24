import { Component, input, output } from '@angular/core';

@Component({
  selector: 'aa-bulk-actions-bar',
  imports: [],
  templateUrl: './bulk-actions-bar.component.html',
  styleUrl: './bulk-actions-bar.component.scss',
})
export class BulkActionsBarComponent {
  readonly selectedCount = input.required<number>();

  readonly itemName = input.required<string>();

  readonly pluralItemName = input<string>();

  readonly clearSelection = output<void>();

  get selectionLabel(): string {
    if (this.selectedCount() === 1) {
      return this.itemName();
    }

    return this.pluralItemName() ?? `${this.itemName()}s`;
  }

  onClearSelection(): void {
    this.clearSelection.emit();
  }
}
