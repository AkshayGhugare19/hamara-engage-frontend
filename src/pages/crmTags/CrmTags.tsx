import { useState } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';

import { TagsCrmsNavItemId } from '@/types/crmTags.types';
import CrmTagsSidePanal from '@/components/crmTags/CrmTagsSidePanal';
import AllTagTableList from '@/tables/CRMTags/AllTagsTableList';
import MissionTagTableList from '@/tables/CRMTags/MissionTagsTableList';
import RanksTagsTableList from '@/tables/CRMTags/RanksTagsTableList';
import RewardsShopTagsTableList from '@/tables/CRMTags/RewardShopTagsTableList';
import TokenRulesTagsTableList from '@/tables/CRMTags/TokenRulesTagsTableList';
import TournamentsTagsTableList from '@/tables/CRMTags/TournamentsTagsTableList';
import XpPointTagsTableList from '@/tables/CRMTags/XpPointTagsTableList';

const CrmTags = () => {
  const [activeSection, setActiveSection] = useState<TagsCrmsNavItemId>('all-crm-tags');

  const renderPanel = () => {
    switch (activeSection) {
      case 'all-crm-tags':
        return <AllTagTableList />;
      case 'mission-crm-tags':
        return <MissionTagTableList />;
      case 'ranks-crm-tags':
        return <RanksTagsTableList />;
      case 'reward-shop-crm-tags':
        return <RewardsShopTagsTableList />;
      case 'token-rules-crm-tags':
        return <TokenRulesTagsTableList />;
      case 'tournaments-crm-tags':
        return <TournamentsTagsTableList />;
      case 'xp-points-crm-tags':
        return <XpPointTagsTableList />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full flex min-h-screen  text-slate-200 p-4">
        <CrmTagsSidePanal activeSection={activeSection} onSelect={setActiveSection} />
        <main className="flex-1 overflow-y-auto">{renderPanel()}</main>
      </div>
    </DashboardLayout>
  );
};

export default CrmTags;
