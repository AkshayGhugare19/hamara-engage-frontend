import type { FC } from 'react';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'switch'
  | 'tags'
  | 'levels';

/** One configured level inside a Rank (stored in data.levels[]). */
export interface RankLevel {
  level: number;
  xp_start: number;
  xp_end: number;
  reward_type?: string;
  reward_value?: number;
}

/** Reward types selectable per level (kept in sync with the rank-wide reward step). */
export const LEVEL_REWARD_TYPES: FieldOption[] = [
  { label: 'None', value: '' },
  { label: 'Bonus Cash', value: 'bonus_cash' },
  { label: 'Free Spins', value: 'free_spins' },
  { label: 'XP Points', value: 'xp' },
  { label: 'Tokens', value: 'tokens' },
];

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldDef {
  /** key inside form.data (or 'name'/'description' which are root columns) */
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  /** half-width when true (two per row) */
  half?: boolean;
  hint?: string;
}

export interface WizardStep {
  key: string;
  title: string;
  /** short helper line under the step title */
  subtitle?: string;
  fields: FieldDef[];
}

const ROOT_FIELDS = new Set(['name', 'description', 'priority']);

export const isRootField = (name: string) => ROOT_FIELDS.has(name);

interface LevelsEditorProps {
  value: RankLevel[];
  onChange: (value: RankLevel[]) => void;
}

/**
 * Repeatable editor for a Rank's levels. Each row defines the XP window
 * (start → end) for that level plus an optional per-level reward. The
 * backend recomputes a player's level/rank from these XP windows.
 */
const LevelsEditor: FC<LevelsEditorProps> = ({ value, onChange }) => {
  const cell =
    'w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500';

  const update = (idx: number, patch: Partial<RankLevel>) =>
    onChange(value.map((row, i) => (i === idx ? { ...row, ...patch } : row)));

  const addRow = () => {
    const last = value[value.length - 1];
    const nextLevel = last ? Number(last.level) + 1 : 1;
    const nextStart = last ? Number(last.xp_end) || 0 : 0;
    onChange([
      ...value,
      {
        level: nextLevel,
        xp_start: nextStart,
        xp_end: nextStart + 100,
        reward_type: '',
        reward_value: 0,
      },
    ]);
  };

  const removeRow = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="grid grid-cols-[60px_1fr_1fr_1fr_90px_28px] gap-2 text-[11px] text-slate-500 px-1">
          <span>Level</span>
          <span>XP Start</span>
          <span>XP End</span>
          <span>Level Reward</span>
          <span>Reward Val</span>
          <span />
        </div>
      )}

      {value.map((row, idx) => (
        <div key={idx} className="grid grid-cols-[60px_1fr_1fr_1fr_90px_28px] gap-2 items-center">
          <input
            type="number"
            className={cell}
            value={row.level ?? ''}
            onChange={(e) => update(idx, { level: Number(e.target.value) })}
          />
          <input
            type="number"
            className={cell}
            value={row.xp_start ?? ''}
            onChange={(e) => update(idx, { xp_start: Number(e.target.value) })}
          />
          <input
            type="number"
            className={cell}
            value={row.xp_end ?? ''}
            onChange={(e) => update(idx, { xp_end: Number(e.target.value) })}
          />
          <select
            className={cell}
            value={row.reward_type ?? ''}
            onChange={(e) => update(idx, { reward_type: e.target.value })}
          >
            {LEVEL_REWARD_TYPES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            className={cell}
            value={row.reward_value ?? ''}
            onChange={(e) => update(idx, { reward_value: Number(e.target.value) })}
          />
          <button
            type="button"
            onClick={() => removeRow(idx)}
            className="text-red-400 hover:text-red-300 text-sm"
            title="Remove level"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="mt-1 px-3 py-1.5 rounded text-xs bg-blue-600/80 hover:bg-blue-600 text-white"
      >
        + Add Level
      </button>
    </div>
  );
};

interface FieldRendererProps {
  field: FieldDef;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}

export const FieldRenderer: FC<FieldRendererProps> = ({ field, value, error, onChange }) => {
  const base =
    'w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500';

  return (
    <div className={field.half ? 'w-full' : 'w-full'}>
      <label className="text-xs text-slate-400 block mb-1">
        {field.label}
        {field.required && <span className="text-red-400"> *</span>}
      </label>

      {field.type === 'text' && (
        <input
          className={base}
          placeholder={field.placeholder}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'number' && (
        <input
          type="number"
          className={base}
          placeholder={field.placeholder}
          value={(value as number | string) ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          rows={3}
          className={base}
          placeholder={field.placeholder}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'select' && (
        <select
          className={base}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select…</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      {field.type === 'multiselect' && (
        <div className="flex flex-wrap gap-2 p-2 bg-slate-800 border border-slate-700 rounded">
          {field.options?.map((o) => {
            const arr = Array.isArray(value) ? (value as string[]) : [];
            const checked = arr.includes(o.value);
            return (
              <button
                type="button"
                key={o.value}
                onClick={() =>
                  onChange(checked ? arr.filter((v) => v !== o.value) : [...arr, o.value])
                }
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  checked
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}

      {field.type === 'tags' && (
        <input
          className={base}
          placeholder="Comma separated tags"
          value={Array.isArray(value) ? (value as string[]).join(', ') : ''}
          onChange={(e) =>
            onChange(
              e.target.value
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            )
          }
        />
      )}

      {field.type === 'switch' && (
        <label className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer mt-1">
          <input
            type="checkbox"
            className="w-4 h-4 accent-blue-600"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          {field.placeholder ?? 'Enabled'}
        </label>
      )}

      {field.type === 'levels' && (
        <LevelsEditor
          value={Array.isArray(value) ? (value as RankLevel[]) : []}
          onChange={(v) => onChange(v)}
        />
      )}

      {field.hint && <p className="text-[11px] text-slate-500 mt-1">{field.hint}</p>}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};
