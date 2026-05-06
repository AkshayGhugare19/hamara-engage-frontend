import { useEffect, useState } from 'react';
import PageHeaderBreadcrumb from '@/components/PageHeaderBreadcrumb';
import apiService from '@/services/api';
import Pagination from '@/components/Pagination';
import { toast } from 'react-toastify';

import { ApiError, PaginatedData } from '@/types';
import { DeleteRecord } from '@/components/DeleteRecord';
import {
  GamificationTag,
  GamificationTagErrors,
  GamificationTagForm,
} from '@/types/gamificationTags.types';
import CreateGamificationTag from '@/components/modals/tagsGamification/CreateGamificationTag';

const defaultForm: GamificationTagForm = {
  id: '',
  name: '',
  description: '',
  category: 'ACTIVE',
  createdAt: '',
  createdBy: '',
};

const categoryOptions = [
  { label: 'Mission', value: 'mission' },
  { label: 'Ranks', value: 'ranks' },
  { label: 'Reward Shop', value: 'reward-shop' },
  { label: 'Token Rules', value: 'token-rules' },
  { label: 'Tournaments', value: 'tournaments' },
  { label: 'XP Points', value: 'xp-points' },
];

const RanksTagsTableList = () => {
  const [allGamificationTags, setAllGamificationTags] = useState<GamificationTag[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState<GamificationTagForm>(defaultForm);
  const [errors, setErrors] = useState<GamificationTagErrors>({});
  const [loading, setLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setForm(defaultForm);
    setErrors({});
  };

  const validate = (): GamificationTagErrors => {
    const err: GamificationTagErrors = {};
    if (!form.name) err.name = 'Required';
    return err;
  };

  const getRoles = async () => {
    try {
      const response = await apiService.get<PaginatedData<GamificationTag>>(
        '/tags-gamification/paginate',
        {
          page,
          limit,
        }
      );
      console.log('Get Roles response:', response);
      if (response?.success && response?.data) {
        setAllGamificationTags(response?.data?.data);
        setTotalPages(response?.data?.pagination?.totalPages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async () => {
    const err = validate();
    if (Object.keys(err).length) return setErrors(err);

    try {
      setLoading(true);

      const response = await apiService.post('/tags-gamification/add', {
        name: form.name,
        description: form.description,
        createdBy: form.createdBy,
        createdAt: form.createdAt,
      });
      console.log('Create Tag response:', response);
      if (response?.success) {
        toast.success(response?.message || 'Tag created successfully');
        getRoles();
        closeCreateModal();
      } else {
        closeCreateModal();
      }
    } catch (err) {
      const apiErr = err as ApiError;
      console.log('Create Tag error:', apiErr);
      toast.error(apiErr.message || 'Failed to create tag');
    } finally {
      setLoading(false);
      closeCreateModal();
    }
  };

  const handleDelete = (id: string | number): void => {
    DeleteRecord({
      endpoint: `/tags-gamification/${id}`,
      successMessage: 'Tag deleted',
      onSuccess: getRoles,
    });
  };

  useEffect(() => {
    getRoles();
  }, [page]);

  const filteredGamificationTags = allGamificationTags.filter((r) =>
    `${r.name} ${r.description ?? ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <PageHeaderBreadcrumb
          title="Ranks Tags"
          items={[{ label: 'Home', clickable: true }, { label: 'Tags' }]}
        />

        <button
          onClick={() => openCreateModal()}
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >
          + Create New Tag
        </button>
      </div>

      <input
        placeholder="Search tag..."
        className="w-72 px-4 py-2 rounded bg-slate-800 border border-slate-700 mb-5"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto border border-slate-700 rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-slate-800">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Created Date</th>
              <th className="p-3 text-left">Created By</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredGamificationTags.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  No data found
                </td>
              </tr>
            ) : (
              filteredGamificationTags.map((role) => (
                <tr key={role?.id} className="border-t border-slate-700">
                  <td className="p-3">{role?.name}</td>
                  <td className="p-3">{role?.description}</td>
                  <td className="p-3">{role?.category}</td>
                  <td className="p-3">{role?.createdAt}</td>
                  <td className="p-3">{role?.createdBy}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="bg-red-600 px-2 py-1 rounded text-xs"
                      onClick={() => handleDelete(role?.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {showCreateModal && (
        <CreateGamificationTag
          form={form}
          setForm={setForm}
          errors={errors}
          onSave={handleCreate}
          loading={loading}
          closeCreateModal={closeCreateModal}
          categoryOptions={categoryOptions}
        />
      )}
    </div>
  );
};

export default RanksTagsTableList;
