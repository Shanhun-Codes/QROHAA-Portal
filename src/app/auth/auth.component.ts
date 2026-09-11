import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { ButtonComponent } from '../shared/components/button/button.component';

@Component({
    selector: 'aa-auth',
    imports: [AsyncPipe, ButtonComponent],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  readonly auth = inject(OidcSecurityService);

  ngOnInit(): void {
    this.auth.checkAuth().subscribe();
  }

  login(): void {
    this.auth.authorize();
  }

  logout(): void {
    this.auth.logoff().subscribe();
  }
}
