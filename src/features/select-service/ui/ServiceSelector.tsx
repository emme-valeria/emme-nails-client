import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Layers, Trash2, Wrench, HelpCircle, Check, LayoutGrid, List } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';

export interface ServiceOption {
  id: string;
  name: string;
  priceMXN?: number;
  description: string;
}

interface ServiceSelectorProps {
  services: ServiceOption[];
  selectedId?: string;
  onSelect: (serviceId: string) => void;
  showPrices?: boolean;
  defaultLayout?: 'grid' | 'list';
}

export function ServiceSelector({
  services,
  selectedId,
  onSelect,
  showPrices = true,
  defaultLayout = 'grid'
}: ServiceSelectorProps) {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>(defaultLayout);

  const getIcon = (id: string) => {
    switch (id) {
      case 'gel-manicure':
        return <Sparkles className="size-4 sm:size-5 text-primary" />;
      case 'acrylic-set':
        return <ShieldCheck className="size-4 sm:size-5 text-primary" />;
      case 'gel-extensions':
        return <Layers className="size-4 sm:size-5 text-primary" />;
      case 'removal':
        return <Trash2 className="size-4 sm:size-5 text-primary" />;
      case 'repair':
        return <Wrench className="size-4 sm:size-5 text-primary" />;
      default:
        return <HelpCircle className="size-4 sm:size-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Header with Visual Cuadrícula vs Lista Toggle */}
      <div className="flex items-center justify-between pb-0.5">
        <label className="text-xs font-black text-foreground uppercase tracking-wider block">
          Catálogo de Servicios
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
          {services.map((service) => {
            const isSelected = selectedId === service.id;

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => onSelect(service.id)}
                className={`group relative text-left p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 sm:gap-3 ${
                  isSelected
                    ? 'bg-primary/10 border-primary shadow-md shadow-primary/10 ring-2 ring-primary/20'
                    : 'bg-card border-border/70 hover:border-primary/50 hover:bg-secondary/40'
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div
                      className={`size-8 sm:size-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-secondary/80 text-foreground group-hover:bg-primary/20'
                      }`}
                    >
                      {getIcon(service.id)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-extrabold text-foreground tracking-tight truncate">
                        {service.name}
                      </h4>
                      {showPrices && service.priceMXN && (
                        <span className="text-[11px] sm:text-xs font-black text-primary block mt-0.5">
                          ${service.priceMXN} MXN
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className={`size-5 sm:size-6 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                      isSelected
                        ? 'bg-primary border-primary text-white'
                        : 'border-border/60 bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="size-3 sm:size-3.5 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug sm:leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="divide-y divide-border/60 border border-border/70 rounded-2xl overflow-hidden bg-card">
          {services.map((service) => {
            const isSelected = selectedId === service.id;
            return (
              <div
                key={service.id}
                onClick={() => onSelect(service.id)}
                className={`p-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer text-left ${
                  isSelected ? 'bg-primary/5 font-semibold' : 'hover:bg-secondary/40 active:bg-secondary/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary text-white' : 'bg-secondary text-foreground'
                    }`}
                  >
                    {getIcon(service.id)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-foreground truncate">{service.name}</h4>
                    <p className="text-[10.5px] text-muted-foreground truncate">{service.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {showPrices && service.priceMXN && (
                    <span className="text-xs font-black text-foreground block">${service.priceMXN} MXN</span>
                  )}
                  <div
                    className={`size-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary border-primary text-white' : 'border-border/70'
                    }`}
                  >
                    {isSelected && <Check className="size-3 stroke-[3]" />}
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
