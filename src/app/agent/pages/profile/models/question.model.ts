export interface AgentFeedbackQuestionRequest {
  questionId: string;
  active: boolean;
  required: boolean;
  sortOrder: number;
  printable: boolean;
}

export interface DefaultQuestionDisplay {
  id: string;
  label: string;
  type: string;
  printable: boolean;
  category: string;
  required: boolean;
  optionCount: number;
}
