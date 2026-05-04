export interface UserProfile {
  name: string;
  email: string;
  username: string;
  timezone: string;
  role: string;
  avatarInitials: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
}
