import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';

import { OpenHouseDetail } from '../../models/open-house.model';

@Injectable({
  providedIn: 'root',
})
export class OpenHouseExpandedRowService {
  private readonly http = inject(HttpClient);
  private readonly agentAppBaseUrl = environment.agentAppApiUrl;

  getOpenHouseDetail(openHouseId: string) {
    return this.http.get<OpenHouseDetail>(
      `${this.agentAppBaseUrl}/open-houses/${openHouseId}`,
    );
  }
}
