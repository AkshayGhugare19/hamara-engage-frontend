import { useState, useRef, useEffect, type FC } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ApiResponse } from '@/types';
import apiService from '@/services/api';
import type { ThemeName } from '@/types/profile';
import { useNavigate } from 'react-router-dom';

const SearchIcon: FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
    className={`transition-transform ${open ? 'rotate-180' : ''}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const Header: FC = () => {
  const { logout } = useAuth();
  const { applyTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const now = new Date();

  const utcStr =
    now.toUTCString().slice(5, 11) +
    ' · ' +
    String(now.getUTCHours()).padStart(2, '0') +
    ':' +
    String(now.getUTCMinutes()).padStart(2, '0') +
    ' UTC';

  const getLoggedInUser = async (): Promise<void> => {
    try {
      const response = await apiService.get<ApiResponse<any>>('/users/me');
      if (response?.success) {
        setLoggedInUser(response.data);
        const userTheme = (response.data as { theme?: ThemeName })?.theme;
        if (userTheme) {
          applyTheme(userTheme);
        }
      } else {
        console.error('Failed to fetch logged-in user:', response?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching logged-in user:', error);
    }
  };
  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    getLoggedInUser();
  }, []);
  return (
    <div className="flex-shrink-0 sticky top-0 z-50 h-14 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0d1b3e]">
      {/* Date Time */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>{utcStr}</span>

        <span className="text-slate-400">
          Your time:&nbsp;
          <strong className="text-slate-200 font-medium">
            {now.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
            })}{' '}
            ·{' '}
            {now.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </strong>
        </span>
      </div>

      {/* Search */}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs text-slate-500">Find Player by Username</span>

        <div className="relative flex items-center">
          <input
            type="text"
            className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-slate-200 w-52 outline-none focus:border-blue-500/50"
          />

          <span className="absolute right-2 text-slate-500">
            <SearchIcon />
          </span>
        </div>
      </div>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-xs font-bold text-white">
        {loggedInUser?.first_name?.charAt(0) || 'A'}
      </div>

      {/* Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-sm text-slate-200 font-medium hover:text-white transition"
          type="button"
        >
          {loggedInUser?.first_name || 'Admin User'}
          <ChevronDown open={open} />
        </button>

        {open && (
          <div className="absolute right-0 top-10 w-44 bg-[#162040] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
            <button
              onClick={() => {
                navigate('/profile');
              }}
              className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-white/5"
              type="button"
            >
              Profile
            </button>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5"
              type="button"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
