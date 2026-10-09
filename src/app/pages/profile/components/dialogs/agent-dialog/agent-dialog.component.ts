import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { DialogRef } from '../../../../../shared/components/dialog/dialog-ref';
import {
  AGENT_FORM_CONFIG,
  BRANDING_FORM_CONFIG,
  BROKERAGE_FORM_CONFIG,
} from '../../../config/agent-form.config';
import { AgentProfile } from '../../../../../auth/auth.model';
import { DynamicFormComponent } from '../../../../../shared/components/dynamic-form/dynamic-form.component';
import { AuthService } from '../../../../../auth/auth.service';
import { Brokerage } from '../../../../../auth/auth.model';
import { SnackbarService } from '../../../../../shared/components/snackbar/snackbar.service';
import {
  AgentProfileFormValues,
  toAgentUpdateRequest,
} from '../../../profile-form.model';

interface AgentDialogData {
  onSubmit: (
    values: ReturnType<typeof toAgentUpdateRequest>,
  ) => Promise<boolean>;
  formMode: 'BRANDING' | 'BROKERAGE' | 'PROFILE';
}
@Component({
  selector: 'aa-agent-dialog',
  imports: [DynamicFormComponent],
  templateUrl: './agent-dialog.component.html',
  styleUrl: './agent-dialog.component.scss',
})
export class AgentDialogComponent implements OnInit {
  ngOnInit(): void {
    this.setFormData();
  }
  private readonly authService = inject(AuthService);
  private readonly snackbarService = inject(SnackbarService);
  readonly data = input.required<AgentDialogData>();
  readonly dialogRef = input.required<DialogRef<any>>();
  readonly agent = computed(() => this.authService.agent());

  readonly profileFormConfig = computed(() => {
    const agent = this.agent();

    return {
      ...AGENT_FORM_CONFIG,

      fields: AGENT_FORM_CONFIG.fields.map((field) => ({
        ...field,
        value: this.getProfileValue(field.key, agent) ?? field.value ?? '',
      })),
    };
  });

  readonly brokerageFormConfig = computed(() => {
    const agent = this.agent();

    return {
      ...BROKERAGE_FORM_CONFIG,

      fields: BROKERAGE_FORM_CONFIG.fields.map((field) => ({
        ...field,
        value: this.getBrandingValue(field.key, agent) ?? field.value ?? '',
        disabled:
          field.key.startsWith('brokerage') && agent?.brandingLocked === true,
        required:
          field.key === 'brokerageName' ? !agent?.brokerage : field.required,
      })),
    };
  });

  readonly brandingFormConfig = computed(() => ({
    ...BRANDING_FORM_CONFIG,
    fields: BRANDING_FORM_CONFIG.fields.map((field) => ({
      ...field,
      value:
        this.getBrandingValue(field.key, this.agent()) ?? field.value ?? '',
    })),
  }));

  readonly formConfig = signal(AGENT_FORM_CONFIG);

  setFormData() {
    switch (this.data().formMode) {
      case 'BRANDING':
        return this.formConfig.set(this.brandingFormConfig());
      case 'BROKERAGE':
        return this.formConfig.set(this.brokerageFormConfig());
      default:
        return this.formConfig.set(this.profileFormConfig());
    }
  }

  async onSubmit(values: unknown): Promise<void> {
    const formValues = values as AgentProfileFormValues;

    if (
      this.data().formMode === 'BROKERAGE' &&
      !formValues.brokerageName.trim() &&
      this.hasBrokerageDetails(formValues)
    ) {
      this.snackbarService.error(
        'Enter a brokerage name to save brokerage details.',
      );
      return;
    }

    if (this.data().formMode === 'BROKERAGE' && this.agent()?.brandingLocked) {
      this.snackbarService.error('Your agency manages brokerage details.');
      return;
    }

    const success = await this.data().onSubmit(
      toAgentUpdateRequest(formValues, this.data().formMode),
    );

    if (success) {
      this.dialogRef().close();
    }
  }

  private getProfileValue(
    key: keyof AgentProfileFormValues,
    agent: AgentProfile | null,
  ): string | null | undefined {
    if (!agent) return undefined;

    const value = agent[key as keyof AgentProfile];
    return typeof value === 'string' || value === null ? value : undefined;
  }

  private getBrandingValue(
    key: keyof AgentProfileFormValues,
    agent: AgentProfile | null,
  ): string | null | undefined {
    if (!agent) return undefined;

    const brokerageKeys: Partial<
      Record<keyof AgentProfileFormValues, keyof Brokerage>
    > = {
      brokerageName: 'name',
      brokerageLicenseNumber: 'licenseNumber',
      brokerageStreet: 'street',
      brokerageStreet2: 'street2',
      brokerageCity: 'city',
      brokerageState: 'state',
      brokerageZip: 'zip',
      brokeragePhone: 'phone',
      brokerageEmail: 'email',
      brokerageWebsiteUrl: 'websiteUrl',
    };
    const brokerageKey = brokerageKeys[key];

    if (brokerageKey) {
      return agent.brokerage?.[brokerageKey] ?? undefined;
    }

    const value = agent[key as keyof AgentProfile];
    return typeof value === 'string' || value === null ? value : undefined;
  }

  private hasBrokerageDetails(values: AgentProfileFormValues): boolean {
    return [
      values.brokerageLicenseNumber,
      values.brokerageStreet,
      values.brokerageStreet2,
      values.brokerageCity,
      values.brokerageState,
      values.brokerageZip,
      values.brokeragePhone,
      values.brokerageEmail,
      values.brokerageWebsiteUrl,
    ].some((value) => value.trim().length > 0);
  }
}
