import { Component, input } from '@angular/core';

import { FeedbackQuestionSelection } from '../models/feedback-question-selector.model';

@Component({
    selector: 'aa-feedback-question-selector',
    imports: [],
    templateUrl: './feedback-question-selector.component.html',
    styleUrl: './feedback-question-selector.component.scss'
})
export class FeedbackQuestionSelectorComponent {
  readonly questions = input.required<FeedbackQuestionSelection[]>();

  toggleQuestion(question: FeedbackQuestionSelection): void {
    question.selected = !question.selected;

    if (!question.selected) {
      question.required = false;
    }
  }

  toggleRequired(question: FeedbackQuestionSelection): void {
    if (!question.selected) {
      return;
    }

    question.required = !question.required;
  }
}
