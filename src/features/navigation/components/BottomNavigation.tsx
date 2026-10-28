import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  MessageCircle, 
  Calendar,
  User,
  X, 
  Search, 
  ChevronRight, 
  SlidersHorizontal, 
  LogOut,
  Star
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';
import { useApp } from '@/app/AppContext';
import { NavIcon } from './NavIcon';
import { cn } from '@emme/ui/lib/utils';
import { toast } from 'sonner';
import { triggerSelectionVibration } from '@/shared/utils/haptics';

interface BottomNavigationProps {
  activeTab: string;
}

export function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useApp();
  const {
    pinnedItems,
    openCustomizeModal,
    searchQuery,
    setSearchQuery,
    filteredCategories,
  } = useSidebar();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Auto-hide mobile bar on downward scroll, reveal on upward scroll (iOS Safari pattern)
  useEffect(() => {
    const container = document.getElementById('main-scroll-container');
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      if (currentScrollY + clientHeight >= scrollHeight - 50) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY.current - 12) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 12 && currentScrollY > 90) {
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 4 Core Navigation Tabs as requested: Inicio (/), Chat (/chat), Mis Citas (/agenda), Perfil (/profile)
  const coreTabs = [
    { id: 'inicio', label: 'Inicio', icon: Home, path: '/inicio' },
    { id: 'chat', label: 'Chat', icon: MessageCircle, path: '/chat' },
    { id: 'agenda', label: 'Mis Citas', icon: Calendar, path: '/agenda' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
  ];

  const isCoreTabActive = (id: string) => {
    if (id === 'inicio') return activeTab === 'inicio' || location.pathname === '/' || location.pathname === '/inicio';
    if (id === 'chat') return activeTab === 'chat' || location.pathname.startsWith('/chat');
    if (id === 'agenda') return activeTab === 'agenda' || location.pathname.startsWith('/agenda');
    if (id === 'profile') return activeTab === 'profile' || activeTab === 'settings' || location.pathname.startsWith('/profile') || location.pathname.startsWith('/settings');
    return false;
  };

  const handleTabClick = (path: string) => {
    triggerSelectionVibration();
    navigate(path);
  };

  const handleLogout = () => {
    setIsDrawerOpen(false);
    logout();
    toast.success('Sesión cerrada correctamente');
  };

  const activeIndex = coreTabs.findIndex((tab) => isCoreTabActive(tab.id));
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <>
      {/* Compact floating dock with persistent labels and safe-area spacing */}
      <div 
        className={cn(
          "fixed bottom-[calc(env(safe-area-inset-bottom)+0.65rem)] left-1/2 -translate-x-1/2 w-[calc(100%-1.25rem)] max-w-[460px] h-[68px] z-50 transition-transform duration-300 ease-out lg:hidden",
          isVisible ? "translate-y-0" : "translate-y-24"
        )}
      >
        <nav aria-label="Navegación principal" className="material-regular absolute inset-0 flex items-center justify-around gap-1 rounded-[22px] p-1.5">
          {coreTabs.map((tab, i) => {
            const active = i === safeActiveIndex;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.path)}
                className="relative flex h-full min-w-0 flex-1 items-center justify-center rounded-[16px] outline-none tap-highlight-transparent focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={tab.label}
                aria-current={active ? 'page' : undefined}
              >
                <motion.div
                  initial={false}
                  animate={{ scale: active ? 1 : 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className={cn("relative flex min-h-[52px] w-full flex-col items-center justify-center gap-1 rounded-[15px] px-1 transition-colors", active ? "bg-[#E05286] text-white shadow-[0_3px_10px_rgba(224,82,134,0.25)]" : "text-[#747985] hover:bg-black/[0.035] dark:text-[#B8BBC4] dark:hover:bg-white/[0.06]")}
                >
                  <Icon className={cn("size-[19px] transition-colors", active ? "stroke-[2.4]" : "stroke-[1.9]")} />
                  <span className={cn("max-w-full truncate text-[10px] leading-none", active ? "font-semibold" : "font-medium")}>{tab.label}</span>
                </motion.div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2-Level Navigation Hierarchy Bottom Sheet Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-[120] flex flex-col justify-end lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[16px]"
            />

            {/* Bottom Sheet Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              style={{
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              }}
              className="relative w-full bg-white/85 dark:bg-[#1C1C1E]/85 rounded-t-[32px] border-t border-black/[0.06] dark:border-white/[0.1] shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Sheet Drag Indicator */}
              <div className="w-10 h-1 bg-black/20 dark:bg-white/25 rounded-full mx-auto mt-3 mb-1" />

              {/* Sheet Header */}
              <div className="px-6 py-3.5 border-b border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-display font-bold text-foreground">
                    Menú Completo
                  </h3>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="min-h-[44px] min-w-[44px] size-10 rounded-full bg-black/[0.04] dark:bg-white/[0.08] flex items-center justify-center text-foreground cursor-pointer active:scale-90 transition-transform"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="px-6 pt-3 pb-1">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.08] min-h-[44px]">
                  <Search className="size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar servicios, citas, opciones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-hidden font-medium"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-muted-foreground min-h-[36px] min-w-[36px] flex items-center justify-center">
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Pinned Quick Shortcuts */}
              {pinnedItems.length > 0 && !searchQuery && (
                <div className="px-6 pt-3">
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Star className="size-3 text-amber-500 fill-amber-500" />
                    Atajos Rápidos
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pinnedItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setIsDrawerOpen(false);
                          navigate(item.path);
                        }}
                        className="min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                      >
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2-Level Hierarchical Navigation List */}
              <div className="p-6 space-y-2.5 overflow-y-auto custom-scrollbar flex-1">
                {filteredCategories.map((category) => {
                  const isExpanded = expandedCategoryId === category.id || !!searchQuery;
                  const hasSub = category.subItems && category.subItems.length > 0;

                  return (
                    <div key={category.id} className="border border-black/[0.04] dark:border-white/[0.06] rounded-2xl p-1.5 bg-black/[0.02] dark:bg-white/[0.02]">
                      <button
                        onClick={() => {
                          if (hasSub) {
                            setExpandedCategoryId(isExpanded ? null : category.id);
                          } else {
                            setIsDrawerOpen(false);
                            navigate(category.defaultPath);
                          }
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all cursor-pointer min-h-[48px] active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <NavIcon name={category.iconName} className="size-4.5" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-foreground">{category.label}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {category.subItems?.length || 0} sub-opciones
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {category.badge && (
                            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {category.badge}
                            </span>
                          )}
                          <ChevronRight className={cn("size-4 text-muted-foreground transition-transform", isExpanded && "rotate-90 text-primary")} />
                        </div>
                      </button>

                      {/* Submenu Expansion */}
                      <AnimatePresence>
                        {hasSub && isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pl-4 pr-2 pt-1 pb-1 space-y-1"
                          >
                            {category.subItems?.map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() => {
                                  setIsDrawerOpen(false);
                                  navigate(sub.path);
                                }}
                                className="w-full p-2.5 rounded-xl text-left text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-between cursor-pointer min-h-[44px] active:scale-[0.98]"
                              >
                                <span className="truncate">{sub.label}</span>
                                {sub.badge && (
                                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-md bg-black/[0.05] dark:bg-white/[0.08] text-muted-foreground">
                                    {sub.badge}
                                  </span>
                                )}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Sheet Footer */}
              <div className="p-4.5 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    openCustomizeModal();
                  }}
                  className="min-h-[44px] px-3 flex items-center gap-2 text-xs font-bold text-primary cursor-pointer hover:underline active:scale-95 transition-transform"
                >
                  <SlidersHorizontal className="size-4" />
                  Personalizar Barra
                </button>

                <button
                  onClick={handleLogout}
                  className="min-h-[44px] px-3 flex items-center gap-2 text-xs font-bold text-rose-600 cursor-pointer active:scale-95 transition-transform"
                >
                  <LogOut className="size-4" />
                  Salir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default BottomNavigation;
