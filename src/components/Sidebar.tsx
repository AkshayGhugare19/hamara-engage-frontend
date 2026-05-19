import { useEffect, useState, type FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  GAMIFICATION_BASE,
  GAMIFICATION_MODULE_KEYS,
  GAMIFICATION_MODULES,
  gamificationPath,
} from '@/config/gamificationModules';
import gamruLogo from '@/assets/gamruLogo.svg';

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

const PlayersIcon: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
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
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
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

const navItem =
  'flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 border-l-[3px]';
const active = 'text-blue-400 bg-blue-400/10 border-blue-400 font-medium';
const inactive = 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border-transparent';

const Sidebar: FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const [crmOpen, setCrmOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isCRMActive = path.startsWith('/crm');

  const isGameActive = path.startsWith(GAMIFICATION_BASE);

  const isSettingActive =
    path.startsWith('/settings/users') ||
    path.startsWith('/settings/user-logs') ||
    path.startsWith('/settings/roles') ||
    path.startsWith('/settings/system-settings') ||
    path.startsWith('/settings/tags-gamification') ||
    path.startsWith('/settings/tags-crm') ||
    path.startsWith('/settings/media-database') ||
    path.startsWith('/settings/casino-catalog') ||
    path.startsWith('/settings/sports-catalog') ||
    path.startsWith('/settings/http-debugger-console');

  useEffect(() => {
    if (isCRMActive) setCrmOpen(true);
    if (isGameActive) setGameOpen(true);
    if (isSettingActive) setSettingOpen(true);
  }, [path]);

  return (
    <div
      className={`${
        collapsed ? 'w-[120px] min-w-[118px]' : 'w-[240px] min-w-[240px]'
      } bg-[#0d1b3e] border-r border-white/5 flex flex-col h-screen sticky  top-0 overflow-y-auto thin-scrollbar transition-all duration-300`}
    >
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <img src={gamruLogo} alt="Gamru Logo" className="w-[60px] h-[60px] object-contain" />
          </div>
        )}

        {collapsed && (
          <img src={gamruLogo} alt="Gamru Logo" className="w-[60px] h-[60px] object-contain" />
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-white/10 p-2 rounded-md"
          type="button"
        >
          <HamburgerIcon />
        </button>
      </div>

      {!collapsed && <div className="text-[9px] text-slate-600 px-4 mb-3">v2.11.0</div>}

      <button
        className={`mx-3.5 mb-4 flex items-center ${
          collapsed ? 'justify-center px-0' : 'gap-2 px-4'
        } border border-white/25 rounded-full py-2 text-white text-sm font-medium hover:bg-white/10 transition`}
      >
        <PlusIcon />
        {!collapsed && 'Create'}
      </button>

      {!collapsed && (
        <div className="bg-[#0e7c6e] text-white text-xs font-semibold tracking-widest px-4 py-2">
          SBX
        </div>
      )}

      <nav className="py-2 overflow-y-auto">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${navItem} ${isActive ? active : inactive}`}
        >
          <HomeIcon />
          {!collapsed && 'Dashboard'}
        </NavLink>

        <NavLink
          to="/documentation"
          className={({ isActive }) => `${navItem} ${isActive ? active : inactive}`}
        >
          <HelpIcon />
          {!collapsed && 'Documentation'}
        </NavLink>

        <NavLink
          to="/players"
          className={({ isActive }) => `${navItem} ${isActive ? active : inactive}`}
        >
          <PlayersIcon />
          {!collapsed && 'Players'}
        </NavLink>

        {/* CRM */}
        <button
          onClick={() => setCrmOpen(!crmOpen)}
          className={`${navItem} ${isCRMActive ? active : inactive} w-full`}
        >
          <CRMIcon />
          {!collapsed && 'CRM'}
          {!collapsed && <ChevronDown open={crmOpen} />}
        </button>

        {!collapsed && crmOpen && (
          <div className="ml-6 border-l border-white/5">
            {[
              { to: '/crm/campaigns', label: 'Campaigns' },
              { to: '/crm/analytics', label: 'Analytics' },
              { to: '/crm/segments', label: 'Segments' },
              { to: '/crm/templates', label: 'Templates' },
              { to: '/crm/custom-triggers', label: 'Custom Triggers' },
              { to: '/crm/frequency-cap', label: 'Frequency Cap' },
              { to: '/crm/unsubscribe-reports', label: 'Unsubscribe Reports' },
              { to: '/crm/player-data', label: 'Player Data' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Gamification */}
        <button
          onClick={() => setGameOpen(!gameOpen)}
          className={`${navItem} ${isGameActive ? active : inactive} w-full`}
        >
          <GamificationIcon />
          {!collapsed && 'Gamification'}
          {!collapsed && <ChevronDown open={gameOpen} />}
        </button>

        {!collapsed && gameOpen && (
          <div className="ml-6 border-l border-white/5">
            {GAMIFICATION_MODULE_KEYS.map((key) => [
              gamificationPath(key),
              GAMIFICATION_MODULES[key].title,
            ]).map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm ${
                    isActive ? 'text-white ' : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Settings */}
        <button
          onClick={() => setSettingOpen(!settingOpen)}
          className={`${navItem} ${isSettingActive ? active : inactive} w-full`}
        >
          <SettingsIcon />
          {!collapsed && 'Settings'}
          {!collapsed && <ChevronDown open={settingOpen} />}
        </button>

        {!collapsed && settingOpen && (
          <div className="ml-6 border-l border-white/5">
            {[
              ['/settings/users', 'User Management'],
              ['/settings/user-logs', 'User Logs'],
              ['/settings/roles', 'Roles'],
              ['/settings/system-settings', 'System Settings'],
              ['/settings/tags-gamification', 'Tags (Gamification)'],
              ['/settings/tags-crm', 'Tags (CRM)'],
              ['/settings/media-database', 'Media Database'],
              ['/settings/casino-catalog', 'Casino Catalog'],
              ['/settings/sports-catalog', 'Sports Catalog'],
              ['/settings/http-debugger-console', 'HTTP Debugger Console'],
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Bottom */}
      <NavLink
        to="/documentation"
        className={({ isActive }) =>
          `mt-auto border-t border-white/5 px-4 py-4 flex items-center gap-2 transition-colors ${
            isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-200'
          }`
        }
      >
        <HelpIcon />
        {!collapsed && 'Help & Support'}
      </NavLink>
    </div>
  );
};

export default Sidebar;
