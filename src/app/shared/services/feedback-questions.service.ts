import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FeedbackQuestionSelection } from '../components/models/feedback-question-selector.model';

@Injectable({
  providedIn: 'root',
})
export class FeedbackQuestionsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly agentId = environment.agentId;

  readonly feedbackQuestions = signal<FeedbackQuestionSelection[]>([]);
  readonly agentDefaultQuestions = signal<FeedbackQuestionSelection[]>([]);
  getFeedbackQuestions() {
    return this.http.get<FeedbackQuestionSelection[]>(
      `${this.baseUrl}/feedback-questions`,
    );
  }

  getAgentDefaultQuestions() {
    return this.http.get<FeedbackQuestionSelection[]>(
      `${this.baseUrl}/agents/${this.agentId}/feedback-questions`,
    );
  }
}
