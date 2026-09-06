import { Component, inject, input } from '@angular/core';
import { ExpandableTableRowService } from './expandable-table-row.service';

@Component({
  selector: 'aa-expandable-table-row',
  standalone: true,
  imports: [],
  templateUrl: './expandable-table-row.component.html',
  styleUrl: './expandable-table-row.component.scss',
})
export class ExpandableTableRowComponent {
  readonly exTableRowService = inject(ExpandableTableRowService);
  readonly rowData = input<string | null>();
  readonly tableData = input<any>();
}
