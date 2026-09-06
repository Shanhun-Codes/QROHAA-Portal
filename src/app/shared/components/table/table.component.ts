import { Component, inject, input, signal } from '@angular/core';
import { ITableHeaderConfig } from '../../models/table.model';
import { MatIcon } from '@angular/material/icon';
import { StatusPillComponent } from '../status-pill/status-pill.component';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { ExpandableTableRowService } from './expandable-table-row/expandable-table-row.service';
import { ExpandableTableRowComponent } from './expandable-table-row/expandable-table-row.component';
import { TableService } from '../table.service';

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
export class TableComponent {
  private exTableRowService = inject(ExpandableTableRowService);
  private tableService = inject(TableService)

  public readonly tableHeaderConfig =
    input.required<ITableHeaderConfig<any>[]>();

  public readonly tableDataConfig = input.required<any[]>();

  public row = this.exTableRowService.row;
  public isRowExpanded = this.exTableRowService.isRowExpanded;
  public rowTableData = this.exTableRowService.tableRowData;

  onRowClick(row: string) {
    this.tableService.handleRowClick(row)
  }
}
