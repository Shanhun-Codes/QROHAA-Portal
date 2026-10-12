import {
  RETRY_INVITATION_BUTTON_CONFIG,
  LEAVE_INVITATION_BUTTON_CONFIG,
  JOIN_SIGN_IN_BUTTON_CONFIG,
  DIFFERENT_ACCOUNT_BUTTON_CONFIG,
  RETURN_WORKSPACE_BUTTON_CONFIG,
  ACCEPT_INVITATION_BUTTON_CONFIG,
  CANCEL_INVITATION_BUTTON_CONFIG,
} from './config/button.config';
import { JoinAgencyService } from './join-agency.service';
import { InvitationPreview } from './join-agency.model';
import { JOIN_AGENCY_FORM_CONFIG } from './config/join-agency-form.config';
import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { AppLoaderService } from '../../../shared/components/app-loader/app-loader.service';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'aa-join-agency',
  imports: [DynamicFormComponent, ButtonComponent],
  templateUrl: './join-agency.component.html',
  styleUrl: './join-agency.component.scss',
})
export class JoinAgencyComponent implements OnInit {
  private readonly oidc = inject(OidcSecurityService);
  private readonly service = inject(JoinAgencyService);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly loader = inject(AppLoaderService);
  readonly form = viewChild<DynamicFormComponent>('personalForm');
  readonly preview = signal<InvitationPreview | null>(null);
  readonly signedIn = signal(false);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  private token = '';
  readonly formConfig = JOIN_AGENCY_FORM_CONFIG;
  readonly brokerageConfig = computed(() => ({
    fields: [
      { key: 'name', label: 'Brokerage name', type: 'text' as const, readonly: true,
        value: this.preview()?.agency.brokerage?.name ?? '', layout: 'half' as const },
      { key: 'licenseNumber', label: 'Brokerage license number', type: 'text' as const, readonly: true,
        value: this.preview()?.agency.brokerage?.licenseNumber ?? '', layout: 'half' as const },
    ],
  }));
  readonly retryButtonConfig = {
    ...RETRY_INVITATION_BUTTON_CONFIG,
    click: () => { void this.initialize(); },
  };
  readonly leaveButtonConfig = {
    ...LEAVE_INVITATION_BUTTON_CONFIG,
    click: () => this.cancel(),
  };
  readonly loginButtonConfig = {
    ...JOIN_SIGN_IN_BUTTON_CONFIG,
    click: () => this.login(),
  };
  readonly differentAccountButtonConfig = {
    ...DIFFERENT_ACCOUNT_BUTTON_CONFIG,
    click: () => this.differentAccount(),
  };
  readonly returnWorkspaceButtonConfig = {
    ...RETURN_WORKSPACE_BUTTON_CONFIG,
    click: () => this.cancel(),
  };
  readonly acceptButtonConfig = computed(() => ({
    ...ACCEPT_INVITATION_BUTTON_CONFIG,
    label: this.saving() ? 'Joining…' : 'Accept invitation & join agency',
    disabled: this.saving(),
    click: () => this.form()?.submit(),
  }));
  readonly cancelButtonConfig = computed(() => ({
    ...CANCEL_INVITATION_BUTTON_CONFIG,
    disabled: this.saving(),
    click: () => this.cancel(),
  }));
  ngOnInit(): void {
    void this.loader.runInitialLoad(() => this.initialize());
  }
  private async initialize() {
    this.loading.set(true);
    this.error.set('');
    const fragmentToken = new URLSearchParams(
      window.location.hash.slice(1),
    ).get('invite');
    if (fragmentToken) {
      sessionStorage.setItem('agency-invitation', fragmentToken);
      // Keep bearer invitation tokens out of the address bar after capturing them.
      window.history.replaceState(
        window.history.state,
        '',
        window.location.pathname + window.location.search,
      );
    }
    this.token = sessionStorage.getItem('agency-invitation') ?? '';
    try {
      if (!this.token) {
        this.error.set(
          'An agency invitation link is required. Ask your agency administrator for an invitation.',
        );
        return;
      }
      const { isAuthenticated } = await firstValueFrom(
        this.oidc.isAuthenticated$,
      );
      this.signedIn.set(isAuthenticated);
      if (!isAuthenticated) return;
      const idToken = await firstValueFrom(this.oidc.getIdToken());
      this.preview.set(
        await firstValueFrom(this.service.inspect(this.token, idToken)),
      );
    } catch (error) {
      this.error.set(this.message(error));
    } finally {
      this.loading.set(false);
    }
  }
  login() {
    this.oidc.authorize();
  }
  differentAccount() {
    this.auth.logout();
  }
  cancel() {
    sessionStorage.removeItem('agency-invitation');
    void this.router.navigateByUrl('/auth');
  }
  async accept(values: unknown) {
    if (
      this.saving() ||
      !this.preview()?.emailMatches ||
      this.preview()?.existingAccount
    )
      return;
    this.saving.set(true);
    this.error.set('');
    try {
      const idToken = await firstValueFrom(this.oidc.getIdToken());
      await firstValueFrom(
        this.service.accept(this.token, idToken, values as object),
      );
      sessionStorage.removeItem('agency-invitation');
      this.auth.agent.set(null);
      await this.auth.getCurrentAgent();
      await this.router.navigateByUrl(
        this.preview()?.role === 'AGENCY_ADMIN' ? '/agency' : '/home',
      );
    } catch (error) {
      this.error.set(this.message(error));
    } finally {
      this.saving.set(false);
    }
  }
  private message(error: unknown) {
    const message =
      error instanceof HttpErrorResponse ? error.error?.message : null;
    if (message === 'Invalid invitation identity')
      return 'We could not confirm your verified email. Finish email verification, then sign in again using the invited email. Your invitation has been kept.';
    if (message === 'Unable to verify Cognito identity')
      return 'We could not check your account with the sign-in service. Your invitation has been kept. Try checking it again; if this continues, contact your agency administrator.';
    return typeof message === 'string' 
      ? message
      : Array.isArray(message)
        ? message.join(' ')
        : 'Unable to verify your invitation. Check that your Cognito email is verified and try reopening the invitation.';
  }
}
