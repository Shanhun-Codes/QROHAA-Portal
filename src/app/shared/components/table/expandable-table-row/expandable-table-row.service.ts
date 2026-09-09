import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExpandableTableRowService {
  public isRowExpanded = signal<boolean>(false);
  public row = signal<string>('');
  public tableRowData = signal<any[]>([]);
}
