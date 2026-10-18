export type SidebarRowSize = 'small' | 'medium' | 'large';

export type AdaptableNavMode = 'auto' | 'sidebar' | 'tabbar';

export type SystemAccentColor = 'rose' | 'blue' | 'purple' | 'orange' | 'emerald' | 'slate';

export interface SubMenuItem {
  id: string;
  path: string;
  label: string;
  description?: string;
  badge?: string;
  badgeType?: 'default' | 'accent' | 'vip' | 'ai' | 'warning';
  icon?: string;
  isPinned?: boolean;
}

export interface NavCategory {
  id: string;
  label: string;
  iconName: string;
  defaultPath: string;
  badge?: string;
  badgeType?: 'default' | 'accent' | 'vip' | 'ai';
  tintColor?: string; // Optional fixed semantic color if purposeful (e.g., VIP, AI, Alert)
  subItems?: SubMenuItem[];
}

export interface SidebarConfig {
  rowSize: SidebarRowSize;
  isCollapsed: boolean;
  adaptableMode: AdaptableNavMode;
  accentColor: SystemAccentColor;
  customSectionOrder: string[];
  hiddenSectionIds: string[];
  pinnedItemIds: string[];
}
