import { useState, useEffect, type FC } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import PageHeaderBreadcrumb from '@/components/PageHeaderBreadcrumb';
import CreateNewUser from '@/components/modals/user/CreateNewUser';
import UpdateUser from '@/components/modals/user/UpdateUser';
import apiService from '@/services/api';
import Pagination from '@/components/Pagination';
import type {
  AddOrUpdateUserRequest,
  ApiError,
  PaginatedData,
  User,
  UserFormData,
  UserFormErrors,
} from '@/types';
import { toast } from 'react-toastify';
import { Role } from '@/types/role';
import { DeleteRecord } from '@/components/DeleteRecord';

const defaultForm: UserFormData = {
  first_name: '',
  last_name: '',
  email: '',
  mobile: '',
  username: '',
  role: '',
  status: 'ACTIVE',
};

const UserTableList: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [form, setForm] = useState<UserFormData>(defaultForm);
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const filteredUsers = users.filter((user) =>
    `${user?.first_name ?? ''} ${user?.last_name ?? ''} ${user?.email ?? ''} ${user?.username ?? ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openCreateModal = (): void => {
    setShowCreateModal(true);
  };
  const closeCreateModal = (): void => {
    setShowCreateModal(false);
    setForm(defaultForm);
    setErrors({});
  };

  const openShowUpdateModal = (user: User): void => {
    setShowUpdateModal(true);
    setForm({
      id: user?.id,
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      username: user?.username || '',
      role: user?.role || '',
      status: user?.status || 'ACTIVE',
    });
  };
  const closeShowUpdateModal = (): void => {
    setShowUpdateModal(false);
    setForm(defaultForm);
    setErrors({});
  };

  const validate = (): UserFormErrors => {
    const newErrors: UserFormErrors = {};
    if (!form?.first_name) newErrors.first_name = 'Required';
    if (!form?.last_name) newErrors.last_name = 'Required';
    if (!form?.email) newErrors.email = 'Required';
    if (!form?.mobile) newErrors.mobile = 'Required';
    if (!form?.username) newErrors.username = 'Required';
    if (!form?.role) newErrors.role = 'Required';
    return newErrors;
  };

  const getUsers = async (): Promise<void> => {
    try {
      const response = await apiService.get<PaginatedData<User>>('/users/paginate', {
        page,
        limit,
      });

      if (response?.success && response?.data) {
        setUsers(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (): Promise<void> => {
    const newErrors = validate();
    console.log('Validation Errors:', newErrors);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await apiService.post<AddOrUpdateUserRequest>('/users/add', {
        first_name: form?.first_name,
        last_name: form?.last_name,
        email: form?.email,
        mobile: form?.mobile,
        username: form?.username,
        role: form?.role,
        status: form?.status,
      });
      console.log('Create User response:', response);
      if (response?.success) {
        closeCreateModal();
        toast.success('User created successfully');
        getUsers();
      } else {
        console.error('Create User failed:', response);
        toast.error(response?.message || 'Failed to create user');
      }
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr?.errors) {
        setErrors(apiErr.errors);
      } else {
        console.log('apiErr:', apiErr);
        toast.error(apiErr?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (): Promise<void> => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.post<AddOrUpdateUserRequest>(
        `/users/update-by/${form?.id}`,
        {
          first_name: form?.first_name,
          last_name: form?.last_name,
          email: form?.email,
          mobile: form?.mobile,
          username: form?.username,
          role: form?.role,
          status: form?.status,
        }
      );
      if (response?.success) {
        toast.success(response?.message || 'User updated successfully');
        getUsers();
        closeShowUpdateModal();
      } else {
        toast.error(response?.message || 'Failed to update user');
        closeShowUpdateModal();
      }
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr?.errors) {
        setErrors(apiErr.errors);
      } else {
        console.log('apiErr:', apiErr);
        toast.error(apiErr?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string | number): void => {
    DeleteRecord({
      endpoint: `/users/${id}`,
      successMessage: 'User deleted',
      onSuccess: getUsers,
    });
  };

  const getRoles = async (): Promise<void> => {
    try {
      const response = await apiService.get<PaginatedData<Role>>('/roles/paginate', {
        page: 1,
        limit: 100,
      });
      console.log('Get Roles response:', response);
      if (response?.success && response?.data) {
        setRoles(response?.data?.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsers();
    getRoles();
  }, [page, limit]);

  return (
    <DashboardLayout>
      <div className="px-4 w-full">
        <div className="flex justify-between items-center mb-6">
          <PageHeaderBreadcrumb
            title="User Management"
            items={[{ label: 'Home', clickable: true }, { label: 'Settings' }, { label: 'Users' }]}
          />

          <button onClick={openCreateModal} className="bg-blue-600 px-4 py-2 rounded text-white">
            + Create New User
          </button>
        </div>

        <input
          type="text"
          placeholder="Search user?..."
          className="w-72 px-4 py-2 rounded bg-slate-800 border border-slate-700 mb-5"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="overflow-x-auto border border-slate-700 rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">
                    No data found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user?.id} className="border-t border-slate-700">
                    <td className="p-3">
                      {user?.first_name} {user?.last_name}
                    </td>
                    <td className="p-3">{user?.email}</td>
                    <td className="p-3">{user?.mobile}</td>
                    <td className="p-3">{user?.username}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          user?.status === 'ACTIVE'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {user?.status}
                      </span>
                    </td>

                    <td className="p-3">{user?.role}</td>

                    <td className="p-3 flex gap-2">
                      <button
                        className="bg-blue-600 px-3 py-1 rounded text-xs"
                        onClick={() => {
                          openShowUpdateModal(user);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-600 px-3 py-1 rounded text-xs"
                        onClick={() => handleDelete(user?.id)}
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
          <CreateNewUser
            closeCreateModal={closeCreateModal}
            form={form}
            setForm={setForm}
            errors={errors}
            handleSave={handleSave}
            loading={loading}
            roles={roles}
          />
        )}

        {showUpdateModal && (
          <UpdateUser
            closeShowUpdateModal={closeShowUpdateModal}
            form={form}
            setForm={setForm}
            errors={errors}
            handleUpdate={handleUpdate}
            loading={loading}
            roles={roles}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserTableList;
