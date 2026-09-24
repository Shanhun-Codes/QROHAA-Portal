import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { forkJoin, of } from 'rxjs';

import { DialogRef } from '../../../../../shared/components/dialog/dialog-ref';
import { FeedbackQuestionSelectorComponent } from '../../../../../shared/components/feedback-question-selector/feedback-question-selector.component';
import { DynamicFormComponent } from '../../../../../shared/components/dynamic-form/dynamic-form.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

import { FeedbackQuestionsService } from '../../../../../shared/services/feedback-questions.service';
import { PropertiesService } from '../../../../properties/properties.service';

import { PropertyFormValue } from '../../../../properties/models/property.model';
import { AgentFeedbackQuestionRequest } from '../../../../profile/models/question.model';

import { OPEN_HOUSE_FORM_CONFIG } from '../../../config/open-house-form.config';

import {
  PROPERTY_FORM_CONFIG,
  PROPERTY_SELECTION_FORM_CONFIG,
} from '../../../../properties/config/property-form.config';

import { OpenHouseDialogService } from './open-house-dialog.service';
import { DialogType } from '../../../../leads/models/note.model';
import { OpenHouse } from '../../../models/open-house.model';

interface OpenHouseDetailsFormValue {
  startDate: string;
  startTime: string;
  durationDays: 1 | 2;
  endTime: string;
}

interface PropertySelectionFormValue {
  propertyId: string;
}

interface OpenHouseDialogData {
  mode: DialogType;
  openHouse?: OpenHouse;
}

