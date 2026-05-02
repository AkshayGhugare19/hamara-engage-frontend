import { useState, type FC } from 'react';
import { NavLink } from 'react-router-dom';

/* ---------------- Icons ---------------- */

const GamanzaIcon: FC = () => (
  <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="6" fill="#1e3a8a" />
    <path d="M8 20 L16 10 L32 10 L32 20 L20 20 L20 30 L8 30 Z" fill="#3b82f6" />
    <path d="M20 20 L32 20 L26 30 L20 30 Z" fill="#60a5fa" opacity="0.7" />
  </svg>
);

const HamburgerIcon: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const HomeIcon: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const CRMIcon: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
  </svg>
);

const GamificationIcon: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V18H9v2h6v-2h-2v-2.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z" />
  </svg>
);

const SettingsIcon: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

const HelpIcon: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const PlusIcon: FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

interface ChevronDownProps {
  open: boolean;
}

const ChevronDown: FC<ChevronDownProps> = ({ open }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`ml-auto transition-transform ${open ? 'rotate-180' : ''}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ---------------- Styles ---------------- */

const navItem =
  'flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 border-l-[3px]';

const active = 'text-blue-400 bg-blue-400/10 border-blue-400 font-medium';

const inactive = 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border-transparent';

/* ---------------- Sidebar ---------------- */

const Sidebar: FC = () => {
  const [crmOpen, setCrmOpen] = useState<boolean>(true);
  const [gameOpen, setGameOpen] = useState<boolean>(false);
  const [settingOpen, setSettingOpen] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <div
      className={`${
        collapsed ? 'w-[78px] min-w-[78px]' : 'w-[240px] min-w-[240px]'
      } bg-[#0d1b3e] border-r border-white/5 flex flex-col h-screen sticky top-0 overflow-y-auto thin-scrollbar transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <GamanzaIcon />
            <div className="leading-none">
              <div className="text-white font-bold tracking-[2px] text-sm">HAMARA</div>
              <div className="text-slate-400 text-[9px] tracking-[1.5px] uppercase">Engage</div>
            </div>
          </div>
        )}

        {collapsed && <GamanzaIcon />}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-white/10 p-2 rounded-md"
          type="button"
        >
          <HamburgerIcon />
        </button>
      </div>

      {!collapsed && <div className="text-[9px] text-slate-600 px-4 mb-3">v2.11.0</div>}

      {/* Create */}
      <button
        className={`mx-3.5 mb-4 flex items-center ${
          collapsed ? 'justify-center px-0' : 'gap-2 px-4'
        } border border-white/25 rounded-full py-2 text-white text-sm font-medium hover:bg-white/10 transition`}
        type="button"
      >
        <PlusIcon />
        {!collapsed && 'Create'}
      </button>

      {!collapsed && (
        <div className="bg-[#0e7c6e] text-white text-xs font-semibold tracking-widest px-4 py-2">
          SBX
        </div>
      )}

      {/* Menu */}
      <nav className="py-2 overflow-y-auto thin-scrollbar scrollbar-hide">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${navItem} ${isActive ? active : inactive}`}
        >
          <HomeIcon />
          {!collapsed && 'Dashboard'}
        </NavLink>

        <button
          onClick={() => setCrmOpen(!crmOpen)}
          className={`${navItem} ${inactive} w-full`}
          type="button"
        >
          <CRMIcon />
          {!collapsed && 'CRM'}
          {!collapsed && <ChevronDown open={crmOpen} />}
        </button>

        {!collapsed && crmOpen && (
          <div className="ml-6 border-l border-white/5">
            <NavLink to="/crm/campaigns" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Campaigns</NavLink>
            <NavLink to="/crm/analytics" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Analytics</NavLink>
            <NavLink to="/crm/segments" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Segments</NavLink>
            <NavLink to="/crm/templates" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Templates</NavLink>
            <NavLink to="/crm/custom-triggers" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Custom Triggers</NavLink>
            <NavLink to="/crm/frequency-cap" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Frequency Cap</NavLink>
            <NavLink to="/crm/unsubscribe-reports" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Unsubscribe Reports</NavLink>
            <NavLink to="/crm/player-data" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Player Data</NavLink>
          </div>
        )}

        <button
          onClick={() => setGameOpen(!gameOpen)}
          className={`${navItem} ${inactive} w-full`}
          type="button"
        >
          <GamificationIcon />
          {!collapsed && 'Gamification'}
          {!collapsed && <ChevronDown open={gameOpen} />}
        </button>

        {!collapsed && gameOpen && (
          <div className="ml-6 border-l border-white/5">
            <NavLink to="/missions" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Missions</NavLink>
            <NavLink to="/mission-bundles" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Mission Bundles</NavLink>
            <NavLink to="/ranks" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Ranks</NavLink>
            <NavLink to="/token-rules-casino" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Token Rules (Casino)</NavLink>
            <NavLink to="/token-rules-sports" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Token Rules (Sports)</NavLink>
            <NavLink to="/xp-point-rules-casino" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">XP Point Rules (Casino)</NavLink>
            <NavLink to="/xp-point-rules-sports" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">XP Point Rules (Sports)</NavLink>
            <NavLink to="/player-categories" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Player Categories</NavLink>
            <NavLink to="/reward-shop" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Reward Shop</NavLink>
            <NavLink to="/prizeshark-catalog" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Prizeshark Catalog</NavLink>
            <NavLink to="/purchase-feed" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Purchase Feed</NavLink>
            <NavLink to="/tournaments" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Tournaments</NavLink>
          </div>
        )}

        <button
          onClick={() => setSettingOpen(!settingOpen)}
          className={`${navItem} ${inactive} w-full`}
          type="button"
        >
          <SettingsIcon />
          {!collapsed && 'Settings'}
          {!collapsed && <ChevronDown open={settingOpen} />}
        </button>

        {!collapsed && settingOpen && (
          <div className="ml-6 border-l border-white/5">
            <NavLink to="/users" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">User Management</NavLink>
            <NavLink to="/user-logs" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">User Logs</NavLink>
            <NavLink to="/roles" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Roles</NavLink>
            <NavLink to="/system-settings" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">System Settings</NavLink>
            <NavLink to="/tags-gamification" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Tags (Gamification)</NavLink>
            <NavLink to="/tags-crm" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Tags (CRM)</NavLink>
            <NavLink to="/media-database" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Media Database</NavLink>
            <NavLink to="/casino-catalog" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Casino Catalog</NavLink>
            <NavLink to="/sports-catalog" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">Sports Catalog</NavLink>
            <NavLink to="/http-debugger-console" className="block px-4 py-2 text-sm text-slate-400 hover:text-white">HTTP Debugger Console</NavLink>
          </div>
        )}
      </nav>

      {/* Bottom */}
      <div className="mt-auto border-t border-white/5 px-4 py-4 text-slate-500 text-sm hover:text-slate-300 cursor-pointer flex items-center gap-2">
        <HelpIcon />
        {!collapsed && 'Help & Support'}
      </div>
    </div>
  );
};

export default Sidebar;
