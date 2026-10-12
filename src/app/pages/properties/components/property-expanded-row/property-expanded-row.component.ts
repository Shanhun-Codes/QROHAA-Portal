import {
  Component,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PropertiesService } from '../../properties.service';
import { Property } from '../../property.model';
import { FeedbackSubmission } from '../../../../shared/components/feedback/feedback.model';
import { FeedbackListComponent } from '../../../../shared/components/feedback/feedback-list.component';
import { ActionMenuComponent } from '../../../../shared/components/action-menu/action-menu.component';
import { StatusPillComponent } from '../../../../shared/components/status-pill/status-pill.component';
interface EventDetail {
  id: string;
  startsAt: string;
  endsAt: string;
  openHouseFeedbackSubmissions: FeedbackSubmission[];
}
interface PropertyDetail extends Property {
  openHouses: EventDetail[];
}
@Component({
  selector: 'aa-property-expanded-row',
  imports: [
    ButtonComponent,
    DatePipe,
    CurrencyPipe,
    FeedbackListComponent,
    ActionMenuComponent,
    StatusPillComponent,
  ],
  template: ` @if (loading()) {
      <p role="status">Loading property details…</p>
    } @else if (error()) {
      <p role="alert">{{ error() }}</p>
    } @else if (detail(); as property) {
      <header>
        <div>
          <h3>{{ property.street }} {{ property.street2 }}</h3>
          <p>{{ property.city }}, {{ property.state }} {{ property.zip }}</p>
        </div>
        <aa-action-menu ariaLabel="Property actions" [actions]="actions()" />
      </header>
      <aa-status-pill
        [config]="{
          label: row().status,
          variant: row().status === 'ACTIVE' ? 'success' : 'neutral',
        }"
      />
      <p>
        Listing price:
        {{
          property.listingPriceCents != null
            ? (property.listingPriceCents / 100 | currency)
            : 'Not provided'
        }}
      </p>
      <h4>Open houses ({{ property.openHouses.length }})</h4>
      @for (event of property.openHouses; track event.id) {
        <div class="event">
          <p>
            {{ event.startsAt | date: 'medium' }} –
            {{ event.endsAt | date: 'medium' }} ·
            {{ event.openHouseFeedbackSubmissions.length }} submissions
          </p>
          <aa-button
            [config]="{
              label:
                selectedEventId() === event.id
                  ? 'Hide event feedback'
                  : 'View event feedback',
              variant: 'ghost',
              click: eventAction(event.id),
            }"
          />
        </div>
      } @empty {
        <p>No open houses yet.</p>
      }
      @if (selectedEventId()) {
        <aa-feedback-list [submissions]="submissions()" />
      }
    }`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 1.5rem;
      }
      header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
      }
      h3,
      h4,
      p {
        margin: 0;
      }
      header p {
        margin-top: 0.5rem;
      }
      .event {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem 0;
        border-bottom: 1px solid var(--border-light, #ddd);
      }
      .event p {
        line-height: 1.6;
      }
      @media (max-width: 600px) {
        :host {
          padding: 1rem;
        }
        .event {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class PropertyExpandedRowComponent {
  readonly selectedEventId = signal<string | null>(null);
  readonly viewer = viewChild(FeedbackListComponent);
  eventAction(id: string) {
    return () => {
      this.selectedEventId.update((selected) => (selected === id ? null : id));
    };
  }
  readonly row = input.required<Property>();
  readonly detail = signal<PropertyDetail | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly submissions = signal<FeedbackSubmission[]>([]);
  private readonly http = inject(HttpClient);
  private readonly properties = inject(PropertiesService);
  constructor() {
    effect(() => this.load(this.row().id));
    effect(() => {
      const id = this.selectedEventId();
      if (id) this.viewer()?.selectEvent(id);
    });
  }
  load(id: string) {
    this.loading.set(true);
    this.error.set('');
    this.http
      .get<PropertyDetail>(`${environment.agentAppApiUrl}/properties/${id}`)
      .subscribe({
        next: (property) => {
          if (!property) {
            this.error.set('Property not found.');
            this.loading.set(false);
            return;
          }
          this.detail.set(property);
          this.submissions.set(
            property.openHouses.flatMap((event) =>
              event.openHouseFeedbackSubmissions.map((item) => ({
                ...item,
                openHouse: {
                  id: event.id,
                  startsAt: event.startsAt,
                  endsAt: event.endsAt,
                  property,
                },
              })),
            ),
          );
          this.loading.set(false);
        },
        error: () => {
          this.error.set(
            'Unable to load property feedback. Please reopen this row to retry.',
          );
          this.loading.set(false);
        },
      });
  }
  actions() {
    return [
      {
        label: 'Edit property',
        icon: 'edit',
        action: () =>
          void this.properties
            .openPropertyDialog('EDIT', this.row())
            .then(() => this.load(this.row().id)),
      },
      {
        label:
          this.row().status === 'ACTIVE'
            ? 'Archive property'
            : 'Restore property',
        icon: 'archive',
        action: () =>
          void this.properties.updatePropertyStatus(
            this.row().id,
            this.row().status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE',
          ),
      },
    ];
  }
}
