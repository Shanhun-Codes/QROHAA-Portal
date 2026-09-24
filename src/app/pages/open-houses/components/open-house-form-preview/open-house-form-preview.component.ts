import { Component, computed, input } from '@angular/core';

import {
  FeedbackQuestionDetail,
  OpenHouseDetail,
  OpenHouseFeedbackQuestion,
} from '../../models/open-house.model';

interface PrintableQuestion {
  selection: OpenHouseFeedbackQuestion;
  number: number;
}

@Component({
  selector: 'aa-open-house-form-preview',
  imports: [],
  templateUrl: './open-house-form-preview.component.html',
  styleUrl: './open-house-form-preview.component.scss',
})
export class OpenHouseFormPreviewComponent {
  readonly openHouse = input.required<OpenHouseDetail>();

  readonly agentName = computed(
    () =>
      `${this.openHouse().agent.firstName} ${this.openHouse().agent.lastName}`,
  );

  readonly questions = computed(() =>
    this.openHouse()
      .openHouseFeedbackQuestions.filter((selection) => selection.printable)
      .slice()
      .sort(
        (a, b) =>
          (a.printableSortOrder ?? a.sortOrder) -
          (b.printableSortOrder ?? b.sortOrder),
      ),
  );

  readonly questionColumns = computed(() => {
    const questions: PrintableQuestion[] = this.questions().map(
      (selection, index) => ({
        selection,
        number: index + 1,
      }),
    );

    if (questions.length <= 1) {
      return {
        left: questions,
        right: [] as PrintableQuestion[],
      };
    }

    const totalCost = questions.reduce(
      (total, item) => total + this.getPrintableCost(item.selection),
      0,
    );

    const targetCost = totalCost / 2;

    let runningCost = 0;
    let splitIndex = 1;
    let smallestDifference = Number.POSITIVE_INFINITY;

    for (let index = 0; index < questions.length - 1; index++) {
      runningCost += this.getPrintableCost(questions[index].selection);

      const difference = Math.abs(targetCost - runningCost);

      if (difference < smallestDifference) {
        smallestDifference = difference;
        splitIndex = index + 1;
      }
    }

    return {
      left: questions.slice(0, splitIndex),
      right: questions.slice(splitIndex),
    };
  });

  readonly propertyAddress = computed(() => {
    const property = this.openHouse().property;

    return [
      property.street,
      property.street2,
      `${property.city}, ${property.state} ${property.zip}`,
    ]
      .filter(Boolean)
      .join(', ');
  });

  isRatingQuestion(selection: OpenHouseFeedbackQuestion): boolean {
    return (
      selection.question.type === 'RATING' ||
      selection.question.key.toLowerCase().includes('rating')
    );
  }

  isLongTextQuestion(question: FeedbackQuestionDetail): boolean {
    return ['TEXTAREA', 'LONG_TEXT'].includes(question.type);
  }

  isTextQuestion(question: FeedbackQuestionDetail): boolean {
    return ['TEXT', 'SHORT_TEXT'].includes(question.type);
  }

  isBooleanQuestion(question: FeedbackQuestionDetail): boolean {
    return ['BOOLEAN', 'YES_NO'].includes(question.type);
  }

  isMultiSelectQuestion(question: FeedbackQuestionDetail): boolean {
    return ['MULTI_SELECT', 'CHECKBOX', 'CHECKBOXES'].includes(question.type);
  }

  isSingleSelectQuestion(question: FeedbackQuestionDetail): boolean {
    return ['SINGLE_SELECT', 'RADIO'].includes(question.type);
  }

  private getPrintableCost(selection: OpenHouseFeedbackQuestion): number {
    const question = selection.question;

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
