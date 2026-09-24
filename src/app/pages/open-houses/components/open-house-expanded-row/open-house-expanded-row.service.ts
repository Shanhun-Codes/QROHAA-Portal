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

  getOpenHouse(openHouseId: string): Observable<OpenHouseDetail> {
    return this.http.get<OpenHouseDetail>(
      `${this.agentAppBaseUrl}/open-houses/${openHouseId}`,
    );
  }

  generateFlyer(openHouse: OpenHouseDetail): void {
    console.log('Generate flyer:', openHouse);
  }

  generatePrintableForm(openHouse: OpenHouseDetail): void {
    console.log('Generate printable form:', openHouse);
  }
}
