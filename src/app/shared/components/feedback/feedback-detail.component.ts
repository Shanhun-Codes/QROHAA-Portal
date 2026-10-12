import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FeedbackSubmission, answerLabel } from './feedback.model';
@Component({
  selector: 'aa-feedback-detail',
  imports: [DatePipe],
  template: `
    @if (data(); as submission) {
      @if (submission.openHouse; as event) {
        <h3>{{ event.property.street }} {{ event.property.street2 }}</h3>
        <p>
          {{ event.property.city }}, {{ event.property.state }}
          {{ event.property.zip }}
        </p>
        <p>
          Open house: {{ event.startsAt | date: 'medium' }}
          @if (event.endsAt) {
            – {{ event.endsAt | date: 'medium' }}
          }
        </p>
      }
      <p>Submitted {{ submission.createdAt | date: 'medium' }}</p>
      @if (submission.lead; as visitor) {
        <h4>{{ visitor.firstName }} {{ visitor.lastName }}</h4>
        @if (visitor.email) {
          <p>
            <a [href]="'mailto:' + visitor.email">{{ visitor.email }}</a>
          </p>
        }
        @if (visitor.phone) {
          <p>
            <a [href]="'tel:' + visitor.phone">{{ visitor.phone }}</a>
          </p>
        }
      } @else {
        <p>Anonymous visitor</p>
      }
      <dl>
        @for (answer of submission.feedbackAnswers; track $index) {
          <dt>{{ answer.question.label }}</dt>
          <dd>{{ format(answer) }}</dd>
        } @empty {
          <p>No answers were submitted.</p>
        }
      </dl>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
      dt {
        font-weight: 600;
        margin-top: 1rem;
      }
      dd {
        margin: 0.35rem 0 1rem;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }
      p {
        overflow-wrap: anywhere;
      }
    `,
  ],
})
export class FeedbackDetailComponent {
  readonly data = input.required<FeedbackSubmission>();
  readonly format = answerLabel;
}
