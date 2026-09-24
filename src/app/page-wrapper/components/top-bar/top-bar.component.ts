import { Component, computed, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TopBarService } from './top-bar.service';
import { AgentProfile, AgentResponse } from '../../../auth/auth.model';
import { AuthService } from '../../../auth/auth.service';
import { ActionMenuItem } from '../../../shared/components/models/action-menu.model';
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
  readonly userName = computed(() => {
    const agent = this.topBarService.agent();
    return agent ? `${agent.firstName} ${agent.lastName}` : '';
  });
  readonly userEmail = computed(() => {
    const agent = this.topBarService.agent();
    return agent ? agent.email : '';
  });
  readonly userAvatarUrl = computed(() => {
    const agent = this.topBarService.agent();
    return agent ? agent.headshotUrl : '';
  });

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly userActions: ActionMenuItem[] = [
    {
      label: 'My Profile',
      icon: 'person',
      action: () => {
        this.router.navigate(['/profile']);
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
  ];

  ngOnInit(): void {
    this.topBarService.getAgent();
  }
}
