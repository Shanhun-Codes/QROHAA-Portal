export type FeedbackQuestionType =
  | 'SINGLE_SELECT'
  | 'TEXT'
  | 'TEXTAREA'
  | 'RATING';

export type FeedbackQuestionCategory =
  | 'BUYER_PROFILE'
  | 'PROPERTY_FEEDBACK'
  | 'BUYING_READINESS';

export interface FeedbackQuestionOption {
  label: string;
  value: string;
  sortOrder: number;
}

export interface FeedbackQuestionSelection {
  id: string;
  questionId: string;
  key: string;
  label: string;
  type: FeedbackQuestionType;
  category: FeedbackQuestionCategory;
  options: FeedbackQuestionOption[];
  selected: boolean;
  required: boolean;
  sortOrder: number;
  question: any;
  printable: boolean;
}
