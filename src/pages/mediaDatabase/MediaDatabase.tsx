import { useState } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';

import MediaDatabaseSidePanal from '@/components/mediaDatabase/MediaDatabaseSidePanal';
import { MediaDatabaseNavItemId } from '@/types/medaiDatabase.types';
import AllMediaDatabase from '@/components/mediaDatabase/AllMediaDatabase';

const MediaDatabase = () => {
  const [activeSection, setActiveSection] = useState<MediaDatabaseNavItemId>('all-media-database');

  const renderPanel = () => {
    switch (activeSection) {
      case 'all-media-database':
        return <AllMediaDatabase />;
      case 'media-database-banners':
        return <div>mission media database</div>;
      case 'media-database-booster-images':
        return <div>ranks media database</div>;
      case 'media-database-email-templates-assets':
        return <div>reward shop media database</div>;
      case 'media-database-joy-saha':
        return <div>token rules media database</div>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full flex min-h-screen  text-slate-200 p-4">
        <MediaDatabaseSidePanal activeSection={activeSection} onSelect={setActiveSection} />
        <main className="flex-1 overflow-y-auto">{renderPanel()}</main>
      </div>
    </DashboardLayout>
  );
};

export default MediaDatabase;
