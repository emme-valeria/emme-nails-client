import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Pin, 
  PinOff, 
  SlidersHorizontal,
  Palette,
  Sparkles,
  Layout,
  Check
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';
import { DEFAULT_NAV_CATEGORIES } from '../data/navConfig';
import { SidebarRowSize, SystemAccentColor, AdaptableNavMode } from '../types';
import { NavIcon } from './NavIcon';
import { cn } from '@emme/ui/lib/utils';

export function SidebarCustomizerModal() {
  const {
    isCustomizeModalOpen,
    closeCustomizeModal,
    config,
    rowSize,
    setRowSize,
    accentColor,
    setAccentColor,
    adaptableMode,
    setAdaptableMode,
    pinnedItems,
    togglePinItem,
    reorderSections,
    toggleSectionVisibility,
    resetToDefaults,
  } = useSidebar();

  if (!isCustomizeModalOpen) return null;

  const currentOrder = config.customSectionOrder;

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newOrder = [...currentOrder];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    reorderSections(newOrder);
  };

  const handleMoveDown = (index: number) => {
    if (index >= currentOrder.length - 1) return;
    const newOrder = [...currentOrder];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    reorderSections(newOrder);
  };

  const accentColors: { id: SystemAccentColor; label: string; bgClass: string }[] = [
    { id: 'rose', label: 'Rosa Emme', bgClass: 'bg-[#E05286]' },
    { id: 'blue', label: 'Azul Apple', bgClass: 'bg-[#0071E3]' },
    { id: 'purple', label: 'Violeta', bgClass: 'bg-[#AF52DE]' },
    { id: 'orange', label: 'Naranja', bgClass: 'bg-[#FF9500]' },
    { id: 'emerald', label: 'Esmeralda', bgClass: 'bg-[#34C759]' },
    { id: 'slate', label: 'Grafito', bgClass: 'bg-[#8E8E93]' },
  ];

  // Collect all available sub-items for pinning
  const allSubItems = DEFAULT_NAV_CATEGORIES.flatMap(cat => 
    (cat.subItems || []).map(sub => ({ ...sub, categoryLabel: cat.label }))
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCustomizeModal}
          className="fixed inset-0 bg-black/40 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-xl bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-2xl rounded-3xl border border-white/40 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] sticky top-0 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl z-10">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <SlidersHorizontal className="size-4.5" />
              </div>
              <div>
                <h3 className="text-base font-display font-bold text-foreground">
                  Personalizar Barra Lateral
                </h3>
                <p className="text-xs text-muted-foreground">
                  Estándares Apple HIG • Adapta secciones, orden y densidad
                </p>
              </div>
            </div>
            <button
              onClick={closeCustomizeModal}
              className="size-8 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] text-foreground/70 hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
            {/* Row Height Density */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Layout className="size-3.5" />
                  Densidad de Filas (macOS HIG)
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {rowSize === 'small' ? 'Compacta (34px)' : rowSize === 'medium' ? 'Estándar (42px)' : 'Amplia (48px)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'small', label: 'Compacta', desc: 'Más elementos visibles' },
                  { id: 'medium', label: 'Estándar', desc: 'Equilibrio Apple' },
                  { id: 'large', label: 'Amplia', desc: 'Espaciosa y táctil' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRowSize(item.id as SidebarRowSize)}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between",
                      rowSize === item.id
                        ? "bg-primary/10 border-primary/40 text-primary font-bold shadow-xs"
                        : "bg-black/[0.02] dark:bg-white/[0.03] border-border/40 hover:border-border/80 text-foreground"
                    )}
                  >
                    <span className="text-xs font-bold">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Theme */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Palette className="size-3.5" />
                Color de Acento de la Barra
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {accentColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setAccentColor(color.id)}
                    className={cn(
                      "p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer",
                      accentColor === color.id
                        ? "border-primary bg-primary/5 shadow-xs font-bold"
                        : "border-border/40 hover:border-border/80 bg-black/[0.02] dark:bg-white/[0.03]"
                    )}
                  >
                    <div className={cn("size-5 rounded-full shadow-xs flex items-center justify-center", color.bgClass)}>
                      {accentColor === color.id && <Check className="size-3 text-white stroke-[3]" />}
                    </div>
                    <span className="text-[11px] truncate w-full text-center text-foreground">{color.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Adaptable Tablet Mode */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5" />
                Comportamiento en Tablet / iPad (`sidebarAdaptable`)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'auto', label: 'Automático', desc: 'Tab bar flotante responsive' },
                  { id: 'sidebar', label: 'Barra Lateral', desc: 'Siempre panel dividido' },
                  { id: 'tabbar', label: 'Pestañas', desc: 'Siempre barra de pestañas' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setAdaptableMode(mode.id as AdaptableNavMode)}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all cursor-pointer",
                      adaptableMode === mode.id
                        ? "bg-primary/10 border-primary/40 text-primary font-bold shadow-xs"
                        : "bg-black/[0.02] dark:bg-white/[0.03] border-border/40 hover:border-border/80 text-foreground"
                    )}
                  >
                    <span className="text-xs font-bold">{mode.label}</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reorder and Toggle Sections */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Organizar Secciones de la Barra (2 Niveles HIG)
                </label>
                <span className="text-[11px] text-muted-foreground">Usa flechas para reordenar</span>
              </div>

              <div className="space-y-2 border border-border/40 rounded-2xl p-2 bg-black/[0.01] dark:bg-white/[0.01]">
                {currentOrder.map((catId, index) => {
                  const cat = DEFAULT_NAV_CATEGORIES.find(c => c.id === catId);
                  if (!cat) return null;
                  const isHidden = config.hiddenSectionIds.includes(catId);

                  return (
                    <div
                      key={cat.id}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border transition-all",
                        isHidden 
                          ? "opacity-50 bg-black/[0.02] dark:bg-white/[0.02] border-dashed border-border/60" 
                          : "bg-white dark:bg-[#252528] border-border/50 shadow-xs"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-foreground flex items-center justify-center">
                          <NavIcon name={cat.iconName} className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{cat.label}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {cat.subItems?.length || 0} sub-elementos • {isHidden ? 'Oculto' : 'Visible'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Move Up */}
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveUp(index)}
                          className="size-7 rounded-lg hover:bg-black/[0.06] dark:hover:bg-white/[0.08] disabled:opacity-30 text-foreground flex items-center justify-center transition-colors cursor-pointer"
                          title="Subir"
                        >
                          <ArrowUp className="size-3.5" />
                        </button>
                        {/* Move Down */}
                        <button
                          disabled={index === currentOrder.length - 1}
                          onClick={() => handleMoveDown(index)}
                          className="size-7 rounded-lg hover:bg-black/[0.06] dark:hover:bg-white/[0.08] disabled:opacity-30 text-foreground flex items-center justify-center transition-colors cursor-pointer"
                          title="Bajar"
                        >
                          <ArrowDown className="size-3.5" />
                        </button>
                        {/* Toggle Visibility */}
                        <button
                          onClick={() => toggleSectionVisibility(cat.id)}
                          className={cn(
                            "size-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer",
                            isHidden 
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" 
                              : "hover:bg-black/[0.06] dark:hover:bg-white/[0.08] text-foreground"
                          )}
                          title={isHidden ? 'Mostrar sección' : 'Ocultar sección'}
                        >
                          {isHidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pinned Quick Favorites */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Pin className="size-3.5" />
                  Atajos Rápidos Fijados en la Barra
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {config.pinnedItemIds.length} fijados
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {allSubItems.map((item) => {
                  const isPinned = config.pinnedItemIds.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => togglePinItem(item.id)}
                      className={cn(
                        "p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer",
                        isPinned
                          ? "bg-primary/10 border-primary/40 text-primary font-bold shadow-xs"
                          : "bg-black/[0.02] dark:bg-white/[0.02] border-border/40 hover:border-border/80 text-foreground"
                      )}
                    >
                      <div className="truncate mr-2">
                        <p className="text-xs font-semibold truncate">{item.label}</p>
                        <p className="text-[9px] text-muted-foreground truncate">{item.categoryLabel}</p>
                      </div>
                      <div className={cn(
                        "size-6 rounded-lg flex items-center justify-center shrink-0",
                        isPinned ? "bg-primary text-white" : "bg-black/[0.05] dark:bg-white/[0.08] text-muted-foreground"
                      )}>
                        {isPinned ? <Pin className="size-3" /> : <PinOff className="size-3 opacity-60" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl">
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              Restablecer Valores
            </button>

            <button
              onClick={closeCustomizeModal}
              className="px-5 py-2 rounded-2xl bg-primary text-white text-xs font-bold hover:brightness-110 shadow-sm transition-all cursor-pointer"
            >
              Listo
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
