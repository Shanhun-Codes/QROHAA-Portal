import { computed, inject, Injectable } from '@angular/core';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { AgentProfile } from '../../auth/auth.model';
import { AgentDialogComponent } from './components/dialogs/agent-dialog/agent-dialog.component';
import { AuthService } from '../../auth/auth.service';
import { PublicPreviewService } from './preview-public.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly dialogService = inject(DialogService);
  private readonly authService = inject(AuthService);
  private readonly previewService = inject(PublicPreviewService);
  private readonly agent = computed(() => this.authService.agent);

  async updateAgent(values: AgentProfile) {
    try {
      await this.authService.updateCurrentAgent(values);
      this.previewService.refreshPreview();
      return true;
    } catch (error) {
      console.error('Failed to update agent:', error);
    }
    return false;
  }

  async openAgentDialog(mode: 'BRANDING' | 'PROFILE'): Promise<void> {
    this.dialogService.open({
      title: mode === 'BRANDING' ? 'Branding Details' : 'Agent Details',
      contentComponent: AgentDialogComponent,
      data: {
        formMode: mode,
        agent: this.agent(),
        onSubmit: (values: AgentProfile) => this.updateAgent(values),
      },
      actions: [
        {
          label: 'Cancel',
          type: 'secondary',
        },
        {
          label: mode === 'BRANDING' ? 'Update Branding' : 'Update Profile',
          type: 'primary',
          submit: true,
        },
      ],
    });
  }
}
