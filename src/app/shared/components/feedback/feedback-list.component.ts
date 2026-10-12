import { Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SelectComponent } from '../inputs/select/select.component';
import { ButtonComponent } from '../button/button.component';
import { DialogService } from '../dialog/dialog.service';
import { FeedbackDetailComponent } from './feedback-detail.component';
import { FeedbackSubmission } from './feedback.model';
@Component({
  selector: 'aa-feedback-list',
  imports: [DatePipe, SelectComponent, ButtonComponent],
  template: ` <section aria-label="Feedback submissions">
    <h4>Submissions ({{ submissions().length }})</h4>
    @if (filterEvents() && (events().length > 1 || eventId())) {
      <aa-select
        aria-label="Filter submissions by open house"
        [options]="events()"
        [value]="eventId()"
        (valueChange)="selectEvent($event)"
      />
    }
    @for (submission of filtered(); track submission.id) {
      <div class="submission">
        <div>
          <strong>{{ visitor(submission) }}</strong>
          <p>{{ submission.createdAt | date: 'medium' }}</p>
          @if (submission.openHouse; as event) {
            <p>
              {{ event.property.street }} ·
              {{ event.startsAt | date: 'mediumDate' }}
            </p>
          }
        </div>
        <aa-button
          [config]="{
            label: 'View feedback',
            variant: 'secondary',
            size: 'sm',
            click: viewAction(submission.id),
          }"
        />
      </div>
    } @empty {
      <p>
        No feedback submissions{{
          eventId() ? ' for this open house' : ' yet'
        }}.
      </p>
    }
  </section>`,
  styles: [
    `
      .submission {
        display: flex;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ddd;
        padding: 1rem 0;
      }
      .submission p {
        margin: 0.25rem 0;
      }
      aa-select {
        display: block;
        margin: 0.75rem 0;
      }
      @media (max-width: 600px) {
        .submission {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `,
  ],
})
export class FeedbackListComponent {
  private readonly dialogs = inject(DialogService);
  readonly submissions = input.required<FeedbackSubmission[]>();
  readonly filterEvents = input(false);
  readonly eventOptions = input<Array<{ label: string; value: string }>>([]);
  selectEvent(id: string) {
    this.eventId.set(id);
  }
  readonly eventId = signal('');
  readonly filtered = computed(() =>
    this.submissions()
      .filter((item) => !this.eventId() || item.openHouseId === this.eventId())
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
  );
  readonly events = computed(() => [
    { label: 'All open houses', value: '' },
    ...(this.eventOptions().length
      ? this.eventOptions()
      : Array.from(
          new Map(
            this.submissions()
              .filter((item) => item.openHouse)
              .map((item) => [
                item.openHouseId,
                {
                  value: item.openHouseId,
                  label:
                    item.openHouse!.property.street +
                    ' · ' +
                    new Date(item.openHouse!.startsAt).toLocaleString(),
                },
              ]),
          ).values(),
        )),
  ]);
  visitor(item: FeedbackSubmission) {
    return item.lead
      ? [item.lead.firstName, item.lead.lastName].filter(Boolean).join(' ') ||
          item.lead.email ||
          'Visitor'
      : 'Anonymous visitor';
  }
  viewAction(id: string) {
    return () => this.open(id);
  }
  open(id: string) {
    const submission = this.submissions().find((item) => item.id === id);
    if (!submission) return;
    this.dialogs.open({
      title: 'Visitor feedback',
      contentComponent: FeedbackDetailComponent,
      data: submission,
      width: '720px',
      actions: [{ label: 'Close', type: 'secondary' }],
    });
  }
}
