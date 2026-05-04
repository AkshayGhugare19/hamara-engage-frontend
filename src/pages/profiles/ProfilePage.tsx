import PersonalInfoSection from '@/components/profile/PersonalInfoSection';
import ProfileLeftPanel from '@/components/profile/ProfileLeftPanel';
import SecuritySection from '@/components/profile/SecuritySection';
import DashboardLayout from '@/layout/DashboardLayout';
import apiService from '@/services/api';
import { ApiResponse } from '@/types';
import { SecuritySettings, UserProfile } from '@/types/profile';
import { useEffect, useState } from 'react';

interface ApiUser {
  id: string;
  first_name: string;
  last_name: string;
  username: string | null;
  email: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    username: '',
    timezone: 'GMT+04 Samara / Armenia',
    role: '',
    avatarInitials: '',
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
  });

  const handleToggle2FA = () => {
    setSecurity((prev) => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled,
    }));
  };

  const getLoggedInUser = async (): Promise<void> => {
    try {
      const response = await apiService.get<ApiResponse<ApiUser>>('/users/me');

      if (response && response.success && response.data) {
        const user = response.data as unknown as ApiUser;
        const mappedProfile: UserProfile = {
          name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim(),
          email: user.email ?? '',
          username: user.username ?? '',
          role: user.role ?? '',
          timezone: 'GMT+04 Samara / Armenia',
          avatarInitials: `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase(),
        };

        setProfile(mappedProfile);
      } else {
        console.error(response?.message || 'Failed to fetch user');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    getLoggedInUser();
  }, []);

  return (
    <DashboardLayout>
      <div className="w-full flex h-screen bg-slate-900 text-slate-200 overflow-hidden">
        <ProfileLeftPanel profile={profile} />
        <div className="flex-1 overflow-y-auto p-8 scrollbar-none">
          <PersonalInfoSection profile={profile} />
          <div className="my-6 border-t border-slate-700" />
          <SecuritySection security={security} onToggle2FA={handleToggle2FA} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
