import React from 'react';
import { AppleSidebar } from './AppleSidebar';
import { AdaptableTabBar } from './AdaptableTabBar';
import { BottomNavigation } from './BottomNavigation';
import { SidebarCustomizerModal } from './SidebarCustomizerModal';
import { useSidebar, SidebarProvider } from '../context/SidebarContext';

interface NavProps {
  activeTab: string;
}

function SidebarContent({ activeTab }: NavProps) {
  const { effectiveLayout } = useSidebar();

  return (
    <>
      {/* 1. Desktop & Tablet Split/Collapsible Sidebar */}
      {effectiveLayout === 'sidebar' && (
        <AppleSidebar activeTab={activeTab} />
      )}

      {/* 2. Tablet sidebarAdaptable Floating Tab Bar */}
      {effectiveLayout === 'adaptable-tab' && (
        <div className="w-full hidden md:block lg:hidden sticky top-0 z-40">
          <AdaptableTabBar activeTab={activeTab} />
        </div>
      )}

      {/* 3. Apple HIG Customization Sheet Modal */}
      <SidebarCustomizerModal />
    </>
  );
}

export function Sidebar({ activeTab }: NavProps) {
  // If useSidebar is already present in parent tree, render directly; otherwise wrap safely
  return <SidebarContent activeTab={activeTab} />;
}

export function MobileNav({ activeTab }: NavProps) {
  return <BottomNavigation activeTab={activeTab} />;
}

export {
  AppleSidebar,
  AdaptableTabBar,
  BottomNavigation,
  SidebarCustomizerModal,
  SidebarProvider,
  useSidebar
};
