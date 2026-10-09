import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../setup-agent/setup-agent.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-access-pending',
  standalone: true,
  template: `
    <main class="access-pending">
      <h1>Access pending</h1>
      <p>{{ message }}</p>
      <button type="button" (click)="checkAccess()">Check access</button>
    </main>
  `,
  styles: [
    `
      .access-pending {
        max-width: 34rem;
        margin: 12vh auto;
        padding: 2rem;
        text-align: center;
      }
      button {
        min-height: 2.75rem;
        padding: 0 1rem;
        cursor: pointer;
      }
    `,
  ],
})
export class AccessPendingComponent {
  private readonly onboardingService = inject(OnboardingService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  message = 'Your account is waiting for access approval.';

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
