export type TagsCrmsNavItemId =
  | 'all-crm-tags'
  | 'mission-crm-tags'
  | 'ranks-crm-tags'
  | 'reward-shop-crm-tags'
  | 'token-rules-crm-tags'
  | 'tournaments-crm-tags'
  | 'xp-points-crm-tags';

export interface TagsCrmsNavItem {
  id: TagsCrmsNavItemId;
  label: string;
  icon: React.ReactNode;
}

export interface CrmTag {
  id: string;
  name: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CrmTagForm {
  id?: string;
  name: string;
  description?: string;
  category?: string;
  createdAt?: string;
  createdBy: string;
}

export interface CrmTagErrors {
  name?: string;
  category?: string;
  description?: string;
}
