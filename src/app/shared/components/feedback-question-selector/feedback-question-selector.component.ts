import { Component, input } from '@angular/core';

import { FeedbackQuestionSelection } from '../models/feedback-question-selector.model';

@Component({
  selector: 'aa-feedback-question-selector',
  imports: [],
  templateUrl: './feedback-question-selector.component.html',
  styleUrl: './feedback-question-selector.component.scss',
})
export class FeedbackQuestionSelectorComponent {
  readonly questions = input.required<FeedbackQuestionSelection[]>();

  toggleQuestion(question: FeedbackQuestionSelection): void {
    question.selected = !question.selected;

    if (!question.selected) {
      question.required = false;
      question.printable = false;
    }
  }

  toggleRequired(question: FeedbackQuestionSelection): void {
    if (!question.selected) {
      return;
    }

    question.required = !question.required;
  }

  togglePrintable(question: FeedbackQuestionSelection): void {
    if (!question.selected) {
      return;
    }

    question.printable = !question.printable;
  }

  getQuestionTypeLabel(type: string): string {
    switch (type) {
      case 'SINGLE_SELECT':
        return 'Single choice';

      case 'RATING':
        return 'Rating';

      case 'TEXT':
        return 'Short text';

      case 'TEXTAREA':
        return 'Long text';

      default:
        return type;
    }
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'BUYER_PROFILE':
        return 'Buyer Profile';

      case 'PROPERTY_FEEDBACK':
        return 'Property Feedback';

      case 'BUYING_READINESS':
        return 'Buying Readiness';

      default:
        return category;
    }
  }

  getOptionPreview(question: FeedbackQuestionSelection): string {
    return question.options
      .slice(0, 3)
      .map((option) => option.label)
      .join(' / ');
  }
}
