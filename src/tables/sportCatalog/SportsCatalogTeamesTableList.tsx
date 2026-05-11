import { useEffect, useState, useRef, type FC } from 'react';
import Pagination from '@/components/Pagination';

import { DeleteRecord } from '@/components/DeleteRecord';
import CreateSportCatalogTeam from '@/components/modals/sportsCatalog/CreateSportsCatalogTeam';
import {
  SportsCatalogTeam,
  SportsCatalogTeamFormData,
  SportsCatalogTeamFormErrors,
} from '@/types/sportsCatalog.types';

import { DUMMY_TEAMS } from '@/dummydata/SportCatalog';

const BLANK_TEAM_FORM: SportsCatalogTeamFormData = {
  id: '',
  name: '',
  sport: '',
  tournament: '',
};

interface SportsCatalogTeamesTableListProps {
  isCreateModalOpen: boolean;
  onCreateModalClose: () => void;
}

const SportsCatalogTeamesTableList: FC<SportsCatalogTeamesTableListProps> = ({
  isCreateModalOpen,
  onCreateModalClose,
}) => {
  const [allGames, setAllGames] = useState<SportsCatalogTeam[]>(DUMMY_TEAMS);
  const [games, setGames] = useState<SportsCatalogTeam[]>([]);
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [filterSport, setFilterSport] = useState('');

  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState<SportsCatalogTeamFormData>(BLANK_TEAM_FORM);

  const [formErrors, setFormErrors] = useState<SportsCatalogTeamFormErrors>({});

  const [saveLoading, setSaveLoading] = useState(false);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const menuRef = useRef<HTMLTableDataCellElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  useEffect(() => {
    let filtered = [...allGames];
    if (filterName) {
      filtered = filtered.filter((g) => g.name === filterName);
    }
    if (filterSport) {
      filtered = filtered.filter((g) => g.sport === filterSport);
    }
    const total = Math.ceil(filtered.length / LIMIT) || 1;
    setTotalPages(total);

    const safePage = Math.min(page, total);

    setGames(filtered.slice((safePage - 1) * LIMIT, safePage * LIMIT));
  }, [allGames, filterName, filterSport, page]);

  useEffect(() => {
    if (isCreateModalOpen) {
      setEditId(null);
      setForm(BLANK_TEAM_FORM);
      setFormErrors({});
    }
  }, [isCreateModalOpen]);

  const isModalOpen = isCreateModalOpen || editId !== null;

  const handleCloseModal = () => {
    setEditId(null);
    setForm(BLANK_TEAM_FORM);
    setFormErrors({});
    onCreateModalClose();
  };

  const validate = (): boolean => {
    const errs: SportsCatalogTeamFormErrors = {};

    if (!form.name.trim()) {
      errs.name = 'Name is required';
    }

    if (!form.sport.trim()) {
      errs.sport = 'Sport is required';
    }

    if (!form.tournament.trim()) {
      errs.tournament = 'Tournament is required';
    }

    setFormErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    setSaveLoading(true);

    setTimeout(() => {
      if (editId) {
        setAllGames((prev) =>
          prev.map((g) =>
            g.id === editId
              ? {
                  ...g,
                  ...form,
                }
              : g
          )
        );
      } else {
        const newTeam: SportsCatalogTeam = {
          id: Date.now().toString(),
          name: form.name,
          sport: form.sport,
          tournament: form.tournament,
        };

        setAllGames((prev) => [newTeam, ...prev]);
      }

      setSaveLoading(false);

      handleCloseModal();
    }, 600);
  };

  const handleEdit = (game: SportsCatalogTeam) => {
    setOpenMenuId(null);

    setEditId(game.id);

    setForm({
      id: game.id,
      name: game.name,
      sport: game.sport ?? '',
      tournament: game.tournament ?? '',
    });

    setFormErrors({});
  };

  const handleDeleteConfirm = (id: string) => {
    DeleteRecord({
      endpoint: `/tags-gamification/${id}`,
      successMessage: 'Team deleted',
    });

    setAllGames((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="relative">
          <input
            className="w-full px-3 py-2 pl-9 bg-slate-800 border border-slate-700 rounded text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 text-slate-200"
            placeholder="Search by Name or ID"
            value={filterName}
            onChange={(e) => {
              setFilterName(e.target.value);
              setPage(1);
            }}
          />

          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-slate-500"
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

        <div className="relative">
          <select
            className="w-full appearance-none px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            value={filterSport}
            onChange={(e) => {
              setFilterSport(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Sports</option>

            {[...new Set(allGames.map((g) => g.sport))].map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-700 rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-slate-800">
            <tr>
              <th className="p-3 text-left text-slate-300 font-medium">Name</th>

              <th className="p-3 text-left text-slate-300 font-medium">Sport</th>

              <th className="p-3 text-left text-slate-300 font-medium">Tournament</th>

              <th className="p-3 text-left text-slate-300 font-medium w-10"></th>
            </tr>
          </thead>

          <tbody>
            {games.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-400">
                  No teams found
                </td>
              </tr>
            ) : (
              games.map((game) => (
                <tr
                  key={game.id}
                  className="border-t border-slate-700 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-3 font-medium text-blue-400">{game.name}</td>

                  <td className="p-3 text-slate-300">{game.sport}</td>

                  <td className="p-3 text-slate-300">{game.tournament}</td>

                  <td className="p-3 relative" ref={openMenuId === game.id ? menuRef : undefined}>
                    <button
                      className="p-1.5 rounded hover:bg-slate-700 transition-colors text-slate-400"
                      onClick={() => setOpenMenuId(openMenuId === game.id ? null : game.id)}
                    >
                      ⋮
                    </button>

                    {openMenuId === game.id && (
                      <div className="absolute right-8 top-1 z-20 bg-slate-800 border border-slate-700 rounded shadow-lg min-w-[110px]">
                        <button
                          className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700"
                          onClick={() => handleEdit(game)}
                        >
                          Edit
                        </button>

                        <button
                          className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-700"
                          onClick={() => handleDeleteConfirm(game.id)}
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

      <CreateSportCatalogTeam
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        form={form}
        setForm={setForm}
        errors={formErrors}
        onSave={handleSave}
        loading={saveLoading}
        editId={editId}
      />
    </>
  );
};

export default SportsCatalogTeamesTableList;
