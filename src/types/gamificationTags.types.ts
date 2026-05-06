export type TagsGamificationsNavItemId =
  | 'all-gamification-tags'
  | 'mission-gamification-tags'
  | 'ranks-gamification-tags'
  | 'reward-shop-gamification-tags'
  | 'token-rules-gamification-tags'
  | 'tournaments-gamification-tags'
  | 'xp-points-gamification-tags';

export interface TagsGamificationsNavItem {
  id: TagsGamificationsNavItemId;
  label: string;
  icon: React.ReactNode;
}

export interface GamificationTag {
  id: string;
  name: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface GamificationTagForm {
  id?: string;
  name: string;
  description?: string;
  category?: string;
  createdAt?: string;
  createdBy: string;
}

export interface GamificationTagErrors {
  name?: string;
  category?: string;
  description?: string;
}
