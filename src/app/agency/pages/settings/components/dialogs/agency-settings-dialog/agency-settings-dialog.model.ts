import {
  AgencySettings,
  AgencySettingsUpdate,
} from '../../../agency-settings.model';
export interface SettingsDialogData {
  mode: 'BRANDING' | 'BROKERAGE';
  settings: AgencySettings;
  save: (payload: AgencySettingsUpdate) => Promise<boolean>;
}
