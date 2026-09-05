// lead-status.mapper.ts

import { StatusPillConfig } from '../../../shared/models/status-pill.model';
import { LeadStatusType } from '../models/lead.model';

export function mapLeadStatusToPill(status: LeadStatusType): StatusPillConfig {
  switch (status) {
    case LeadStatusType.NEW:
      return {
        label: 'New',
        variant: 'info',
      };

    case LeadStatusType.CONTACTED:
      return {
        label: 'Contacted',
        variant: 'purple',
      };

    case LeadStatusType.FOLLOW_UP:
      return {
        label: 'Follow Up',
        variant: 'warning',
      };

    case LeadStatusType.QUALIFIED:
      return {
        label: 'Qualified',
        variant: 'success',
      };

    case LeadStatusType.CLOSED:
      return {
        label: 'Closed',
        variant: 'success',
      };

    case LeadStatusType.LOST:
      return {
        label: 'Lost',
        variant: 'neutral',
      };
  }
}
