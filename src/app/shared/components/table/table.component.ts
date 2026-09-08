import { Component, input, output, signal, TemplateRef } from '@angular/core';
import { ITableHeaderConfig } from '../models/table.model';
import { MatIcon } from '@angular/material/icon';
import { StatusPillComponent } from '../status-pill/status-pill.component';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { ExpandableTableRowComponent } from './expandable-table-row/expandable-table-row.component';

@Component({
  selector: 'aa-table',
  standalone: true,
  imports: [
    MatIcon,
    StatusPillComponent,
    TimeAgoPipe,
    ExpandableTableRowComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T extends { id: string }> {
  readonly tableHeaderConfig = input.required<ITableHeaderConfig<any>[]>();

  readonly tableDataConfig = input.required<any[]>();

  readonly expandedRowTemplate = input.required<TemplateRef<any>>();

  readonly rowExpanded = output<string>();

  readonly row = signal<string | null>(null);

  onRowClick(id: string): void {
    const isOpening = this.row() !== id;

    this.row.set(isOpening ? id : null);

    if (isOpening) {
      this.rowExpanded.emit(id);
    }
  }

  getColumnClass(
    value?: string | number | symbol,
    suffix: 'cell' | 'column' = 'cell',
  ): string {
    if (value === undefined) {
      return '';
    }

    const columnName = String(value)
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();

    return `${columnName}-${suffix}`;
  }
}
