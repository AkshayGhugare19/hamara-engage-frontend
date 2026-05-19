import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '@/layout/DashboardLayout';
import { DeleteRecord } from '@/components/DeleteRecord';
import type { ApiError } from '@/types';
import type {
  GamificationEntity,
  GamificationFeatureKey,
  GamificationStatus,
} from '@/types/gamification.types';
import { gamificationApi } from '@/services/gamification.api';
import type { LevelContinuation, RankLevel, WizardStep } from './fields';
import CreateWizard, { buildInitialForm, type WizardFormState } from './CreateWizard';
import BulkUploadModal from './BulkUploadModal';

export interface ColumnDef {
  header: string;
  render: (row: GamificationEntity) => ReactNode;
}

export interface GamificationModuleConfig {
  featureKey: GamificationFeatureKey;
  title: string;
  singular: string;
  breadcrumb: string[];
  createLabel: string;
  columns: ColumnDef[];
  showStatusFilter?: boolean;
  showTagsFilter?: boolean;
  /** decorative filter selects shown to match the designs */
  extraFilters?: string[];
  steps: WizardStep[];
  bulkUpload?: {
    headerLabel: string;
    title: string;
    description: string;
    confirmLabel: string;
    /** render the bulk button as the primary (blue) header action */
    primary?: boolean;
    /** show comma/semicolon delimiter chooser */
    delimiter?: boolean;
  };
  subTabs?: { key: string; label: string }[];
  /** hide the Create button (e.g. CSV-only catalogs) */
  hideCreate?: boolean;
  /** hide the Archive toggle */
  hideArchive?: boolean;
  /** 'inline' (default) shows the full filter bar; 'button' shows Search + a Filter toggle */
  filterMode?: 'inline' | 'button';
}

const Crumb = ({ items }: { items: string[] }) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="text-xl font-bold text-white mr-2">{items[items.length - 1]}</span>
    {items.map((c, i) => (
      <span key={c} className="text-slate-500">
        {c}
        {i < items.length - 1 && <span className="mx-1">›</span>}
      </span>
    ))}
  </div>
);

