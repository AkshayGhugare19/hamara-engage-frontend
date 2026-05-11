import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ModalSelect from '../dropdowns/ModalSelect';
import { settingsApi } from '@/services/systemSettings.service';

const CURRENCY_OPTIONS = [
  { label: 'USD - US Dollar (Default)', value: 'USD - US Dollar (Default)' },
  { label: 'EUR - Euro', value: 'EUR - Euro' },
  { label: 'GBP - British Pound', value: 'GBP - British Pound' },
  { label: 'INR - Indian Rupee', value: 'INR - Indian Rupee' },
  { label: 'JPY - Japanese Yen', value: 'JPY - Japanese Yen' },
];

const BET_OPTIONS = [
  { label: 'Total Bet Amount (RM Only)', value: 'Total Bet Amount (RM Only)' },
  { label: 'Net Bet Amount', value: 'Net Bet Amount' },
  { label: 'Deposit Amount', value: 'Deposit Amount' },
];

const PLAYER_CATEGORY_OPTIONS = [
  { label: 'Average Deposit Amount', value: 'Average Deposit Amount' },
  { label: 'Total Deposit Amount', value: 'Total Deposit Amount' },
  { label: 'Net Bet Amount', value: 'Net Bet Amount' },
];

const SPORTS_EVENT_OPTIONS = [
  { label: 'Placed Bets', value: 'Placed Bets' },
  { label: 'Settled Bets', value: 'Settled Bets' },
  { label: 'Winning Bets', value: 'Winning Bets' },
];

interface GamificationValues {
  default_currency: string;
  xp_setting: string;
  tokens_setting: string;
  player_category_setting: string;
  sports_event_setting: string;
  allow_ranks_downgrade: boolean;
}

const DEFAULTS: GamificationValues = {
  default_currency: 'USD - US Dollar (Default)',
  xp_setting: 'Total Bet Amount (RM Only)',
  tokens_setting: 'Total Bet Amount (RM Only)',
  player_category_setting: 'Average Deposit Amount',
  sports_event_setting: 'Placed Bets',
  allow_ranks_downgrade: false,
};

interface RowProps {
  label: string;
  description?: string;
  type: 'dropdown' | 'toggle' | 'button';
  value?: string;
  options?: { label: string; value: string }[];
  toggle?: boolean;
  buttonLabel?: string;
  onChange?: (val: string) => void;
  onToggle?: (next: boolean) => void;
  onClick?: () => void;
}

const SettingRow = ({
  label,
  description,
  type,
  value,
  options,
  toggle,
  buttonLabel,
  onChange,
  onToggle,
  onClick,
}: RowProps) => (
  <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg px-5 py-4 hover:bg-slate-700/50 hover:border-slate-500 transition-colors">
    <div>
      <p className="font-semibold text-slate-200 text-sm">{label}</p>
      {description && <p className="text-slate-500 text-xs mt-0.5">{description}</p>}
    </div>

    {type === 'dropdown' && (
      <ModalSelect
        label=""
        value={value ?? ''}
        options={options ?? []}
        onChange={onChange ?? (() => {})}
      />
    )}

    {type === 'toggle' && (
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle?.(!toggle)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            toggle ? 'bg-blue-500' : 'bg-slate-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white ${
              toggle ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className="text-slate-400 text-sm">{toggle ? 'Enabled' : 'Disabled'}</span>
      </div>
    )}

    {type === 'button' && (
      <button
        onClick={onClick}
        className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-5 py-1.5 rounded-full"
      >
        {buttonLabel || 'Update'}
      </button>
    )}
  </div>
);

const GamificationPanel = () => {
  const [values, setValues] = useState<GamificationValues>(DEFAULTS);

  useEffect(() => {
    (async () => {
      try {
        const res = await settingsApi.getByPanel('gamification');
        const d = (res.data ?? {}) as Partial<GamificationValues>;
        setValues({
          default_currency: (d.default_currency as string) ?? DEFAULTS.default_currency,
          xp_setting: (d.xp_setting as string) ?? DEFAULTS.xp_setting,
          tokens_setting: (d.tokens_setting as string) ?? DEFAULTS.tokens_setting,
          player_category_setting:
            (d.player_category_setting as string) ?? DEFAULTS.player_category_setting,
          sports_event_setting: (d.sports_event_setting as string) ?? DEFAULTS.sports_event_setting,
          allow_ranks_downgrade: Boolean(d.allow_ranks_downgrade),
        });
      } catch {
        toast.error('Failed to load gamification settings');
      }
    })();
  }, []);

  const save = async <K extends keyof GamificationValues>(key: K, value: GamificationValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    try {
      await settingsApi.upsert('gamification', key, value);
      toast.success('Saved');
    } catch {
      toast.error('Failed to save');
    }
  };

  const stub = (label: string) => () => toast.info(`${label}: not yet implemented`);

  return (
    <div className="px-4 ">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white mb-6">Gamification</h1>
        <div className="space-y-2">
          <SettingRow
            label="Default Currency"
            type="dropdown"
            options={CURRENCY_OPTIONS}
            value={values.default_currency}
            onChange={(v) => save('default_currency', v)}
          />
          <SettingRow
            label="XP Points Settings"
            description="Select the setting for calculating XP points."
            type="dropdown"
            options={BET_OPTIONS}
            value={values.xp_setting}
            onChange={(v) => save('xp_setting', v)}
          />
          <SettingRow
            label="Tokens Settings"
            description="Select the setting for calculating tokens."
            type="dropdown"
            options={BET_OPTIONS}
            value={values.tokens_setting}
            onChange={(v) => save('tokens_setting', v)}
          />
          <SettingRow
            label="Player Category Settings"
            description="Select the category for player ranking."
            type="dropdown"
            options={PLAYER_CATEGORY_OPTIONS}
            value={values.player_category_setting}
            onChange={(v) => save('player_category_setting', v)}
          />
          <SettingRow
            label="Sports Event Type Contribution"
            description="Select the type of sports events that contribute to gamification."
            type="dropdown"
            options={SPORTS_EVENT_OPTIONS}
            value={values.sports_event_setting}
            onChange={(v) => save('sports_event_setting', v)}
          />
          <SettingRow
            label="Allow Ranks Downgrade"
            description="Allow players to be downgraded in rank."
            type="toggle"
            toggle={values.allow_ranks_downgrade}
            onToggle={(v) => save('allow_ranks_downgrade', v)}
          />
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-xl text-white mb-6">Loyalty Opt Out</h1>
        <div className="space-y-2">
          <SettingRow
            label="Counter Reset Option"
            type="button"
            buttonLabel="Change"
            onClick={stub('Counter Reset Option')}
          />
          <SettingRow
            label="Opt Out Reasons"
            type="button"
            buttonLabel="Update"
            onClick={stub('Opt Out Reasons')}
          />
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-xl text-white mb-6">Reward Shop</h1>
        <div className="space-y-2">
          <SettingRow
            label="Custom Fields"
            type="button"
            buttonLabel="Change"
            onClick={stub('Custom Fields')}
          />
          <SettingRow
            label="Low Stock Alert"
            type="button"
            buttonLabel="Change"
            onClick={stub('Low Stock Alert')}
          />
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white mb-6">Player Card</h1>
        <div className="space-y-2">
          <SettingRow
            label="PAMS Player Card URL"
            type="button"
            buttonLabel="Update"
            onClick={stub('PAMS Player Card URL')}
          />
        </div>
      </div>
    </div>
  );
};

export default GamificationPanel;
