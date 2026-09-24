import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

import { DialogService } from '../../shared/components/dialog/dialog.service';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { AgentProfile } from '../../auth/auth.model';
import { AgentDialogComponent } from './components/dialogs/agent-dialog/agent-dialog.component';
import { AuthService } from '../../auth/auth.service';
import { PublicPreviewService } from './preview-public.service';

type AgentAssetType = 'headshot' | 'logo';

interface AgentUploadUrlResponse {
  key: string;
  uploadUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly dialogService = inject(DialogService);
  private readonly authService = inject(AuthService);
  private readonly previewService = inject(PublicPreviewService);
  private readonly snackbarService = inject(SnackbarService);

  private readonly agentAppBaseUrl = environment.agentAppApiUrl;

  private readonly agent = computed(() => this.authService.agent());

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

  async uploadAgentAsset(file: File, type: AgentAssetType): Promise<void> {
    try {
      const { key, uploadUrl } = await firstValueFrom(
        this.http.post<AgentUploadUrlResponse>(
          `${this.agentAppBaseUrl}/assets/upload-url`,
          {
            type,
            contentType: file.type,
          },
        ),
      );

      await firstValueFrom(
        this.http.put(uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
          responseType: 'text',
        }),
      );

      const agent = await firstValueFrom(
        this.http.post<AgentProfile>(
          `${this.agentAppBaseUrl}/assets/complete`,
          {
            type,
            key,
          },
        ),
      );

      this.authService.agent.set(agent);

      this.previewService.refreshPreview();

      this.snackbarService.success(
        type === 'headshot'
          ? 'Headshot successfully updated'
          : 'Logo successfully updated',
      );
    } catch (error) {
      console.error('Failed to upload agent asset:', error);

      this.snackbarService.error(
        type === 'headshot'
          ? 'Unable to upload headshot'
          : 'Unable to upload logo',
      );
    }
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
