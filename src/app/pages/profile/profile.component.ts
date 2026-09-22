import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { PageTemplateComponent } from '../../page-wrapper/page-template/page-template.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AppLoaderService } from '../../shared/components/app-loader/app-loader.service';
import { AuthService } from '../../auth/auth.service';
import { FeedbackQuestionsService } from '../../shared/services/feedback-questions.service';

import { formatPhoneNumber } from '../../shared/utils/format-phone-number.util';
import {
  EDIT_BRANDING_BUTTON_CONFIG,
  EDIT_PROFILE_BUTTON_CONFIG,
  EDIT_QUESTIONS_BUTTON_CONFIG,
  PREVIEW_BUTTON_CONFIG,
} from './config/button.config';
import { ButtonConfig } from '../../shared/components/button/button.config';
import { PublicPreviewService } from './preview-public.service';
import { ProfileService } from './profile.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { QuestionsDialogService } from './components/dialogs/questions-dialog/questions-dialog.service';
import { DefaultQuestionDisplay } from './models/question.model';
import { BidiModule } from '@angular/cdk/bidi';

@Component({
  selector: 'aa-profile',
  imports: [PageTemplateComponent, ButtonComponent, BidiModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly appLoaderService = inject(AppLoaderService);
  private readonly feedbackQuestionsService = inject(FeedbackQuestionsService);
  private readonly publicPreviewService = inject(PublicPreviewService);
  private readonly profileService = inject(ProfileService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly questionsDialogService = inject(QuestionsDialogService);
  readonly showPreview = this.publicPreviewService.showPreview;

  readonly title = 'My Profile';

  readonly subtitle =
    'Manage your agent information, branding, and default open house settings.';

  readonly previewUrl: SafeResourceUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(
      'http://localhost:4200/preview',
    );
  readonly previewConfig = computed(() => {
    const agent = this.authService.agent();

    if (!agent) {
      return null;
    }

    return this.publicPreviewService.buildPreviewConfig(
      agent,
      this.feedbackQuestionsService.agentDefaultQuestions(),
    );
  });

  readonly editProfileButtonConfig: ButtonConfig = {
    ...EDIT_PROFILE_BUTTON_CONFIG,
    click: () => this.onEditProfile(),
  };
  readonly editBrandingButtonConfig: ButtonConfig = {
    ...EDIT_BRANDING_BUTTON_CONFIG,
    click: () => this.onEditBranding(),
  };
  readonly editDefaultQuestionsButtonConfig: ButtonConfig = {
    ...EDIT_QUESTIONS_BUTTON_CONFIG,
    click: () => this.onEditDefaultQuestions(),
  };

  readonly previewButtonConfig: ButtonConfig = {
    ...PREVIEW_BUTTON_CONFIG,
    click: () => this.openPreview(),
  };

  readonly agent = computed(() => {
    const agent = this.authService.agent();

    if (!agent) {
      return null;
    }

    return {
      ...agent,
      phone: formatPhoneNumber(agent.phone),
    };
  });
  readonly defaultQuestions = computed<DefaultQuestionDisplay[]>(() =>
    this.feedbackQuestionsService.agentDefaultQuestions().map((selection) => {
      const question = selection.question;

      return {
        id: question.id,
        label: question.label,
        type: this.getQuestionTypeLabel(question.type),
        category: this.getQuestionCategoryLabel(question.category),
        required: selection.required,
        optionCount: question.options?.length ?? 0,
        printable: selection.printable,
      };
    }),
  );

  ngOnInit(): void {
    window.addEventListener(
      'message',
      this.publicPreviewService.previewMessageHandler,
    );

    this.appLoaderService.runInitialLoad(async () => {
      await this.authService.getCurrentAgent();

      const defaults = await firstValueFrom(
        this.feedbackQuestionsService.getAgentDefaultQuestions(),
      );

      this.feedbackQuestionsService.agentDefaultQuestions.set(defaults);
    });
  }

  private onEditProfile(): void {
    this.profileService.openAgentDialog('PROFILE');
  }

  private onEditBranding(): void {
    this.profileService.openAgentDialog('BRANDING');
  }

  private onEditDefaultQuestions(): void {
    this.questionsDialogService.openQuestionsDialog();
  }

  ngOnDestroy(): void {
    window.removeEventListener(
      'message',
      this.publicPreviewService.previewMessageHandler,
    );
  }

  openPreview(): void {
    this.publicPreviewService.openPreview();
  }

  onPreviewLoad(frame: HTMLIFrameElement): void {
    this.publicPreviewService.registerFrame(frame);
  }

  private getQuestionTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      SINGLE_SELECT: 'Single Select',
      RATING: 'Rating',
      TEXTAREA: 'Long Answer',
    };

    return labels[type] ?? type;
  }

  private getQuestionCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      BUYER_PROFILE: 'Buyer Profile',
      PROPERTY_FEEDBACK: 'Property Feedback',
    };

    return labels[category] ?? category;
  }
}
