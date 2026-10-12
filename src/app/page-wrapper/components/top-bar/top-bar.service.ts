import { computed, inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class TopBarService {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  readonly isAgencyView = computed(() => {
    const path = this.currentUrl().split(/[?#]/)[0];
    return path === '/agency' || path.startsWith('/agency/');
  });
  readonly activePortal = computed(() =>
    this.isAgencyView() ? 'Agency App' : 'Agent App',
  );
  readonly title = 'Open House Studio';
  readonly agent = this.authService.agent;

  getAgent() {
    return this.authService.getCurrentAgent();
  }
}