@Component({
  selector: 'aa-open-house-dialog',
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

  private readonly openHouseDialogService = inject(OpenHouseDialogService);

  readonly dialogRef = input.required<DialogRef<any>>();

  readonly data = input.required<OpenHouseDialogData>();

  readonly propertySelectionForm = viewChild<DynamicFormComponent>(
    'propertySelectionForm',
  );

  readonly propertyForm = viewChild<DynamicFormComponent>('propertyForm');

  readonly openHouseForm =
    viewChild.required<DynamicFormComponent>('openHouseForm');

  readonly createProperty = signal(false);

  readonly useDefaultQuestions = signal(true);

  readonly saveAsDefaultQuestions = signal(false);

  readonly propertyFormConfig = PROPERTY_FORM_CONFIG;

  readonly openHouseFormConfig = computed(() => {
    const openHouse = this.data().openHouse;

    if (!openHouse) {
      return OPEN_HOUSE_FORM_CONFIG;
    }

    const startsAt = new Date(openHouse.startsAt);
    const endsAt = new Date(openHouse.endsAt);

    const durationDays: 1 | 2 =
      startsAt.toDateString() === endsAt.toDateString() ? 1 : 2;

    return {
      ...OPEN_HOUSE_FORM_CONFIG,

      fields: OPEN_HOUSE_FORM_CONFIG.fields.map((field) => {
        switch (field.key) {
          case 'startDate':
            return {
              ...field,
              value: this.formatDate(startsAt),
            };

          case 'startTime':
            return {
              ...field,
              value: this.formatTime(startsAt),
            };

          case 'durationDays':
            return {
              ...field,
              value: durationDays,
            };

          case 'endTime':
            return {
              ...field,
              value: this.formatTime(endsAt),
            };

          default:
            return field;
        }
      }),
    };
  });

  readonly feedbackQuestions = computed(() =>
    this.feedbackQuestionsService.feedbackQuestions(),
  );

  readonly hasProperties = computed(
    () => this.propertyService.tableData().length > 0,
  );

  readonly propertySelectionFormConfig = computed(() => {
    const openHouse = this.data().openHouse;

    return {
      ...PROPERTY_SELECTION_FORM_CONFIG,

      fields: PROPERTY_SELECTION_FORM_CONFIG.fields.map((field) =>
        field.key === 'propertyId'
          ? {
              ...field,

              value: openHouse?.propertyId ?? field.value,

              options: this.propertyService.tableData().map((property) => ({
                label: `${property.street}, ${property.city}, ${property.state}`,
                value: property.id,
              })),
            }
          : field,
      ),
    };
  });

  readonly propertyToggleButtonConfig = computed(() => ({
    label: this.createProperty()
      ? 'Select Existing Property'
      : 'Create Property',

    icon: this.createProperty() ? 'home' : 'add',

    variant: 'secondary' as const,

    size: 'sm' as const,

    click: () => this.togglePropertyMode(),
  }));

  constructor() {
    effect(() => {
      const dialogRef = this.dialogRef();

      dialogRef.registerSubmitHandler(() => this.submit());
    });
  }

  ngOnInit(): void {
    forkJoin({
      properties: this.propertyService.getProperties() ?? of([]),

      feedbackQuestions: this.feedbackQuestionsService.getFeedbackQuestions(),

      agentDefaultQuestions:
        this.feedbackQuestionsService.getAgentDefaultQuestions(),
    }).subscribe({
      next: ({ properties, feedbackQuestions, agentDefaultQuestions }) => {
        this.propertyService.tableData.set(properties);

        if (this.data().mode === 'EDIT') {
          this.createProperty.set(false);
        } else if (!properties.length) {
          this.createProperty.set(true);
        }

        this.feedbackQuestionsService.setQuestionsWithDefaults(
          feedbackQuestions,
          agentDefaultQuestions,
        );
      },
    });
  }

  async submit(): Promise<void> {
    const openHouseFormComponent = this.openHouseForm();

    const openHouseForm = openHouseFormComponent.form();

    openHouseForm.markAllAsTouched();

    if (openHouseForm.invalid) {
      return;
    }

    const openHouseValues =
      openHouseForm.getRawValue() as OpenHouseDetailsFormValue;

    let propertyId: string | undefined;
    let property: PropertyFormValue | undefined;

    if (this.createProperty()) {
      const propertyFormComponent = this.propertyForm();

      if (!propertyFormComponent) {
        return;
      }

      const propertyForm = propertyFormComponent.form();

      propertyForm.markAllAsTouched();

      if (propertyForm.invalid) {
        return;
      }

      property = propertyForm.getRawValue() as PropertyFormValue;
    } else {
      const propertySelectionFormComponent = this.propertySelectionForm();

      if (!propertySelectionFormComponent) {
        return;
      }

      const propertySelectionForm = propertySelectionFormComponent.form();

      propertySelectionForm.markAllAsTouched();

      if (propertySelectionForm.invalid) {
        return;
      }

      const propertySelectionValues =
        propertySelectionForm.getRawValue() as PropertySelectionFormValue;

      propertyId = propertySelectionValues.propertyId;
    }

    const questions = this.buildSelectedQuestions();

    if (!this.useDefaultQuestions() && !questions?.length) {
      return;
    }

    const startsAt = this.buildDateTime(
      openHouseValues.startDate,
      openHouseValues.startTime,
    );

    const endsAt = this.buildEndDateTime(
      openHouseValues.startDate,
      openHouseValues.endTime,
      openHouseValues.durationDays,
    );

    if (!startsAt || !endsAt) {
      return;
    }

    const workflow = {
      createProperty: this.createProperty(),

      propertyId,

      property,

      openHouse: {
        startsAt,
        endsAt,
      },

      questions,

      saveAsDefaultQuestions:
        !this.useDefaultQuestions() && this.saveAsDefaultQuestions(),
    };

    let openHouse: OpenHouse | null;

    const data = this.data();

    if (data.mode === 'EDIT' && data.openHouse) {
      openHouse = await this.openHouseDialogService.updateOpenHouse(
        data.openHouse.id,
        workflow,
      );
    } else {
      openHouse = await this.openHouseDialogService.createOpenHouse(workflow);
    }
    if (!openHouse) {
      return;
    }

    this.dialogRef().close(openHouse);
  }

  private togglePropertyMode(): void {
    if (!this.hasProperties()) {
      return;
    }

    this.createProperty.update((value) => !value);
  }

  private buildSelectedQuestions(): AgentFeedbackQuestionRequest[] | undefined {
    if (this.useDefaultQuestions()) {
      return undefined;
    }

    return this.feedbackQuestions()
      .filter((question) => question.selected)
      .map((question) => ({
        questionId: question.id,
        active: true,
        required: question.required,
        sortOrder: question.sortOrder,
        printable: question.printable ?? false,
      }));
  }

  private buildDateTime(date: string, time: string): string | null {
    if (!date || !time) {
      return null;
    }

    const value = new Date(`${date}T${time}`);

    if (Number.isNaN(value.getTime())) {
      return null;
    }

    return value.toISOString();
  }

  private buildEndDateTime(
    startDate: string,
    endTime: string,
    durationDays: 1 | 2,
  ): string | null {
    if (!startDate || !endTime) {
      return null;
    }

    const value = new Date(`${startDate}T${endTime}`);

    if (Number.isNaN(value.getTime())) {
      return null;
    }

    if (durationDays === 2) {
      value.setDate(value.getDate() + 1);
    }

    return value.toISOString();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');

    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  }
}
