export type NavItemId =
  | 'core-features'
  | 'gamification'
  | 'missions'
  | 'crm'
  | 'platform-integration'
  | 'widgets';

export interface NavItem {
  id: NavItemId;
  label: string;
  icon: React.ReactNode;
}

export interface SettingsRow {
  label: string;
  description?: string;
  value?: string;
  hasUpdate?: boolean;
}
