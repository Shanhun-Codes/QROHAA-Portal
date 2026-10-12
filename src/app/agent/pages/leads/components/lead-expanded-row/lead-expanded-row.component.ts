import { Component, inject, input, OnInit, signal } from '@angular/core';
import { answerLabel } from '../../../../../shared/components/feedback/feedback.model';
import { mapLeadStatusToPill } from '../../utils/lead-status.mapper';
import { FeedbackListComponent } from '../../../../../shared/components/feedback/feedback-list.component';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

import { StatusPillComponent } from '../../../../../shared/components/status-pill/status-pill.component';
import { LeadExpandedRowService } from './lead-expanded-row.service';
import { Lead } from '../../models/lead.model';
import { formatPhoneNumber } from '../../../../../shared/utils/format-phone-number.util';
import { NotesComponent } from './notes/notes.component';
import { NotesService } from './notes/notes.service';
import { ActionMenuComponent } from '../../../../../shared/components/action-menu/action-menu.component';
import { ActionMenuItem } from '../../../../../shared/components/action-menu/action-menu.model';

@Component({
  selector: 'aa-lead-expanded-row',
  imports: [
    MatIcon,
    FeedbackListComponent,
    StatusPillComponent,
    DatePipe,
    NotesComponent,
    ActionMenuComponent,
  ],
  templateUrl: './lead-expanded-row.component.html',
  styleUrl: './lead-expanded-row.component.scss',
})
export class LeadExpandedRowComponent implements OnInit {
  private readonly expandedRowService = inject(LeadExpandedRowService);
  private readonly notesService = inject(NotesService);

  readonly row = input.required<Lead>();

  readonly leadDetails = signal<any>({});

  readonly loading = signal(true);
  readonly error = signal('');
  readonly statusPill = mapLeadStatusToPill;

  ngOnInit(): void {
    this.loading.set(true);
    this.error.set('');
    this.notesService.leadId.set(this.row().id);

    const request = this.expandedRowService.getLead(this.row().id);

    if (!request) {
      return;
    }

    request.subscribe({
      next: (response) => {
        this.loading.set(false);
        if (!response) {
          this.error.set('Lead not found.');
          return;
        }
        const submission = response.submissions?.[0];

        const answers = Object.fromEntries(
          submission?.feedbackAnswers?.map((answer: any) => [
            answer.question.key,
            answerLabel(answer),
          ]) ?? [],
        );

        this.leadDetails.set({
          ...response,
          submissions: response.submissions.map((item: any) => ({
            ...item,
            lead: response,
          })),

          name: `${response.firstName} ${response.lastName}`,
          phone: formatPhoneNumber(response.phone),

          budgetRange: answers['budget_range'] ?? '—',
          purchaseTimeline: answers['purchase_timeline'] ?? '—',
          preQualified: answers['pre_qualified'] ?? '—',
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
        });
      },
      error: () => {
        this.loading.set(false);
        this.error.set(
          'Unable to load lead details. Reopen this row to retry.',
        );
      },
    });

    this.notesService.getNotes();
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

  getLeadActions(lead: Lead): ActionMenuItem[] {
    return [
      {
        label: 'Edit Lead',
        icon: 'edit',
        action: () => this.onEditClick(lead.id),
      },
      {
        label: 'Mark as Lost',
        icon: 'cancel',
        danger: true,
        action: () => this.onMarkAsLostClick(lead.id),
      },
    ];
  }

  onEditClick(leadId: string): void {
    void this.expandedRowService.editLead(leadId).then(() => this.ngOnInit());
  }

  onMarkAsLostClick(leadId: string): void {
    void this.expandedRowService.markLeadAsLost(leadId).then((success) => {
      if (success)
        this.leadDetails.update((lead) => ({ ...lead, status: 'LOST' }));
    });
  }
}
