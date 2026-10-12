import {
  DEACTIVATE_AGENTS_BUTTON_CONFIG,
  REACTIVATE_AGENTS_BUTTON_CONFIG,
  INVITE_AGENT_BUTTON_CONFIG,
  REFRESH_AGENCY_BUTTON_CONFIG,
  COPY_INVITATION_BUTTON_CONFIG,
} from './config/button.config';
import {
  selectedMemberStatusDialog,
  INVITE_AGENT_DIALOG_CONFIG,
  revokeInvitationDialog,
  memberStatusDialog,
} from './config/dialog.config';
import { BulkActionsBarComponent } from '../../../shared/components/bulk-actions-bar/bulk-actions-bar.component';
import { AgencyAgentsService } from './agency-agents.service';
import { AGENCY_AGENTS_TABLE_HEADER_CONFIG } from './config/agency-agents-table-header.config';
import { AgencyOption } from '../../models/agency.model';
import { AgencyWorkspaceService } from '../../services/agency-workspace.service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { PageTemplateComponent } from '../../../page-wrapper/page-template/page-template.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SelectComponent } from '../../../shared/components/inputs/select/select.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ActionMenuComponent } from '../../../shared/components/action-menu/action-menu.component';
import { ActionMenuItem } from '../../../shared/components/action-menu/action-menu.model';
import { AppLoaderService } from '../../../shared/components/app-loader/app-loader.service';
import { DialogService } from '../../../shared/components/dialog/dialog.service';
import { SnackbarService } from '../../../shared/components/snackbar/snackbar.service';
import {
  AgencyInvitation,
  AgencyMember,
  AgencyOverview,
  InvitationResult,
} from './agency-agents.model';

@Component({
  selector: 'aa-agency',
  imports: [
    BulkActionsBarComponent,
    PageTemplateComponent,
    ButtonComponent,
    SelectComponent,
    TableComponent,
    ActionMenuComponent,
    DatePipe,
  ],
  templateUrl: './agency-agents.component.html',
  styleUrl: './agency-agents.component.scss',
})
export class AgencyAgentsComponent implements OnInit {
  private readonly service = inject(AgencyAgentsService);
  private readonly workspace = inject(AgencyWorkspaceService);
  private readonly auth = inject(AuthService);
  private readonly loader = inject(AppLoaderService);
  private readonly dialogs = inject(DialogService);
  private readonly snackbar = inject(SnackbarService);
  readonly agencies = signal<AgencyOption[]>([]);
  readonly selectedAgency = inject(AgencyWorkspaceService).selectedAgency;
  readonly detail = signal<AgencyOverview | null>(null);
  readonly loading = signal(false);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly invitationResult = signal<InvitationResult | null>(null);
  readonly agencyOptions = computed(() =>
    this.agencies().map((item) => ({ label: item.name, value: item.id })),
  );
  readonly atCapacity = computed(() => {
    const d = this.detail();
    return (
      d?.agency.seatLimit != null &&
      d.usedSeats + d.reservedSeats >= d.agency.seatLimit
    );
  });
  readonly selectedMemberIds = signal<string[]>([]);
  readonly selectedAgents = computed(() => this.detail()?.members.filter(
    member => member.role === 'AGENT' && this.selectedMemberIds().includes(member.id),
  ) ?? []);
  readonly deactivateSelectedButton = computed(() => ({
    ...DEACTIVATE_AGENTS_BUTTON_CONFIG,
    disabled: this.busy() || this.loading() || !this.selectedAgents().some(m => m.status === 'ACTIVE'),
    click: () => { void this.setSelectedStatus(false); },
  }));
  readonly reactivateSelectedButton = computed(() => ({
    ...REACTIVATE_AGENTS_BUTTON_CONFIG,
    disabled: this.busy() || this.loading() || !this.selectedAgents().some(m => m.status !== 'ACTIVE'),
    click: () => { void this.setSelectedStatus(true); },
  }));
  async setSelectedStatus(active: boolean) {
    if (this.busy() || this.loading()) return;
    const agencyId = this.selectedAgency();
    const members = this.selectedAgents().filter(m => active ? m.status !== 'ACTIVE' : m.status === 'ACTIVE');
    if (!members.length) return;
    const confirmed = await this.dialogs.open<boolean>(selectedMemberStatusDialog(members.length, active)).afterClosed();
    if (!confirmed || this.busy() || this.selectedAgency() !== agencyId) return;
    this.busy.set(true);
    this.error.set('');
    const failures: string[] = [];
    try {
      for (const member of members) {
        try {
          await firstValueFrom(this.service.updateStatus(agencyId, member.id, active ? 'ACTIVE' : 'SUSPENDED'));
        } catch (error) { failures.push(`${member.email}: ${this.message(error)}`); }
      }
      this.selectedMemberIds.set([]);
      await this.load();
      if (failures.length) this.error.set(failures.join(' '));
      else this.snackbar.success(active ? 'Selected agents reactivated' : 'Selected agents deactivated');
    } finally { this.busy.set(false); }
  }
  readonly memberHeaders = AGENCY_AGENTS_TABLE_HEADER_CONFIG;
  readonly memberRows = computed(
    () =>
      this.detail()?.members.map((member) => ({
        ...member,
        name: member.agent
          ? `${member.agent.firstName} ${member.agent.lastName}`
          : 'Agency administrator',
        access:
          member.role === 'AGENCY_ADMIN'
            ? 'Agency Administrator'
            : member.role === 'PLATFORM_ADMIN'
              ? 'Platform Administrator'
              : 'Agent',
        statusLabel: member.status === 'ACTIVE' ? 'Active' : 'Deactivated',
      })) ?? [],
  );
  readonly refreshButtonConfig = computed(() => ({
    ...REFRESH_AGENCY_BUTTON_CONFIG,
    disabled: this.busy() || this.loading(),
    click: () => {
      void this.load();
    },
  }));
  readonly inviteButtonConfig = computed(() => ({
    ...INVITE_AGENT_BUTTON_CONFIG,
    disabled: this.busy() || this.loading() || this.atCapacity(),
    click: () => {
      void this.invite();
    },
  }));
  readonly copyInvitationButtonConfig = {
    ...COPY_INVITATION_BUTTON_CONFIG,
    click: () => {
      void this.copyLink();
    },
  };
  ngOnInit(): void {
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
    this.selectedMemberIds.set([]);
    this.selectedAgency.set(id);
    this.invitationResult.set(null);
    this.detail.set(null);
    await this.load();
  }
  async load() {
    this.loading.set(true);
    this.error.set('');
    try {
      this.detail.set(
        await firstValueFrom(this.service.getOverview(this.selectedAgency())),
      );
    } catch (error) {
      this.error.set(this.message(error));
    } finally {
      this.loading.set(false);
    }
  }

