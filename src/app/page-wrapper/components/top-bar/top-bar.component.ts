import { Component, computed, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TopBarService } from './top-bar.service';
import { AgentProfile, AgentResponse } from '../../../auth/auth.model';

@Component({
  selector: 'aa-top-bar',
  imports: [MatIconModule, RouterLink],
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

  ngOnInit(): void {
    this.topBarService.getAgent();
  }
}
