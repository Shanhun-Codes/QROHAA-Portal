import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { PROPERTY_TABLE_HEADER_CONFIG } from './config/properties-table-header-config';
import { PageTemplateComponent } from '../page-template/page-template.component';

@Component({
  selector: 'aa-properties',
  standalone: true,
  imports: [TableComponent, PageTemplateComponent],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
})
export class PropertiesComponent {
  readonly title = 'Properties';
  readonly subtitle = 'Manage your properties here';

  readonly tableHeaderConfig = PROPERTY_TABLE_HEADER_CONFIG;
  readonly tableData = signal<any[]>([]);
}
