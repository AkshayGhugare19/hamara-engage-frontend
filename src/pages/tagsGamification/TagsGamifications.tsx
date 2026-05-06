import { useState } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import TagsGamificationSidePanal from '@/components/tagsGamification/TagsGamificationSidePanal';
import { TagsGamificationsNavItemId } from '@/types/gamificationTags.types';
import AllTagTableList from '@/tables/TagsGamifications/AllTagsTableList';
import MissionTagTableList from '@/tables/TagsGamifications/MissionTagsTableList';
import RanksTagsTableList from '@/tables/TagsGamifications/RanksTagsTableList';
import RewardsShopTagsTableList from '@/tables/TagsGamifications/RewardShopTagsTableList';

const TagsGamifications = () => {
  const [activeSection, setActiveSection] =
    useState<TagsGamificationsNavItemId>('all-gamification-tags');

  const renderPanel = () => {
    switch (activeSection) {
      case 'all-gamification-tags':
        return <AllTagTableList />;
      case 'mission-gamification-tags':
        return <MissionTagTableList />;
      case 'ranks-gamification-tags':
        return <RanksTagsTableList />;
      case 'reward-shop-gamification-tags':
        return <RewardsShopTagsTableList />;
      case 'token-rules-gamification-tags':
        return <div>Token Rules</div>;
      case 'tournaments-gamification-tags':
        return <div>Tournaments</div>;
      case 'xp-points-gamification-tags':
        return <div>XP Points</div>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full flex min-h-screen  text-slate-200 p-4">
        <TagsGamificationSidePanal activeSection={activeSection} onSelect={setActiveSection} />
        <main className="flex-1 overflow-y-auto">{renderPanel()}</main>
      </div>
    </DashboardLayout>
  );
};

export default TagsGamifications;
