import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageTemplateComponent } from '../../page-wrapper/page-template/page-template.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { StatusPillComponent } from '../../shared/components/status-pill/status-pill.component';
import { AppLoaderService } from '../../shared/components/app-loader/app-loader.service';

@Component({
  selector: 'aa-agency',
  imports: [PageTemplateComponent, ButtonComponent, StatusPillComponent],
  template: `
    <aa-page-template
      title="Agency view"
      subtitle="Preview the agency workspace"
    >
      <section class="component">
        <aa-status-pill
          [config]="{ label: 'Coming soon', variant: 'neutral' }"
        />
        <h2>Your agency workspace is on its way</h2>
        <p>
          The agency view has not been built yet. Use Agent view to manage
          properties, open houses, and leads.
        </p>
        <p>
          Platform admins can switch views from the user menu in the top bar.
          Switching views does not change your account role or permissions.
        </p>
        <aa-button [config]="agentButton" />
      </section>
    </aa-page-template>
  `,
  styles: [
    `
      section {
        padding: 2rem;
        max-width: 48rem;
      }
      p {
        line-height: 1.7;
        margin-bottom: 1.5rem;
      }
    `,
  ],
})
export class AgencyComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly loader = inject(AppLoaderService);
  readonly agentButton = {
    label: 'View as Agent',
    variant: 'secondary' as const,
    click: () => {
      void this.router.navigateByUrl('/home');
    },
  };
  ngOnInit(): void {
    void this.loader.runInitialLoad(() => Promise.resolve());
  }
}
