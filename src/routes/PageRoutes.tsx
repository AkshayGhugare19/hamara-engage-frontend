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
import MissionsPage from '@/pages/gamification/MissionsPage';
import MissionBundlesPage from '@/pages/gamification/MissionBundlesPage';
import RanksPage from '@/pages/gamification/RanksPage';
import TokenRulesCasinoPage from '@/pages/gamification/TokenRulesCasinoPage';
import TokenRulesSportsPage from '@/pages/gamification/TokenRulesSportsPage';
import XpPointRulesCasinoPage from '@/pages/gamification/XpPointRulesCasinoPage';
import XpPointRulesSportsPage from '@/pages/gamification/XpPointRulesSportsPage';
import PlayerCategoriesPage from '@/pages/gamification/PlayerCategoriesPage';
import RewardShopPage from '@/pages/gamification/RewardShopPage';
import PrizesharkCatalogPage from '@/pages/gamification/PrizesharkCatalogPage';
import PurchaseFeedPage from '@/pages/gamification/PurchaseFeedPage';
import TournamentsPage from '@/pages/gamification/TournamentsPage';
import PlayerTableList from '@/pages/players/PlayerTableList';
import PlayerProfilePage from '@/pages/players/PlayerProfilePage';

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

        {/* Players */}
        <Route path="/players" element={<PlayerTableList />} />
        <Route path="/players/:id" element={<PlayerProfilePage />} />

        {/* CRM Routes */}
        <Route path="/crm" element={<Navigate to="/crm/campaigns" replace />} />
        <Route path="/crm/campaigns" element={<CampaignTableList />} />
        <Route path="/crm/campaigns/archive" element={<CampaignArchive />} />
        <Route path="/crm/campaigns/create" element={<CreateCampaign />} />
        <Route path="/crm/analytics" element={<AnalyticsPage />} />
        <Route path="/crm/segments" element={<SegmentTableList />} />
        <Route path="/crm/segments/archive" element={<SegmentArchive />} />
        <Route path="/crm/segments/create" element={<CreateSegment />} />
        <Route path="/crm/templates" element={<TemplateTableList />} />
        <Route path="/crm/templates/archive" element={<TemplateArchive />} />
        <Route path="/crm/templates/create" element={<CreateTemplate />} />
        <Route path="/crm/custom-triggers" element={<CustomTriggerTableList />} />
        <Route path="/crm/custom-triggers/archive" element={<CustomTriggerArchive />} />
        <Route path="/crm/custom-triggers/create" element={<CreateCustomTrigger />} />
        <Route path="/crm/frequency-cap" element={<FrequencyCapTableList />} />
        <Route path="/crm/unsubscribe-reports" element={<UnsubscribeReportList />} />
        <Route path="/crm/player-data" element={<PlayerDataPage />} />

        {/* Gamification */}
        <Route path="/gamification" element={<Navigate to="/gamification/missions" replace />} />
        <Route path="/gamification/missions" element={<MissionsPage />} />
        <Route path="/gamification/mission-bundles" element={<MissionBundlesPage />} />
        <Route path="/gamification/ranks" element={<RanksPage />} />
        <Route path="/gamification/token-rules-casino" element={<TokenRulesCasinoPage />} />
        <Route path="/gamification/token-rules-sports" element={<TokenRulesSportsPage />} />
        <Route path="/gamification/xp-point-rules-casino" element={<XpPointRulesCasinoPage />} />
        <Route path="/gamification/xp-point-rules-sports" element={<XpPointRulesSportsPage />} />
        <Route path="/gamification/player-categories" element={<PlayerCategoriesPage />} />
        <Route path="/gamification/reward-shop" element={<RewardShopPage />} />
        <Route path="/gamification/prizeshark-catalog" element={<PrizesharkCatalogPage />} />
        <Route path="/gamification/purchase-feed" element={<PurchaseFeedPage />} />
        <Route path="/gamification/tournaments" element={<TournamentsPage />} />

        {/* Settings routes */}
        <Route path="/settings" element={<Navigate to="/settings/users" replace />} />
        <Route path="/settings/users" element={<UserTableList />} />
        <Route path="/settings/user-logs" element={<UserLogTableList />} />
        <Route path="/settings/roles" element={<RoleTableList />} />
        <Route path="/settings/system-settings" element={<SystemSettings />} />
        <Route path="/settings/tags-gamification" element={<TagsGamifications />} />
        <Route path="/settings/tags-crm" element={<CrmTags />} />
        <Route path="/settings/media-database" element={<MediaDatabase />} />
        <Route path="/settings/casino-catalog" element={<CasinoCatalogPage />} />
        <Route path="/settings/sports-catalog" element={<SportsCatalogPage />} />
        <Route path="/settings/http-debugger-console" element={<HttpDebuggerConsolePage />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PageRoutes;
