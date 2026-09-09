import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { StatusPillComponent } from '../../../../shared/components/status-pill/status-pill.component';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {
  ACTION_BUTTON_CONFIG,
  NOTE_BUTTON_CONFIG,
} from '../../config/button.config';
import { LeadExpandedRowService } from './lead-expanded-row.service';
import { Lead } from '../../models/lead.model';
import { formatPhoneNumber } from '../../../../shared/utils/format-phone-number.util';

@Component({
  selector: 'aa-lead-expanded-row',
  standalone: true,
  imports: [MatIcon, StatusPillComponent, DatePipe, ButtonComponent],
  templateUrl: './lead-expanded-row.component.html',
  styleUrl: './lead-expanded-row.component.scss',
})
export class LeadExpandedRowComponent implements OnInit {
  private readonly expandedRowService = inject(LeadExpandedRowService);

  readonly row = input.required<Lead>();

  readonly leadDetails = this.expandedRowService.leadDetails;

  readonly actionsButtonConfig = ACTION_BUTTON_CONFIG;

  readonly addNoteButtonConfig = {
    ...NOTE_BUTTON_CONFIG,
    click: () => this.onAddNoteClick(),
  };

  ngOnInit(): void {
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

          notes: response.notes ?? [],
        });

        console.log('LEAD DETAIL:', response);
      },
    });
  }

  onAddNoteClick(): void {
    this.expandedRowService.openAddNoteDialog();
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
