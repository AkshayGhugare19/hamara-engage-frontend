import { useState, type FC } from 'react';
import type { CategoryStat, Player } from '@/types/player.types';

const EmptyCard: FC<{ title: string }> = ({ title }) => (
  <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6">
    <h3 className="font-semibold mb-4">{title}</h3>
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-16 border-2 border-slate-600 rounded mb-3" />
      <p className="font-semibold text-slate-300">No results found.</p>
      <p className="text-xs text-slate-500 mt-1">
        What you searched for was unfortunately not found. Please try another combination.
      </p>
    </div>
  </div>
);

const Donut: FC<{ total: number }> = ({ total }) => (
  <div className="relative w-32 h-32 shrink-0">
    <div className="absolute inset-0 rounded-full border-[14px] border-blue-500" />
    <div className="absolute inset-0 rounded-full border-[14px] border-cyan-400 border-r-transparent border-b-transparent rotate-45" />
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      <span className="text-sm font-semibold">USD {total.toFixed(2)}</span>
      <span className="text-[10px] text-slate-400">Total Turnover</span>
    </div>
  </div>
);

const StatCard: FC<{ title: string; rows?: CategoryStat[]; total: number }> = ({
  title,
  rows,
  total,
}) => (
  <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-5">
    <h3 className="font-semibold mb-4">{title}</h3>
    <div className="flex items-center gap-6">
      <Donut total={total} />
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-slate-400">
            <tr>
              <th className="text-left py-1">NAME</th>
              <th className="text-left py-1">PERC.</th>
              <th className="text-left py-1">TURNOVER</th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).length === 0 ? (
              <tr>
                <td colSpan={3} className="py-3 text-slate-500">
                  No data
                </td>
              </tr>
            ) : (
              (rows ?? []).map((r) => (
                <tr key={r.name} className="border-t border-slate-700/60">
                  <td className="py-2 text-blue-300">{r.name}</td>
                  <td className="py-2">{r.perc}%</td>
                  <td className="py-2">USD {r.turnover}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const PersonalizationTab: FC<{ player: Player }> = ({ player }) => {
  const [view, setView] = useState<'casino' | 'sports'>('casino');
  const casino = player.personalization?.casino;
  const total = casino?.totalTurnover ?? 0;
  const fav = casino?.favoriteGames ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['casino', 'sports'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize ${
                view === v
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <select className="bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm">
          <option>Lifetime</option>
          <option>Last 30 days</option>
          <option>Last 7 days</option>
        </select>
      </div>

      {view === 'casino' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <StatCard title="Game Category" rows={casino?.gameCategory} total={total} />
            <StatCard title="Game Provider" rows={casino?.gameProvider} total={total} />
          </div>

          <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-5">
            <h3 className="font-semibold mb-4">Favorite Games</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800 text-slate-400 text-xs">
                  <tr>
                    <th className="p-2 text-left">POSITION</th>
                    <th className="p-2 text-left">GAME</th>
                    <th className="p-2 text-left">CATEGORY</th>
                    <th className="p-2 text-left">TURNOVER</th>
                    <th className="p-2 text-left">PERC.</th>
                  </tr>
                </thead>
                <tbody>
                  {fav.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-500">
                        No favorite games
                      </td>
                    </tr>
                  ) : (
                    fav.map((g) => (
                      <tr key={g.position} className="border-t border-slate-700/60">
                        <td className="p-2">{g.position}</td>
                        <td className="p-2">{g.game}</td>
                        <td className="p-2">{g.category}</td>
                        <td className="p-2">USD {g.turnover}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden max-w-[160px]">
                              <div className="h-full bg-blue-500" style={{ width: `${g.perc}%` }} />
                            </div>
                            <span className="text-xs">{g.perc}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <EmptyCard title="Sports" />
          <EmptyCard title="Tournaments" />
          <EmptyCard title="Teams" />
          <EmptyCard title="Markets" />
        </div>
      )}
    </div>
  );
};

export default PersonalizationTab;
