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
import CrmTags from '@/pages/crmTags/CrmTags';
import MediaDatabase from '@/pages/mediaDatabase/MediaDatabase';
import CasinoCatalogPage from '@/pages/casinoCatalog/CasinoCatalogPage';
import SportsCatalogPage from '@/pages/sportsCatalog/SportsCatalogPage';
import HttpDebuggerConsolePage from '@/pages/httpDebugerConsole/HttpDebuggerConsolePage';
import CampaignTableList from '@/pages/campaign/CampaignTableList';
import CampaignArchive from '@/pages/campaign/CampaignArchive';
import CreateCampaign from '@/pages/campaign/CreateCampaign';
import GamificationModulePage from '@/components/gamification/GamificationModulePage';
import { GAMIFICATION_MODULES, GAMIFICATION_ROUTES } from '@/config/gamificationModules';

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
        <Route path="/tags-crm" element={<CrmTags />} />
        <Route path="/media-database" element={<MediaDatabase />} />
        <Route path="/casino-catalog" element={<CasinoCatalogPage />} />
        <Route path="/sports-catalog" element={<SportsCatalogPage />} />
        <Route path="/http-debugger-console" element={<HttpDebuggerConsolePage />} />

        {/* CRM Campaigns */}
        <Route path="/crm/campaigns" element={<CampaignTableList />} />
        <Route path="/crm/campaigns/archive" element={<CampaignArchive />} />
        <Route path="/crm/campaigns/create" element={<CreateCampaign />} />

        {/* Gamification feature modules */}
        {GAMIFICATION_ROUTES.map(({ path, key }) => (
          <Route
            key={path}
            path={path}
            element={<GamificationModulePage config={GAMIFICATION_MODULES[key]} />}
          />
        ))}
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PageRoutes;
