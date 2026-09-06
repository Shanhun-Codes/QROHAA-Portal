import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExpandableTableRowService {
  public isRowExpanded = signal<boolean>(false);
  public row = signal<string>('');
  public tableRowData = signal<any[]>([]);
}
