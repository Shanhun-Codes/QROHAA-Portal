import { Component, computed, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TopBarService } from './top-bar.service';
import { AuthService } from '../../../auth/auth.service';
import { ActionMenuItem } from '../../../shared/components/action-menu/action-menu.model';
import { ActionMenuComponent } from '../../../shared/components/action-menu/action-menu.component';

@Component({
  selector: 'aa-top-bar',
  imports: [MatIconModule, RouterLink, ActionMenuComponent],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent implements OnInit {
  private readonly topBarService = inject(TopBarService);
  public title = this.topBarService.title;
  public activePortal = this.topBarService.activePortal;
  public subtitle = this.activePortal;
  readonly isAgencyView = this.topBarService.isAgencyView;
  readonly userName = computed(() => {
    const agent = this.topBarService.agent();
    return agent
      ? `${agent.firstName} ${agent.lastName}`
      : 'Agency administrator';
  });
  readonly userEmail = computed(() => {
    const agent = this.topBarService.agent();
    return agent ? agent.email : 'Agency administrator';
  });
  readonly userAvatarUrl = computed(() => {
    const agent = this.topBarService.agent();
    return agent ? agent.headshotUrl : '';
  });

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly hasAgent = computed(() => Boolean(this.authService.agent()));
  readonly userActions = computed<ActionMenuItem[]>(() => [
    ...(this.authService.canAccessAgency() &&
    (this.authService.isPlatformAdmin() || this.hasAgent())
      ? [
          {
            label: this.topBarService.isAgencyView()
              ? 'View as Agent'
              : 'View as Agency',
            icon: this.topBarService.isAgencyView() ? 'person' : 'business',
            action: () => {
              void this.router.navigateByUrl(
                this.topBarService.isAgencyView() ? '/home' : '/agency',
              );
            },
          },
        ]
      : []),
    {
      label: 'My Profile',
      icon: 'person',
      disabled: !this.hasAgent(),
      action: async () => {
        const result = await this.router.navigateByUrl('/settings');
      },
    },
    {
      label: 'Sign Out',
      icon: 'logout',
      danger: true,
      action: () => {
        this.authService.logout();
      },
    },
  ]);

  ngOnInit(): void {
    this.topBarService.getAgent();
  }
}
