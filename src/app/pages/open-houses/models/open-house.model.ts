import { StatusPillConfig } from '../../../shared/components/models/status-pill.model';
import { AgentFeedbackQuestionRequest } from '../../profile/models/question.model';

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

export interface OpenHouseFormValue {
  propertyId: string;
  createProperty: boolean;

  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  listingPrice?: string;

  startDate: string;
  startTime: string;
  durationDays: 1 | 2;
  endTime: string;
}

export interface CreateOpenHouseRequest {
  propertyId: string;
  startsAt: string | Date;
  endsAt: string | Date;
  feedbackQuestions?: AgentFeedbackQuestionRequest[];
}
