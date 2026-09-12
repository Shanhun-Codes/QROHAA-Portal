import {
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { firstValueFrom, forkJoin } from 'rxjs';

import { FeedbackQuestionSelectorComponent } from '../../shared/components/feedback-question-selector/feedback-question-selector.component';
import { PageTemplateComponent } from '../../page-wrapper/page-template/page-template.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AppLoaderService } from '../../shared/components/app-loader/app-loader.service';
import { AuthService } from '../../auth/auth.service';
import { FeedbackQuestionsService } from '../../shared/services/feedback-questions.service';

import { formatPhoneNumber } from '../../shared/utils/format-phone-number.util';
import {
  EDIT_PROFILE_BUTTON_CONFIG,
  PREVIEW_BUTTON_CONFIG,
} from './config/button.config';
import { ButtonConfig } from '../../shared/components/button/button.config';
import { PublicPreviewService } from './preview-public.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'aa-profile',
  imports: [PageTemplateComponent, ButtonComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly appLoaderService = inject(AppLoaderService);
  private readonly feedbackQuestionsService = inject(FeedbackQuestionsService);
  private readonly publicPreviewService = inject(PublicPreviewService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly title = 'My Profile';

  readonly subtitle =
    'Manage your agent information, branding, and default open house settings.';

  readonly showPreview = signal(false);

  ngOnDestroy(): void {
    window.removeEventListener('message', this.previewMessageHandler);
  }
  openPreview(): void {
    this.showPreview.set(true);
  }

  @ViewChild('publicPreviewFrame')
  private publicPreviewFrame?: ElementRef<HTMLIFrameElement>;

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
    ...EDIT_PROFILE_BUTTON_CONFIG,
    click: () => this.onEditBranding(),
  };
  readonly editDefaultQuestionsButtonConfig: ButtonConfig = {
    ...EDIT_PROFILE_BUTTON_CONFIG,
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

  readonly defaultQuestions =
    this.feedbackQuestionsService.agentDefaultQuestions;

  ngOnInit(): void {
    window.addEventListener('message', this.previewMessageHandler);

    this.appLoaderService.runInitialLoad(async () => {
      await this.authService.getCurrentAgent();

      const defaults = await firstValueFrom(
        this.feedbackQuestionsService.getAgentDefaultQuestions(),
      );

      this.feedbackQuestionsService.agentDefaultQuestions.set(defaults);
    });
  }

  private onEditProfile(): void {
    // Implement the logic for editing the profile here
  }

  private onEditBranding(): void {
    // Implement the logic for editing the branding here
  }

  private onEditDefaultQuestions(): void {
    // Implement the logic for editing the default questions here
  }

  onPreviewLoad(): void {
    this.sendPreviewConfig();
  }

  private sendPreviewConfig(): void {
    const config = this.previewConfig();
    const frame = this.publicPreviewFrame?.nativeElement;

    console.log('Sending preview config:', config);

    if (!config || !frame?.contentWindow) {
      return;
    }

    frame.contentWindow.postMessage(
      {
        type: 'OPEN_HOUSE_PREVIEW_CONFIG',
        config,
      },
      'http://localhost:4200',
    );
  }

  private readonly previewMessageHandler = (event: MessageEvent): void => {
    if (event.origin !== 'http://localhost:4200') {
      return;
    }

    if (event.data?.type !== 'OPEN_HOUSE_PREVIEW_READY') {
      return;
    }

    console.log('Preview ready');

    this.sendPreviewConfig();
  };
}
