import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '@/app/AppContext';
import { useTheme } from '@/app/ThemeProvider';
import { Button } from '@emme/ui/button';
import { Input } from '@emme/ui/input';
import { PhoneInput } from '@emme/ui/PhoneInput';
import { Label } from '@emme/ui/label';
import { Textarea } from '@emme/ui/textarea';
import { 
  User, Sparkles, Bell, HelpCircle, ChevronRight, LogOut,
  ShieldCheck, Globe, Database, RefreshCw, Trash2, Heart,
  Calendar, Check, UserX, ScanFace, Mail, Lock,
  AlertCircle, Download, Palette, Gift,
  CheckCircle2, Sun, Moon, Monitor, Sliders
} from 'lucide-react';
import { Badge } from '@emme/ui/badge';
import { Switch } from '@emme/ui/switch';
import { toast } from 'sonner';
import { cacheService } from '@emme/infrastructure/cacheService';
import { cn } from '@emme/ui/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@emme/ui/select";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { 
    profile, updateProfile, appointments, logout,
    googleUser, restartOnboarding, startTour
  } = useApp();

  // Client personal profile state initialized from current profile/client preferences
  const [formData, setFormData] = useState({
    name: profile.owner || profile.name || 'Valeria Arriaza',
    email: googleUser?.email || 'valeria.clienta@emme.com',
    phone: profile.phone || '+34 600 000 000',
    birthday: '1998-10-15',
    instagram: profile.instagram || '@valeria_nails',
    // Beauty Preferences
    nailShape: 'Almendra',
    nailLength: 'Mediano',
    favoriteStyle: 'Nude & Minimalista',
    lashStyle: 'Efecto Foxy / Cat Eye',
    browStyle: 'Laminado de Cejas',
    allergies: 'Sensibilidad suave a la cutícula, sin alergias a acrílico.',
    appointmentPreferences: 'Prefiero música suave durante el servicio y bebida fría.',
    // Notifications
    whatsappReminders: true,
    emailConfirmations: true,
    promoOffers: true,
    reminderHours: 24,
    // Language & Theme
    language: profile.language || 'es',
  });

  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'estilo' || tabParam === 'notificaciones' || tabParam === 'apariencia' || tabParam === 'idioma') {
      return tabParam;
    }
    return "perfil";
  });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && (tabParam === 'perfil' || tabParam === 'estilo' || tabParam === 'notificaciones' || tabParam === 'apariencia' || tabParam === 'idioma')) {
      setActiveTab(tabParam);
      setIsDetailOpen(true);
    }
  }, [searchParams]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const categories = [
    { id: "all", label: "Todas las Secciones" },
    { id: "Mi Cuenta", label: "Mi Cuenta" },
    { id: "Preferencias", label: "Preferencias" },
  ];

  const tabItems = [
    { id: "perfil", label: "Datos Personales", icon: User, description: "Información de contacto", category: "Mi Cuenta" },
    { id: "estilo", label: "Preferencias de Uñas", icon: Heart, description: "Forma, largo y estilo", category: "Mi Cuenta" },
    { id: "notificaciones", label: "Recordatorios", icon: Bell, description: "WhatsApp y avisos", category: "Preferencias" },
    { id: "apariencia", label: "Apariencia", icon: Palette, description: "Modo claro y oscuro", category: "Preferencias" },
    { id: "idioma", label: "Idioma y Región", icon: Globe, description: "Español / Configuración", category: "Preferencias" },
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId !== "all") {
      const itemsInCategory = tabItems.filter(item => item.category === categoryId);
      if (itemsInCategory.length > 0 && !itemsInCategory.some(i => i.id === activeTab)) {
        setActiveTab(itemsInCategory[0].id);
      }
    }
  };

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsDetailOpen(true);
  };

  const handleSave = () => {
    updateProfile({
      ...profile,
      owner: formData.name,
      name: formData.name,
      phone: formData.phone,
      instagram: formData.instagram,
      language: formData.language,
    });
    toast.success('Perfil y preferencias guardados con éxito');
  };

  const handleClearCache = () => {
    setIsClearing(true);
    setTimeout(() => {
      cacheService.clear();
      setIsClearing(false);
      toast.success('Caché del sistema liberada');
      setTimeout(() => window.location.reload(), 800);
    }, 800);
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
      link.download = `historial-citas-emme-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      toast.success('Historial y datos exportados correctamente');
    }, 1000);
  };

  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-700 max-w-full mx-auto pb-48 min-h-screen px-4 sm:px-6 lg:px-0">
      {/* Header */}
      <div className={cn(
        "flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 transition-all duration-500",
        isDetailOpen ? "hidden lg:flex" : "flex"
      )}>
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary opacity-80">Ajustes Personales</p>
          <div className="space-y-1">
            <h2 className="text-[32px] sm:text-[38px] lg:text-[48px] font-display font-semibold tracking-tight text-foreground leading-none flex items-center gap-3">
              <Sparkles className="size-8 sm:size-10 text-primary shrink-0" />
              <span>Perfil de Clienta</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base font-medium pt-2">
              Gestiona tu cuenta personal y tus preferencias de servicio en un solo lugar.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Header with Back Button (Only in Detail View) */}
      <AnimatePresence>
        {isDetailOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between gap-4 py-4 md:hidden"
          >
            <Button 
              variant="ghost" 
              onClick={() => setIsDetailOpen(false)}
              className="h-10 w-10 rounded-full bg-secondary p-0 flex items-center justify-center"
            >
              <ChevronRight className="size-5 rotate-180 text-foreground" />
            </Button>
            <div className="flex-1 text-center">
              {(() => {
                const item = tabItems.find(t => t.id === activeTab);
                const IconComp = item?.icon;
                return (
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{item?.category}</span>
                    <div className="flex items-center gap-2 pt-0.5">
                      {IconComp && <IconComp className="size-4 text-primary" />}
                      <span className="font-display font-semibold text-lg text-foreground">{item?.label}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="w-10 h-10" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "grid grid-cols-1 lg:grid-cols-12 gap-8 relative outline-none",
        isDetailOpen ? "pb-4" : ""
      )}>
        {/* Navigation Sidebar Grouped by Category */}
        <div className={cn(
          "lg:col-span-4 space-y-6 transition-all duration-500",
          isDetailOpen ? "hidden lg:block" : "block"
        )}>
          {["Mi Cuenta", "Preferencias"].map((categoryName) => {
            const categoryItems = tabItems.filter(item => item.category === categoryName);
            return (
              <div key={categoryName} className="space-y-2.5">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868B] px-3">{categoryName}</h3>
                <div className="bg-white/70 dark:bg-[#1E1E1E]/60 backdrop-blur-[20px] border border-white/40 dark:border-white/10 rounded-[28px] p-2 flex flex-col gap-1 shadow-[0_8px_25px_-8px_rgba(0,0,0,0.04)]">
                  {categoryItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        className={cn(
                          "min-h-[48px] flex items-center justify-between px-4 py-3 rounded-[20px] transition-all duration-200 group outline-none active:scale-[0.98] cursor-pointer",
                          isActive && !isDetailOpen 
                            ? "bg-primary text-white font-bold shadow-[0_4px_14px_rgba(224,82,134,0.3)]" 
                            : "text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
                        )}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={cn(
                            "size-9 rounded-2xl flex items-center justify-center transition-all duration-200",
                            isActive && !isDetailOpen ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:scale-105"
                          )}>
                            <Icon className="size-4 stroke-[2.2]" />
                          </div>
                          <div className="flex flex-col items-start text-left">
                            <span className={cn(
                              "font-display font-bold text-sm tracking-tight leading-none mb-1",
                              isActive && !isDetailOpen ? "text-white" : "text-[#1D1D1F] dark:text-white"
                            )}>{item.label}</span>
                            <span className={cn("text-[11px] font-medium leading-none", isActive && !isDetailOpen ? "text-white/80" : "text-[#86868B]")}>{item.description}</span>
                          </div>
                        </div>
                        <ChevronRight className={cn("size-4 transition-all opacity-40", isActive && !isDetailOpen ? "text-white opacity-100 translate-x-0.5" : "group-hover:opacity-80 group-hover:translate-x-0.5")} />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Section: Presentación & Ayuda */}
          <div className="space-y-2.5">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868B] px-3">Presentación & Guía</h3>
            <div className="bg-white/70 dark:bg-[#1E1E1E]/60 backdrop-blur-[20px] border border-white/40 dark:border-white/10 rounded-[28px] p-2 flex flex-col gap-1 shadow-[0_8px_25px_-8px_rgba(0,0,0,0.04)]">
              <button
                type="button"
                onClick={restartOnboarding}
                className="min-h-[48px] flex items-center justify-between px-4 py-3 rounded-[20px] transition-all duration-200 text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.05] hover:text-primary outline-none active:scale-[0.98] cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="size-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-all duration-200 group-hover:bg-primary group-hover:text-white">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-display font-semibold text-sm tracking-tight leading-none mb-1 text-[#1D1D1F] dark:text-white">Onboarding Interactivo</span>
                    <span className="text-[10px] font-medium uppercase tracking-widest leading-none text-[#86868B]">Repetir bienvenida y estilo</span>
                  </div>
                </div>
                <ChevronRight className="size-4 opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all text-primary" />
              </button>

              <button
                type="button"
                onClick={startTour}
                className="min-h-[48px] flex items-center justify-between px-4 py-3 rounded-[20px] transition-all duration-200 text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.05] outline-none active:scale-[0.98] cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="size-9 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] text-[#86868B] flex items-center justify-center transition-all duration-200 group-hover:text-foreground">
                    <HelpCircle className="size-4" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-display font-semibold text-sm tracking-tight leading-none mb-1 text-[#1D1D1F] dark:text-white">Tour de la Aplicación</span>
                    <span className="text-[10px] font-medium uppercase tracking-widest leading-none text-[#86868B]">Paso a paso en pantalla</span>
                  </div>
                </div>
                <ChevronRight className="size-4 opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          {/* Section: Sesión */}
          <div className="space-y-2.5">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868B] px-3">Sesión</h3>
            <div className="bg-white/70 dark:bg-[#1E1E1E]/60 backdrop-blur-[20px] border border-white/40 dark:border-white/10 rounded-[28px] p-2 flex flex-col gap-1 shadow-[0_8px_25px_-8px_rgba(0,0,0,0.04)]">
              <button
                type="button"
                onClick={logout}
                className="min-h-[48px] flex items-center justify-between px-4 py-3 rounded-[20px] transition-all duration-200 text-rose-600 hover:bg-rose-500/10 outline-none active:scale-[0.98] cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="size-9 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center transition-all duration-200 group-hover:bg-rose-600 group-hover:text-white">
                    <LogOut className="size-4" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-display font-semibold text-sm tracking-tight leading-none mb-1">Cerrar Sesión</span>
                    <span className="text-[10px] font-medium uppercase tracking-widest leading-none opacity-70">Salir de tu cuenta</span>
                  </div>
                </div>
                <ChevronRight className="size-4 opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={cn(
          "lg:col-span-8 transition-all duration-500",
          isDetailOpen ? "block" : "hidden lg:block"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Tab 1: Datos Personales */}
              {activeTab === "perfil" && (
                <div className="bg-card border border-border rounded-[32px] p-6 lg:p-10 shadow-xs space-y-8">
                  <div className="flex items-center gap-3.5 pb-4 border-b border-border">
                    <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <User className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-foreground">Datos Personales</h3>
                      <p className="text-xs text-muted-foreground">Información personal de contacto y redes sociales</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border">
                    <div className="relative group">
                      <div className="size-24 rounded-[28px] bg-gradient-to-tr from-primary/20 via-rose-100 to-purple-100 flex items-center justify-center text-primary text-3xl font-display font-bold shadow-xs">
                        {formData.name.charAt(0) || 'V'}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <h4 className="text-[24px] font-display font-semibold text-foreground leading-tight">{formData.name}</h4>
                      <p className="text-xs font-medium text-muted-foreground">Clienta VIP Emme Studio</p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                        <Badge variant="outline" className="rounded-full px-3 py-1 border-primary/20 bg-primary/5 text-[10px] font-bold text-primary uppercase inline-flex items-center gap-1">
                          <CheckCircle2 className="size-3 text-primary" />
                          <span>Clienta Verificada</span>
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-3 py-1 border-emerald-500/20 bg-emerald-50 text-[10px] font-bold text-emerald-600 uppercase">Activa</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Nombre Completo</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary/40" />
                        <Input 
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value})} 
                          className="h-12 pl-12 rounded-2xl bg-secondary border-none text-sm font-semibold"
                          placeholder="Tu nombre completo"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Correo Electrónico</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary/40" />
                        <Input 
                          type="email"
                          value={formData.email} 
                          onChange={e => setFormData({...formData, email: e.target.value})} 
                          className="h-12 pl-12 rounded-2xl bg-secondary border-none text-sm font-semibold"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Teléfono / WhatsApp</Label>
                      <PhoneInput 
                        value={formData.phone} 
                        onChange={val => setFormData({...formData, phone: val})} 
                        className="h-12 rounded-2xl bg-secondary border-none text-sm font-semibold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Fecha de Cumpleaños</Label>
                      <div className="relative">
                        <Gift className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary/40" />
                        <Input 
                          type="date"
                          value={formData.birthday} 
                          onChange={e => setFormData({...formData, birthday: e.target.value})} 
                          className="h-12 pl-12 rounded-2xl bg-secondary border-none text-sm font-semibold"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground ml-1">¡Recibirás sorpresas y descuentos especiales en tu mes!</p>
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Usuario de Instagram</Label>
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                        <Input 
                          value={formData.instagram} 
                          onChange={e => setFormData({...formData, instagram: e.target.value})} 
                          className="h-12 pl-12 rounded-2xl bg-secondary border-none text-sm font-semibold"
                          placeholder="@tu_usuario"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-0.5 text-center sm:text-left">
                      <p className="font-bold text-sm text-foreground">¿Deseas cerrar tu sesión?</p>
                      <p className="text-xs text-muted-foreground">Podrás ingresar de nuevo en cualquier momento</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={logout} 
                        className="h-11 px-5 border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30 font-bold text-xs rounded-2xl flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <LogOut className="size-4" />
                        <span>Cerrar Sesión</span>
                      </Button>

                      <Button onClick={handleSave} className="h-11 px-6 bg-primary text-white font-bold text-xs rounded-2xl shadow-md shadow-primary/20 hover:brightness-105 cursor-pointer">
                        Guardar Datos
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Preferencias de Uñas & Estilo */}
              {activeTab === "estilo" && (
                <div className="bg-card border border-border rounded-[32px] p-6 lg:p-10 shadow-xs space-y-8">
                  <div className="flex items-center gap-3.5 pb-4 border-b border-border">
                    <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Heart className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-foreground">Perfil Estético de Uñas</h3>
                      <p className="text-xs text-muted-foreground">Guarda tu estilo para que tu manicurista conozca tus gustos</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Forma de Uña Preferida</Label>
                      <Select value={formData.nailShape} onValueChange={val => setFormData({...formData, nailShape: val})}>
                        <SelectTrigger className="h-12 rounded-2xl bg-secondary border-none font-semibold text-sm">
                          <SelectValue placeholder="Selecciona forma" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="Almendra">Almendra (Almond)</SelectItem>
                          <SelectItem value="Coffin">Coffin / Bailarina</SelectItem>
                          <SelectItem value="Cuadrada">Cuadrada (Square)</SelectItem>
                          <SelectItem value="Stiletto">Stiletto / Puntiaguda</SelectItem>
                          <SelectItem value="Ovalada">Ovalada</SelectItem>
                          <SelectItem value="Redonda">Redonda Natural</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Largo Favorito</Label>
                      <Select value={formData.nailLength} onValueChange={val => setFormData({...formData, nailLength: val})}>
                        <SelectTrigger className="h-12 rounded-2xl bg-secondary border-none font-semibold text-sm">
                          <SelectValue placeholder="Selecciona largo" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="Corto">Corto Natural</SelectItem>
                          <SelectItem value="Mediano">Mediano Elegante</SelectItem>
                          <SelectItem value="Largo">Largo Glamour</SelectItem>
                          <SelectItem value="Extralargo">Extralargo XL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Estilo & Diseños Favoritos</Label>
                      <Select value={formData.favoriteStyle} onValueChange={val => setFormData({...formData, favoriteStyle: val})}>
                        <SelectTrigger className="h-12 rounded-2xl bg-secondary border-none font-semibold text-sm">
                          <SelectValue placeholder="Selecciona estilo" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="Nude & Minimalista">Nude & Minimalista (Clean Girl Aesthetic)</SelectItem>
                          <SelectItem value="Francés / Clásico">Efecto Francés / French Clásico o Colorido</SelectItem>
                          <SelectItem value="Colores Neón & Vibrantes">Tonos Neón & Vibrantes</SelectItem>
                          <SelectItem value="Nail Art 3D / Cristales">Nail Art 3D, Encapsulados & Cristales</SelectItem>
                          <SelectItem value="Efecto Cromo / Glazed">Efecto Glazed / Cromado / Espejo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Estilo de Pestañas</Label>
                      <Select value={formData.lashStyle} onValueChange={val => setFormData({...formData, lashStyle: val})}>
                        <SelectTrigger className="h-12 rounded-2xl bg-secondary border-none font-semibold text-sm">
                          <SelectValue placeholder="Selecciona pestañas" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="Clásicas 1:1">Efecto Rímel (Clásicas 1:1)</SelectItem>
                          <SelectItem value="Foxy / Cat Eye">Efecto Foxy / Cat Eye</SelectItem>
                          <SelectItem value="Volumen Ruso / Híbrido">Volumen Ruso / Híbrido</SelectItem>
                          <SelectItem value="Lash Lift Keratina">Lash Lift & Botox Keratina</SelectItem>
                          <SelectItem value="Solo Uñas por ahora">Solo Uñas por ahora</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Cuidado de Cejas</Label>
                      <Select value={formData.browStyle} onValueChange={val => setFormData({...formData, browStyle: val})}>
                        <SelectTrigger className="h-12 rounded-2xl bg-secondary border-none font-semibold text-sm">
                          <SelectValue placeholder="Selecciona cejas" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="Laminado de Cejas">Laminado de Cejas (Lamination)</SelectItem>
                          <SelectItem value="Diseño + Henna / Tinte">Diseño Visagismo + Henna / Tinte</SelectItem>
                          <SelectItem value="Depilación con Hilo / Cera">Depilación & Perfilado Limpio</SelectItem>
                          <SelectItem value="Natural sin servicio">Natural sin servicio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Sensibilidad o Cuidados Especiales</Label>
                      <Textarea 
                        value={formData.allergies}
                        onChange={e => setFormData({...formData, allergies: e.target.value})}
                        className="rounded-2xl bg-secondary border-none text-sm font-medium p-4 min-h-[90px]"
                        placeholder="Ej: Cutículas delicadas, sensibilidad a monómero..."
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Preferencias Durante la Cita</Label>
                      <Textarea 
                        value={formData.appointmentPreferences}
                        onChange={e => setFormData({...formData, appointmentPreferences: e.target.value})}
                        className="rounded-2xl bg-secondary border-none text-sm font-medium p-4 min-h-[90px]"
                        placeholder="Ej: Prefiero cita relajante/silenciosa, café frío, música pop..."
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleSave} className="h-12 px-8 bg-primary text-white font-bold text-xs rounded-2xl shadow-md shadow-primary/20 hover:brightness-105">
                      Guardar Preferencias de Uñas
                    </Button>
                  </div>
                </div>
              )}

              {/* Tab 3: Notificaciones y Recordatorios */}
              {activeTab === "notificaciones" && (
                <div className="bg-card border border-border rounded-[32px] p-6 lg:p-10 shadow-xs space-y-8">
                  <div className="flex items-center gap-3.5 pb-4 border-b border-border">
                    <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Bell className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-foreground">Recordatorios de Citas</h3>
                      <p className="text-xs text-muted-foreground">Recibe avisos oportunos para no olvidar tus citas agendadas</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-secondary flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-bold text-sm text-foreground">Recordatorios por WhatsApp</p>
                        <p className="text-xs text-muted-foreground">Recibe un mensaje automático antes de tu cita</p>
                      </div>
                      <Switch 
                        checked={formData.whatsappReminders} 
                        onCheckedChange={val => setFormData({...formData, whatsappReminders: val})} 
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-bold text-sm text-foreground">Confirmaciones por Correo</p>
                        <p className="text-xs text-muted-foreground">Recibe detalles de tu reserva en tu email</p>
                      </div>
                      <Switch 
                        checked={formData.emailConfirmations} 
                        onCheckedChange={val => setFormData({...formData, emailConfirmations: val})} 
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-bold text-sm text-foreground">Promociones & Descuentos VIP</p>
                        <p className="text-xs text-muted-foreground">Avisos sobre promociones exclusivas para ti</p>
                      </div>
                      <Switch 
                        checked={formData.promoOffers} 
                        onCheckedChange={val => setFormData({...formData, promoOffers: val})} 
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleSave} className="h-12 px-8 bg-primary text-white font-bold text-xs rounded-2xl shadow-md shadow-primary/20 hover:brightness-105">
                      Guardar Notificaciones
                    </Button>
                  </div>
                </div>
              )}

              {/* Tab 4: Apariencia */}
              {activeTab === "apariencia" && (
                <div className="bg-card border border-border rounded-[32px] p-6 lg:p-10 shadow-xs space-y-8">
                  <div className="flex items-center gap-3.5 pb-4 border-b border-border">
                    <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Palette className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-foreground">Apariencia y Tema Visual</h3>
                      <p className="text-xs text-muted-foreground">Personaliza la paleta de colores y el modo visual</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Light Mode */}
                    <button 
                      type="button"
                      onClick={() => setTheme('light')}
                      className={cn(
                        "p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer",
                        theme === 'light' 
                          ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20" 
                          : "border-border hover:bg-secondary"
                      )}
                    >
                      <div className="size-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                        <Sun className="size-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">Modo Claro</p>
                        <p className="text-xs text-muted-foreground">Luminoso y limpio</p>
                      </div>
                    </button>

                    {/* Rose Pink Mode */}
                    <button 
                      type="button"
                      onClick={() => setTheme('rose')}
                      className={cn(
                        "p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer",
                        theme === 'rose' 
                          ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20" 
                          : "border-border hover:bg-secondary"
                      )}
                    >
                      <div className="size-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                        <Sparkles className="size-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">Modo Rosa</p>
                        <p className="text-xs text-muted-foreground">Tono Rose Pink chic</p>
                      </div>
                    </button>

                    {/* Dark Mode */}
                    <button 
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={cn(
                        "p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer",
                        theme === 'dark' 
                          ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20" 
                          : "border-border hover:bg-secondary"
                      )}
                    >
                      <div className="size-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center">
                        <Moon className="size-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">Modo Oscuro</p>
                        <p className="text-xs text-muted-foreground">Para poca luz</p>
                      </div>
                    </button>

                    {/* System Mode */}
                    <button 
                      type="button"
                      onClick={() => setTheme('system')}
                      className={cn(
                        "p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer",
                        theme === 'system' 
                          ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20" 
                          : "border-border hover:bg-secondary"
                      )}
                    >
                      <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Monitor className="size-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">Sistema</p>
                        <p className="text-xs text-muted-foreground">Dispositivo</p>
                      </div>
                    </button>
                  </div>

                  <div className="pt-4 flex justify-start">
                    <Button onClick={handleSave} className="h-12 px-8 bg-primary text-white font-bold text-xs rounded-2xl shadow-md shadow-primary/20 hover:brightness-105">
                      Guardar Apariencia
                    </Button>
                  </div>
                </div>
              )}

              {/* Tab 5: Idioma y Región / Datos */}
              {activeTab === "idioma" && (
                <div className="bg-card border border-border rounded-[32px] p-6 lg:p-10 shadow-xs space-y-8">
                  <div className="flex items-center gap-3.5 pb-4 border-b border-border">
                    <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Globe className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-foreground">Idioma & Gestión de Datos</h3>
                      <p className="text-xs text-muted-foreground">Configura idioma, descarga tus datos o limpia caché</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Idioma Preferido</Label>
                      <Select value={formData.language} onValueChange={val => setFormData({...formData, language: val})}>
                        <SelectTrigger className="h-12 rounded-2xl bg-secondary border-none font-semibold text-sm">
                          <SelectValue placeholder="Idioma" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="es">Español (Latinoamérica / España)</SelectItem>
                          <SelectItem value="en">English (US)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 flex flex-col justify-end">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Copia de Seguridad</Label>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={handleExportData}
                        disabled={isExporting}
                        className="h-12 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border-border hover:bg-secondary cursor-pointer"
                      >
                        <Download className="size-4 text-primary" />
                        <span>{isExporting ? 'Exportando...' : 'Exportar Mis Datos JSON'}</span>
                      </Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-0.5 text-center sm:text-left">
                      <p className="font-bold text-sm text-foreground">Limpieza de Memoria Caché</p>
                      <p className="text-xs text-muted-foreground">Si notas lentitud, puedes restablecer la caché local</p>
                    </div>

                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleClearCache}
                      disabled={isClearing}
                      className="h-11 px-5 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-900/50 dark:text-amber-400 dark:hover:bg-amber-950/30 font-bold text-xs rounded-2xl flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <RefreshCw className={cn("size-4", isClearing && "animate-spin")} />
                      <span>{isClearing ? 'Limpiando...' : 'Limpiar Caché Local'}</span>
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
