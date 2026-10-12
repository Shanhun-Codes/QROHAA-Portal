import { ITableHeaderConfig } from '../../../../shared/components/table/table.model';
export const AGENCY_AGENTS_TABLE_HEADER_CONFIG: ITableHeaderConfig<
  Record<string, unknown>
>[] = [
  { label: 'Name', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Access', value: 'access' },
  { label: 'Status', value: 'statusLabel' },
];
