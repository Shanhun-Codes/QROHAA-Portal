import { StatusPillConfig } from '../../../shared/models/status-pill.model';
import { Property } from '../../properties/models/property.model';

export interface OpenHouse {
  id: string;
  publicCode: string;
  startsAt: string;
  endsAt: string;
  agentId: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
  property: Property;
}

export interface OpenHouseTableRow extends Omit<OpenHouse, 'property'> {
  property: string;
  listingPrice: string;
  date: string;
  time: string;
  status: StatusPillConfig;
}
