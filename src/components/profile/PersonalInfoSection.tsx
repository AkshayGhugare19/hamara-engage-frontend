import { UserProfile } from '@/types/profile';
import ProfileInfoRow from './ProfileInfoRow';
import TimezoneRow from './TimezoneRow';

interface Props {
  profile: UserProfile;
}

const PersonalInfoSection = ({ profile }: Props) => (
  <div>
    <h2 className="text-lg font-semibold text-slate-100 mb-4">Personal Information</h2>
    <div className="space-y-2">
      <ProfileInfoRow label="Name" value={profile.name} />
      <ProfileInfoRow
        label="Email"
        value={profile.email}
        action={
          <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-4 py-1.5 rounded-full transition-colors">
            Change
          </button>
        }
      />
      <ProfileInfoRow label="Username" value={profile.username} />
      <TimezoneRow
        description="Applicable only for CRM & Message Gateway Campaigns"
        value={profile.timezone}
      />
    </div>
  </div>
);

export default PersonalInfoSection;
