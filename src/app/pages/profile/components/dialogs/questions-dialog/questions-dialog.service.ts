import { inject, Injectable } from '@angular/core';
import { DialogService } from '../../../../../shared/components/dialog/dialog.service';
import { QuestionsDialogComponent } from './questions-dialog.component';
import { FeedbackQuestionsService } from '../../../../../shared/services/feedback-questions.service';
import { AgentFeedbackQuestionRequest } from '../../../models/question.model';
import { PublicPreviewService } from '../../../preview-public.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionsDialogService {
  private readonly dialogService = inject(DialogService);
  private readonly feedbackQuestionsService = inject(FeedbackQuestionsService);
  private readonly publicPreviewService = inject(PublicPreviewService);

  async updateDefaultQuestions(
    values: AgentFeedbackQuestionRequest[],
  ): Promise<boolean> {
    try {
      await this.feedbackQuestionsService.updateAgentDefaultQuestions(values);
      this.publicPreviewService.refreshPreview();
      return true;
    } catch (error) {
      console.error('Failed to update default questions:', error);
      return false;
    }
  }

  async openQuestionsDialog(): Promise<void> {
    this.dialogService.open({
      contentComponent: QuestionsDialogComponent,
      data: {
        onSubmit: (values: AgentFeedbackQuestionRequest[]) =>
          this.updateDefaultQuestions(values),
      },
      actions: [
        {
          label: 'Cancel',
          type: 'secondary',
        },
        {
          label: 'Update Question Selection',
          type: 'primary',
          submit: true,
        },
      ],
    });
  }
}
