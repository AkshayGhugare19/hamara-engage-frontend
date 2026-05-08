import { useEffect, useState } from 'react';
import PageHeaderBreadcrumb from '@/components/PageHeaderBreadcrumb';
import apiService from '@/services/api';
import Pagination from '@/components/Pagination';
import { toast } from 'react-toastify';
import { ApiError, PaginatedData } from '@/types';
import { DeleteRecord } from '@/components/DeleteRecord';

import {
  categoryOptions,
  dummyMediaDatabase,
  MediaDatabase,
  MediaDatabaseErrors,
  MediaDatabaseForm,
} from '@/types/medaiDatabase.types';

import CreateMediaDatabase from '../../components/modals/mediaDatabase/CreateMediaDatabase';
import MediaCard from '../../components/mediaDatabase/MediaCard';

const defaultForm: MediaDatabaseForm = {
  name: '',
  description: '',
  imageUrl: '',
  category: '',
  createdAt: '',
  createdBy: '',
};

const TemplateMediaDatabase = () => {
  const [allMedia, setAllMedia] = useState<MediaDatabase[]>(dummyMediaDatabase);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(25);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState<MediaDatabaseForm>(defaultForm);

  const [errors, setErrors] = useState<MediaDatabaseErrors>({});
  const [loading, setLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const openCreateModal = () => setShowCreateModal(true);

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setForm(defaultForm);
    setErrors({});
  };

  const validate = (): MediaDatabaseErrors => {
    const err: MediaDatabaseErrors = {};

    if (!form.name.trim()) {
      err.name = 'File name is required';
    }

    if (!form.category) {
      err.category = 'Folder is required';
    }

    if (!form.file) {
      err.imageUrl = 'Please select image';
    }

    return err;
  };

  const fetchMedia = async () => {
    try {
      const response = await apiService.get<PaginatedData<MediaDatabase>>(
        '/media-database/paginate',
        {
          page,
          limit,
          category: 'all',
        }
      );

      if (response?.success && response?.data) {
        setAllMedia(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async () => {
    const err = validate();

    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('name', form.name);
      formData.append('description', form.description || '');
      formData.append('category', form.category || '');
      formData.append('createdBy', form.createdBy || '');

      if (form.file) {
        formData.append('image', form.file);
      }

      const response = await apiService.post('/media-database/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.success) {
        toast.success(response.message || 'File uploaded successfully');

        fetchMedia();
        closeCreateModal();
      }
    } catch (err) {
      const apiErr = err as ApiError;

      toast.error(apiErr.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string): void => {
    DeleteRecord({
      endpoint: `/media-database/${id}`,
      successMessage: 'File deleted',
      onSuccess: fetchMedia,
    });
  };

  useEffect(() => {
    fetchMedia();
  }, [page]);

  const filteredMedia = allMedia.filter((r) =>
    `${r.name} ${r.description ?? ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <PageHeaderBreadcrumb
          title="Templates"
          items={[{ label: 'Home', clickable: true }, { label: 'Templates' }]}
        />

        <button
          onClick={openCreateModal}
          className="bg-blue-600 px-4 py-2 rounded text-white text-sm"
        >
          + Create Media
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="Search media..."
        className="w-72 px-4 py-2 rounded bg-slate-800 border border-slate-700 mb-5 text-sm text-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Grid */}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          {filteredMedia.length === 0 ? (
            <div className="text-center text-slate-400 py-16">No media found</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              {filteredMedia.map((item) => (
                <MediaCard key={item.id} item={item} onDelete={handleDelete} />
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {showCreateModal && (
        <CreateMediaDatabase
          form={form}
          setForm={setForm}
          errors={errors}
          onSave={handleCreate}
          loading={loading}
          closeCreateModal={closeCreateModal}
          categoryOptions={categoryOptions.filter((x) => x.value !== 'all')}
        />
      )}
    </div>
  );
};

export default TemplateMediaDatabase;
