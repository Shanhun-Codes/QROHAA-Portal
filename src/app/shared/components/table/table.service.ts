import { inject, Injectable } from '@angular/core';
import { ExpandableTableRowService } from './expandable-table-row/expandable-table-row.service';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private exTableService = inject(ExpandableTableRowService);

  private row = this.exTableService.row;

  handleRowClick(id: string): void {
    this.row.update((currentId) => (currentId === id ? '' : id));
  }
}
