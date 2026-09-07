import { ITableHeaderConfig } from '../../../shared/models/table.model';
import { OpenHouseTableRow } from '../models/open-house.model';

export const OPEN_HOUSE_TABLE_HEADER_CONFIG: ITableHeaderConfig<OpenHouseTableRow>[] =
  [
    {
      label: 'Date',
      value: 'date',
      type: 'text',
    },
    {
      label: 'Time',
      value: 'time',
      type: 'text',
    },
    {
      label: 'Property',
      value: 'property',
      type: 'text',
    },
    {
      label: 'Listing Price',
      value: 'listingPrice',
      type: 'text',
    },
    {
      label: 'Status',
      value: 'status',
      type: 'pill',
    },
    {
      label: 'Created',
      value: 'createdAt',
      type: 'text',
    },
    {
      label: 'Notes',
      type: 'icon',
      icon: 'note_stack',
    },
  ];
