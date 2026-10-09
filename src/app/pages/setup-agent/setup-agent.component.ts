import { Component, inject, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicFormComponent } from '../../shared/components/dynamic-form/dynamic-form.component';
import { DynamicFormConfig } from '../../shared/components/dynamic-form/dynamic-form.model';
import { OnboardingService } from './setup-agent.service';
import { AppLoaderService } from '../../shared/components/app-loader/app-loader.service';
import { finalize } from 'rxjs';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ButtonConfig } from '../../shared/components/button/button.config';
import { AuthService } from '../../auth/auth.service';
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
  readonly formConfig: DynamicFormConfig<AgentSetupFormValues> =
    AGENT_FORM_CONFIG;
  readonly saveButtonConfig: ButtonConfig = {
    ...SAVE_BUTTON_CONFIG,
    click: () => this.dynamicForm()?.submit(),
  };
  readonly resetButtonConfig: ButtonConfig = {
    ...RESET_BUTTON_CONFIG,
    click: () => this.onResetClick(),
  };

  ngOnInit(): void {
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
    const invitationToken = sessionStorage.getItem('onboarding-invitation');
    if (!invitationToken) {
      this.invitationError = 'A valid invitation link is required to continue.';
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
          console.error('AGENT SETUP ERROR:', error);
        },
      });
  }
  onResetClick(): void {
    this.dynamicForm()?.reset();
  }
}
