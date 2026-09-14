import {
  computed,
  effect,
  ElementRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';

import { AgentProfile } from '../../auth/auth.model';
import { AuthService } from '../../auth/auth.service';

import { FeedbackQuestionSelection } from '../../shared/components/models/feedback-question-selector.model';
import { FeedbackQuestionsService } from '../../shared/services/feedback-questions.service';

import { ProfilePreviewConfig } from './preview-public.model';

@Injectable({
  providedIn: 'root',
})
export class PublicPreviewService {
  private readonly authService = inject(AuthService);

  private readonly feedbackQuestionsService = inject(FeedbackQuestionsService);

  private previewFrame?: HTMLIFrameElement;
  readonly showPreview = signal(false);

  readonly previewConfig = computed(() => {
    const agent = this.authService.agent();

    if (!agent) {
      return null;
    }

    return this.buildPreviewConfig(
      agent,
      this.feedbackQuestionsService.agentDefaultQuestions(),
    );
  });

  constructor() {
    effect(() => {
      const showPreview = this.showPreview();
      const config = this.previewConfig();

      if (!showPreview || !config) {
        return;
      }

      this.sendPreviewConfig();
    });
  }

  openPreview(): void {
    this.showPreview.set(true);
  }

  closePreview(): void {
    this.showPreview.set(false);
    this.previewFrame = undefined;
  }

  registerFrame(frame: HTMLIFrameElement): void {
    this.previewFrame = frame;
  }

  refreshPreview(): void {
    const iframe = this.previewFrame;

    if (!iframe) {
      return;
    }

    iframe.addEventListener(
      'load',
      () => {
        this.sendPreviewConfig();
      },
      { once: true },
    );

    iframe.src = iframe.src;
  }
  sendPreviewConfig(): void {
    const config = this.previewConfig();
    const frame = this.previewFrame;

    if (!config || !frame?.contentWindow) {
      return;
    }

    console.log('Sending preview config:', config);

    frame.contentWindow.postMessage(
      {
        type: 'OPEN_HOUSE_PREVIEW_CONFIG',
        config,
      },
      'http://localhost:4200',
    );
  }

  readonly previewMessageHandler = (event: MessageEvent): void => {
    if (event.origin !== 'http://localhost:4200') {
      return;
    }

    if (event.data?.type !== 'OPEN_HOUSE_PREVIEW_READY') {
      return;
    }

    console.log('Preview ready');

    this.sendPreviewConfig();
  };

  buildPreviewConfig(
    agent: AgentProfile,
    defaultQuestions: FeedbackQuestionSelection[],
  ): ProfilePreviewConfig {
    return {
      agent: {
        slug: agent.slug,
        firstName: agent.firstName,
        lastName: agent.lastName,
        email: agent.email,
        phone: agent.phone ?? '',
        brokerageName: agent.brokerageName ?? '',
        headline: agent.headline ?? '',
        logoUrl: agent.logoUrl ?? null,
        headshotUrl: agent.headshotUrl ?? null,
      },

      branding: {
        primaryColor: `${agent.primaryColor ?? '111820'}`,
        secondaryColor: `${agent.secondaryColor ?? '7f1d1d'}`,
        accentColor: `${agent.accentColor ?? 'dc2626'}`,
      },

      openHouse: {
        publicCode: 'PREVIEW',
        startsAt: new Date().toISOString(),
        endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      },

      property: {
        street: '123 Main Street',
        street2: null,
        city: 'Springfield',
        state: 'MO',
        zip: '65804',
        listingPriceCents: 35000000,
      },

      leadForm: {
        fields: [
          {
            key: 'firstName',
            label: 'First Name',
            type: 'TEXT',
            required: true,
          },
          {
            key: 'lastName',
            label: 'Last Name',
            type: 'TEXT',
            required: true,
          },
          {
            key: 'email',
            label: 'Email',
            type: 'EMAIL',
            required: true,
          },
          {
            key: 'phone',
            label: 'Phone',
            type: 'TEL',
            required: false,
          },
        ],
      },

      feedbackForm: {
        questions: defaultQuestions.map((question) => ({
          id: question.id,
          key: question.key,
          label: question.label,
          type: question.type,
          category: question.category,
          required: question.required,
          sortOrder: question.sortOrder,
          options: question.options,
        })),
      },
    };
  }
}
