import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../../agent/pages/setup-agent/setup-agent.service';
import { AuthService } from '../../auth/auth.service';
import { AppLoaderService } from '../../shared/components/app-loader/app-loader.service';
import { CHECK_ACCESS_BUTTON_CONFIG } from './config/button-config';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ButtonConfig } from '../../shared/components/button/button.config';

@Component({
  selector: 'app-access-pending',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './access-pending.component.html',
  styleUrl: './access-pending.component.scss',
})
export class AccessPendingComponent implements OnInit {
  private readonly onboardingService = inject(OnboardingService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly appLoaderService = inject(AppLoaderService);
  message = 'Your account is waiting for access approval.';

  readonly buttonConfig: ButtonConfig = {
    ...CHECK_ACCESS_BUTTON_CONFIG,
    click: () => this.checkAccess(),
  };

  ngOnInit(): void {
    this.appLoaderService.stopLoading();
  }

  checkAccess(): void {
    this.onboardingService.getMe().subscribe({
      next: (response) => {
        if (response.hasAgent && response.accessGranted && response.agent) {
          this.authService.agent.set(response.agent);
          void this.router.navigate(['/home']);
          return;
        }
        this.message =
          response.accessStatus === 'SUSPENDED'
            ? 'This account is suspended. Contact a platform administrator.'
            : 'Your account is still waiting for access approval.';
      },
      error: () => {
        this.message = 'Unable to check access right now. Please try again.';
      },
    });
  }
}
