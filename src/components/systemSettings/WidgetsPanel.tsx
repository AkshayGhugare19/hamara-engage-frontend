import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { settingsApi } from '@/services/systemSettings.service';

interface WidgetsValues {
  configuration: unknown;
  sidebar_modules: unknown;
  theme: unknown;
}

const WidgetsPanel = () => {
  const [, setValues] = useState<WidgetsValues>({
    configuration: null,
    sidebar_modules: null,
    theme: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await settingsApi.getByPanel('widgets');
        const d = (res.data ?? {}) as Partial<WidgetsValues>;
        setValues({
          configuration: d.configuration ?? null,
          sidebar_modules: d.sidebar_modules ?? null,
          theme: d.theme ?? null,
        });
      } catch {
        toast.error('Failed to load widgets settings');
      }
    })();
  }, []);

  const stub = (label: string) => () => toast.info(`${label}: not yet implemented`);

  const rows = [
    { key: 'configuration', label: 'Widgets Configuration' },
    { key: 'sidebar_modules', label: 'Sidebar Modules' },
    { key: 'theme', label: 'Theme' },
  ] as const;

  return (
    <div className="px-4">
      <h1 className="text-xl font-semibold text-slate-100 mb-6">Widgets</h1>
      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg px-5 py-4 hover:bg-slate-700/50 hover:border-slate-500 transition-colors"
          >
            <div>
              <p className="font-semibold text-slate-200 text-sm">{row.label}</p>
            </div>
            <button
              onClick={stub(row.label)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-4 py-1.5 rounded-full transition-colors"
            >
              Update
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WidgetsPanel;
