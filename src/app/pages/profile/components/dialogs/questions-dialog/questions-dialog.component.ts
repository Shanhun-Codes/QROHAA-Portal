import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { forkJoin } from 'rxjs';

import { FeedbackQuestionSelectorComponent } from '../../../../../shared/components/feedback-question-selector/feedback-question-selector.component';
import { DialogRef } from '../../../../../shared/components/dialog/dialog-ref';
import { FeedbackQuestionsService } from '../../../../../shared/services/feedback-questions.service';
import { AgentFeedbackQuestionRequest } from '../../../models/question.model';

interface AgentDialogData {
  onSubmit: (values: AgentFeedbackQuestionRequest[]) => Promise<boolean>;
}

@Component({
  selector: 'aa-questions-dialog',
  imports: [FeedbackQuestionSelectorComponent],
  templateUrl: './questions-dialog.component.html',
  styleUrl: './questions-dialog.component.scss',
})
export class QuestionsDialogComponent implements OnInit {
  readonly data = input.required<AgentDialogData>();
  readonly dialogRef = input.required<DialogRef<any>>();

  private readonly questionsService = inject(FeedbackQuestionsService);

  readonly questions = computed(() =>
    this.questionsService.feedbackQuestions(),
  );

  constructor() {
    effect(() => {
      const dialogRef = this.dialogRef();

      if (dialogRef) {
        dialogRef.registerSubmitHandler(() => this.submit());
      }
    });
  }

  ngOnInit(): void {
    forkJoin({
      feedbackQuestions: this.questionsService.getFeedbackQuestions(),
      agentDefaultQuestions: this.questionsService.getAgentDefaultQuestions(),
    }).subscribe({
      next: ({ feedbackQuestions, agentDefaultQuestions }) => {
        this.questionsService.setQuestionsWithDefaults(
          feedbackQuestions,
          agentDefaultQuestions,
        );
      },
    });
  }

  async submit(): Promise<void> {
    const values: AgentFeedbackQuestionRequest[] = this.questions()
      .filter((question) => question.selected)
      .map((question) => ({
        questionId: question.id,
        active: true,
        required: question.required,
        sortOrder: question.sortOrder,
        printable: question.printable ?? false,
      }));

    console.log('1. SUBMIT START', values);

    const success = await this.data().onSubmit(values);

    console.log('2. SUBMIT FINISHED', success);

    if (success) {
      console.log('3. CLOSING DIALOG');

      this.dialogRef().close();
    }
  }
}