const GamificationModulePage = ({ config }: { config: GamificationModuleConfig }) => {
  const api = useMemo(() => gamificationApi(config.featureKey), [config.featureKey]);

  const [rows, setRows] = useState<GamificationEntity[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [fetching, setFetching] = useState(false);

  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [statusFilter, setStatusFilter] = useState<GamificationStatus | ''>('');
  const [tagFilter, setTagFilter] = useState('');
  const [archived, setArchived] = useState(false);

  const [view, setView] = useState<'list' | 'form'>('list');
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<WizardFormState>(buildInitialForm());
  const [saving, setSaving] = useState(false);
  const [levelContinuation, setLevelContinuation] = useState<LevelContinuation | undefined>(
    undefined
  );

  const [showBulk, setShowBulk] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [subTab, setSubTab] = useState(config.subTabs?.[0]?.key ?? '');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Archive view drops the Status column + status filter (matches the designs).
  const visibleColumns = useMemo(
    () => (archived ? config.columns.filter((c) => c.header !== 'Status') : config.columns),
    [archived, config.columns]
  );
  const filterBarVisible = config.filterMode !== 'button' || filtersOpen;
  const showStatusFilter = config.showStatusFilter !== false && !archived;

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setDebounced(search.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchRows = useCallback(async () => {
    try {
      setFetching(true);
      const res = await api.paginate({
        page,
        limit,
        archived,
        ...(debounced ? { search: debounced } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(tagFilter ? { tag: tagFilter } : {}),
      });
      if (res?.success && res?.data) {
        setRows(res.data.data);
        setTotal(res.data.pagination.total || 0);
        setTotalPages(res.data.pagination.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
      toast.error(`Failed to load ${config.title}`);
    } finally {
      setFetching(false);
    }
  }, [api, page, limit, archived, debounced, statusFilter, tagFilter, config.title]);

  useEffect(() => {
    if (view === 'list') fetchRows();
  }, [fetchRows, view]);

  /**
   * Ranks share one continuous ladder. Work out where this rank's levels
   * must begin: continuing an existing rank keeps its own starting point,
   * a brand-new rank picks up from the current top of the ladder, and the
   * very first rank starts at level 1 / 0 XP.
   */
  const computeRankContinuation = useCallback(
    async (editing?: GamificationEntity) => {
      if (config.featureKey !== 'ranks') {
        setLevelContinuation(undefined);
        return;
      }
      const levelsOf = (r: GamificationEntity): RankLevel[] => {
        const l = (r.data as { levels?: unknown })?.levels;
        return Array.isArray(l) ? (l as RankLevel[]) : [];
      };
      try {
        const res = await api.paginate({ page: 1, limit: 100, archived: false });
        const ranks = res?.data?.data ?? [];
        const others = ranks.filter((r) => !editing || r.id !== editing.id);

        // Editing a rank that already has levels → keep its position.
        const own = editing ? levelsOf(editing) : [];
        if (own.length) {
          const first = [...own].sort((a, b) => a.level - b.level)[0];
          const from = others.find((r) =>
            levelsOf(r).some((l) => Number(l.xp_end) === Number(first.xp_start))
          );
          setLevelContinuation({
            startLevel: Number(first.level) || 1,
            startXp: Number(first.xp_start) || 0,
            fromRank: from?.name ?? null,
          });
          return;
        }

        const flat = others.flatMap(levelsOf);
        if (!flat.length) {
          setLevelContinuation({ startLevel: 1, startXp: 0, fromRank: null });
          return;
        }
        const maxLevel = Math.max(...flat.map((l) => Number(l.level) || 0));
        const maxXp = Math.max(...flat.map((l) => Number(l.xp_end) || 0));
        const from = others.find((r) => levelsOf(r).some((l) => Number(l.xp_end) === maxXp));
        setLevelContinuation({
          startLevel: maxLevel + 1,
          startXp: maxXp,
          fromRank: from?.name ?? null,
        });
      } catch {
        setLevelContinuation({ startLevel: 1, startXp: 0, fromRank: null });
      }
    },
    [api, config.featureKey]
  );

  const openCreate = () => {
    setEditId(null);
    setForm(buildInitialForm());
    setLevelContinuation(undefined);
    computeRankContinuation();
    setView('form');
  };

  const openEdit = (row: GamificationEntity) => {
    setMenuId(null);
    setEditId(row.id);
    setForm({
      name: row.name,
      description: row.description ?? '',
      priority: row.priority ?? 0,
      status: row.status,
      tags: row.tags ?? [],
      data: row.data ?? {},
    });
    setLevelContinuation(undefined);
    computeRankContinuation(row);
    setView('form');
  };

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || null,
      status: form.status,
      priority: Number(form.priority) || 0,
      tags: form.tags,
      data: form.data,
    };
    try {
      if (editId) {
        await api.update(editId, payload);
        toast.success(`${config.singular} updated`);
      } else {
        await api.create(payload);
        toast.success(`${config.singular} created`);
      }
      setView('list');
      setPage(1);
    } catch (e) {
      toast.error((e as ApiError).message || `Failed to save ${config.singular}`);
    } finally {
      setSaving(false);
    }
  };

  const handleArchiveToggle = async (row: GamificationEntity) => {
    setMenuId(null);
    try {
      await api.archive(row.id, !row.archived);
      toast.success(row.archived ? 'Unarchived' : 'Archived');
      fetchRows();
    } catch {
      toast.error('Action failed');
    }
  };

  const handleDelete = (id: string) => {
    setMenuId(null);
    DeleteRecord({
      endpoint: `/gamification/${config.featureKey}/${id}`,
      successMessage: `${config.singular} deleted`,
      onSuccess: fetchRows,
    });
  };

  // ── Create / Edit view ───────────────────────────────────────────
  if (view === 'form') {
    return (
      <DashboardLayout>
        <div className="p-4 w-full">
          <CreateWizard
            title={config.singular}
            breadcrumb={config.breadcrumb}
            steps={config.steps}
            form={form}
            setForm={setForm}
            onCancel={() => setView('list')}
            onSubmit={submit}
            saving={saving}
            editing={Boolean(editId)}
            levelContinuation={levelContinuation}
          />
        </div>
      </DashboardLayout>
    );
  }

  // ── List view ────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="p-4 w-full">
        <div className="flex items-center justify-between mb-4">
          <Crumb items={archived ? [...config.breadcrumb, 'Archive'] : config.breadcrumb} />
          <div className="flex gap-3">
            {config.bulkUpload &&
              (config.bulkUpload.primary ? (
                <button
                  onClick={() => setShowBulk(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm text-white"
                >
                  {config.bulkUpload.headerLabel}
                </button>
              ) : (
                <button
                  onClick={() => setShowBulk(true)}
                  className="text-sm text-slate-200 hover:text-white px-3 py-2"
                >
                  + {config.bulkUpload.headerLabel}
                </button>
              ))}
            {!config.hideArchive && (
              <button
                onClick={() => {
                  setArchived((a) => !a);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm border ${
                  archived
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'border-amber-500/40 text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                Archive
              </button>
            )}
            {!config.hideCreate && (
              <button
                onClick={openCreate}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm text-white"
              >
                {config.createLabel}
              </button>
            )}
          </div>
        </div>

        {config.subTabs && (
          <div className="flex gap-2 mb-4">
            {config.subTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setSubTab(t.key)}
                className={`px-4 py-1.5 rounded-full text-sm ${
                  subTab === t.key ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Search</label>
              <div className="relative">
                <input
                  className="w-60 px-3 py-2 pr-9 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg
                  className="absolute right-3 top-2.5 w-4 h-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {config.filterMode === 'button' && (
              <button
                onClick={() => setFiltersOpen((o) => !o)}
                className={`px-4 py-2 rounded text-sm flex items-center gap-2 ${
                  filtersOpen
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600/80 text-white hover:bg-blue-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h18M6 12h12M10 20h4"
                  />
                </svg>
                Filter
              </button>
            )}

            {filterBarVisible && showStatusFilter && (
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Status</label>
                <select
                  className="w-44 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as GamificationStatus | '');
                    setPage(1);
                  }}
                >
                  <option value="">All</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            )}

            {filterBarVisible &&
              config.extraFilters?.map((f) => (
                <div key={f}>
                  <label className="text-[11px] text-slate-400 block mb-1">{f}</label>
                  <select
                    disabled
                    className="w-44 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-500"
                  >
                    <option>All</option>
                  </select>
                </div>
              ))}

            {filterBarVisible && config.showTagsFilter !== false && (
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Tags</label>
                <input
                  className="w-44 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200"
                  placeholder="tag"
                  value={tagFilter}
                  onChange={(e) => {
                    setTagFilter(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            )}

            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setTagFilter('');
                setPage(1);
              }}
              className="text-red-400 text-sm hover:text-red-300 pb-2"
            >
              🗑 Clear
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-700 rounded-md">
          <table className="w-full text-sm">
            <thead className={archived ? 'bg-amber-700/40' : 'bg-slate-800'}>
              <tr>
                {visibleColumns.map((c) => (
                  <th key={c.header} className="p-3 text-left text-slate-300 font-medium">
                    {c.header}
                  </th>
                ))}
                <th className="p-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + 1}
                    className="p-10 text-center text-slate-400"
                  >
                    {fetching ? 'Loading…' : 'No results found.'}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-700 hover:bg-slate-800/50">
                    {visibleColumns.map((c) => (
                      <td key={c.header} className="p-3 text-slate-300">
                        {c.render(row)}
                      </td>
                    ))}
                    <td className="p-3 relative">
                      <button
                        className="p-1.5 rounded hover:bg-slate-700 text-slate-400"
                        onClick={() => setMenuId(menuId === row.id ? null : row.id)}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="5" r="1.5" />
                          <circle cx="12" cy="12" r="1.5" />
                          <circle cx="12" cy="19" r="1.5" />
                        </svg>
                      </button>
                      {menuId === row.id && (
                        <div className="absolute right-8 top-1 z-20 bg-slate-800 border border-slate-700 rounded shadow-lg min-w-[130px]">
                          <button
                            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700"
                            onClick={() => openEdit(row)}
                          >
                            Edit
                          </button>
                          <button
                            className="w-full text-left px-3 py-2 text-sm text-amber-400 hover:bg-slate-700"
                            onClick={() => handleArchiveToggle(row)}
                          >
                            {row.archived ? 'Unarchive' : 'Archive'}
                          </button>
                          <button
                            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-700"
                            onClick={() => handleDelete(row.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-4 mt-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            Rows per page
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(1)}
              className="px-2 py-1 disabled:opacity-30"
            >
              |‹
            </button>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 disabled:opacity-30"
            >
              ‹
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded-full">{page}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-2 py-1 disabled:opacity-30"
            >
              ›
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(totalPages)}
              className="px-2 py-1 disabled:opacity-30"
            >
              ›|
            </button>
          </div>
          <span>Total: {total}</span>
        </div>

        {showBulk && config.bulkUpload && (
          <BulkUploadModal
            title={config.bulkUpload.title}
            description={config.bulkUpload.description}
            confirmLabel={config.bulkUpload.confirmLabel}
            withDelimiter={config.bulkUpload.delimiter}
            onClose={() => setShowBulk(false)}
            onUpload={() => {
              toast.info('Bulk upload received (processing stub).');
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default GamificationModulePage;
