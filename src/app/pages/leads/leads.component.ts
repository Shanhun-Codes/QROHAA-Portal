import { Component, computed, inject, OnInit } from '@angular/core';

import { TableComponent } from '../../shared/components/table/table.component';
import { LEADS_TABLE_HEADER_CONFIG } from './config/leads-table-header-config';
import { LeadStatusType } from './models/lead.model';
import { mapLeadStatusToPill } from './utils/lead-status.mapper';
import { LeadsService } from './leads.service';
import { PageTemplateComponent } from '../../page-wrapper/page-template/page-template.component';
import {
  ACTION_BUTTON_CONFIG,
  LEADS_BUTTON_CONFIG,
  NOTE_BUTTON_CONFIG,
} from './config/button.config';
import { StatusPillComponent } from '../../shared/components/status-pill/status-pill.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'aa-leads',
  standalone: true,
  imports: [
    TableComponent,
    PageTemplateComponent,
    StatusPillComponent,
    ButtonComponent,
    MatIcon,
    DatePipe,
  ],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
})
export class LeadsComponent implements OnInit {
  private readonly leadsService = inject(LeadsService);

  readonly title = 'Leads';
  readonly subtitle = 'Manage and follow up with your open house leads here';

  readonly addLeadButtonConfig = LEADS_BUTTON_CONFIG;
  readonly addNoteButtonConfig = NOTE_BUTTON_CONFIG;
  readonly actionsButtonConfig = ACTION_BUTTON_CONFIG;

  readonly tableHeaderConfig = LEADS_TABLE_HEADER_CONFIG;

  readonly tableData = computed(() =>
    this.leadsService.leads().map((lead) => ({
      ...lead,
      status: mapLeadStatusToPill(lead.status as LeadStatusType),
    })),
  );

  ngOnInit(): void {
    this.leadsService.getLeads();
  }

  onLeadExpanded(e: string) {}

  getLeadDetail(row: any) {
    const submission = row.submissions?.[0];

    const answers = Object.fromEntries(
      submission?.feedbackAnswers?.map((answer: any) => [
        answer.question.key,
        answer.value,
      ]) ?? [],
    );

    return {
      createdAt: row.createdAt,
      email: row.email,
      phone: row.phone,

      budgetRange: this.formatAnswer(answers['budget_range']),
      purchaseTimeline: this.formatAnswer(answers['purchase_timeline']),
      preQualified: this.formatAnswer(answers['pre_qualified']),
      neighborhoods: answers['neighborhoods'] ?? '—',

      visitedAt: submission?.createdAt ?? '—',

      property: submission?.openHouse?.property?.street ?? '—',

      propertyLocation: submission?.openHouse?.property
        ? `${submission.openHouse.property.city}, ${submission.openHouse.property.state} ${submission.openHouse.property.zip}`
        : '—',

      openHouseDate: submission?.openHouse?.startsAt ?? '—',

      likedMost: this.formatAnswer(answers['liked_most']),
      likedLeast: this.formatAnswer(answers['liked_least']),
      additionalComments: answers['additional_comments'] ?? '—',

      notes: row.notes ?? [],
    };
  }

  private formatAnswer(value?: string): string {
    if (!value) {
      return '—';
    }

    return value
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  getAvatarStatusClass(status: any): string {
    const label = status?.label ?? status?.text ?? status ?? '';

    return `lead-avatar lead-avatar--${String(label)
      .toLowerCase()
      .replaceAll(' ', '-')}`;
  }
}
