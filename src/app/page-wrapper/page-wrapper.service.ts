import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PageWrapperService {
  constructor() {}

  readonly isSideNavExpanded = signal(true);

  collapseSideNav() {
    this.isSideNavExpanded.update((value) => !value);
  }
}
