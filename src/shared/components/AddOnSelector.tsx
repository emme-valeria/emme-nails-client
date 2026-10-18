import React, { useState } from 'react';
import { Check, LayoutGrid, List, Sparkles, Clock, Trash2, Wrench, Gem, Droplets } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';

export interface AddOnItem {
  id: string;
  title: string;
  priceMXN: number;
  durationMinutes: number;
  description?: string;
  icon?: string;
}

export const AVAILABLE_ADDONS: AddOnItem[] = [
  {
    id: 'removal',
    title: 'Retiro de Producto Anterior',
    description: 'Retiro suave y seguro sin desgastar tu lámina natural',
    priceMXN: 120,
    durationMinutes: 20,
    icon: 'trash'
  },
  {
    id: 'repair',
    title: 'Reparación de Uña Rota',
    description: 'Reconstrucción con fibra o tip escultural',
    priceMXN: 80,
    durationMinutes: 15,
    icon: 'wrench'
  },
  {
    id: 'charms',
    title: 'Decoración Dije / Cristales 3D',
    description: 'Charms metálicos, perlas o cristales Swarovski',
    priceMXN: 150,
    durationMinutes: 20,
    icon: 'gem'
  },
  {
    id: 'hydration',
    title: 'Tratamiento Parafina & Cutícula',
    description: 'Spa hidratante profundo con aceites botánicos',
    priceMXN: 180,
    durationMinutes: 15,
    icon: 'droplet'
  },
];

interface AddOnSelectorProps {
  selectedAddOnIds: string[];
  onToggleAddOn: (id: string) => void;
  defaultLayout?: 'grid' | 'list';
}

export function AddOnSelector({
  selectedAddOnIds,
  onToggleAddOn,
  defaultLayout = 'grid'
}: AddOnSelectorProps) {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>(defaultLayout);

  const getAddOnIcon = (id: string) => {
    switch (id) {
      case 'removal':
        return <Trash2 className="size-4 text-primary" />;
      case 'repair':
        return <Wrench className="size-4 text-primary" />;
      case 'charms':
        return <Gem className="size-4 text-primary" />;
      case 'hydration':
        return <Droplets className="size-4 text-primary" />;
      default:
        return <Sparkles className="size-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Header with Visual Cuadrícula vs Lista Toggle */}
      <div className="flex items-center justify-between pb-0.5">
        <label className="text-xs font-black text-foreground uppercase tracking-wider block">
          Complementos & Extras
        </label>

        <div className="flex items-center bg-secondary/80 p-0.5 rounded-lg border border-border/60 shrink-0">
          <button
            type="button"
            onClick={() => setLayoutMode('grid')}
            className={cn(
              "px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              layoutMode === 'grid'
                ? "bg-card text-foreground shadow-2xs font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Vista Cuadrícula"
          >
            <LayoutGrid className="size-3.5 text-primary" />
            <span className="hidden xs:inline">Cuadrícula</span>
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('list')}
            className={cn(
              "px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              layoutMode === 'list'
                ? "bg-card text-foreground shadow-2xs font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Vista Lista"
          >
            <List className="size-3.5" />
            <span className="hidden xs:inline">Lista</span>
          </button>
        </div>
      </div>

      {layoutMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {AVAILABLE_ADDONS.map((addon) => {
            const isSelected = selectedAddOnIds.includes(addon.id);
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => onToggleAddOn(addon.id)}
                className={cn(
                  "group relative p-3 sm:p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2.5 transition-all cursor-pointer active:scale-[0.99] bg-card",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-2xs"
                    : "border-border/70 hover:border-primary/40 hover:bg-secondary/40"
                )}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "size-8 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        isSelected ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground group-hover:bg-primary/10"
                      )}
                    >
                      {getAddOnIcon(addon.id)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-foreground block truncate">
                        {addon.title}
                      </span>
                      {addon.description && (
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                          {addon.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "size-4.5 rounded-md border flex items-center justify-center shrink-0 transition-all",
                      isSelected ? "bg-primary border-primary text-white" : "border-border/70 bg-card"
                    )}
                  >
                    {isSelected && <Check className="size-3 stroke-[3]" />}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-border/40 w-full text-xs">
                  <span className="font-extrabold text-foreground text-xs">
                    +${addon.priceMXN} MXN
                  </span>
                  <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                    <Clock className="size-2.5" />
                    +{addon.durationMinutes} min
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="divide-y divide-border/60 border border-border/70 rounded-2xl overflow-hidden bg-card">
          {AVAILABLE_ADDONS.map((addon) => {
            const isSelected = selectedAddOnIds.includes(addon.id);
            return (
              <div
                key={addon.id}
                onClick={() => onToggleAddOn(addon.id)}
                className={cn(
                  "p-3 flex items-center justify-between gap-3 transition-colors cursor-pointer text-left",
                  isSelected ? "bg-primary/5 font-semibold" : "hover:bg-secondary/40 active:bg-secondary/60"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className={cn(
                      "size-4.5 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                      isSelected ? "bg-primary border-primary text-white" : "border-border bg-card"
                    )}
                  >
                    {isSelected && <Check className="size-3 stroke-[3]" />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-foreground block truncate">{addon.title}</span>
                    {addon.description && (
                      <p className="text-[10px] text-muted-foreground truncate">{addon.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 text-right">
                  <div>
                    <span className="text-xs font-black text-foreground block">+${addon.priceMXN} MXN</span>
                    <span className="text-[9.5px] text-muted-foreground font-bold">+{addon.durationMinutes} min</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
