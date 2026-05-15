import type { FC } from 'react';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'switch'
  | 'tags';

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

      {field.hint && <p className="text-[11px] text-slate-500 mt-1">{field.hint}</p>}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};
