import type { FC, ReactNode } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#111d3e] text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
