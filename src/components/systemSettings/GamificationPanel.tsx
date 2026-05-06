import { useState } from 'react';
import ModalSelect from '../dropdowns/ModalSelect';

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

const GamificationSettingRow = ({ row, value, onChange }: any) => {
  const [toggle, setToggle] = useState(row.toggleDefault || false);

  return (
    <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg px-5 py-4 hover:bg-slate-700/50 hover:border-slate-500 transition-colors">
      <div>
        <p className="font-semibold text-slate-200 text-sm">{row.label}</p>
        {row.description && <p className="text-slate-500 text-xs mt-0.5">{row.description}</p>}
      </div>

      {row.type === 'dropdown' && (
        <ModalSelect label="" value={value} options={row.options} onChange={onChange} />
      )}

      {row.type === 'toggle' && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setToggle(!toggle)}
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

      {row.type === 'button' && (
        <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-5 py-1.5 rounded-full">
          {row.buttonLabel || 'Update'}
        </button>
      )}
    </div>
  );
};

const Gamification = () => {
  const [values, setValues] = useState({
    currency: 'USD - US Dollar (Default)',
    xp: 'Total Bet Amount (RM Only)',
    tokens: 'Total Bet Amount (RM Only)',
    playerCategory: 'Average Deposit Amount',
    sportsEvent: 'Placed Bets',
  });

  const rows = [
    {
      label: 'Default Currency',
      description: '',
      type: 'dropdown',
      options: CURRENCY_OPTIONS,
      key: 'currency',
    },
    {
      label: 'XP Points Settings',
      description: 'Select the setting for calculating XP points.',
      type: 'dropdown',
      options: BET_OPTIONS,
      key: 'xp',
    },
    {
      label: 'Tokens Settings',
      description: 'Select the setting for calculating tokens.',
      type: 'dropdown',
      options: BET_OPTIONS,
      key: 'tokens',
    },
    {
      label: 'Player Category Settings',
      description: 'Select the category for player ranking.',
      type: 'dropdown',
      options: PLAYER_CATEGORY_OPTIONS,
      key: 'playerCategory',
    },
    {
      label: 'Sports Event Type Contribution',
      description: 'Select the type of sports events that contribute to gamification.',
      type: 'dropdown',
      options: SPORTS_EVENT_OPTIONS,
      key: 'sportsEvent',
    },
    {
      label: 'Allow Ranks Downgrade',
      description: 'Allow players to be downgraded in rank.',
      type: 'toggle',
      toggleDefault: false,
    },
  ];

  return (
    <div className="mb-8">
      <h1 className="text-xl font-semibold text-white mb-6">Gamification</h1>
      <div className="space-y-2">
        {rows.map((row: any) => (
          <GamificationSettingRow
            key={row.label}
            row={row}
            value={values[row?.key as keyof typeof values]}
            onChange={(val: string) =>
              setValues({ ...values, [row.key as keyof typeof values]: val })
            }
          />
        ))}
      </div>
    </div>
  );
};

const LoyaltyOptOut = () => {
  const rows = [
    { label: 'Counter Reset Option', type: 'button', buttonLabel: 'Change' },
    { label: 'Opt Out Reasons', type: 'button', buttonLabel: 'Update' },
  ];

  return (
    <div className="mb-8">
      <h1 className="text-xl text-white mb-6">Loyalty Opt Out</h1>
      <div className="space-y-2">
        {rows.map((row: any) => (
          <GamificationSettingRow key={row.label} row={row} />
        ))}
      </div>
    </div>
  );
};

const RewardShop = () => {
  const rows = [
    { label: 'Custom Fields', type: 'button', buttonLabel: 'Change' },
    { label: 'Low Stock Alert', type: 'button', buttonLabel: 'Change' },
  ];

  return (
    <div className="mb-8">
      <h1 className="text-xl text-white mb-6">Reward Shop</h1>
      <div className="space-y-2">
        {rows.map((row: any) => (
          <GamificationSettingRow key={row.label} row={row} />
        ))}
      </div>
    </div>
  );
};

const PlayerCard = () => {
  const rows = [{ label: 'PAMS Player Card URL', type: 'button', buttonLabel: 'Update' }];

  return (
    <div className="mb-8">
      <h1 className="text-xl font-semibold text-white mb-6">Player Card</h1>
      <div className="space-y-2">
        {rows.map((row: any) => (
          <GamificationSettingRow key={row.label} row={row} />
        ))}
      </div>
    </div>
  );
};

const GamificationPanel = () => {
  return (
    <div className="px-4 ">
      <Gamification />
      <LoyaltyOptOut />
      <RewardShop />
      <PlayerCard />
    </div>
  );
};

export default GamificationPanel;
