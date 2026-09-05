import { Component, input } from '@angular/core';
import { ITableHeaderConfig } from '../../models/table.model';
import { MatIcon } from '@angular/material/icon';
import { StatusPillComponent } from '../status-pill/status-pill.component';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'aa-table',
  standalone: true,
  imports: [MatIcon, StatusPillComponent, TimeAgoPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  public readonly tableHeaderConfig =
    input.required<ITableHeaderConfig<any>[]>();

  public readonly tableDataConfig = input.required<any[]>();
}
