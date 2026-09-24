import { Component, inject, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicFormComponent } from '../../shared/components/dynamic-form/dynamic-form.component';
import { DynamicFormConfig } from '../../shared/components/models/dynamic-form.model';
import { OnboardingService } from './setup-agent.service';
import { AppLoaderService } from '../../shared/components/app-loader/app-loader.service';
import { finalize } from 'rxjs';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ButtonConfig } from '../../shared/components/button/button.config';
import {
  AGENT_FORM_CONFIG,
  RESET_BUTTON_CONFIG,
  SAVE_BUTTON_CONFIG,
} from './config/agent-form.config';
import { AgentProfile } from '../../auth/auth.model';

@Component({
  selector: 'app-setup-agent',
  standalone: true,
  imports: [DynamicFormComponent, ButtonComponent],
  templateUrl: './setup-agent.component.html',
  styleUrl: './setup-agent.component.scss',
})
export class SetupAgentComponent implements OnInit {
  private readonly onboardingService = inject(OnboardingService);
  private readonly router = inject(Router);
  private readonly appLoaderService = inject(AppLoaderService);
  readonly dynamicForm = viewChild(DynamicFormComponent);
  readonly formConfig: DynamicFormConfig<any> = AGENT_FORM_CONFIG;
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
        next: (response: any) => {
          if (response.hasAgent) {
            this.router.navigate(['/home']);
          }
        },

        error: (error) => {
          console.error('ONBOARDING STATUS ERROR:', error);
        },
      });
  }

  onSubmit(values: unknown): void {
    this.onboardingService.createAgent(values).subscribe({
      next: () => {
        this.router.navigate(['/home']);
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
