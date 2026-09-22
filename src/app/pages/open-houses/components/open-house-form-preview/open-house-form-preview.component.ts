import { Component, computed, input } from '@angular/core';

import {
  FeedbackQuestionDetail,
  OpenHouseDetail,
  OpenHouseFeedbackQuestion,
} from '../../models/open-house.model';

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
      .openHouseFeedbackQuestions.slice()
      .sort((a, b) => a.sortOrder - b.sortOrder),
  );

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
    return selection.question.key.toLowerCase().includes('rating');
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
}
