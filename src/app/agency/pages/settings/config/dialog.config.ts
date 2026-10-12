import { DialogConfig } from '../../../../shared/components/dialog/models/dialog.model';
import { AgencySettingsDialogComponent } from '../components/dialogs/agency-settings-dialog/agency-settings-dialog.component';
import { SettingsDialogData } from '../components/dialogs/agency-settings-dialog/agency-settings-dialog.model';
export function agencySettingsDialog(data: SettingsDialogData): DialogConfig {
  return {
    title: data.mode === 'BRANDING' ? 'Agency branding' : 'Agency brokerage',
    contentComponent: AgencySettingsDialogComponent,
    data,
    actions: [
      { label: 'Cancel', type: 'secondary' },
      { label: 'Save changes', type: 'primary', submit: true },
    ],
  };
}
