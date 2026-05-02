import type { FC, ReactNode } from 'react';
import CalendarComponent from '@/components/Calendar';
import DashboardLayout from '@/layout/DashboardLayout';

interface ArrowRightProps {
  className?: string;
}

const ArrowRight: FC<ArrowRightProps> = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

interface IconMap {
  campaigns: ReactNode;
  customTriggers: ReactNode;
  frequencyCap: ReactNode;
  missionBundles: ReactNode;
  missions: ReactNode;
  playerData: ReactNode;
  prizeshark: ReactNode;
  purchaseFeed: ReactNode;
  ranks: ReactNode;
  rewardShop: ReactNode;
}

const icons: IconMap = {
  campaigns: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 3h2v2h-2V7zm0 4h2v6h-2v-6zM7 7h2v2H7V7zm0 4h2v6H7v-6zm10 6h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
  customTriggers: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
    </svg>
  ),
  frequencyCap: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
    </svg>
  ),
  missionBundles: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
    </svg>
  ),
  missions: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
    </svg>
  ),
  playerData: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),
  prizeshark: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.9 18 9 18h12v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0023.46 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2z" />
    </svg>
  ),
  purchaseFeed: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
    </svg>
  ),
  ranks: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
    </svg>
  ),
  rewardShop: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 15.6.14 12.55.14c-1.67 0-3.06.88-3.92 2.16L12 5.77l3.38-3.48c.31-.31.73-.5 1.17-.5 1.11 0 2.01.9 2.01 2.01 0 .45-.19.87-.5 1.18L15.7 6.6l1.4 1.4.01.01 2.89 2.9V12h-1.31l-2.19-2.19-2.12 2.12 3.5 3.5V17h-3.62l-3.5-3.5-1.41 1.41L11.56 17H4v1.5C4 19.88 5.12 21 6.5 21H18c1.1 0 2-.9 2-2v-1.62L20 6z" />
    </svg>
  ),
};

interface TileData {
  key: string;
  label: string;
  icon: ReactNode;
}

const ROW1: TileData[] = [
  { key: 'Analytics', label: 'Analytics', icon: icons.campaigns },
  { key: 'campaigns', label: 'Campaigns', icon: icons.campaigns },
  { key: 'customTriggers', label: 'Custom Triggers', icon: icons.customTriggers },
  { key: 'frequencyCap', label: 'Frequency Cap', icon: icons.frequencyCap },
  { key: 'missionBundles', label: 'Mission Bundles', icon: icons.missionBundles },
  { key: 'missions', label: 'Missions', icon: icons.missions },
];

const ROW2: TileData[] = [
  { key: 'playerCategories', label: 'Player Categories', icon: icons.playerData },
  { key: 'playerData', label: 'Player Data', icon: icons.playerData },
  { key: 'prizeshark', label: 'Prizeshark Catalog', icon: icons.prizeshark },
  { key: 'purchaseFeed', label: 'Purchase Feed', icon: icons.purchaseFeed },
  { key: 'ranks', label: 'Ranks', icon: icons.ranks },
  { key: 'rewardShop', label: 'Reward Shop', icon: icons.rewardShop },
];

const ROW3: TileData[] = [
  { key: 'segments', label: 'Segments', icon: icons.playerData },
  { key: 'templates', label: 'Templates', icon: icons.playerData },
  { key: 'tokenRulseCasino', label: 'Token Rules Casino', icon: icons.prizeshark },
  { key: 'tokenRulseSuports', label: 'Token Rules Support', icon: icons.prizeshark },
  { key: 'tournaments', label: 'Tournaments', icon: icons.ranks },
  { key: 'unsubscribeReports', label: 'Unsubscribe Reports', icon: icons.rewardShop },
];

const ROW4: TileData[] = [
  { key: 'xpPointRulesCasino', label: 'XP Point Rules Casino', icon: icons.playerData },
  { key: 'xpPointRulesSupports', label: 'XP Point Rules Supports', icon: icons.playerData },
];

/* ── Tile ── */
interface TileProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

const Tile: FC<TileProps> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="bg-[#162040] border border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-[#1d2e55] hover:border-blue-400/30 transition-all duration-150 group min-h-[80px]"
    >
      <div className="flex flex-col gap-3 text-left">
        <span className="text-blue-400">{icon}</span>
        <span className="text-sm font-medium text-slate-300">{label}</span>
      </div>
      <ArrowRight className="text-slate-600 group-hover:text-blue-400 transition-colors" />
    </button>
  );
};

/* ── Tile Row ── */
interface TileRowProps {
  tiles: TileData[];
}

const TileRow: FC<TileRowProps> = ({ tiles }) => {
  return (
    <div className="grid grid-cols-6 gap-2.5">
      {tiles.map((t) => (
        <Tile key={t.key} icon={t.icon} label={t.label} />
      ))}
    </div>
  );
};

const Dashboard: FC = () => {
  return (
    <DashboardLayout>
      <div className="w-full p-4">
        <div className="w-full flex bg-[#111d3e] h-[300px]">
          <div
            className="w-full rounded-xl px-10 py-8 flex items-center justify-between relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0f2260 0%, #1a3070 60%, #152d80 100%)',
            }}
          >
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back <span className="text-blue-400">Akshay</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Let&apos;s get to work.</p>
              <div className="mt-20 w-full text-center">
                <div className="text-[#22c3aa] bg-[#234c60] rounded-md px-4 py-2">sandbox</div>
              </div>
            </div>
            <img
              src="https://cdn-libs-uat.gamanzaengage.com/moneytree/mf-auth-layout/9e095acd7469c045d934.svg"
              alt="Hero Illustration"
            />
          </div>
          <div className="w-[500px]">
            <CalendarComponent />
          </div>
        </div>
        <div className="w-full mt-4">
          <TileRow tiles={ROW1} />
          <div className="my-4" />
          <TileRow tiles={ROW2} />
          <div className="my-4" />
          <TileRow tiles={ROW3} />
          <div className="my-4" />
          <TileRow tiles={ROW4} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
