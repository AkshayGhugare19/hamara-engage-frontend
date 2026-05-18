import type { FC } from 'react';
import {
  Award,
  Calendar,
  Flame,
  Globe,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Star,
  User as UserIcon,
} from 'lucide-react';
import type { Player } from '@/types/player.types';

const InfoRow: FC<{
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-2">
    <span className="text-white/80 mt-0.5">{icon}</span>
    <div className="leading-tight">
      <div className="text-[11px] text-white/70">{label}</div>
      <div className="text-sm font-medium break-all">
        {value || <span className="italic text-white/50">Undefined</span>}
      </div>
    </div>
  </div>
);

const CONSENT_KEYS: { key: keyof NonNullable<Player['consents']>; node: React.ReactNode }[] = [
  { key: 'email', node: <Mail size={14} /> },
  { key: 'sms', node: <span className="text-[10px] font-bold">SMS</span> },
  { key: 'onsite', node: <Globe size={14} /> },
  { key: 'push', node: <Star size={14} /> },
  { key: 'phone', node: <Phone size={14} /> },
  { key: 'post', node: <Mail size={14} /> },
];

const PlayerLeftPanel: FC<{ player: Player }> = ({ player }) => {
  const xpTotal = player.xp_points + (player.xp_to_next || 0);
  const xpPct = xpTotal > 0 ? Math.min(100, Math.round((player.xp_points / xpTotal) * 100)) : 0;

  return (
    <aside className="w-[260px] min-w-[260px] bg-blue-600 text-white rounded-lg p-4 overflow-y-auto thin-scrollbar">
      {/* Avatar */}
      <div className="flex flex-col items-center text-center pb-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-blue-400/40 ring-4 ring-blue-300/50 flex items-center justify-center">
            <UserIcon size={36} />
          </div>
          <span className="absolute -top-1 -right-1 bg-green-500 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {player.level}
          </span>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-600 text-[10px] px-2 py-0.5 rounded-full">
            {player.rank_name || 'Sprout'}
          </span>
        </div>
        <h2 className="mt-4 font-bold italic">{player.username}</h2>
        <p className="text-xs text-white/80">{player.name || player.username}</p>
      </div>

      {/* Gamification status */}
      <div className="bg-white/10 rounded-md px-3 py-2 flex items-center gap-2 mb-2">
        <span
          className={`w-9 h-5 rounded-full flex items-center px-0.5 ${
            player.gamification_active ? 'bg-green-500 justify-end' : 'bg-slate-500'
          }`}
        >
          <span className="w-4 h-4 bg-white rounded-full" />
        </span>
        <div className="text-xs">
          <div className="text-white/70">Gamification Features</div>
          <div className="font-semibold">{player.gamification_active ? 'Active' : 'Inactive'}</div>
        </div>
      </div>

      {/* XP */}
      <div className="bg-white/10 rounded-md px-3 py-2 mb-2">
        <div className="flex items-center gap-2 text-xs mb-1">
          <Star size={14} />
          <span>XP Points: {player.xp_points}</span>
        </div>
        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white" style={{ width: `${xpPct}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-white/70 mt-1">
          <span>{player.xp_to_next} XP for the next rank!!</span>
          <span>{player.rank_name || 'Sprout'}</span>
        </div>
      </div>

      {/* Level / Tokens */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-white/10 rounded-md px-3 py-2 text-xs">
          <Flame size={14} className="mb-1" />
          <div className="text-white/70">Level</div>
          <div className="font-semibold">
            {player.level} / {player.max_level}
          </div>
        </div>
        <div className="bg-white/10 rounded-md px-3 py-2 text-xs">
          <Award size={14} className="mb-1" />
          <div className="text-white/70">Tokens</div>
          <div className="font-semibold">{player.tokens}</div>
        </div>
      </div>

      {/* Personal information */}
      <h3 className="text-xs font-semibold text-white/80 mb-1">Personal Information</h3>
      <div className="divide-y divide-white/10">
        <InfoRow icon={<IdCard size={15} />} label="ID" value={player.player_id} />
        <InfoRow
          icon={<UserIcon size={15} />}
          label="Account Status"
          value={player.account_status}
        />
        <InfoRow icon={<Mail size={15} />} label="Email" value={player.email} />
        <InfoRow icon={<Phone size={15} />} label="Mobile Number" value={player.mobile_number} />
        <InfoRow icon={<Calendar size={15} />} label="Birthday" value={player.birthday} />
        <InfoRow icon={<MapPin size={15} />} label="Address" value={player.address} />
        <InfoRow icon={<Globe size={15} />} label="Language" value={player.language} />
      </div>

      {/* Consents */}
      <h3 className="text-xs font-semibold text-white/80 mt-4 mb-2">Consents</h3>
      <div className="flex flex-wrap gap-2">
        {CONSENT_KEYS.map(({ key, node }) => {
          const on = player.consents?.[key];
          return (
            <span
              key={key}
              title={key}
              className={`w-8 h-8 rounded-md flex items-center justify-center ${
                on ? 'bg-white text-blue-600' : 'bg-white/20 text-white/60'
              }`}
            >
              {node}
            </span>
          );
        })}
      </div>
    </aside>
  );
};

export default PlayerLeftPanel;
