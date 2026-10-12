import { INVITE_AGENT_FORM_CONFIG } from '../../../config/invite-agent-form.config';
import { Component, inject, input, signal } from '@angular/core';
import { DynamicFormComponent } from '../../../../../../shared/components/dynamic-form/dynamic-form.component';
import { DialogRef } from '../../../../../../shared/components/dialog/dialog-ref';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AgencyAgentsService } from '../../../agency-agents.service';
import { InvitationResult } from '../../../agency-agents.model';
@Component({
  selector: 'aa-invite-agent-dialog',
  imports: [DynamicFormComponent],
  templateUrl: './invite-agent-dialog.component.html',
})
export class InviteAgentDialogComponent {
  readonly dialogRef = input.required<DialogRef<InvitationResult>>();
  readonly data = input.required<{ agencyId: string }>();
  private readonly service = inject(AgencyAgentsService);
  readonly saving = signal(false);
  readonly error = signal('');

  async submit(values: unknown) {
    if (this.saving()) return;
    this.saving.set(true);
    this.error.set('');
    try {
      const dto = values as { email: string; role: string };
      const result = await firstValueFrom(this.service.invite(this.data().agencyId, {
        ...dto, email: dto.email.trim().toLowerCase(),
      }));
      this.dialogRef().close(result);
    } catch (error) {
      const message = error instanceof HttpErrorResponse ? error.error?.message : null;
      this.error.set(Array.isArray(message) ? message.join(' ') :
        typeof message === 'string' ? message : 'Unable to create the invitation. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }
  readonly config = INVITE_AGENT_FORM_CONFIG;
}
