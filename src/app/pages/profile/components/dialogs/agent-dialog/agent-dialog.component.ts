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
} from '../../../config/agent-form.config';
import { AgentProfile } from '../../../../../auth/auth.model';
import { DynamicFormComponent } from '../../../../../shared/components/dynamic-form/dynamic-form.component';
import { AuthService } from '../../../../../auth/auth.service';

interface AgentDialogData {
  onSubmit: (values: AgentProfile) => Promise<boolean>;
  formMode: 'BRANDING' | 'PROFILE';
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
  readonly data = input.required<AgentDialogData>();
  readonly dialogRef = input.required<DialogRef<any>>();
  readonly agent = computed(() => this.authService.agent());

  readonly profileFormConfig = computed(() => {
    const agent = this.agent();

    return {
      ...AGENT_FORM_CONFIG,

      fields: AGENT_FORM_CONFIG.fields.map((field) => ({
        ...field,
        value: agent?.[field.key] ?? field.value ?? '',
      })),
    };
  });

  readonly brandingFormConfig = computed(() => {
    const agent = this.agent();

    return {
      ...BRANDING_FORM_CONFIG,

      fields: BRANDING_FORM_CONFIG.fields.map((field) => ({
        ...field,
        value: agent?.[field.key] ?? field.value ?? '',
      })),
    };
  });

  readonly formConfig = signal<any>(null);

  setFormData() {
    return this.data().formMode === 'BRANDING'
      ? this.formConfig.set(this.brandingFormConfig())
      : this.formConfig.set(this.profileFormConfig());
  }

  async onSubmit(values: unknown): Promise<void> {
    const success = await this.data().onSubmit(values as AgentProfile);

    if (success) {
      this.dialogRef().close();
    }
  }
}
