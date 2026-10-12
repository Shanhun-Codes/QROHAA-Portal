import { DialogConfig } from '../../../../shared/components/dialog/models/dialog.model';
import { InviteAgentDialogComponent } from '../components/dialogs/invite-agent-dialog/invite-agent-dialog.component';
export const INVITE_AGENT_DIALOG_CONFIG: DialogConfig = {
  title: 'Invite agent',
  contentComponent: InviteAgentDialogComponent,
  actions: [
    { label: 'Cancel', type: 'secondary' },
    {
      label: 'Create invitation',
      type: 'primary',
      submit: true,
      closeOnClick: false,
    },
  ],
};
export function revokeInvitationDialog(email: string): DialogConfig {
  return {
    title: 'Revoke invitation?',
    message: `The invitation for ${email} will stop working and its reserved seat will be released.`,
    actions: [
      { label: 'Cancel', type: 'secondary' },
      { label: 'Revoke invitation', type: 'danger', value: true },
    ],
  };
}
export function memberStatusDialog(
  email: string,
  active: boolean,
): DialogConfig {
  return {
    title: active ? 'Deactivate agent?' : 'Reactivate agent?',
    message: active
      ? `This blocks ${email} from accessing the app. Their records and occupied seat are retained.`
      : `Restore app access for ${email}, subject to agency access being active.`,
    actions: [
      { label: 'Cancel', type: 'secondary' },
      {
        label: active ? 'Deactivate' : 'Reactivate',
        type: active ? 'danger' : 'primary',
        value: true,
      },
    ],
  };
}

export function selectedMemberStatusDialog(count: number, active: boolean): DialogConfig {
  return {
    title: `${active ? 'Reactivate' : 'Deactivate'} ${count} agent${count === 1 ? '' : 's'}?`,
    message: active ? 'Restore app access for the selected agents, subject to agency access being active.' : 'Block app access for the selected agents. Their records and occupied seats are retained.',
    actions: [
      { label: 'Cancel', type: 'secondary' },
      { label: active ? 'Reactivate agents' : 'Deactivate agents', type: active ? 'primary' : 'danger', value: true },
    ],
  };
}
