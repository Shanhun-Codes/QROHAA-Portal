import { Component, computed, input, OnInit, signal } from '@angular/core';
import { DialogRef } from '../../../../../shared/components/dialog/dialog-ref';
import { FeedbackQuestionSelectorComponent } from '../../../../../shared/components/feedback-question-selector/feedback-question-selector.component';
import { OpenHouseFormValue } from '../../../models/open-house.model';
import { OPEN_HOUSE_FORM_CONFIG } from '../../../config/open-house-form.config';
import { DynamicFormComponent } from '../../../../../shared/components/dynamic-form/dynamic-form.component';
import {
  PROPERTY_FORM_CONFIG,
  PROPERTY_SELECTION_FORM_CONFIG,
} from '../../../../properties/config/property-form.config';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

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
  readonly createProperty = signal(false);
  readonly useDefaultQuestions = signal(true);
  readonly saveAsDefaultQuestions = signal(false);
  ngOnInit(): void {
    // Initialization logic here
  }
  readonly data = input.required<OpenHouseDialogData>();
  readonly dialogRef = input.required<DialogRef<any>>();

  readonly openHouseFormConfig = OPEN_HOUSE_FORM_CONFIG;
  readonly propertyFormConfig = PROPERTY_FORM_CONFIG;
  propertySelectionFormConfig = PROPERTY_SELECTION_FORM_CONFIG;

  readonly propertyToggleButtonConfig = computed(() => ({
    label: this.createProperty()
      ? 'Select Existing Property'
      : 'Create Property',
    icon: this.createProperty() ? 'home' : 'add',
    variant: 'secondary' as const,
    size: 'sm' as const,
    click: () => this.createProperty.update((value) => !value),
  }));

  readonly feedbackQuestions = [
    {
      id: '1',
      label: 'How did you hear about this open house?',
      selected: true,
      required: true,
      sortOrder: 1,
    },
    {
      id: '2',
      label: 'How would you rate the property?',
      selected: true,
      required: false,
      sortOrder: 2,
    },
    {
      id: '3',
      label: 'Are you pre-qualified for a mortgage?',
      selected: false,
      required: false,
      sortOrder: 3,
    },
    {
      id: '4',
      label: 'Are you currently working with an agent?',
      selected: false,
      required: false,
      sortOrder: 4,
    },
  ];

  readonly propertyOptions = [
    {
      label: '1949 E Sunshine St, Springfield, MO',
      value: 'property-1',
    },
    {
      label: '310 N Jefferson Ave, Springfield, MO',
      value: 'property-2',
    },
    {
      label: '2201 S Campbell Ave, Springfield, MO',
      value: 'property-3',
    },
  ];

  async onSubmit(values: unknown): Promise<void> {
    const success = await this.data().onSubmit(values as OpenHouseFormValue);

    if (success) {
      this.dialogRef().close();
    }
  }
}