  async invite() {
    if (this.busy() || this.atCapacity()) return;
    const result = await this.dialogs
      .open<InvitationResult>({
        ...INVITE_AGENT_DIALOG_CONFIG,
        data: { agencyId: this.selectedAgency() },
      })
      .afterClosed();
    if (result) {
      this.invitationResult.set(result);
      await this.load();
    }
  }

  invitationStatus(invite: AgencyInvitation) {
    return invite.redeemedAt
      ? 'Accepted'
      : invite.revokedAt
        ? 'Revoked'
        : Date.parse(invite.expiresAt) <= Date.now()
          ? 'Expired'
          : 'Invited';
  }
  invitationActions(invite: AgencyInvitation): ActionMenuItem[] {
    return [
      {
        label: 'Resend invitation',
        icon: 'send',
        disabled: this.busy() || this.invitationStatus(invite) !== 'Invited',
        action: () => {
          void this.mutate(
            () => this.service.resend(this.selectedAgency(), invite.id),
            true,
          );
        },
      },
      {
        label: 'Revoke invitation',
        icon: 'cancel',
        danger: true,
        disabled: this.busy() || Boolean(invite.redeemedAt || invite.revokedAt),
        action: () => {
          void this.revoke(invite);
        },
      },
    ];
  }
  private async revoke(invite: AgencyInvitation) {
    const confirmed = await this.dialogs
      .open<boolean>(revokeInvitationDialog(invite.email))
      .afterClosed();
    if (confirmed)
      await this.mutate(() =>
        this.service.revoke(this.selectedAgency(), invite.id),
      );
  }
  memberActions(member: AgencyMember): ActionMenuItem[] {
    return [
      {
        label:
          member.status === 'ACTIVE' ? 'Deactivate agent' : 'Reactivate agent',
        icon: 'manage_accounts',
        disabled: this.busy() || member.role !== 'AGENT',
        action: () => {
          void this.setStatus(member);
        },
      },
    ];
  }
  private async setStatus(member: AgencyMember) {
    const active = member.status === 'ACTIVE';
    const confirmed = await this.dialogs
      .open<boolean>(memberStatusDialog(member.email, active))
      .afterClosed();
    if (confirmed)
      await this.mutate(() =>
        this.service.updateStatus(
          this.selectedAgency(),
          member.id,
          active ? 'SUSPENDED' : 'ACTIVE',
        ),
      );
  }
  private async mutate(
    request: () => import('rxjs').Observable<unknown>,
    invitation = false,
  ) {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      const result = await firstValueFrom(request());
      if (invitation) this.invitationResult.set(result as InvitationResult);
      else this.invitationResult.set(null);
      await this.load();
    } catch (error) {
      this.error.set(this.message(error));
    } finally {
      this.busy.set(false);
    }
  }
  invitationLink() {
    const result = this.invitationResult();
    return result
      ? (result.link ??
          `${window.location.origin}/join-agency#invite=${encodeURIComponent(result.token)}`)
      : '';
  }
  async copyLink() {
    try {
      await navigator.clipboard.writeText(this.invitationLink());
      this.snackbar.success('Invitation link copied');
    } catch {
      this.snackbar.error(
        'Unable to copy. Select and copy the displayed link.',
      );
    }
  }
  private message(error: unknown) {
    const m = error instanceof HttpErrorResponse ? error.error?.message : null;
    return Array.isArray(m)
      ? m.join(' ')
      : typeof m === 'string'
        ? m
        : 'Unable to load agency data. Please try again.';
  }
}
