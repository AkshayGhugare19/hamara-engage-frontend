import type { SettingsRow } from '../../types/systemSettings.types';

const rows: SettingsRow[] = [
  {
    label: 'Widgets Configuration',
    description: '',
    hasUpdate: true,
  },
  {
    label: 'Sidebar Modules',
    description: '',
    hasUpdate: true,
  },
  {
    label: 'Theme',
    description: '',
    hasUpdate: true,
  },
];

const WidgetsPanel = () => (
  <div className="px-4">
    <h1 className="text-xl font-semibold text-slate-100 mb-6">Widgets</h1>
    <div className="space-y-2">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg px-5 py-4 hover:bg-slate-700/50 hover:border-slate-500 transition-colors"
        >
          <div>
            <p className="font-semibold text-slate-200 text-sm">{row.label}</p>
            {row.description && <p className="text-slate-500 text-xs mt-0.5">{row.description}</p>}
          </div>
          {row.hasUpdate ? (
            <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-4 py-1.5 rounded-full transition-colors">
              Update
            </button>
          ) : (
            <span className="text-slate-400 text-sm">{row.value}</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default WidgetsPanel;
