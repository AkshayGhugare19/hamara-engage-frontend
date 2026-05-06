export type ModalKey =
  | 'accountStatus'
  | 'paymentMethods'
  | 'enabledLanguages'
  | 'clientSite'
  | null;

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
  hasDropdown?: boolean;
  modalKey?: ModalKey;
}
export interface LanguageItem {
  id: string;
  language: string;
  flag: string;
  flagEmoji: string;
}
export interface EnabledLanguagesForm {
  languages: LanguageItem[];
}
export interface ClientSiteForm {
  url: string;
}
export interface ClientSiteErrors {
  url?: string;
}
export interface PaymentMethodItem {
  id: string;
  uniqueKey: string;
  displayName: string;
}
export interface PaymentMethodForm {
  methods: PaymentMethodItem[];
}
export interface PaymentMethodErrors {
  [index: number]: {
    uniqueKey?: string;
    displayName?: string;
  };
}
