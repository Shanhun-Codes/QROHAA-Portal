export interface AgentFeedbackQuestionRequest {
  questionId: string;
  active: boolean;
  required: boolean;
  sortOrder: number;
}

export interface DefaultQuestionDisplay {
  id: string;
  label: string;
  type: string;
  category: string;
  required: boolean;
  optionCount: number;
}
