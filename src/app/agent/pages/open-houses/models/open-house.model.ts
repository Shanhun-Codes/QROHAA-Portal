import { StatusPillConfig } from '../../../../shared/components/status-pill/status-pill.model';

import { AgentFeedbackQuestionRequest } from '../../profile/models/question.model';

import { Lead } from '../../leads/models/lead.model';

import { Property } from '../../properties/property.model';

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

export interface OpenHouseDetail extends OpenHouse {
  agent: OpenHouseDetailAgent;
  openHouseFeedbackQuestions: OpenHouseFeedbackQuestion[];
  openHouseFeedbackSubmissions: OpenHouseFeedbackSubmission[];
}

export interface OpenHouseDetailAgent {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  realEstateLicenseNumber: string | null;
  brokerage?: {
    name: string;
    licenseNumber: string | null;
    street: string | null;
    street2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
  } | null;
  headline?: string | null;
  headshotUrl?: string | null;
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

export interface OpenHouseFeedbackQuestion {
  openHouseId: string;
  questionId: string;
  required: boolean;
  sortOrder: number;
  question: FeedbackQuestionDetail;
  printable: boolean;
  printableSortOrder: number;
}

export interface FeedbackQuestionDetail {
  id: string;
  key: string;
  label: string;
  type: string;
  category: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  options: FeedbackQuestionOption[];
}

export interface FeedbackQuestionOption {
  id: string;
  label: string;
  value: string;
  sortOrder: number;
  questionId: string;
}

export type OpenHouseFeedbackSubmission =
  import('../../../../shared/components/feedback/feedback.model').FeedbackSubmission;

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

export interface DeleteOpenHousesResponse {
  deletedCount: number;
  skippedCount: number;
  openHouses: OpenHouse[];
}

export type OpenHouseView = 'UPCOMING' | 'PAST';
