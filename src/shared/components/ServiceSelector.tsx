import React, { useState } from 'react';
import { Sparkles, Clock, Check, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';

export interface ServiceOption {
  id: string;
  title: string;
  description: string;
  category: 'base' | 'extension' | 'add_on';
  priceMXN: number;
  durationMinutes: number;
  isDirectBookable: boolean;
  popularTag?: string;
  imageUrl?: string;
}

export const CATALOG_SERVICES: ServiceOption[] = [
  {
    id: 'srv-gel-mani',
    title: 'Manicura Gel Clásica',
    description: 'Limpieza profunda de cutícula, nivelación de uña natural y esmaltado en gel de alta duración.',
    category: 'base',
    priceMXN: 450,
    durationMinutes: 60,
    isDirectBookable: true,
    popularTag: 'Más Reservado',
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'srv-acrylic-set',
    title: 'Set Completo de Acrílico',
    description: 'Estructura en acrílico con tip o escultural, tono nude o color sólido a elección.',
    category: 'extension',
    priceMXN: 750,
    durationMinutes: 105,
    isDirectBookable: true,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'srv-gel-ext',
    title: 'Extensiones Gel-X / Soft Gel',
    description: 'Sistema ligero de tips de gel de cobertura completa con máxima durabilidad y cuidado de uña.',
    category: 'extension',
    priceMXN: 850,
    durationMinutes: 90,
    isDirectBookable: true,
    popularTag: 'Tendencia 2026',
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'srv-french-chrome',
    title: 'Chrome French Signature',
    description: 'Base de gel o acrílico con punta francesa efecto espejo chrome o perlado.',
    category: 'base',
    priceMXN: 850,
    durationMinutes: 105,
    isDirectBookable: true,
    popularTag: 'Trending',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'srv-removal',
    title: 'Retiro Seguro de Gel/Acrílico',
    description: 'Retiro cuidadoso sin dañar la lámina ungueal con tratamiento de hidratación de cutícula.',
    category: 'add_on',
    priceMXN: 150,
    durationMinutes: 30,
    isDirectBookable: true,
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'srv-repair',
    title: 'Reparación de Uña Individual',
    description: 'Reconstrucción de uña rota o estrellada.',
    category: 'add_on',
    priceMXN: 80,
    durationMinutes: 20,
    isDirectBookable: true,
  },
];

interface ServiceSelectorProps {
  selectedServiceId?: string;
  onSelectService: (service: ServiceOption) => void;
  showCustomDesignOption?: boolean;
  onSelectCustomDesign?: () => void;
  defaultLayout?: 'sliding' | 'grid' | 'list';
}

export function ServiceSelector({
  selectedServiceId,
  onSelectService,
  showCustomDesignOption = true,
  onSelectCustomDesign,
  defaultLayout = 'grid',
}: ServiceSelectorProps) {
  const [layoutMode, setLayoutMode] = useState<'sliding' | 'grid' | 'list'>(defaultLayout);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header with Visual Layout Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-2">
        <div className="space-y-0.5">
          <label className="text-xs font-black text-foreground uppercase tracking-wider block">
            Servicio / Técnica Principal
          </label>
          <p className="text-[11px] text-muted-foreground hidden sm:block">
            Elige el tipo de aplicación que deseas agendar
          </p>
        </div>

        {/* Layout Switcher: Deslizable | Cuadrícula | Lista */}
        <div className="flex items-center bg-secondary/80 p-0.5 rounded-lg border border-border/60 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setLayoutMode('sliding')}
            className={cn(
              "px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              layoutMode === 'sliding'
                ? "bg-card text-foreground shadow-2xs font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Vista Deslizable"
          >
            <SlidersHorizontal className="size-3.5" />
            <span className="hidden xs:inline">Deslizable</span>
          </button>
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

      {/* Sliding Mode */}
      {layoutMode === 'sliding' ? (
        <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
          {CATALOG_SERVICES.map((srv) => {
            const isSelected = selectedServiceId === srv.id;
            return (
              <button
                key={srv.id}
                onClick={() => onSelectService(srv)}
                className={cn(
                  "snap-start shrink-0 w-[260px] p-4 rounded-3xl text-left border-2 transition-all cursor-pointer relative flex flex-col justify-between group",
                  isSelected
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-white border-black/[0.04] hover:border-primary/30"
                )}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    {srv.popularTag ? (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full uppercase tracking-widest">
                        {srv.popularTag}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-secondary/80 text-foreground px-2 py-1 rounded-full uppercase tracking-widest">
                        {srv.category}
                      </span>
                    )}
                    <span className="text-sm font-black text-primary">
                      ${srv.priceMXN}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold text-foreground leading-tight">{srv.title}</h3>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                      {srv.description}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold">
                    <Clock className="size-3" />
                    {srv.durationMinutes} min
                  </div>
                  <div className={cn(
                    "size-5 rounded-full border-2 flex items-center justify-center transition-all",
                    isSelected ? "bg-primary border-primary text-white" : "border-black/10 group-hover:border-primary/40"
                  )}>
                    {isSelected && <Check className="size-3 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
          
          {showCustomDesignOption && (
            <button
              onClick={onSelectCustomDesign}
              className="snap-start shrink-0 w-[260px] p-4 rounded-3xl bg-[#F8F8FA] border-2 border-dashed border-black/10 hover:border-primary/40 text-left transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="text-[13px] font-bold text-foreground leading-tight">Foto Inspiración</h3>
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  Sube una foto y nuestro sistema AI cotizará el servicio exacto
                </p>
              </div>
              <div className="mt-4 text-[11px] font-bold text-primary group-hover:underline">
                Cotizar con foto &rarr;
              </div>
            </button>
          )}
        </div>
      ) : layoutMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {CATALOG_SERVICES.map((srv) => {
            const isSelected = selectedServiceId === srv.id;
            return (
              <button
                key={srv.id}
                type="button"
                onClick={() => onSelectService(srv)}
                className={cn(
                  "group relative p-3.5 sm:p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer active:scale-[0.99] bg-card",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                    : "border-border/70 hover:border-primary/40 hover:bg-secondary/40"
                )}
              >
                <div className="space-y-2 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Sparkles className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-extrabold text-foreground tracking-tight truncate">
                          {srv.title}
                        </h4>
                        {srv.popularTag && (
                          <span className="inline-block px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-black uppercase mt-0.5">
                            {srv.popularTag}
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={cn(
                        "size-5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "border-border/70 bg-transparent"
                      )}
                    >
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40 w-full text-xs">
                  <span className="font-black text-foreground text-xs sm:text-sm">
                    ${srv.priceMXN} MXN
                  </span>
                  <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 bg-secondary/80 px-2 py-0.5 rounded-full">
                    <Clock className="size-3 text-muted-foreground" />
                    {srv.durationMinutes} min
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* List Mode */
        <div className="divide-y divide-border/60 border border-border/70 rounded-2xl overflow-hidden bg-card">
          {CATALOG_SERVICES.map((srv) => {
            const isSelected = selectedServiceId === srv.id;
            return (
              <div
                key={srv.id}
                onClick={() => onSelectService(srv)}
                className={cn(
                  "p-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer text-left",
                  isSelected ? "bg-primary/5 font-semibold" : "hover:bg-secondary/40 active:bg-secondary/60"
                )}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-foreground truncate">{srv.title}</h4>
                      {srv.popularTag && (
                        <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-black uppercase shrink-0">
                          {srv.popularTag}
                        </span>
                      )}
                    </div>
                    <p className="text-[10.5px] text-muted-foreground truncate">{srv.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-black text-foreground block">${srv.priceMXN} MXN</span>
                    <span className="text-[10px] text-muted-foreground font-bold flex items-center justify-end gap-1">
                      <Clock className="size-2.5" />
                      {srv.durationMinutes} min
                    </span>
                  </div>
                  <div
                    className={cn(
                      "size-5 rounded-full border flex items-center justify-center shrink-0",
                      isSelected ? "bg-primary border-primary text-white" : "border-border/70"
                    )}
                  >
                    {isSelected && <Check className="size-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCustomDesignOption && onSelectCustomDesign && (
        <div
          onClick={onSelectCustomDesign}
          className="p-3 sm:p-4 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer text-center space-y-1"
        >
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-primary font-black text-xs">
            <Sparkles className="size-3.5 sm:size-4" />
            <span>¿Buscas un diseño a mano alzada o personalizado?</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Solicita una cotización personalizada con foto de referencia y cálculo automático.
          </p>
        </div>
      )}
    </div>
  );
}
