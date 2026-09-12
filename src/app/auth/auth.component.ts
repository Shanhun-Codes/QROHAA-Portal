import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { ButtonComponent } from '../shared/components/button/button.component';
import { AppLoaderService } from '../shared/components/app-loader/app-loader.service';
import { DynamicFormConfig } from '../shared/components/models/dynamic-form.model';

@Component({
  selector: 'aa-auth',
  imports: [AsyncPipe, ButtonComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  readonly auth = inject(OidcSecurityService);

  private readonly appLoaderService = inject(AppLoaderService);

  readonly authFormConfig: DynamicFormConfig = {
    layout: {
      gap: 'md',
      labelPosition: 'top',
    },
    fields: [
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        layout: 'full',
        required: true,
        placeholder: 'Enter your email',
      },
    ],
  };

  ngOnInit(): void {
    this.appLoaderService.runInitialLoad(
      () =>
        new Promise<void>((resolve) => {
          this.auth.checkAuth().subscribe({
            next: (result) => {
              console.log('AUTH RESULT:', result);

              this.auth.getAccessToken().subscribe((token) => {
                console.log('ACCESS TOKEN:', token);
              });

              resolve();
            },
            error: () => {
              resolve();
            },
          });
        }),
    );
  }

  login(): void {
    this.auth.authorize();
  }

  logout(): void {
    this.auth.logoff().subscribe();
  }
}
