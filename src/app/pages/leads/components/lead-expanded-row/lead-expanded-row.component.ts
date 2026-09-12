import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

import { StatusPillComponent } from '../../../../shared/components/status-pill/status-pill.component';
import { LeadExpandedRowService } from './lead-expanded-row.service';
import { Lead } from '../../models/lead.model';
import { formatPhoneNumber } from '../../../../shared/utils/format-phone-number.util';
import { NotesComponent } from './notes/notes.component';
import { NotesService } from './notes/notes.service';
import { ActionMenuComponent } from '../../../../shared/components/action-menu/action-menu.component';
import { ActionMenuItem } from '../../../../shared/components/models/action-menu.model';

@Component({
    selector: 'aa-lead-expanded-row',
    imports: [
        MatIcon,
        StatusPillComponent,
        DatePipe,
        NotesComponent,
        ActionMenuComponent,
    ],
    templateUrl: './lead-expanded-row.component.html',
    styleUrl: './lead-expanded-row.component.scss'
})
export class LeadExpandedRowComponent implements OnInit {
  private readonly expandedRowService = inject(LeadExpandedRowService);
  private readonly notesService = inject(NotesService);

  readonly row = input.required<Lead>();

  readonly leadDetails = this.expandedRowService.leadDetails;

  ngOnInit(): void {
    this.notesService.leadId.set(this.row().id);

    const request = this.expandedRowService.getLead(this.row().id);

    if (!request) {
      return;
    }

    request.subscribe({
      next: (response) => {
        const submission = response.submissions?.[0];

        const answers = Object.fromEntries(
          submission?.feedbackAnswers?.map((answer: any) => [
            answer.question.key,
            answer.value,
          ]) ?? [],
        );

        this.expandedRowService.leadDetails.set({
          ...response,

          name: `${response.firstName} ${response.lastName}`,
          phone: formatPhoneNumber(response.phone),

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
        });

        console.log('LEAD DETAIL:', response);
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
    this.expandedRowService.editLead(leadId, this.leadDetails());
  }

  onMarkAsLostClick(leadId: string): void {
    this.expandedRowService.markLeadAsLost(leadId);
  }
}
