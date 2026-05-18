import { useEffect, useState, type FC } from 'react';
import apiService from '@/services/api';
import Pagination from '@/components/Pagination';
import ManualRewardModal from '@/components/modals/players/ManualRewardModal';
import type { ApiError, PaginatedData } from '@/types';
import type { PlayerReward, RewardStatus } from '@/types/player.types';

const rewardStatusBadge: Record<RewardStatus, string> = {
  IN_PROGRESS: 'bg-amber-500/20 text-amber-300',
  GRANTED: 'bg-green-500/20 text-green-300',
  EXPIRED: 'bg-slate-500/20 text-slate-300',
  CANCELLED: 'bg-red-500/20 text-red-300',
};

const fmt = (v?: string | null) => {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })} - ${d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const GamificationTab: FC<{ playerId: string }> = ({ playerId }) => {
  const [rewards, setRewards] = useState<PlayerReward[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const res = await apiService.get<PaginatedData<PlayerReward>>(
        `/players/${playerId}/rewards`,
        { page, limit: 25 }
      );
      if (res?.success && res?.data) {
        setRewards(res.data.data);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotal(res.data.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Rewards error:', err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="space-y-6">
      {/* My Rewards */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">My Rewards</h3>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-1.5 rounded-full border border-blue-500 text-blue-300 text-sm hover:bg-blue-500/10"
          >
            + Manual Reward
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-400 text-xs">
              <tr>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Granted Date</th>
                <th className="p-3 text-left">Gamification Source</th>
                <th className="p-3 text-left">Reward Type</th>
                <th className="p-3 text-left">Reward</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              ) : rewards.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    No rewards
                  </td>
                </tr>
              ) : (
                rewards.map((r) => (
                  <tr key={r.id} className="border-t border-slate-700/60">
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${rewardStatusBadge[r.status]}`}
                      >
                        {r.status
                          .toLowerCase()
                          .replace('_', ' ')
                          .replace(/^\w/, (c) => c.toUpperCase())}
                      </span>
                    </td>
                    <td className="p-3">{fmt(r.granted_date)}</td>
                    <td className="p-3">{r.gamification_source || '-'}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-300">
                        {r.reward_type || '-'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300">
                        {r.reward || '-'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-4 mt-3 text-sm text-slate-300">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          <span>
            <span className="font-semibold">Total:</span> {total}
          </span>
        </div>
      </div>

      {/* Tournaments */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-5">
        <h3 className="font-semibold mb-4">Tournaments</h3>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-16 border-2 border-slate-600 rounded mb-3" />
          <p className="font-semibold text-slate-300">No results found.</p>
          <p className="text-xs text-slate-500 mt-1">
            What you searched for was unfortunately not found. Please try another combination.
          </p>
        </div>
      </div>

      {showModal && (
        <ManualRewardModal
          playerId={playerId}
          onClose={() => setShowModal(false)}
          onSuccess={fetchRewards}
        />
      )}
    </div>
  );
};

export default GamificationTab;
