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
import AnalyticsPage from '@/pages/analytics/AnalyticsPage';
import SegmentTableList from '@/pages/segment/SegmentTableList';
import SegmentArchive from '@/pages/segment/SegmentArchive';
import CreateSegment from '@/pages/segment/CreateSegment';
import TemplateTableList from '@/pages/template/TemplateTableList';
import TemplateArchive from '@/pages/template/TemplateArchive';
import CreateTemplate from '@/pages/template/CreateTemplate';
import CustomTriggerTableList from '@/pages/customTrigger/CustomTriggerTableList';
import CustomTriggerArchive from '@/pages/customTrigger/CustomTriggerArchive';
import CreateCustomTrigger from '@/pages/customTrigger/CreateCustomTrigger';
import FrequencyCapTableList from '@/pages/frequencyCap/FrequencyCapTableList';
import UnsubscribeReportList from '@/pages/unsubscribeReport/UnsubscribeReportList';
import PlayerDataPage from '@/pages/playerData/PlayerDataPage';
import DocumentationPage from '@/pages/documentation/DocumentationPage';
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
        <Route path="/documentation" element={<DocumentationPage />} />
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
        <Route path="/crm/analytics" element={<AnalyticsPage />} />

        {/* CRM Segments */}
        <Route path="/crm/segments" element={<SegmentTableList />} />
        <Route path="/crm/segments/archive" element={<SegmentArchive />} />
        <Route path="/crm/segments/create" element={<CreateSegment />} />

        {/* CRM Templates */}
        <Route path="/crm/templates" element={<TemplateTableList />} />
        <Route path="/crm/templates/archive" element={<TemplateArchive />} />
        <Route path="/crm/templates/create" element={<CreateTemplate />} />

        {/* CRM Custom Triggers */}
        <Route path="/crm/custom-triggers" element={<CustomTriggerTableList />} />
        <Route path="/crm/custom-triggers/archive" element={<CustomTriggerArchive />} />
        <Route path="/crm/custom-triggers/create" element={<CreateCustomTrigger />} />

        {/* CRM Frequency Cap / Unsubscribe Reports / Player Data */}
        <Route path="/crm/frequency-cap" element={<FrequencyCapTableList />} />
        <Route path="/crm/unsubscribe-reports" element={<UnsubscribeReportList />} />
        <Route path="/crm/player-data" element={<PlayerDataPage />} />

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
