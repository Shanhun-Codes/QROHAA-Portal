import { Injectable } from '@angular/core';
import { FeedbackQuestionSelection } from '../../shared/components/models/feedback-question-selector.model';
import { ProfilePreviewConfig } from './preview-public.model';
import { AgentProfile } from '../../auth/auth.model';

@Injectable({
  providedIn: 'root',
})
export class PublicPreviewService {
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
        primaryColor: `#${agent.primaryColor ?? '111820'}`,
        secondaryColor: `#${agent.secondaryColor ?? '7f1d1d'}`,
        accentColor: `#${agent.accentColor ?? 'dc2626'}`,
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
