export interface FeedbackAnswer {
  value: string;
  question: {
    key: string;
    label: string;
    type: string;
    options?: Array<{ value: string; label: string }>;
  };
}
export interface FeedbackSubmission {
  id: string;
  createdAt: string;
  openHouseId: string;
  lead?: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  openHouse?: {
    id: string;
    startsAt: string;
    endsAt?: string;
    property: {
      street: string;
      street2?: string | null;
      city: string;
      state: string;
      zip: string;
    };
  };
  feedbackAnswers: FeedbackAnswer[];
}
export function answerLabel(answer: FeedbackAnswer): string {
  const value = answer.value;
  if (!value?.trim()) return 'Not answered';
  const options = answer.question.options ?? [];
  const option = options.find((item) => item.value === value);
  if (option) return option.label;
  if (answer.question.type === 'MULTI_SELECT') {
    let values: unknown;
    try {
      values = JSON.parse(value);
    } catch {
      values = value.split(',');
    }
    if (Array.isArray(values))
      return values
        .map(
          (item) =>
            options.find((option) => option.value === String(item).trim())
              ?.label ?? String(item),
        )
        .join(', ');
  }
  return value;
}
