import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutGrid, 
  Camera, 
  ClipboardList, 
  Calendar,
  User, 
  Settings,
  Plus, 
  Sparkles, 
  LogOut,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '@/app/AppContext';
import { cn } from '@emme/ui/lib/utils';
import { toast } from 'sonner';

interface AppleSidebarProps {
  activeTab: string;
}

export function AppleSidebar({ activeTab }: AppleSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, clients, profile } = useApp();

  const client = clients && clients.length > 0 ? clients[0] : null;
  const userName = client?.name || 'Miky Delzar';
  const userInitial = userName.charAt(0).toUpperCase() || 'M';
  const userShape = client?.preferences || 'Almendra';

  const navItems = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: LayoutGrid,
      path: '/inicio',
      isActive: activeTab === 'inicio' || location.pathname === '/inicio',
    },
    {
      id: 'chat',
      label: 'Emme Chat IA',
      icon: Sparkles,
      path: '/chat',
      badge: 'GEMINI',
      badgeClass: 'bg-primary/10 text-primary',
      isActive: activeTab === 'chat' || location.pathname.startsWith('/chat'),
    },
    {
      id: 'quotes',
      label: 'Inspiración & Galería',
      icon: Camera,
      path: '/quotes/inspiration',
      isActive: activeTab === 'quotes' || location.pathname.startsWith('/quotes'),
    },
    {
      id: 'agenda',
      label: 'Mis Citas',
      icon: Calendar,
      path: '/agenda',
      isActive: activeTab === 'agenda' || location.pathname.startsWith('/agenda'),
    },
    {
      id: 'services',
      label: 'Tratamientos',
      icon: ClipboardList,
      path: '/services',
      isActive: activeTab === 'services' || location.pathname.startsWith('/services'),
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      path: '/profile',
      isActive: activeTab === 'profile' || location.pathname.startsWith('/profile'),
    },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
  };

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 z-40 hidden lg:flex flex-col select-none relative",
        "apple-light-menu border-r border-white/80 dark:border-white/10 w-[264px] 2xl:w-[280px] shrink-0 px-4 2xl:px-5 py-6 justify-between shadow-[6px_0_36px_rgba(0,0,0,0.04)]"
      )}
    >
      {/* Specular Apple Light Top Line */}
      <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 dark:via-white/30 to-transparent pointer-events-none" />

      {/* Top Section */}
      <div className="space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div 
          onClick={() => navigate('/inicio')}
          className="flex items-center gap-3.5 cursor-pointer group px-1 active:scale-[0.98] transition-transform"
        >
          <div className="liquid-glass-sub size-11 rounded-2xl text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <Sparkles className="size-5.5 stroke-[2]" />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-[20px] font-display font-bold tracking-[-0.03em] leading-none text-[#1D1D1F] dark:text-white">
              <span className="text-primary font-bold">emme</span> nails
            </h1>
            <span className="text-[9px] font-bold text-[#86868B] dark:text-[#A1A1A6] uppercase tracking-[0.14em] mt-1">
              POLANCO STUDIO
            </span>
          </div>
        </div>

        {/* Primary "+ Nueva Cita" Action Button */}
        <button
          type="button"
          onClick={() => navigate('/booking')}
          className="w-full min-h-[48px] h-12 rounded-2xl bg-primary hover:brightness-105 text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-[0_8px_24px_-4px_rgba(224,82,134,0.35)] active:scale-95 transition-all cursor-pointer tracking-tight"
          style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.22), transparent)'
          }}
        >
          <Plus className="size-5 stroke-[2.2]" />
          <span>Nueva Cita</span>
        </button>

        {/* Navigation Section */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#86868B] dark:text-[#A1A1A6] px-3 block">
            NAVEGACIÓN
          </span>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = item.isActive;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full min-h-[44px] p-2.5 rounded-2xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer active:scale-[0.98] relative",
                    isSelected
                      ? "apple-light-tab-active"
                      : "border border-transparent hover:bg-white/40 dark:hover:bg-white/[0.06]"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div
                      className={cn(
                        "size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        isSelected
                          ? "bg-primary/15 text-primary"
                          : "liquid-glass-sub text-[#86868B]"
                      )}
                    >
                      <Icon className={cn("size-4.5", isSelected ? "stroke-[2.2]" : "stroke-[1.75]")} />
                    </div>
                    <span
                      className={cn(
                        "text-[13.5px] truncate transition-colors tracking-tight",
                        isSelected
                          ? "font-semibold text-primary dark:text-pink-300"
                          : "font-medium text-[#86868B] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-white"
                      )}
                    >
                      {item.label}
                    </span>
                  </div>

                  {isSelected ? (
                    <div className="size-2 rounded-full bg-primary shrink-0 mr-1" />
                  ) : item.badge ? (
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary tracking-wider shrink-0">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Bottom User Card & Logout */}
      <div className="space-y-3 pt-4 border-t border-black/[0.04] dark:border-white/[0.06] relative z-10">
        <div
          onClick={() => navigate('/profile')}
          className="p-3 rounded-2xl liquid-glass-sub hover:brightness-105 flex items-center justify-between cursor-pointer transition-all duration-200 group active:scale-[0.98]"
        >
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="size-9 rounded-full bg-primary/15 text-primary font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20">
              {userInitial}
            </div>
            <div className="min-w-0">
              <span className="text-[13px] font-semibold text-[#1D1D1F] dark:text-white block truncate leading-tight">
                {userName}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-[10.5px] font-medium text-[#86868B] truncate">
                  VIP Gold ({userShape})
                </span>
              </div>
            </div>
          </div>

          <ArrowUpRight className="size-4 text-[#86868B] group-hover:text-[#1D1D1F] dark:group-hover:text-white transition-colors shrink-0" />
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#86868B] hover:text-[#FF3B30] dark:hover:text-[#FF453A] transition-colors cursor-pointer rounded-xl hover:bg-rose-500/5 active:scale-95"
        >
          <LogOut className="size-4 stroke-[1.75]" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

    </aside>
  );
}
