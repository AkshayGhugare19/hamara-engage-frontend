import type { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Unauthorized from '@/pages/Unauthorized';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '@/pages/Dashboard';
import UserTableList from '@/pages/user/UserTableList';
import NotFound from '@/pages/NotFound';
import ResetPassword from '@/pages/ResetPassword';
import RoleTableList from '@/pages/role/RoleTableList';
import PublicRoute from './PublicRoute';
import UserLogTableList from '@/pages/userLog/UserLogTableList';
import SystemSettings from '@/pages/systemSettings/SystemSettings';
import ProfilePage from '@/pages/profiles/ProfilePage';
import TagsGamifications from '@/pages/tagsGamification/TagsGamifications';

const PageRoutes: FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserTableList />} />
        <Route path="/user-logs" element={<UserLogTableList />} />
        <Route path="/roles" element={<RoleTableList />} />
        <Route path="/system-settings" element={<SystemSettings />} />
        <Route path="/tags-gamification" element={<TagsGamifications />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PageRoutes;
