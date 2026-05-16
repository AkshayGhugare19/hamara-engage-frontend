import { useEffect, useState, useRef, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MoreVertical, Search, Users } from 'lucide-react';
import DashboardLayout from '@/layout/DashboardLayout';
import PageHeaderBreadcrumb from '@/components/PageHeaderBreadcrumb';
import Pagination from '@/components/Pagination';
import apiService from '@/services/api';
import type { ApiError, PaginatedData } from '@/types';
import {
  type Segment,
  type SegmentFilters,
  SEGMENT_TYPE_FILTER_OPTIONS,
  SEGMENT_TAG_OPTIONS,
} from '@/types/segment.types';

const formatDate = (value?: string | null): string => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}\n${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} UTC`;
};

const TypeBadge: FC<{ type: Segment['type'] }> = ({ type }) => {
  const map: Record<string, string> = {
    DYNAMIC: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    STATIC: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs capitalize ${
        map[type] ?? map.DYNAMIC
      }`}
    >
      {type.toLowerCase()}
    </span>
  );
};

const defaultFilters: SegmentFilters = {
  search: '',
  type: '',
  created_by: '',
  tag: '',
};

const SegmentTableList: FC = () => {
  const navigate = useNavigate();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [creators, setCreators] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SegmentFilters>(defaultFilters);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const getSegments = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<PaginatedData<Segment>>('/segments/paginate', {
        page,
        limit,
        archived: false,
        search: filters.search || undefined,
        type: filters.type || undefined,
        created_by: filters.created_by || undefined,
        tag: filters.tag || undefined,
      });
      if (response?.success && response?.data) {
        setSegments(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Get segments error:', err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  const getCreators = async () => {
    try {
      const response = await apiService.get<string[]>('/segments/creators');
      if (response?.success && response?.data) {
        setCreators(response.data);
      }
    } catch (err) {
      console.error('Get creators error:', err as ApiError);
    }
  };

  useEffect(() => {
    getSegments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    getCreators();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const applyFilters = () => {
    setPage(1);
    getSegments();
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
    setTimeout(() => getSegments(), 0);
  };

  const handleArchive = async (id: string) => {
    try {
      const response = await apiService.post(`/segments/archive/${id}`);
      if (response?.success) {
        toast.success(response.message || 'Segment archived');
        getSegments();
      }
    } catch (err) {
      toast.error((err as ApiError).message || 'Failed to archive segment');
    } finally {
      setOpenMenu(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await apiService.delete(`/segments/${id}`);
      if (response?.success) {
        toast.success(response.message || 'Segment deleted');
        getSegments();
      }
    } catch (err) {
      toast.error((err as ApiError).message || 'Failed to delete segment');
    } finally {
      setOpenMenu(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 w-full">
        <div className="flex justify-between items-center mb-6">
          <PageHeaderBreadcrumb
            title="Segments"
            items={[{ label: 'Home', clickable: true }, { label: 'CRM' }, { label: 'Segments' }]}
          />

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/crm/segments/archive')}
              className="px-4 py-2 rounded-full border border-amber-500 text-amber-400 text-sm hover:bg-amber-500/10"
            >
              Archive
            </button>
            <button
              onClick={() => navigate('/crm/segments/create')}
              className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Create Segment
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-md p-4 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Search</label>
              <div className="relative">
                <input
                  className="w-full pl-3 pr-9 py-2 bg-slate-800 border border-slate-700 rounded text-sm"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                />
                <Search
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Types</label>
              <select
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                {SEGMENT_TYPE_FILTER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Created By</label>
              <select
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm"
                value={filters.created_by}
                onChange={(e) => setFilters({ ...filters, created_by: e.target.value })}
              >
                <option value="">All Creators</option>
                {creators.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Tags</label>
              <select
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm"
                value={filters.tag}
                onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
              >
                <option value="">All Tags</option>
                {SEGMENT_TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="bg-blue-600 px-4 py-2 rounded text-white text-sm"
              >
                Apply
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded text-red-400 text-sm hover:bg-red-500/10"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-700 rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Created Date</th>
                <th className="p-3 text-left">Created By</th>
                <th className="p-3 text-left">Last Segment Count</th>
                <th className="p-3 text-left">Tags</th>
                <th className="p-3 text-left" />
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-400">
                    Loading segments...
                  </td>
                </tr>
              ) : segments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-400">
                    No segments found
                  </td>
                </tr>
              ) : (
                segments.map((s) => (
                  <tr key={s.id} className="border-t border-slate-700 hover:bg-slate-800/40">
                    <td className="p-3">
                      <button
                        onClick={() => navigate(`/crm/segments/create?id=${s.id}`)}
                        className="font-medium text-blue-300 underline"
                      >
                        {s.name}
                      </button>
                    </td>
                    <td className="p-3 text-slate-300 max-w-xs">{s.description || '-'}</td>
                    <td className="p-3">
                      <TypeBadge type={s.type} />
                    </td>
                    <td className="p-3 whitespace-pre-line text-xs">{formatDate(s.created_at)}</td>
                    <td className="p-3">{s.created_by || '-'}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/20 text-blue-300">
                          <Users size={14} />
                        </span>
                        <div>
                          <div className="font-medium">{s.player_count ?? 0} players</div>
                          <div className="text-[11px] text-slate-400 whitespace-pre-line">
                            {formatDate(s.last_counted_at)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      {s.tags && s.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {s.tags.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-full text-[11px] bg-slate-700 text-slate-200"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-3 relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)}
                        className="p-1 rounded hover:bg-slate-700"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenu === s.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-6 top-8 z-10 w-36 bg-slate-800 border border-slate-700 rounded shadow-lg text-sm"
                        >
                          <button
                            className="block w-full text-left px-3 py-2 hover:bg-slate-700"
                            onClick={() => {
                              setOpenMenu(null);
                              navigate(`/crm/segments/create?id=${s.id}`);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-3 py-2 hover:bg-slate-700"
                            onClick={() => handleArchive(s.id)}
                          >
                            Archive
                          </button>
                          <button
                            className="block w-full text-left px-3 py-2 text-red-400 hover:bg-slate-700"
                            onClick={() => handleDelete(s.id)}
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

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </DashboardLayout>
  );
};

export default SegmentTableList;
