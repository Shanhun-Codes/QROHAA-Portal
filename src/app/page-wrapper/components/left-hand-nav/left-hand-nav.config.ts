export const LEFT_HAND_NAV_CONFIG = [
  {
    label: 'Leads',
    route: '/home',
    icon: 'people',
  },

  {
    label: 'Properties',
    route: '/properties',
    icon: 'home',
  },
  {
    label: 'Open Houses',
    route: '/open-houses',
    icon: 'event',
  },
  {
    label: 'My Profile',
    route: '/settings',
    icon: 'person',
  },
  {
    label: 'Subscription',
    route: '/subscription',
    icon: 'credit_card',
  },
  {
    separatorBefore: true,
    label: 'Help | Feedback',
    route: '/help',
    icon: 'help',
  },
];

export const AGENCY_NAV_CONFIG = [
  {
    label: 'Agents',
    route: '/agency',
    icon: 'business',
    separatorBefore: false,
  },
  {
    label: 'Agency Settings',
    route: '/agency/settings',
    icon: 'settings',
    separatorBefore: false,
  },
  {
    label: 'Help | Feedback',
    route: '/agency/help',
    icon: 'help',
    separatorBefore: true,
  },
];
