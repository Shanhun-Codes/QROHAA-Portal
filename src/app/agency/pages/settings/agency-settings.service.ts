import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AgencySettings, AgencySettingsUpdate } from './agency-settings.model';
@Injectable({ providedIn: 'root' })
export class AgencySettingsService {
  private readonly http = inject(HttpClient);
  private url(agencyId: string) {
    return `${environment.apiBaseUrl}/agency-app/agencies/${agencyId}`;
  }
  getSettings(agencyId: string) {
    return this.http.get<AgencySettings>(`${this.url(agencyId)}/settings`);
  }
  updateSettings(agencyId: string, values: AgencySettingsUpdate) {
    return this.http.patch<AgencySettings>(
      `${this.url(agencyId)}/settings`,
      values,
    );
  }
  async uploadLogo(agencyId: string, file: File) {
    const base = `${this.url(agencyId)}/logo`;
    const upload = await firstValueFrom(
      this.http.post<{ key: string; uploadUrl: string }>(`${base}/upload-url`, {
        contentType: file.type,
      }),
    );
    await firstValueFrom(
      this.http.put(upload.uploadUrl, file, {
        headers: { 'Content-Type': file.type },
        responseType: 'text',
      }),
    );
    return firstValueFrom(
      this.http.post<AgencySettings>(`${base}/complete`, { key: upload.key }),
    );
  }
}
