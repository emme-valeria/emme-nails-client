import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Heart, 
  Calendar, 
  Settings, 
  Sparkles, 
  Bell, 
  Palette, 
  Globe, 
  Download, 
  RefreshCw, 
  LogOut, 
  ChevronRight, 
  CheckCircle2, 
  Mail, 
  Gift, 
  Sun, 
  Moon, 
  Monitor, 
  HelpCircle,
  ShieldCheck,
  Star,
  Sliders,
  ArrowRight
} from 'lucide-react';
import { useApp } from '@/app/AppContext';
import { useTheme } from '@/app/ThemeProvider';
import { Button } from '@emme/ui/button';
import { Input } from '@emme/ui/input';
import { PhoneInput } from '@emme/ui/PhoneInput';
import { Label } from '@emme/ui/label';
import { Textarea } from '@emme/ui/textarea';
import { Badge } from '@emme/ui/badge';
import { Switch } from '@emme/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@emme/ui/select';
import { toast } from 'sonner';
import { cacheService } from '@emme/infrastructure/cacheService';
import { cn } from '@emme/ui/lib/utils';

export function ProfileView() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme, setTheme } = useTheme();
  const { 
    profile, 
    updateProfile, 
    appointments, 
    logout,
    googleUser, 
    restartOnboarding, 
    startTour,
    clients
  } = useApp();

  const client = clients && clients.length > 0 ? clients[0] : null;

  // Active subview/tab state
  const tabParam = searchParams.get('tab');
  const [activeOption, setActiveOption] = useState<string>(() => {
    if (tabParam === 'configuracion' || tabParam === 'settings' || tabParam === 'notificaciones' || tabParam === 'apariencia' || tabParam === 'idioma') {
      return 'configuracion';
    }
    if (tabParam === 'estilo') return 'estilo';
    return 'perfil';
  });

  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(() => {
    return Boolean(tabParam);
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      if (tab === 'configuracion' || tab === 'settings' || tab === 'notificaciones' || tab === 'apariencia' || tab === 'idioma') {
        setActiveOption('configuracion');
      } else if (tab === 'estilo') {
        setActiveOption('estilo');
      } else if (tab === 'perfil') {
        setActiveOption('perfil');
      }
      setIsDetailOpen(true);
    }
  }, [searchParams]);

  // Form state
  const [formData, setFormData] = useState({
    name: profile.owner || profile.name || client?.name || 'Valeria Arriaza',
    email: googleUser?.email || 'valeria.clienta@emme.com',
    phone: profile.phone || client?.phone || '+52 55 1234 5678',
    birthday: '1998-10-15',
    instagram: profile.instagram || '@valeria_nails',
    // Nail & Beauty Preferences
    nailShape: client?.preferences || 'Almendra',
    nailLength: 'Mediano',
    favoriteStyle: 'Nude & Minimalista',
    lashStyle: 'Efecto Foxy / Cat Eye',
    browStyle: 'Laminado de Cejas',
    allergies: 'Sensibilidad suave a la cutícula, sin alergias a acrílico.',
    appointmentPreferences: 'Prefiero ambiente relajante y música suave.',
    // Settings & Notifications
    whatsappReminders: true,
    emailConfirmations: true,
    promoOffers: true,
    reminderHours: 24,
    language: profile.language || 'es',
  });

  const [isClearing, setIsClearing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({
      ...profile,
      owner: formData.name,
      name: formData.name,
      phone: formData.phone,
      instagram: formData.instagram,
      language: formData.language,
    });
    toast.success('Cambios guardados correctamente', {
      icon: <CheckCircle2 className="size-4 text-emerald-500" />
    });
  };

  const handleClearCache = () => {
    setIsClearing(true);
    setTimeout(() => {
      cacheService.clear();
      setIsClearing(false);
      toast.success('Memoria caché restablecida');
      setTimeout(() => window.location.reload(), 600);
    }, 600);
  };

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      const data = {
        clientProfile: formData,
        appointmentsHistory: appointments,
        exportedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `perfil-emme-nails-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      toast.success('Datos exportados exitosamente');
    }, 800);
  };

  // Main Options Menu Items
  const menuOptions = [
    {
      id: 'perfil',
      label: 'Datos Personales',
      description: 'Nombre, teléfono WhatsApp, cumpleaños e Instagram',
      icon: User,
      badge: 'Básico',
      badgeColor: 'bg-primary/10 text-primary',
      action: () => {
        setActiveOption('perfil');
        setIsDetailOpen(true);
        setSearchParams({ tab: 'perfil' });
      }
    },
    {
      id: 'estilo',
      label: 'Preferencias de Uñas & Estilo',
      description: 'Forma favorita, largo, estilo y notas de servicio',
      icon: Heart,
      badge: formData.nailShape,
      badgeColor: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
      action: () => {
        setActiveOption('estilo');
        setIsDetailOpen(true);
        setSearchParams({ tab: 'estilo' });
      }
    },
    {
      id: 'agenda',
      label: 'Mis Citas & Reservas',
      description: 'Consulta tus citas confirmadas y tu historial',
      icon: Calendar,
      badge: `${appointments?.length || 0} Citas`,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      action: () => {
        navigate('/agenda');
      }
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      description: 'Recordatorios, apariencia, tema, idioma y almacenamiento',
      icon: Settings,
      badge: 'Ajustes',
      badgeColor: 'bg-primary/10 text-primary',
      action: () => {
        setActiveOption('configuracion');
        setIsDetailOpen(true);
        setSearchParams({ tab: 'configuracion' });
      }
    },
    {
      id: 'tour',
      label: 'Guía y Tour Interactivo',
      description: 'Repetir la presentación guiada de la app',
      icon: Sparkles,
      action: () => {
        startTour();
      }
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-36 min-h-screen px-4 sm:px-6 lg:px-0">
      
      {/* Top Header */}
      <div className={cn(
        "flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 transition-all duration-300",
        isDetailOpen ? "hidden lg:flex" : "flex"
      )}>
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Mi Cuenta</p>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-display font-bold tracking-tight text-foreground leading-none flex items-center gap-3">
            <User className="size-8 sm:size-9 text-primary shrink-0" />
            <span>Perfil de Clienta</span>
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm font-medium pt-1">
            Gestiona tus datos, preferencias de manicure y la configuración de tu aplicación.
          </p>
        </div>
      </div>

      {/* Mobile Breadcrumb / Back Button */}
      <AnimatePresence>
        {isDetailOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center justify-between gap-3 py-2 lg:hidden border-b border-black/[0.04] dark:border-white/[0.06] pb-3"
          >
            <button 
              onClick={() => {
                setIsDetailOpen(false);
                setSearchParams({});
              }}
              className="min-h-[44px] px-3.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] flex items-center gap-2 text-foreground font-semibold text-xs active:scale-95 transition-all cursor-pointer"
            >
              <ChevronRight className="size-4 rotate-180 text-primary" />
              <span>Volver a Opciones</span>
            </button>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                {activeOption === 'configuracion' ? 'Ajustes' : activeOption === 'estilo' ? 'Uñas' : 'Datos'}
              </span>
              <span className="text-xs font-bold text-foreground">
                {activeOption === 'configuracion' ? 'Configuración' : activeOption === 'estilo' ? 'Preferencias de Uñas' : 'Datos Personales'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Client Summary Card & Menu Options */}
        <div className={cn(
          "lg:col-span-5 space-y-6 transition-all duration-300",
          isDetailOpen ? "hidden lg:block" : "block"
        )}>
          
          {/* User Profile Summary Card */}
          <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.04] dark:border-white/[0.08] rounded-[32px] p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-[22px] bg-gradient-to-tr from-primary/20 via-pink-100 to-primary/10 text-primary flex items-center justify-center text-2xl font-display font-extrabold border border-primary/20 shadow-xs">
                {formData.name.charAt(0).toUpperCase() || 'V'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-display font-bold text-foreground truncate">{formData.name}</h3>
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground truncate">{formData.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                    <Star className="size-3 fill-purple-500 text-purple-500" />
                    <span>Clienta VIP</span>
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {formData.nailShape} • {formData.nailLength}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
              <div 
                onClick={() => navigate('/agenda')}
                className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.02] dark:border-white/[0.04] cursor-pointer hover:bg-primary/5 transition-all group"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mis Citas</p>
                <p className="text-base font-display font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  <span>{appointments?.length || 0} registradas</span>
                  <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </p>
              </div>

              <div 
                onClick={() => {
                  setActiveOption('estilo');
                  setIsDetailOpen(true);
                  setSearchParams({ tab: 'estilo' });
                }}
                className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.02] dark:border-white/[0.04] cursor-pointer hover:bg-primary/5 transition-all group"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Estilo Uñas</p>
                <p className="text-base font-display font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  <span className="truncate">{formData.nailShape}</span>
                  <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </p>
              </div>
            </div>
          </div>

          {/* Menú de Opciones del Usuario */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground px-3 block">
              Menú de Opciones
            </span>

            <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.04] dark:border-white/[0.08] rounded-[28px] p-2 space-y-1 shadow-sm">
              {menuOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = activeOption === opt.id && isDetailOpen;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={opt.action}
                    className={cn(
                      "w-full min-h-[50px] p-3 rounded-[20px] flex items-center justify-between text-left transition-all duration-200 cursor-pointer active:scale-[0.98] relative",
                      isSelected
                        ? "bg-primary text-white shadow-[0_4px_14px_rgba(224,82,134,0.30)] font-bold"
                        : "hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 pr-2">
                      <div className={cn(
                        "size-9 rounded-2xl flex items-center justify-center shrink-0 transition-all",
                        isSelected
                          ? "bg-white/20 text-white"
                          : opt.id === 'configuracion' 
                            ? "bg-primary/10 text-primary" 
                            : "bg-black/[0.04] dark:bg-white/[0.06] text-muted-foreground"
                      )}>
                        <Icon className={cn("size-4.5", isSelected ? "stroke-[2.2]" : "stroke-[1.75]")} />
                      </div>
                      
                      <div className="flex flex-col min-w-0">
                        <span className={cn(
                          "text-xs sm:text-[13px] font-bold tracking-tight truncate",
                          isSelected ? "text-white" : "text-foreground"
                        )}>
                          {opt.label}
                        </span>
                        <span className={cn(
                          "text-[10px] sm:text-[11px] truncate",
                          isSelected ? "text-white/80" : "text-muted-foreground"
                        )}>
                          {opt.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {opt.badge && !isSelected && (
                        <span className={cn(
                          "text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider",
                          opt.badgeColor || "bg-black/[0.05] dark:bg-white/[0.08] text-muted-foreground"
                        )}>
                          {opt.badge}
                        </span>
                      )}
                      <ChevronRight className={cn(
                        "size-4 transition-transform",
                        isSelected ? "text-white opacity-100 translate-x-0.5" : "text-muted-foreground opacity-50"
                      )} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Session Actions Card */}
          <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.04] dark:border-white/[0.08] rounded-[24px] p-2">
            <button
              type="button"
              onClick={() => {
                logout();
                toast.success('Sesión cerrada correctamente');
              }}
              className="w-full min-h-[44px] flex items-center justify-between p-3 rounded-2xl text-rose-600 hover:bg-rose-500/10 transition-all cursor-pointer active:scale-95 text-xs font-bold"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <LogOut className="size-4 stroke-[2]" />
                </div>
                <span>Cerrar Sesión</span>
              </div>
              <ChevronRight className="size-4 opacity-40" />
            </button>
          </div>

        </div>

        {/* Right Column: Detailed View / Settings Panel */}
        <div className={cn(
          "lg:col-span-7 transition-all duration-300",
          isDetailOpen ? "block" : "hidden lg:block"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeOption}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Option 1: Datos Personales */}
              {activeOption === 'perfil' && (
                <div className="bg-white/85 dark:bg-[#1C1C1E]/85 backdrop-blur-xl border border-black/[0.04] dark:border-white/[0.08] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-3.5 pb-4 border-b border-black/[0.04] dark:border-white/[0.06]">
                    <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <User className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-foreground">Datos Personales</h3>
                      <p className="text-xs text-muted-foreground">Tu información de contacto para citas y avisos</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Nombre Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value})} 
                          className="h-11 pl-10 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold"
                          placeholder="Tu nombre completo"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Correo Electrónico</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                          type="email"
                          value={formData.email} 
                          onChange={e => setFormData({...formData, email: e.target.value})} 
                          className="h-11 pl-10 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Teléfono / WhatsApp</Label>
                      <PhoneInput 
                        value={formData.phone} 
                        onChange={val => setFormData({...formData, phone: val})} 
                        className="h-11 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Cumpleaños</Label>
                      <div className="relative">
                        <Gift className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                          type="date"
                          value={formData.birthday} 
                          onChange={e => setFormData({...formData, birthday: e.target.value})} 
                          className="h-11 pl-10 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Usuario de Instagram</Label>
                      <div className="relative">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                        <Input 
                          value={formData.instagram} 
                          onChange={e => setFormData({...formData, instagram: e.target.value})} 
                          className="h-11 pl-10 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold"
                          placeholder="@tu_usuario"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => navigate('/agenda')}
                      className="text-xs font-semibold text-primary hover:underline p-0 h-auto"
                    >
                      Ver mis citas agendadas →
                    </Button>

                    <Button 
                      onClick={handleSaveProfile}
                      className="min-h-[44px] px-6 rounded-2xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 active:scale-95 transition-all"
                    >
                      Guardar Datos
                    </Button>
                  </div>
                </div>
              )}

              {/* Option 2: Preferencias de Uñas */}
              {activeOption === 'estilo' && (
                <div className="bg-white/85 dark:bg-[#1C1C1E]/85 backdrop-blur-xl border border-black/[0.04] dark:border-white/[0.08] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-3.5 pb-4 border-b border-black/[0.04] dark:border-white/[0.06]">
                    <div className="size-11 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                      <Heart className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-foreground">Perfil Estético & Preferencias</h3>
                      <p className="text-xs text-muted-foreground">Tu manicurista consultará tus gustos antes de atenderte</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Forma de Uña Favorita</Label>
                      <Select value={formData.nailShape} onValueChange={val => setFormData({...formData, nailShape: val})}>
                        <SelectTrigger className="h-11 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] font-semibold text-xs">
                          <SelectValue placeholder="Selecciona forma" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="Almendra">Almendra (Almond)</SelectItem>
                          <SelectItem value="Coffin">Coffin / Bailarina</SelectItem>
                          <SelectItem value="Cuadrada">Cuadrada (Square)</SelectItem>
                          <SelectItem value="Stiletto">Stiletto / Puntiaguda</SelectItem>
                          <SelectItem value="Ovalada">Ovalada Clásica</SelectItem>
                          <SelectItem value="Redonda">Redonda Natural</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Largo Predilecto</Label>
                      <Select value={formData.nailLength} onValueChange={val => setFormData({...formData, nailLength: val})}>
                        <SelectTrigger className="h-11 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] font-semibold text-xs">
                          <SelectValue placeholder="Selecciona largo" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="Corto">Corto Natural (Nivel 1)</SelectItem>
                          <SelectItem value="Mediano">Mediano Elegante (Nivel 2)</SelectItem>
                          <SelectItem value="Largo">Largo Glamour (Nivel 3)</SelectItem>
                          <SelectItem value="Extralargo">Extralargo XL (Nivel 4+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Estilo de Diseño Favorito</Label>
                      <Select value={formData.favoriteStyle} onValueChange={val => setFormData({...formData, favoriteStyle: val})}>
                        <SelectTrigger className="h-11 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] font-semibold text-xs">
                          <SelectValue placeholder="Selecciona estilo" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="Nude & Minimalista">Nude & Minimalista (Clean Girl Aesthetic)</SelectItem>
                          <SelectItem value="Francés / Clásico">Efecto Francés / French Clásico o Color</SelectItem>
                          <SelectItem value="Colores Neón & Vibrantes">Tonos Neón & Vibrantes</SelectItem>
                          <SelectItem value="Nail Art 3D / Cristales">Nail Art 3D, Encapsulados & Cristales</SelectItem>
                          <SelectItem value="Efecto Cromo / Glazed">Efecto Glazed / Cromado Hailey Bieber</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Sensibilidad o Notas Especiales</Label>
                      <Textarea 
                        value={formData.allergies}
                        onChange={e => setFormData({...formData, allergies: e.target.value})}
                        className="rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] text-xs font-medium p-3 min-h-[80px]"
                        placeholder="Ej: Cutículas sensibles, preferencia por limado suave..."
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex justify-end">
                    <Button 
                      onClick={handleSaveProfile}
                      className="min-h-[44px] px-6 rounded-2xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 active:scale-95 transition-all"
                    >
                      Guardar Preferencias de Uñas
                    </Button>
                  </div>
                </div>
              )}

              {/* Option 3: Configuración (The Target Configuration Hub) */}
              {activeOption === 'configuracion' && (
                <div className="bg-white/85 dark:bg-[#1C1C1E]/85 backdrop-blur-xl border border-black/[0.04] dark:border-white/[0.08] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-8">
                  
                  {/* Section Title */}
                  <div className="flex items-center gap-3.5 pb-4 border-b border-black/[0.04] dark:border-white/[0.06]">
                    <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Settings className="size-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-foreground">Configuración de la Aplicación</h3>
                      <p className="text-xs text-muted-foreground">Ajusta tus notificaciones, tema visual, idioma y datos</p>
                    </div>
                  </div>

                  {/* 1. Recordatorios & Notificaciones */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <Bell className="size-3.5 text-primary" />
                      <span>Recordatorios & Notificaciones</span>
                    </div>

                    <div className="space-y-2 bg-black/[0.02] dark:bg-white/[0.03] p-3 rounded-2xl border border-black/[0.04] dark:border-white/[0.06]">
                      <div className="flex items-center justify-between p-2">
                        <div>
                          <p className="text-xs font-bold text-foreground">Avisos por WhatsApp</p>
                          <p className="text-[11px] text-muted-foreground">Recibe recordatorio 24h antes de tu cita</p>
                        </div>
                        <Switch 
                          checked={formData.whatsappReminders} 
                          onCheckedChange={val => setFormData({...formData, whatsappReminders: val})} 
                        />
                      </div>

                      <div className="flex items-center justify-between p-2 border-t border-black/[0.03] dark:border-white/[0.04]">
                        <div>
                          <p className="text-xs font-bold text-foreground">Confirmaciones por Correo</p>
                          <p className="text-[11px] text-muted-foreground">Recibo y comprobante de agendamiento</p>
                        </div>
                        <Switch 
                          checked={formData.emailConfirmations} 
                          onCheckedChange={val => setFormData({...formData, emailConfirmations: val})} 
                        />
                      </div>

                      <div className="flex items-center justify-between p-2 border-t border-black/[0.03] dark:border-white/[0.04]">
                        <div>
                          <p className="text-xs font-bold text-foreground">Promociones VIP & Descuentos</p>
                          <p className="text-[11px] text-muted-foreground">Ofertas exclusivas en tratamientos</p>
                        </div>
                        <Switch 
                          checked={formData.promoOffers} 
                          onCheckedChange={val => setFormData({...formData, promoOffers: val})} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Apariencia y Tema Visual */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <Palette className="size-3.5 text-primary" />
                      <span>Apariencia y Tema</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'light', label: 'Claro', desc: 'Luminoso', icon: Sun, color: 'text-amber-500' },
                        { id: 'rose', label: 'Modo Rosa', desc: 'Chic Emme', icon: Sparkles, color: 'text-pink-500' },
                        { id: 'dark', label: 'Oscuro', desc: 'Baja luz', icon: Moon, color: 'text-slate-400' },
                        { id: 'system', label: 'Sistema', desc: 'Automático', icon: Monitor, color: 'text-blue-500' },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isCurrentTheme = theme === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setTheme(item.id as any)}
                            className={cn(
                              "p-3 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer active:scale-95",
                              isCurrentTheme
                                ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/20"
                                : "border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.02] dark:hover:bg-white/[0.04]"
                            )}
                          >
                            <div className={cn("size-7 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center", item.color)}>
                              <Icon className="size-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground leading-tight">{item.label}</p>
                              <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Idioma y Región */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <Globe className="size-3.5 text-primary" />
                      <span>Idioma de la App</span>
                    </div>

                    <Select value={formData.language} onValueChange={val => setFormData({...formData, language: val})}>
                      <SelectTrigger className="h-11 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] font-semibold text-xs">
                        <SelectValue placeholder="Selecciona idioma" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="es">Español (México / Latinoamérica)</SelectItem>
                        <SelectItem value="en">English (US)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 4. Gestión de Memoria y Datos */}
                  <div className="space-y-3 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-foreground">Almacenamiento Local & Copia de Seguridad</p>
                        <p className="text-[11px] text-muted-foreground">Exporta tu historial de citas o libera memoria caché</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleExportData}
                        disabled={isExporting}
                        className="min-h-[40px] px-4 rounded-xl border-black/[0.08] dark:border-white/[0.1] text-xs font-semibold flex items-center gap-2 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                      >
                        <Download className="size-3.5 text-primary" />
                        <span>{isExporting ? 'Exportando...' : 'Descargar Datos JSON'}</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClearCache}
                        disabled={isClearing}
                        className="min-h-[40px] px-4 rounded-xl border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold flex items-center gap-2 hover:bg-amber-500/5"
                      >
                        <RefreshCw className={cn("size-3.5", isClearing && "animate-spin")} />
                        <span>{isClearing ? 'Limpiando...' : 'Restablecer Caché'}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Save Settings Button */}
                  <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground font-medium">Ajustes sincronizados en tu dispositivo</span>
                    <Button 
                      onClick={handleSaveProfile}
                      className="min-h-[44px] px-6 rounded-2xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 active:scale-95 transition-all"
                    >
                      Guardar Configuración
                    </Button>
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}

export default ProfileView;
