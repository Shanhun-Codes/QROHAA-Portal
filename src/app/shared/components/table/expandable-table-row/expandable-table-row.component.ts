import { Component, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'aa-expandable-table-row',
    imports: [NgTemplateOutlet],
    templateUrl: './expandable-table-row.component.html',
    styleUrl: './expandable-table-row.component.scss'
})
export class ExpandableTableRowComponent {
  readonly rowData = input.required<any>();

  readonly expandedRowTemplate = input.required<TemplateRef<any>>();
}
