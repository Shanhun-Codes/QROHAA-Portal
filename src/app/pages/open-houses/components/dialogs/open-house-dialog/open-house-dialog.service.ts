import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { PropertiesService } from '../../../../properties/properties.service';
import { PropertyFormValue } from '../../../../properties/models/property.model';

import { FeedbackQuestionsService } from '../../../../../shared/services/feedback-questions.service';

import { OpenHousesService } from '../../../open-houses.service';

import { AgentFeedbackQuestionRequest } from '../../../../profile/models/question.model';
import { OpenHouse } from '../../../models/open-house.model';

interface CreateOpenHouseWorkflow {
  createProperty: boolean;

  propertyId?: string;

  property?: PropertyFormValue;

  openHouse: {
    startsAt: Date | string;
    endsAt: Date | string;
  };

  questions?: AgentFeedbackQuestionRequest[];

  saveAsDefaultQuestions: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class OpenHouseDialogService {
  private readonly propertyService = inject(PropertiesService);

  private readonly openHousesService = inject(OpenHousesService);

  private readonly feedbackQuestionsService = inject(FeedbackQuestionsService);

  async createOpenHouse(
    values: CreateOpenHouseWorkflow,
  ): Promise<OpenHouse | null> {
    try {
      let propertyId = values.propertyId;

      if (values.createProperty) {
        if (!values.property) {
          return null;
        }

        const property = await this.propertyService.createProperty(
          values.property,
        );

        if (!property) {
          return null;
        }

        propertyId = property.id;
      }

      if (!propertyId) {
        return null;
      }

      if (values.saveAsDefaultQuestions && values.questions) {
        const defaultsUpdated =
          await this.feedbackQuestionsService.updateAgentDefaultQuestions(
            values.questions,
          );

        if (!defaultsUpdated) {
          return null;
        }
      }

      return await firstValueFrom(
        this.openHousesService.createOpenHouse({
          propertyId,
          startsAt: values.openHouse.startsAt,
          endsAt: values.openHouse.endsAt,
          feedbackQuestions: values.questions,
        }),
      );
    } catch (error) {
      console.error('Failed to create open house:', error);

      return null;
    }
  }

  async updateOpenHouse(
    openHouseId: string,
    values: CreateOpenHouseWorkflow,
  ): Promise<OpenHouse | null> {
    try {
      let propertyId = values.propertyId;

      if (values.createProperty) {
        if (!values.property) {
          return null;
        }

        const property = await this.propertyService.createProperty(
          values.property,
        );

        if (!property) {
          return null;
        }

        propertyId = property.id;
      }

      if (!propertyId) {
        return null;
      }

      if (values.saveAsDefaultQuestions && values.questions) {
        const defaultsUpdated =
          await this.feedbackQuestionsService.updateAgentDefaultQuestions(
            values.questions,
          );

        if (!defaultsUpdated) {
          return null;
        }
      }

      return await firstValueFrom(
        this.openHousesService.updateOpenHouse(openHouseId, {
          propertyId,
          startsAt: values.openHouse.startsAt,
          endsAt: values.openHouse.endsAt,
          feedbackQuestions: values.questions,
        }),
      );
    } catch (error) {
      console.error('Failed to update open house:', error);

      return null;
    }
  }
}
