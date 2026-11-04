import { Component, inject, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { DynamicFormConfig } from '../../../shared/components/dynamic-form/dynamic-form.model';
import { OnboardingService } from './setup-agent.service';
import { AppLoaderService } from '../../../shared/components/app-loader/app-loader.service';
import { finalize } from 'rxjs';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ButtonConfig } from '../../../shared/components/button/button.config';
import { AuthService } from '../../../auth/auth.service';
import {
  AGENT_FORM_CONFIG,
  RESET_BUTTON_CONFIG,
  SAVE_BUTTON_CONFIG,
} from './config/agent-form.config';
import { AgentSetupFormValues, toAgentSetupRequest } from './setup-agent.model';

@Component({
  selector: 'app-setup-agent',
  standalone: true,
  imports: [DynamicFormComponent, ButtonComponent],
  templateUrl: './setup-agent.component.html',
  styleUrl: './setup-agent.component.scss',
})
export class SetupAgentComponent implements OnInit {
  private readonly onboardingService = inject(OnboardingService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly appLoaderService = inject(AppLoaderService);
  readonly dynamicForm = viewChild(DynamicFormComponent);
  invitationError = '';
  invitationReady = false;
  isAgency = false;
  formConfig: DynamicFormConfig = AGENT_FORM_CONFIG;
  readonly saveButtonConfig: ButtonConfig = {
    ...SAVE_BUTTON_CONFIG,
    click: () => this.dynamicForm()?.submit(),
  };
  readonly resetButtonConfig: ButtonConfig = {
    ...RESET_BUTTON_CONFIG,
    click: () => this.onResetClick(),
  };

  ngOnInit(): void {
    const token = sessionStorage.getItem('onboarding-invitation');
    if (token)
      this.onboardingService.inspectInvitation(token).subscribe({
        next: (invitation) => {
          this.isAgency = invitation.accountType === 'AGENCY';
          if (this.isAgency)
            this.formConfig = {
              fields: [
                {
                  key: 'name',
                  label: 'Brokerage name',
                  type: 'text',
                  required: true,
                },
                { key: 'headline', label: 'Brokerage headline', type: 'text' },
              ],
            };
          this.invitationReady = true;
        },
        error: (error) => {
          this.invitationError =
            error.error?.message ?? 'Unable to verify invitation.';
        },
      });
    else
      this.invitationError = 'A valid invitation link is required to continue.';
    this.onboardingService
      .getMe()
      .pipe(
        finalize(() => {
          this.appLoaderService.stopLoading();
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.hasAgent) {
            sessionStorage.removeItem('onboarding-invitation');
            this.router.navigate(['/home']);
          }
        },

        error: (error) => {
          console.error('ONBOARDING STATUS ERROR:', error);
        },
      });
  }

  onSubmit(values: unknown): void {
    if (!this.invitationReady) return;
    const invitationToken = sessionStorage.getItem('onboarding-invitation');
    if (!invitationToken) {
      this.invitationError = 'A valid invitation link is required to continue.';
      return;
    }

    if (this.isAgency) {
      const agency = values as { name: string; headline?: string };
      if (!agency.name?.trim()) {
        this.invitationError = 'Brokerage name is required.';
        return;
      }
      this.onboardingService.createAgency(invitationToken, agency).subscribe({
        next: () => {
          sessionStorage.removeItem('onboarding-invitation');
          this.router.navigate(['/access-pending']);
        },
        error: (error) => {
          this.invitationError =
            error.error?.message ?? 'Unable to create brokerage.';
        },
      });
      return;
    }
    this.onboardingService
      .createAgent(
        toAgentSetupRequest(values as AgentSetupFormValues, invitationToken),
      )
      .subscribe({
        next: (agent) => {
          sessionStorage.removeItem('onboarding-invitation');
          this.authService.agent.set(agent);
          this.router.navigate(['/access-pending']);
        },
        error: (error) => {
          this.invitationError =
            error.error?.message ?? 'Unable to complete setup.';
        },
      });
  }
  onResetClick(): void {
    this.dynamicForm()?.reset();
  }
}
