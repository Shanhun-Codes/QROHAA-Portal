import {
  EDIT_AGENCY_BRANDING_BUTTON_CONFIG,
  EDIT_AGENCY_BROKERAGE_BUTTON_CONFIG,
  UPLOAD_AGENCY_LOGO_BUTTON_CONFIG,
} from './config/button.config';
import { agencySettingsDialog } from './config/dialog.config';
import { AgencySettingsService } from './agency-settings.service';
import { AgencyOption } from '../../models/agency.model';
import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { AppLoaderService } from '../../../shared/components/app-loader/app-loader.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SelectComponent } from '../../../shared/components/inputs/select/select.component';
import { DialogService } from '../../../shared/components/dialog/dialog.service';
import { SnackbarService } from '../../../shared/components/snackbar/snackbar.service';
import { PageTemplateComponent } from '../../../page-wrapper/page-template/page-template.component';
import { AgencySettings, AgencySettingsUpdate } from './agency-settings.model';
import { AgencyWorkspaceService } from '../../services/agency-workspace.service';

@Component({
  selector: 'aa-agency-settings',
  imports: [PageTemplateComponent, ButtonComponent, SelectComponent],
  templateUrl: './agency-settings.component.html',
  styleUrl: './agency-settings.component.scss',
})
export class AgencySettingsComponent implements OnInit {
  private readonly service = inject(AgencySettingsService);
  private readonly workspace = inject(AgencyWorkspaceService);
  private readonly auth = inject(AuthService);
  private readonly loader = inject(AppLoaderService);
  private readonly dialogs = inject(DialogService);
  private readonly snackbar = inject(SnackbarService);
  readonly selectedAgency = inject(AgencyWorkspaceService).selectedAgency;
  readonly agencies = signal<AgencyOption[]>([]);
  readonly settings = signal<AgencySettings | null>(null);
  readonly busy = signal(false);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly agencyOptions = computed(() =>
    this.agencies().map((agency) => ({ value: agency.id, label: agency.name })),
  );
  readonly colorSwatches = computed(() => [
    { label: 'Primary', value: this.settings()?.primaryColor },
    { label: 'Secondary', value: this.settings()?.secondaryColor },
    { label: 'Accent', value: this.settings()?.accentColor },
  ]);
  readonly brokerageAddress = computed(() => {
    const b = this.settings()?.brokerage;
    return b
      ? [
          [b.street, b.street2].filter(Boolean).join(' '),
          [b.city, b.state, b.zip].filter(Boolean).join(' '),
        ]
          .filter(Boolean)
          .join(', ')
      : '';
  });
  readonly logoInput = viewChild<ElementRef<HTMLInputElement>>('logoInput');
  readonly editBrandingButtonConfig = computed(() => ({
    ...EDIT_AGENCY_BRANDING_BUTTON_CONFIG,
    disabled: this.busy(),
    click: this.editBranding,
  }));
  readonly editBrokerageButtonConfig = computed(() => ({
    ...EDIT_AGENCY_BROKERAGE_BUTTON_CONFIG,
    label: this.settings()?.brokerage ? 'Edit brokerage' : 'Add brokerage',
    disabled: this.busy(),
    click: this.editBrokerage,
  }));
  readonly uploadLogoButtonConfig = computed(() => ({
    ...UPLOAD_AGENCY_LOGO_BUTTON_CONFIG,
    label: this.busy() ? 'Saving…' : 'Upload agency logo',
    disabled: this.busy(),
    click: () => this.logoInput()?.nativeElement.click(),
  }));
  ngOnInit() {
    void this.loader.runInitialLoad(() => this.initialize());
  }
  private async initialize() {
    try {
      await this.auth.getCurrentAgent();
      const agencies = await firstValueFrom(this.workspace.getAgencies());
      this.agencies.set(agencies);
      const initial =
        agencies.find((a) => a.id === this.selectedAgency()) ??
        agencies.find((a) => a.id === this.auth.agencyId()) ??
        agencies[0];
      if (initial) await this.selectAgency(initial.id);
    } catch (error) {
      this.error.set(this.message(error));
    }
  }
  async selectAgency(id: string) {
    if (this.busy() || this.loading()) return;
    this.selectedAgency.set(id);
    this.settings.set(null);
    this.loading.set(true);
    this.error.set('');
    try {
      this.settings.set(
        await firstValueFrom(this.service.getSettings(this.selectedAgency())),
      );
    } catch (error) {
      this.error.set(this.message(error));
    } finally {
      this.loading.set(false);
    }
  }

  editBranding = () => this.edit('BRANDING');
  editBrokerage = () => this.edit('BROKERAGE');
  private edit(mode: 'BRANDING' | 'BROKERAGE') {
    const settings = this.settings();
    if (!settings || this.busy()) return;
    this.dialogs.open(
      agencySettingsDialog({
        settings,
        mode,
        save: (payload: AgencySettingsUpdate) => this.save(payload),
      }),
    );
  }
  private async save(payload: AgencySettingsUpdate): Promise<boolean> {
    if (this.busy()) return false;
    this.busy.set(true);
    this.error.set('');
    try {
      const settings = await firstValueFrom(
        this.service.updateSettings(this.selectedAgency(), payload),
      );
      this.settings.set(settings);
      this.agencies.update((agencies) =>
        agencies.map((a) =>
          a.id === settings.id ? { ...a, name: settings.name } : a,
        ),
      );
      await this.refreshOwnAgent();
      this.snackbar.success(
        'Agency settings saved. Agents inherit these changes when their pages reload.',
      );
      return true;
    } catch (error) {
      this.snackbar.error(this.message(error));
      return false;
    } finally {
      this.busy.set(false);
    }
  }
  async uploadLogo(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || this.busy() || !this.settings()) return;
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      this.snackbar.error('Choose a JPEG, PNG, or WebP logo up to 5 MB.');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      this.settings.set(
        await this.service.uploadLogo(this.selectedAgency(), file),
      );
      await this.refreshOwnAgent();
      this.snackbar.success(
        'Agency logo updated. Agency agents inherit it when their pages reload.',
      );
    } catch (error) {
      this.snackbar.error(this.message(error));
    } finally {
      this.busy.set(false);
    }
  }
  private async refreshOwnAgent() {
    if (this.auth.agent()?.agencyId === this.selectedAgency()) {
      this.auth.agent.set(null);
      await this.auth.getCurrentAgent();
    }
  }
  private message(error: unknown) {
    const message =
      error instanceof HttpErrorResponse ? error.error?.message : null;
    return typeof message === 'string'
      ? message
      : Array.isArray(message)
        ? message.join(' ')
        : 'Unable to update agency settings. Please try again.';
  }
}
