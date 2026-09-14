import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FeedbackQuestionSelection } from '../components/models/feedback-question-selector.model';
import { firstValueFrom } from 'rxjs';
import { AgentFeedbackQuestionRequest } from '../../pages/profile/models/question.model';

@Injectable({
  providedIn: 'root',
})
export class FeedbackQuestionsService {
  private readonly http = inject(HttpClient);
  private readonly agentAppBaseUrl = environment.agentAppApiUrl;

  readonly feedbackQuestions = signal<FeedbackQuestionSelection[]>([]);
  readonly agentDefaultQuestions = signal<FeedbackQuestionSelection[]>([]);

  getFeedbackQuestions() {
    return this.http.get<FeedbackQuestionSelection[]>(
      `${this.agentAppBaseUrl}/feedback-questions`,
    );
  }

  getAgentDefaultQuestions() {
    return this.http.get<FeedbackQuestionSelection[]>(
      `${this.agentAppBaseUrl}/feedback-questions/defaults`,
    );
  }

  mapQuestionsWithDefaults(
    feedbackQuestions: FeedbackQuestionSelection[],
    agentDefaultQuestions: FeedbackQuestionSelection[],
  ): FeedbackQuestionSelection[] {
    return feedbackQuestions.map((feedbackQuestion, index) => {
      const defaultQuestion = agentDefaultQuestions.find(
        (agentDefaultQuestion) =>
          agentDefaultQuestion.questionId === feedbackQuestion.id,
      );

      return {
        ...feedbackQuestion,
        selected: !!defaultQuestion,
        required: defaultQuestion?.required ?? false,
        sortOrder:
          defaultQuestion?.sortOrder ?? feedbackQuestion.sortOrder ?? index,
      };
    });
  }

  async setFeedbackQuestions(): Promise<void> {
    const questions = await firstValueFrom(this.getFeedbackQuestions());
    this.feedbackQuestions.set(questions);
  }

  async setAgentDefaultQuestions(): Promise<void> {
    const defaultQuestions = await firstValueFrom(
      this.getAgentDefaultQuestions(),
    );
    this.agentDefaultQuestions.set(defaultQuestions);
  }

  setQuestionsWithDefaults(
    feedbackQuestions: FeedbackQuestionSelection[],
    agentDefaultQuestions: FeedbackQuestionSelection[],
  ): void {
    this.feedbackQuestions.set(
      this.mapQuestionsWithDefaults(feedbackQuestions, agentDefaultQuestions),
    );

    this.agentDefaultQuestions.set(agentDefaultQuestions);
  }

  async updateAgentDefaultQuestions(
    values: AgentFeedbackQuestionRequest[],
  ): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.patch<FeedbackQuestionSelection[]>(
          `${this.agentAppBaseUrl}/feedback-questions/defaults`,
          values,
        ),
      );

      this.agentDefaultQuestions.set(response);

      return true;
    } catch (error) {
      console.error('Failed to update agent default questions', error);
      return false;
    }
  }
}
