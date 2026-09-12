import { Component, inject, OnInit, signal } from '@angular/core';
import { LEFT_HAND_NAV_CONFIG } from './left-hand-nav.config';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { PageWrapperService } from '../../page-wrapper.service';

@Component({
    selector: 'aa-left-hand-nav',
    imports: [RouterLink, MatIcon, RouterLinkActive],
    templateUrl: './left-hand-nav.component.html',
    styleUrl: './left-hand-nav.component.scss'
})
export class LeftHandNavComponent {
  public pageWrapperService = inject(PageWrapperService);

  readonly navConfig = LEFT_HAND_NAV_CONFIG;
  readonly isSideNavExpanded = this.pageWrapperService.isSideNavExpanded;

  public collapseSideNav() {
    this.pageWrapperService.collapseSideNav();
  }
}
