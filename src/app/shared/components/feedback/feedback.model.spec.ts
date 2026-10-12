import { answerLabel, FeedbackAnswer } from './feedback.model';
describe('feedback answer display', () => {
  const answer = (value: string, type = 'SINGLE_SELECT'): FeedbackAnswer => ({
    value,
    question: {
      key: 'test',
      label: 'Test',
      type,
      options: [
        { value: 'UNDER_300K', label: 'Under $300k' },
        { value: 'YES', label: 'Yes' },
      ],
    },
  });
  it('uses configured labels instead of stored codes', () =>
    expect(answerLabel(answer('UNDER_300K'))).toBe('Under $300k'));
  it('preserves free text casing and line breaks', () =>
    expect(answerLabel(answer('Loved the HVAC!\nGreat view.', 'TEXT'))).toBe(
      'Loved the HVAC!\nGreat view.',
    ));
  it('formats multiple selections', () =>
    expect(answerLabel(answer('["YES","UNDER_300K"]', 'MULTI_SELECT'))).toBe(
      'Yes, Under $300k',
    ));
  it('makes an unanswered field clear', () =>
    expect(answerLabel(answer(''))).toBe('Not answered'));
});
