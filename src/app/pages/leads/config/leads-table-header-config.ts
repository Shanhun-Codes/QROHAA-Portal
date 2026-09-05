import { ITableHeaderConfig } from '../../../shared/models/table.model';
import { Lead } from '../models/lead.model';

export const LEAD_TABLE_HEADER_CONFIG: ITableHeaderConfig<Lead>[] = [
  {
    label: 'Name',
    value: 'name',
    type: 'text',
  },

  {
    label: 'Phone',
    value: 'phone',
    type: 'text',
  },
  {
    label: 'Email',
    value: 'email',
    type: 'text',
  },
  {
    label: 'Status',
    value: 'status',
    type: 'pill',
  },
  {
    label: 'Received',
    value: 'createdAt',
    type: 'text',
  },
  {
    label: 'Notes',
    type: 'icon',
    icon: 'note_stack',
  },
  {
    label: 'Actions',
    type: 'actions',
    icon: 'more_vert',
  },
];
