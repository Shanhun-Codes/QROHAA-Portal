import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { forkJoin, of } from 'rxjs';

import { DialogRef } from '../../../../../shared/components/dialog/dialog-ref';
import { FeedbackQuestionSelectorComponent } from '../../../../../shared/components/feedback-question-selector/feedback-question-selector.component';
import { DynamicFormComponent } from '../../../../../shared/components/dynamic-form/dynamic-form.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

import { FeedbackQuestionsService } from '../../../../../shared/services/feedback-questions.service';
import { PropertiesService } from '../../../../properties/properties.service';

import { OpenHouseFormValue } from '../../../models/open-house.model';

import { OPEN_HOUSE_FORM_CONFIG } from '../../../config/open-house-form.config';
import {
  PROPERTY_FORM_CONFIG,
  PROPERTY_SELECTION_FORM_CONFIG,
} from '../../../../properties/config/property-form.config';

interface OpenHouseDialogData {
  onSubmit: (values: OpenHouseFormValue) => Promise<boolean>;
}

@Component({
  selector: 'aa-open-house-dialog',
  standalone: true,
  imports: [
    FeedbackQuestionSelectorComponent,
    DynamicFormComponent,
    ButtonComponent,
  ],
  templateUrl: './open-house-dialog.component.html',
  styleUrl: './open-house-dialog.component.scss',
})
export class OpenHouseDialogComponent implements OnInit {
  private readonly propertyService = inject(PropertiesService);
  private readonly feedbackQuestionsService = inject(FeedbackQuestionsService);

  readonly data = input.required<OpenHouseDialogData>();
  readonly dialogRef = input.required<DialogRef<any>>();

  readonly createProperty = signal(false);
  readonly useDefaultQuestions = signal(true);
  readonly saveAsDefaultQuestions = signal(false);

  readonly openHouseFormConfig = OPEN_HOUSE_FORM_CONFIG;
  readonly propertyFormConfig = PROPERTY_FORM_CONFIG;

  readonly feedbackQuestions = computed(() =>
    this.feedbackQuestionsService.feedbackQuestions(),
  );

  readonly propertySelectionFormConfig = computed(() => ({
    ...PROPERTY_SELECTION_FORM_CONFIG,
    fields: PROPERTY_SELECTION_FORM_CONFIG.fields.map((field) =>
      field.key === 'propertyId'
        ? {
            ...field,
            options: this.propertyService.tableData().map((property) => ({
              label: `${property.street}, ${property.city}, ${property.state}`,
              value: property.id,
            })),
          }
        : field,
    ),
  }));

  readonly propertyToggleButtonConfig = computed(() => ({
    label: this.createProperty()
      ? 'Select Existing Property'
      : 'Create Property',
    icon: this.createProperty() ? 'home' : 'add',
    variant: 'secondary' as const,
    size: 'sm' as const,
    click: () => this.createProperty.update((value) => !value),
  }));

  ngOnInit(): void {
    const requests = {
      properties: this.propertyService.getProperties() ?? of([]),
      feedbackQuestions: this.feedbackQuestionsService.getFeedbackQuestions(),
      agentDefaultQuestions:
        this.feedbackQuestionsService.getAgentDefaultQuestions(),
    };

    forkJoin(requests).subscribe({
      next: ({ properties, feedbackQuestions, agentDefaultQuestions }) => {
        this.propertyService.tableData.set(properties);

        const mappedFeedbackQuestions = feedbackQuestions.map(
          (feedbackQuestion) => {
            const defaultQuestion = agentDefaultQuestions.find(
              (agentDefaultQuestion) =>
                agentDefaultQuestion.questionId === feedbackQuestion.id,
            );

            return {
              ...feedbackQuestion,
              selected: !!defaultQuestion,
              required: defaultQuestion?.required ?? false,
              sortOrder:
                defaultQuestion?.sortOrder ?? feedbackQuestion.sortOrder,
            };
          },
        );

        this.feedbackQuestionsService.feedbackQuestions.set(
          mappedFeedbackQuestions,
        );

        this.feedbackQuestionsService.agentDefaultQuestions.set(
          agentDefaultQuestions,
        );
      },
    });
  }

  async onSubmit(values: unknown): Promise<void> {
    const success = await this.data().onSubmit(values as OpenHouseFormValue);

    if (success) {
      this.dialogRef().close();
    }
  }
}
