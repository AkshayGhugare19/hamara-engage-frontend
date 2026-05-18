import type { ReactNode } from 'react';
import type { GamificationEntity } from '@/types/gamification.types';
import type {
  GamificationModuleConfig,
  ColumnDef,
} from '@/components/gamification/GamificationModulePage';

// ─── Shared cell renderers ────────────────────────────────────────────────────
const StatusCell = (row: GamificationEntity): ReactNode => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium ${
      row.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
    }`}
  >
    {row.status === 'ACTIVE' ? 'Active' : 'Inactive'}
  </span>
);

const NameCell = (row: GamificationEntity): ReactNode => (
  <span className="font-medium text-blue-400 underline">{row.name}</span>
);

const TagsCell = (row: GamificationEntity): ReactNode =>
  row.tags?.length ? (
    <div className="flex flex-wrap gap-1">
      {row.tags.map((t) => (
        <span key={t} className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-200 text-xs">
          {t}
        </span>
      ))}
    </div>
  ) : (
    <span className="text-slate-500">-</span>
  );

const dash = (v: unknown): ReactNode =>
  v === undefined || v === null || v === '' ? <span className="text-slate-500">-</span> : String(v);

const dataCell =
  (key: string): ((row: GamificationEntity) => ReactNode) =>
  (row) =>
    dash(row.data?.[key]);

const STATUS_COL: ColumnDef = { header: 'Status', render: StatusCell };
const NAME_COL: ColumnDef = { header: 'Name', render: NameCell };
const TAGS_COL: ColumnDef = { header: 'Tags', render: TagsCell };

const BadgeCol = (header: string, key: string): ColumnDef => ({
  header,
  render: (row) =>
    row.data?.[key] ? (
      <span className="px-3 py-1 rounded bg-blue-600/30 text-blue-300 text-xs">{header}</span>
    ) : (
      <span className="text-slate-500">-</span>
    ),
});

// ─── Module configs ───────────────────────────────────────────────────────────
export const GAMIFICATION_MODULES: Record<string, GamificationModuleConfig> = {
  missions: {
    featureKey: 'missions',
    title: 'Missions',
    singular: 'Mission',
    breadcrumb: ['Home', 'Gamification', 'Missions'],
    createLabel: 'Create Mission',
    columns: [
      STATUS_COL,
      NAME_COL,
      TAGS_COL,
      BadgeCol('Rewards', 'reward_type'),
      BadgeCol('Objectives', 'objective_type'),
    ],
    steps: [
      {
        key: 'details',
        title: 'Details',
        fields: [
          { name: 'name', label: 'Internal name', type: 'text', required: true },
          { name: 'tags', label: 'Tags (Optional)', type: 'tags' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'objectives',
        title: 'Objectives',
        fields: [
          {
            name: 'objective_type',
            label: 'Objective Type',
            type: 'select',
            required: true,
            options: [
              { label: 'Wager', value: 'wager' },
              { label: 'Deposit', value: 'deposit' },
              { label: 'Login Streak', value: 'login' },
              { label: 'Bet Count', value: 'bet_count' },
            ],
          },
          { name: 'objective_target', label: 'Target Value', type: 'number', half: true },
          { name: 'objective_game_category', label: 'Game Category', type: 'text', half: true },
        ],
      },
      {
        key: 'time',
        title: 'Time Settings',
        fields: [
          {
            name: 'time_frame_type',
            label: 'Time Frame',
            type: 'select',
            options: [
              { label: 'Lifetime', value: 'lifetime' },
              { label: 'Custom', value: 'custom' },
            ],
          },
          { name: 'start_date', label: 'Start Date', type: 'text', half: true },
          { name: 'end_date', label: 'End Date', type: 'text', half: true },
        ],
      },
      {
        key: 'rewards',
        title: 'Rewards',
        fields: [
          {
            name: 'reward_type',
            label: 'Reward Type',
            type: 'select',
            options: [
              { label: 'Bonus Cash', value: 'bonus_cash' },
              { label: 'Free Spins', value: 'free_spins' },
              { label: 'XP Points', value: 'xp' },
            ],
          },
          { name: 'reward_amount', label: 'Reward Amount', type: 'number' },
        ],
      },
    ],
  },

  'mission-bundles': {
    featureKey: 'mission-bundles',
    title: 'Mission Bundles',
    singular: 'Mission Bundle',
    breadcrumb: ['Home', 'Gamification', 'Mission Bundles'],
    createLabel: 'Create Mission Bundle',
    columns: [
      STATUS_COL,
      NAME_COL,
      { header: 'Type', render: dataCell('bundle_type') },
      { header: 'Priority', render: (r) => r.priority },
      { header: 'Missions', render: dataCell('missions') },
      { header: 'Eligibility', render: dataCell('eligibility_type') },
      TAGS_COL,
    ],
    steps: [
      {
        key: 'details',
        title: 'Details',
        subtitle: 'Please add the details with which you want to save this bundle.',
        fields: [
          { name: 'name', label: 'Internal name', type: 'text', required: true },
          { name: 'tags', label: 'Tags (Optional)', type: 'tags' },
          { name: 'description', label: 'Internal Description', type: 'textarea' },
          { name: 'large_image', label: 'Large Image', type: 'text', half: true },
          { name: 'small_image', label: 'Small Image', type: 'text', half: true },
        ],
      },
      {
        key: 'settings',
        title: 'Settings',
        fields: [
          {
            name: 'bundle_type',
            label: 'Type',
            type: 'select',
            options: [
              { label: 'Lifetime', value: 'Lifetime' },
              { label: 'Custom', value: 'Custom' },
            ],
          },
          { name: 'priority', label: 'Priority', type: 'number', half: true },
          { name: 'start_date', label: 'Start Date', type: 'text', half: true },
          { name: 'end_date', label: 'End Date', type: 'text', half: true },
        ],
      },
      {
        key: 'missions',
        title: 'Missions',
        fields: [{ name: 'missions', label: 'Missions (comma separated)', type: 'text' }],
      },
      {
        key: 'easter',
        title: 'Easter Eggs (Optional)',
        fields: [{ name: 'easter_eggs', label: 'Easter Eggs', type: 'text' }],
      },
      {
        key: 'eligibility',
        title: 'Eligibility',
        fields: [
          {
            name: 'eligibility_type',
            label: 'Eligibility',
            type: 'select',
            options: [
              { label: 'All Players', value: 'All Players' },
              { label: 'Segment', value: 'Segment' },
            ],
          },
          { name: 'segment', label: 'Segment', type: 'text' },
        ],
      },
    ],
  },

  ranks: {
    featureKey: 'ranks',
    title: 'Ranks',
    singular: 'Rank',
    breadcrumb: ['Home', 'Gamification', 'Ranks'],
    createLabel: 'Create Rank',
    columns: [
      STATUS_COL,
      NAME_COL,
      {
        header: 'Levels',
        render: (r) => {
          const lvls =
            (r.data?.levels as { xp_start?: number; xp_end?: number }[] | undefined) ?? [];
          if (lvls.length) {
            const start = lvls[0]?.xp_start ?? 0;
            const end = lvls[lvls.length - 1]?.xp_end ?? 0;
            return `${lvls.length} levels (${start} – ${end} XP)`;
          }
          return r.data?.level_from && r.data?.level_to
            ? `${r.data.level_from} - ${r.data.level_to}`
            : dash(null);
        },
      },
      BadgeCol('Rewards', 'reward_type'),
      TAGS_COL,
    ],
    steps: [
      {
        key: 'details',
        title: 'Details',
        subtitle: 'Please add the details with which you want to save this Rank.',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'tags', label: 'Tags (Optional)', type: 'tags' },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'rank_image', label: 'Rank Image', type: 'text' },
        ],
      },
      {
        key: 'levels',
        title: 'Levels & XP Ranges',
        subtitle:
          'Define each level inside this rank with its XP start/end window and an optional per-level reward. A player’s level & rank are recomputed from these XP windows.',
        fields: [{ name: 'levels', label: 'Levels', type: 'levels' }],
      },
      {
        key: 'rewards',
        title: 'Rank Rewards (Optional)',
        fields: [
          {
            name: 'reward_type',
            label: 'Reward Type',
            type: 'select',
            options: [
              { label: 'Level Rewards', value: 'level_rewards' },
              { label: 'Rank Rewards', value: 'rank_rewards' },
            ],
          },
          { name: 'reward_value', label: 'Reward Value', type: 'number' },
        ],
      },
    ],
  },
};

// ─── Rule modules (Token / XP, casino & sports) share one shape ───────────────
const ruleModule = (
  featureKey: GamificationModuleConfig['featureKey'],
  title: string,
  singular: string,
  bulkLabel: string
): GamificationModuleConfig => ({
  featureKey,
  title,
  singular,
  breadcrumb: ['Home', 'Gamification', title],
  createLabel: `Create ${singular}`,
  columns: [
    STATUS_COL,
    { header: 'Name', render: (r) => r.name },
    { header: 'Ranks', render: dataCell('ranks') },
    { header: 'Contribution Type', render: dataCell('contribution_type') },
    { header: 'Contribution %', render: dataCell('contribution_percentage') },
    TAGS_COL,
  ],
  extraFilters: ['Contribution Type', 'Game Category', 'Game provider', 'Game', 'Ranks'],
  subTabs: [
    { key: 'rules', label: 'Token Rules' },
    { key: 'history', label: 'Bulk Token History' },
  ],
  bulkUpload: {
    headerLabel: bulkLabel,
    title: bulkLabel.replace('Add ', ''),
    description:
      'Please upload file in CSV format with Player ID, Amount and Transaction Type (Debit, Credit) properties.',
    confirmLabel: bulkLabel,
  },
  steps: [
    {
      key: 'details',
      title: 'Details',
      subtitle: 'Please add the details with which you want to save this Rule.',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'tags', label: 'Tags (Optional)', type: 'tags' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    },
    {
      key: 'rank',
      title: 'Rank Selection',
      fields: [{ name: 'ranks', label: 'Ranks (comma separated)', type: 'text' }],
    },
    {
      key: 'contribution',
      title: 'Contribution',
      fields: [
        {
          name: 'contribution_type',
          label: 'Contribution Type',
          type: 'select',
          options: [
            { label: 'Game Provider', value: 'Game Provider' },
            { label: 'Game Category', value: 'Game Category' },
            { label: 'Game', value: 'Game' },
          ],
        },
        {
          name: 'contribution_percentage',
          label: 'Contribution %',
          type: 'number',
        },
      ],
    },
  ],
});

GAMIFICATION_MODULES['token-rules-casino'] = ruleModule(
  'token-rules-casino',
  'Token Rules (Casino)',
  'Token Rule Casino',
  'Add Bulk Tokens'
);
GAMIFICATION_MODULES['token-rules-sports'] = ruleModule(
  'token-rules-sports',
  'Token Rules (Sports)',
  'Token Rule Sport',
  'Add Bulk Tokens'
);
GAMIFICATION_MODULES['xp-point-rules-casino'] = ruleModule(
  'xp-point-rules-casino',
  'XP Point Rules (Casino)',
  'XP Points Rule',
  'Add Bulk XP Points'
);
GAMIFICATION_MODULES['xp-point-rules-sports'] = ruleModule(
  'xp-point-rules-sports',
  'XP Point Rules (Sports)',
  'XP Points Rule',
  'Add Bulk XP Points'
);

// ─── Simple modules (no dedicated screenshots) ────────────────────────────────
const simpleModule = (
  featureKey: GamificationModuleConfig['featureKey'],
  title: string,
  singular: string,
  extraSteps: GamificationModuleConfig['steps'] = []
): GamificationModuleConfig => ({
  featureKey,
  title,
  singular,
  breadcrumb: ['Home', 'Gamification', title],
  createLabel: `Create ${singular}`,
  columns: [
    STATUS_COL,
    NAME_COL,
    { header: 'Description', render: (r) => dash(r.description) },
    TAGS_COL,
  ],
  steps: [
    {
      key: 'details',
      title: 'Details',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'tags', label: 'Tags (Optional)', type: 'tags' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    },
    ...extraSteps,
  ],
});

const pill = (text: ReactNode): ReactNode => (
  <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-200 text-xs">{text}</span>
);

// ── Player Categories ─────────────────────────────────────────────────────────
GAMIFICATION_MODULES['player-categories'] = {
  featureKey: 'player-categories',
  title: 'Player Categories',
  singular: 'Player Category',
  breadcrumb: ['Home', 'Gamification', 'Player Categories'],
  createLabel: 'Create Player Category',
  extraFilters: ['Contribution Type', 'Game Category', 'Game provider', 'Game', 'Ranks'],
  columns: [
    STATUS_COL,
    NAME_COL,
    {
      header: 'Type',
      render: (r) => <span className="text-blue-400 underline">{dash(r.data?.category_type)}</span>,
    },
    {
      header: 'Range',
      render: (r) =>
        r.data?.range_from !== undefined && r.data?.range_to !== undefined
          ? pill(
              `${r.data.range_from} ${r.data.currency ?? 'USD'} - ${
                r.data.range_to
              } ${r.data.currency ?? 'USD'}`
            )
          : dash(null),
    },
  ],
  steps: [
    {
      key: 'details',
      title: 'Details',
      fields: [
        { name: 'name', label: 'Internal name', type: 'text', required: true },
        { name: 'tags', label: 'Tags (Optional)', type: 'tags' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    },
    {
      key: 'requirements',
      title: 'Category Requirements',
      fields: [
        {
          name: 'category_type',
          label: 'Type',
          type: 'select',
          required: true,
          options: [
            { label: 'Average Deposit Amount', value: 'Average Deposit Amount' },
            { label: 'Total Deposit Amount', value: 'Total Deposit Amount' },
            { label: 'Average Bet Amount', value: 'Average Bet Amount' },
            { label: 'Total Wager Amount', value: 'Total Wager Amount' },
          ],
        },
        { name: 'range_from', label: 'Range From', type: 'number', half: true },
        { name: 'range_to', label: 'Range To', type: 'number', half: true },
        {
          name: 'currency',
          label: 'Currency',
          type: 'select',
          half: true,
          options: [{ label: 'USD', value: 'USD' }],
        },
      ],
    },
  ],
};

// ── Reward Shop ───────────────────────────────────────────────────────────────
GAMIFICATION_MODULES['reward-shop'] = {
  featureKey: 'reward-shop',
  title: 'Reward Shop',
  singular: 'Product',
  breadcrumb: ['Home', 'Gamification', 'Reward Shop'],
  createLabel: 'Create Product',
  extraFilters: ['Type', 'Ranks Eligibility', 'Supplier'],
  columns: [
    STATUS_COL,
    NAME_COL,
    { header: 'Type', render: dataCell('type') },
    {
      header: 'Stock',
      render: (r) =>
        pill(
          `${r.data?.stock_available ?? r.data?.stock_total ?? 0} / ${r.data?.stock_total ?? 0}`
        ),
    },
    {
      header: 'Token Price',
      render: (r) => (r.data?.token_price ? `${r.data.token_price} Tokens` : dash(null)),
    },
    {
      header: 'Real Price',
      render: (r) =>
        r.data?.real_price ? `${r.data.real_price} ${r.data?.currency ?? 'USD'}` : dash(null),
    },
    {
      header: 'Supplier',
      render: (r) => (r.data?.supplier ? pill(String(r.data.supplier)) : dash(null)),
    },
    TAGS_COL,
    {
      header: 'Eligibility',
      render: (r) => dash(r.data?.eligibility_type ?? 'All Players'),
    },
    { header: 'Product Visibility', render: dataCell('product_visibility') },
  ],
  steps: [
    {
      key: 'details',
      title: 'Details',
      subtitle: 'Please add the details with which you want to save this Rank.',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'tags', label: 'Tags (Optional)', type: 'tags' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'priority', label: 'Order (Optional)', type: 'number' },
        {
          name: 'external_localization',
          label: 'External name and description (Optional)',
          type: 'textarea',
        },
        { name: 'large_image', label: 'Large Image', type: 'text', half: true },
        { name: 'small_image', label: 'Small Image', type: 'text', half: true },
      ],
    },
    {
      key: 'price',
      title: 'Product Type and Price',
      fields: [
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          required: true,
          options: [
            { label: 'External', value: 'External' },
            { label: 'Internal', value: 'Internal' },
          ],
        },
        { name: 'token_price', label: 'Token Price', type: 'number', half: true },
        { name: 'real_price', label: 'Real Price', type: 'number', half: true },
        {
          name: 'currency',
          label: 'Currency',
          type: 'select',
          half: true,
          options: [{ label: 'USD', value: 'USD' }],
        },
      ],
    },
    {
      key: 'settings',
      title: 'Product Settings',
      fields: [
        { name: 'stock_total', label: 'Stock', type: 'number', half: true },
        { name: 'supplier', label: 'Supplier', type: 'text', half: true },
        {
          name: 'product_visibility',
          label: 'Product Visibility',
          type: 'select',
          options: [
            { label: 'Visible', value: 'Visible' },
            { label: 'Hidden', value: 'Hidden' },
          ],
        },
      ],
    },
    {
      key: 'eligibility',
      title: 'Eligibility',
      fields: [
        {
          name: 'eligibility_type',
          label: 'Eligibility',
          type: 'select',
          options: [
            { label: 'All Players', value: 'All Players' },
            { label: 'Ranks', value: 'Ranks' },
          ],
        },
        { name: 'ranks', label: 'Ranks (comma separated)', type: 'text' },
      ],
    },
  ],
};

// ── Prizeshark Catalog (CSV-only) ─────────────────────────────────────────────
GAMIFICATION_MODULES['prizeshark-catalog'] = {
  featureKey: 'prizeshark-catalog',
  title: 'Prizeshark Catalog',
  singular: 'Prizeshark Item',
  breadcrumb: ['Home', 'Gamification', 'Prizeshark Catalog'],
  createLabel: 'Create Prizeshark Item',
  hideCreate: true,
  hideArchive: true,
  showStatusFilter: false,
  showTagsFilter: false,
  bulkUpload: {
    headerLabel: 'Upload CSV Catalog',
    title: 'Bulk Prizeshark Catalog',
    description:
      'Please upload file in CSV format with Reward Id, Product Name, Product Description, Categorization, Brand, Image URL, Cost to client inc delivery, Currency',
    confirmLabel: 'Upload CSV Catalog',
    primary: true,
    delimiter: true,
  },
  columns: [
    NAME_COL,
    { header: 'Brand', render: dataCell('brand') },
    { header: 'Categorization', render: dataCell('categorization') },
    { header: 'Cost', render: dataCell('cost') },
    { header: 'Currency', render: dataCell('currency') },
  ],
  steps: [
    {
      key: 'details',
      title: 'Details',
      fields: [
        { name: 'name', label: 'Product Name', type: 'text', required: true },
        { name: 'description', label: 'Product Description', type: 'textarea' },
        { name: 'brand', label: 'Brand', type: 'text', half: true },
        {
          name: 'categorization',
          label: 'Categorization',
          type: 'text',
          half: true,
        },
        { name: 'cost', label: 'Cost to client inc delivery', type: 'number' },
      ],
    },
  ],
};

// ── Purchase Feed (no dedicated design) ───────────────────────────────────────
GAMIFICATION_MODULES['purchase-feed'] = simpleModule(
  'purchase-feed',
  'Purchase Feed',
  'Purchase Feed Entry'
);

// ── Tournaments ───────────────────────────────────────────────────────────────
GAMIFICATION_MODULES['tournaments'] = {
  featureKey: 'tournaments',
  title: 'Tournaments',
  singular: 'Tournament',
  breadcrumb: ['Home', 'Gamification', 'Tournaments'],
  createLabel: 'Create Tournament',
  filterMode: 'button',
  showTagsFilter: false,
  columns: [
    STATUS_COL,
    NAME_COL,
    { header: 'Type', render: dataCell('tournament_type') },
    { header: 'Period', render: dataCell('period') },
    {
      header: 'Time Frame',
      render: (r) =>
        r.data?.start_date || r.data?.end_date ? (
          <div className="text-xs">
            <div>{String(r.data?.start_date ?? '-')}</div>
            <div>{String(r.data?.end_date ?? '-')}</div>
          </div>
        ) : (
          dash(null)
        ),
    },
    {
      header: 'Industry',
      render: (r) => (r.data?.industry ? pill(String(r.data.industry)) : dash(null)),
    },
    {
      header: 'Min Bet Amount',
      render: (r) => (r.data?.min_bet ? pill(`${r.data.min_bet} USD`) : dash(null)),
    },
    { header: 'Max Number of Bets', render: dataCell('max_bets') },
    {
      header: 'Opt-in',
      render: (r) => (
        <span className="text-slate-400 text-xs">{r.data?.opt_in ? 'Active' : 'Inactive'}</span>
      ),
    },
    { header: 'Buy-in', render: dataCell('buy_in') },
  ],
  steps: [
    {
      key: 'details',
      title: 'Details',
      subtitle:
        "Add the Tournament name, tags, images, and optional descriptions to set up how it's managed and displayed.",
      fields: [
        { name: 'name', label: 'Internal Name', type: 'text', required: true },
        { name: 'tags', label: 'Tags (Optional)', type: 'tags' },
        { name: 'description', label: 'Internal Description', type: 'textarea' },
        { name: 'large_image', label: 'Large Image', type: 'text', half: true },
        { name: 'small_image', label: 'Small Image', type: 'text', half: true },
        {
          name: 'external_localization',
          label: 'External name and description (Optional)',
          type: 'textarea',
        },
      ],
    },
    {
      key: 'type',
      title: 'industry And Tournament Type',
      fields: [
        {
          name: 'industry',
          label: 'Industry',
          type: 'select',
          required: true,
          options: [
            { label: 'Casino', value: 'Casino' },
            { label: 'Sports', value: 'Sports' },
          ],
        },
        {
          name: 'tournament_type',
          label: 'Tournament Type',
          type: 'select',
          options: [
            { label: 'Most Points', value: 'Most Points' },
            { label: 'Most Wins', value: 'Most Wins' },
            { label: 'Highest Multiplier', value: 'Highest Multiplier' },
          ],
        },
        {
          name: 'period',
          label: 'Period',
          type: 'select',
          options: [
            { label: 'Custom', value: 'Custom' },
            { label: 'Daily', value: 'Daily' },
            { label: 'Weekly', value: 'Weekly' },
          ],
        },
      ],
    },
    {
      key: 'settings',
      title: 'Settings',
      fields: [
        { name: 'min_bet', label: 'Min Bet Amount', type: 'number', half: true },
        {
          name: 'max_bets',
          label: 'Max Number of Bets',
          type: 'number',
          half: true,
        },
        { name: 'buy_in', label: 'Buy-in', type: 'number', half: true },
        {
          name: 'opt_in',
          label: 'Opt-in',
          type: 'switch',
          placeholder: 'Players must opt in',
          half: true,
        },
        { name: 'start_date', label: 'Start Date', type: 'text', half: true },
        { name: 'end_date', label: 'End Date', type: 'text', half: true },
      ],
    },
    {
      key: 'leaderboard',
      title: 'Leaderboard',
      fields: [
        {
          name: 'leaderboard_size',
          label: 'Leaderboard Size',
          type: 'number',
          half: true,
        },
        { name: 'prize_pool', label: 'Prize Pool', type: 'number', half: true },
      ],
    },
    {
      key: 'eligibility',
      title: 'Eligibility',
      fields: [
        {
          name: 'eligibility_type',
          label: 'Eligibility',
          type: 'select',
          options: [
            { label: 'All Players', value: 'All Players' },
            { label: 'Segment', value: 'Segment' },
          ],
        },
        { name: 'segment', label: 'Segment', type: 'text' },
      ],
    },
  ],
};

// Base path all gamification module routes are nested under.
export const GAMIFICATION_BASE = '/gamification';

// Default sub-route used when landing on the bare `/gamification` path.
export const GAMIFICATION_DEFAULT_KEY = 'missions';

// Module keys in the order they should appear in nav menus.
export const GAMIFICATION_MODULE_KEYS = [
  'missions',
  'mission-bundles',
  'ranks',
  'token-rules-casino',
  'token-rules-sports',
  'xp-point-rules-casino',
  'xp-point-rules-sports',
  'player-categories',
  'reward-shop',
  'prizeshark-catalog',
  'purchase-feed',
  'tournaments',
] as const;

// Build the full route path for a given module key (e.g. "ranks" → "/gamification/ranks").
export const gamificationPath = (key: string): string => `${GAMIFICATION_BASE}/${key}`;

// path → config (used by the router). Paths are nested under `/gamification`.
export const GAMIFICATION_ROUTES: { path: string; key: string }[] = GAMIFICATION_MODULE_KEYS.map(
  (key) => ({ path: gamificationPath(key), key })
);
