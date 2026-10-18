import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  PanelLeftOpen, 
  SlidersHorizontal, 
  Search,
  X,
  ChevronDown
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';
import { NavCategory } from '../types';
import { NavIcon } from './NavIcon';
import { cn } from '@emme/ui/lib/utils';

interface AdaptableTabBarProps {
  activeTab: string;
}

export function AdaptableTabBar({ activeTab }: AdaptableTabBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    categories,
    effectiveLayout,
    setAdaptableMode,
    openCustomizeModal,
    searchQuery,
    setSearchQuery,
    pinnedItems,
  } = useSidebar();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const isCategoryActive = (category: NavCategory) => {
    if (category.id === 'inicio') return activeTab === 'inicio';
    if (category.id === 'agenda') return activeTab === 'agenda';
    if (category.id === 'asistente') return activeTab === 'chat';
    if (category.id === 'servicios') return activeTab === 'services' || activeTab === 'history';
    if (category.id === 'perfil') return activeTab === 'profile' || activeTab === 'settings';
    return false;
  };

  // Only render on tablet/medium screen widths when in adaptable tab bar mode
  return (
    <div 
      style={{
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      }}
      className="w-full sticky top-0 z-40 bg-white/70 dark:bg-[#1C1C1E]/70 border-b border-white/40 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-4 sm:px-6 py-2.5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Mode Switcher (Apple sidebarAdaptable toggle) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAdaptableMode('sidebar')}
            className="min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-foreground text-xs font-bold transition-all cursor-pointer active:scale-95 border border-white/40 dark:border-white/10"
            title="Cambiar a vista Barra Lateral (iPad HIG)"
          >
            <PanelLeftOpen className="size-4 text-primary" />
            <span className="hidden sm:inline">Ver Barra Lateral</span>
          </button>

          <div 
            onClick={() => navigate('/inicio')}
            className="flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
          >
            <h1 className="text-base font-display font-extrabold tracking-tight flex items-center">
              <span className="text-primary mr-0.5">emme</span>
              <span className="text-[#1D1D1F] dark:text-white">nails</span>
            </h1>
          </div>
        </div>

        {/* Center Tab Items (Apple Adaptable Tabs) */}
        <nav className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1">
          {categories.slice(0, 5).map((category) => {
            const active = isCategoryActive(category);
            const hasSub = category.subItems && category.subItems.length > 0;
            const isDropdownOpen = activeDropdownId === category.id;

            return (
              <div key={category.id} className="relative">
                <button
                  onClick={() => {
                    if (active && hasSub) {
                      setActiveDropdownId(isDropdownOpen ? null : category.id);
                    } else {
                      setActiveDropdownId(null);
                      navigate(category.defaultPath);
                    }
                  }}
                  className={cn(
                    "min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95",
                    active
                      ? "bg-primary text-white shadow-[0_4px_14px_rgba(224,82,134,0.3)] font-bold border border-white/20"
                      : "text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] font-semibold"
                  )}
                >
                  <NavIcon name={category.iconName} className="size-4" />
                  <span>{category.label}</span>
                  {category.badge && (
                    <span className={cn(
                      "text-[9px] font-extrabold px-1.5 py-0.2 rounded-full",
                      active ? "bg-white/25 text-white" : "bg-primary/10 text-primary"
                    )}>
                      {category.badge}
                    </span>
                  )}
                  {hasSub && (
                    <ChevronDown className={cn("size-3.5 opacity-70 transition-transform", isDropdownOpen && "rotate-180")} />
                  )}
                </button>

                {/* Submenu Dropdown Popover */}
                <AnimatePresence>
                  {isDropdownOpen && hasSub && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white/85 dark:bg-[#252528]/85 backdrop-blur-[24px] rounded-[24px] p-2 shadow-2xl border border-white/40 dark:border-white/10 z-50 space-y-1"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#86868B]">
                        {category.label}
                      </div>
                      {category.subItems?.map((sub) => {
                        const isSubActive = location.pathname + location.search === sub.path;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setActiveDropdownId(null);
                              navigate(sub.path);
                            }}
                            className={cn(
                              "w-full min-h-[40px] px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer active:scale-98",
                              isSubActive
                                ? "bg-primary/10 text-primary font-bold"
                                : "text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                            )}
                          >
                            <span className="truncate">{sub.label}</span>
                            {isSubActive && <div className="size-2 rounded-full bg-primary" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Right Tools (Customizer & Search) */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 44, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 44, opacity: 0 }}
                className="flex items-center gap-1.5 bg-black/[0.04] dark:bg-white/[0.06] rounded-full px-3.5 py-1.5 border border-white/40 dark:border-white/10 min-h-[44px]"
              >
                <Search className="size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-foreground outline-hidden font-medium"
                />
                <button 
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="size-5 flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="size-11 rounded-full bg-black/[0.04] hover:bg-black/[0.07] dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-foreground flex items-center justify-center transition-all cursor-pointer active:scale-90 border border-white/40 dark:border-white/10"
                title="Buscar en la app"
              >
                <Search className="size-4" />
              </button>
            )}
          </div>

          {/* Customize Button */}
          <button
            onClick={openCustomizeModal}
            className="size-11 rounded-full bg-black/[0.04] hover:bg-black/[0.07] dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-foreground flex items-center justify-center transition-all cursor-pointer active:scale-90 border border-white/40 dark:border-white/10"
            title="Personalizar Navegación"
          >
            <SlidersHorizontal className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
