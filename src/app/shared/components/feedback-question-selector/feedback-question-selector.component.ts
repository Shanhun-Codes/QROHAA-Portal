import { Component, input } from '@angular/core';
import { FeedbackQuestionSelection } from '../models/feedback-question-selector.model';

@Component({
  selector: 'aa-feedback-question-selector',
  standalone: true,
  imports: [],
  templateUrl: './feedback-question-selector.component.html',
  styleUrl: './feedback-question-selector.component.scss',
})
export class FeedbackQuestionSelectorComponent {
  readonly questions = input.required<FeedbackQuestionSelection[]>();
}
