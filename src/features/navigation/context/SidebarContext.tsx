import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  SidebarRowSize, 
  AdaptableNavMode, 
  SystemAccentColor, 
  SidebarConfig, 
  NavCategory, 
  SubMenuItem 
} from '../types';
import { DEFAULT_NAV_CATEGORIES } from '../data/navConfig';
import { toast } from 'sonner';

interface SidebarContextType {
  // Config & State
  config: SidebarConfig;
  rowSize: SidebarRowSize;
  isCollapsed: boolean;
  adaptableMode: AdaptableNavMode;
  accentColor: SystemAccentColor;
  searchQuery: string;
  expandedCategories: Record<string, boolean>;
  isCustomizeModalOpen: boolean;
  isMobileDrawerOpen: boolean;

  // Breakpoints & Layout modes
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  effectiveLayout: 'sidebar' | 'adaptable-tab' | 'mobile-tab';

  // Navigation Items
  categories: NavCategory[];
  pinnedItems: SubMenuItem[];
  filteredCategories: NavCategory[];

  // Actions
  toggleSidebarCollapse: () => void;
  setSidebarCollapse: (collapsed: boolean) => void;
  setRowSize: (size: SidebarRowSize) => void;
  setAdaptableMode: (mode: AdaptableNavMode) => void;
  setAccentColor: (color: SystemAccentColor) => void;
  setSearchQuery: (query: string) => void;
  toggleCategoryExpanded: (categoryId: string) => void;
  setCategoryExpanded: (categoryId: string, expanded: boolean) => void;
  openCustomizeModal: () => void;
  closeCustomizeModal: () => void;
  setMobileDrawerOpen: (open: boolean) => void;
  togglePinItem: (itemId: string) => void;
  reorderSections: (newOrder: string[]) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'emme_sidebar_config_v3';

const DEFAULT_CONFIG: SidebarConfig = {
  rowSize: 'medium',
  isCollapsed: false,
  adaptableMode: 'auto',
  accentColor: 'rose',
  customSectionOrder: ['inicio', 'agenda', 'asistente', 'servicios', 'perfil'],
  hiddenSectionIds: [],
  pinnedItemIds: ['agenda-next', 'chat-asesor'],
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // Load saved config or defaults
  const [config, setConfig] = useState<SidebarConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse sidebar config:', e);
    }
    return DEFAULT_CONFIG;
  });

  // Responsive state
  const [windowWidth, setWindowWidth] = useState<number>(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Search and Disclosure states
  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    inicio: true,
    agenda: true,
    asistente: false,
    servicios: false,
    perfil: false,
  });

  // Save config changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save sidebar config:', e);
    }
  }, [config]);

  // Handle Window Resize for responsive layout changes
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  // Determine Effective Navigation Layout (Apple HIG sidebarAdaptable behavior)
  const effectiveLayout = useMemo<'sidebar' | 'adaptable-tab' | 'mobile-tab'>(() => {
    if (isMobile) return 'mobile-tab';
    if (isTablet) {
      if (config.adaptableMode === 'sidebar') return 'sidebar';
      return 'adaptable-tab';
    }
    // Desktop: default is sidebar
    return 'sidebar';
  }, [isMobile, isTablet, isDesktop, config.adaptableMode]);

  // Global Keyboard Shortcut: Cmd/Ctrl + B or Cmd/Ctrl + S to toggle sidebar on desktop/tablet
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in an input or textarea
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'b' || e.key.toLowerCase() === 's')) {
        e.preventDefault();
        setConfig(prev => ({
          ...prev,
          isCollapsed: !prev.isCollapsed
        }));
        toast.info(config.isCollapsed ? 'Barra lateral mostrada' : 'Barra lateral ocultada', {
          duration: 1500,
          icon: '📐'
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config.isCollapsed]);

  // Build Categories in customized order and filter out hidden sections
  const categories = useMemo(() => {
    const categoryMap = new Map(DEFAULT_NAV_CATEGORIES.map(cat => [cat.id, cat]));
    const ordered: NavCategory[] = [];

    // First add according to custom order
    config.customSectionOrder.forEach(catId => {
      const found = categoryMap.get(catId);
      if (found && !config.hiddenSectionIds.includes(catId)) {
        ordered.push(found);
        categoryMap.delete(catId);
      }
    });

    // Add any remaining categories not yet in custom order
    categoryMap.forEach((cat) => {
      if (!config.hiddenSectionIds.includes(cat.id)) {
        ordered.push(cat);
      }
    });

    return ordered;
  }, [config.customSectionOrder, config.hiddenSectionIds]);

  // Collect pinned favorite items across all categories
  const pinnedItems = useMemo(() => {
    const allSubItems: SubMenuItem[] = [];
    DEFAULT_NAV_CATEGORIES.forEach(cat => {
      if (cat.subItems) {
        cat.subItems.forEach(sub => {
          if (config.pinnedItemIds.includes(sub.id)) {
            allSubItems.push({
              ...sub,
              icon: cat.iconName,
              isPinned: true
            });
          }
        });
      }
    });
    return allSubItems;
  }, [config.pinnedItemIds]);

  // Filter categories and sub-items based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();

    return categories
      .map(cat => {
        const matchesCategory = cat.label.toLowerCase().includes(q);
        const matchedSubItems = cat.subItems?.filter(
          sub => sub.label.toLowerCase().includes(q) || (sub.description && sub.description.toLowerCase().includes(q))
        ) || [];

        if (matchesCategory || matchedSubItems.length > 0) {
          return {
            ...cat,
            subItems: matchesCategory ? cat.subItems : matchedSubItems
          };
        }
        return null;
      })
      .filter(Boolean) as NavCategory[];
  }, [categories, searchQuery]);

  // State modification actions
  const toggleSidebarCollapse = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      isCollapsed: !prev.isCollapsed
    }));
  }, []);

  const setSidebarCollapse = useCallback((collapsed: boolean) => {
    setConfig(prev => ({ ...prev, isCollapsed: collapsed }));
  }, []);

  const setRowSize = useCallback((size: SidebarRowSize) => {
    setConfig(prev => ({ ...prev, rowSize: size }));
    toast.success(`Densidad de barra: ${size === 'small' ? 'Compacta' : size === 'medium' ? 'Estándar' : 'Amplia'}`);
  }, []);

  const setAdaptableMode = useCallback((mode: AdaptableNavMode) => {
    setConfig(prev => ({ ...prev, adaptableMode: mode }));
    toast.success(
      mode === 'sidebar' 
        ? 'Modo Barra Lateral fijado' 
        : mode === 'tabbar' 
        ? 'Modo Barra de Pestañas flotante fijado' 
        : 'Modo Adaptativo automático activado'
    );
  }, []);

  const setAccentColor = useCallback((color: SystemAccentColor) => {
    setConfig(prev => ({ ...prev, accentColor: color }));
    toast.success(`Color de acento: ${color}`);
  }, []);

  const toggleCategoryExpanded = useCallback((categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  const setCategoryExpanded = useCallback((categoryId: string, expanded: boolean) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: expanded
    }));
  }, []);

  const togglePinItem = useCallback((itemId: string) => {
    setConfig(prev => {
      const isCurrentlyPinned = prev.pinnedItemIds.includes(itemId);
      const newPinned = isCurrentlyPinned
        ? prev.pinnedItemIds.filter(id => id !== itemId)
        : [...prev.pinnedItemIds, itemId];
      
      toast.success(isCurrentlyPinned ? 'Atajo removido de favoritos' : 'Atajo fijado a favoritos');
      return { ...prev, pinnedItemIds: newPinned };
    });
  }, []);

  const reorderSections = useCallback((newOrder: string[]) => {
    setConfig(prev => ({ ...prev, customSectionOrder: newOrder }));
    toast.success('Orden de secciones actualizado');
  }, []);

  const toggleSectionVisibility = useCallback((sectionId: string) => {
    setConfig(prev => {
      const isHidden = prev.hiddenSectionIds.includes(sectionId);
      const newHidden = isHidden
        ? prev.hiddenSectionIds.filter(id => id !== sectionId)
        : [...prev.hiddenSectionIds, sectionId];
      
      toast.success(isHidden ? 'Sección restaurada' : 'Sección ocultada de la barra');
      return { ...prev, hiddenSectionIds: newHidden };
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setExpandedCategories({
      inicio: true,
      agenda: true,
      asistente: false,
      servicios: false,
      perfil: false,
    });
    setSearchQuery('');
    toast.success('Barra lateral restablecida a valores por defecto');
  }, []);

  const value = {
    config,
    rowSize: config.rowSize,
    isCollapsed: config.isCollapsed,
    adaptableMode: config.adaptableMode,
    accentColor: config.accentColor,
    searchQuery,
    expandedCategories,
    isCustomizeModalOpen,
    isMobileDrawerOpen,
    isMobile,
    isTablet,
    isDesktop,
    effectiveLayout,
    categories,
    pinnedItems,
    filteredCategories,
    toggleSidebarCollapse,
    setSidebarCollapse,
    setRowSize,
    setAdaptableMode,
    setAccentColor,
    setSearchQuery,
    toggleCategoryExpanded,
    setCategoryExpanded,
    openCustomizeModal: () => setIsCustomizeModalOpen(true),
    closeCustomizeModal: () => setIsCustomizeModalOpen(false),
    setMobileDrawerOpen: setIsMobileDrawerOpen,
    togglePinItem,
    reorderSections,
    toggleSectionVisibility,
    resetToDefaults,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
