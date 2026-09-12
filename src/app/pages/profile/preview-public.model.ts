import {
  FeedbackQuestionCategory,
  FeedbackQuestionOption,
  FeedbackQuestionType,
} from '../../shared/components/models/feedback-question-selector.model';

export interface ProfilePreviewConfig {
  agent: {
    slug: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    brokerageName: string;
    headline: string;
    logoUrl: string | null;
    headshotUrl: string | null;
  };

  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };

  openHouse: {
    publicCode: string;
    startsAt: string;
    endsAt: string;
  };

  property: {
    street: string;
    street2: string | null;
    city: string;
    state: string;
    zip: string;
    listingPriceCents: number;
  };

  leadForm: {
    fields: {
      key: string;
      label: string;
      type: 'TEXT' | 'EMAIL' | 'TEL';
      required: boolean;
    }[];
  };

  feedbackForm: {
    questions: {
      id: string;
      key: string;
      label: string;
      type: FeedbackQuestionType;
      category: FeedbackQuestionCategory;
      required: boolean;
      sortOrder: number;
      options: FeedbackQuestionOption[];
    }[];
  };
}
