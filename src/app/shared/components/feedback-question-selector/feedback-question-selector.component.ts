import { Component, computed, input, signal } from '@angular/core';

import { FeedbackQuestionSelection } from '../models/feedback-question-selector.model';

@Component({
  selector: 'aa-feedback-question-selector',
  imports: [],
  templateUrl: './feedback-question-selector.component.html',
  styleUrl: './feedback-question-selector.component.scss',
})
export class FeedbackQuestionSelectorComponent {
  readonly questions = input.required<FeedbackQuestionSelection[]>();

  private readonly maxPrintableCapacity = 14;
  private readonly selectionVersion = signal(0);

  readonly printableCapacityUsed = computed(() => {
    this.selectionVersion();

    return this.questions()
      .filter((question) => question.printable)
      .reduce((total, question) => total + this.getPrintableCost(question), 0);
  });

  toggleQuestion(question: FeedbackQuestionSelection): void {
    question.selected = !question.selected;

    if (!question.selected) {
      question.required = false;
      question.printable = false;
    }

    this.selectionVersion.update((value) => value + 1);
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

    if (question.printable) {
      question.printable = false;
      this.selectionVersion.update((value) => value + 1);
      return;
    }

    const questionCost = this.getPrintableCost(question);

    if (
      this.printableCapacityUsed() + questionCost >
      this.maxPrintableCapacity
    ) {
      return;
    }

    question.printable = true;
    this.selectionVersion.update((value) => value + 1);
  }

  canMakePrintable(question: FeedbackQuestionSelection): boolean {
    if (!question.selected) {
      return false;
    }

    if (question.printable) {
      return true;
    }

    return (
      this.printableCapacityUsed() + this.getPrintableCost(question) <=
      this.maxPrintableCapacity
    );
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

  private getPrintableCost(question: FeedbackQuestionSelection): number {
    switch (question.type) {
      case 'RATING':
        return 1;

      case 'TEXT':
        return 1.25;

      case 'TEXTAREA':
        return 1.75;

      case 'SINGLE_SELECT':
        if (question.options.length <= 3) {
          return 1;
        }

        if (question.options.length <= 5) {
          return 1.25;
        }

        if (question.options.length <= 7) {
          return 1.5;
        }

        return 1.75;

      default:
        return 1.25;
    }
  }
}
