import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Camera, 
  ShieldCheck, 
  Flame, 
  Layers, 
  Eye, 
  Feather, 
  Footprints, 
  Flower2, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { type Service } from '@/app/AppContext';
import { cn } from '@emme/ui/lib/utils';

interface ExpressBookingWidgetProps {
  services: Service[];
  maxItems?: number;
  showSearch?: boolean;
}

const CATEGORY_TABS = [
  { id: 'todos', label: 'Todos', icon: Sparkles },
  { id: 'uñas', label: 'Uñas', icon: Layers },
  { id: 'pestañas', label: 'Pestañas', icon: Eye },
  { id: 'cejas', label: 'Cejas', icon: Feather },
  { id: 'pedicura', label: 'Pedicura', icon: Footprints },
  { id: 'spa', label: 'Spa', icon: Flower2 },
];

export function ExpressBookingWidget({
  services,
  maxItems = 6,
  showSearch = true,
}: ExpressBookingWidgetProps) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeServices = services.filter((s) => s.isActive);
  
  const filteredServices = activeServices
    .filter((s) => {
      let matchesCat = true;
      if (selectedCategory === 'uñas') {
        matchesCat = s.category.toLowerCase().includes('manicura') || s.category.toLowerCase().includes('extension') || s.category.toLowerCase().includes('uña') || s.category.toLowerCase().includes('art');
      } else if (selectedCategory === 'pestañas') {
        matchesCat = s.category.toLowerCase().includes('pestaña') || s.category.toLowerCase().includes('lash');
      } else if (selectedCategory === 'cejas') {
        matchesCat = s.category.toLowerCase().includes('ceja') || s.category.toLowerCase().includes('brow');
      } else if (selectedCategory === 'pedicura') {
        matchesCat = s.category.toLowerCase().includes('pedi') || s.category.toLowerCase().includes('pie');
      } else if (selectedCategory === 'spa') {
        matchesCat = s.category.toLowerCase().includes('spa') || s.category.toLowerCase().includes('tratam');
      }

      const matchesSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .slice(0, maxItems || undefined);

  const handleServiceSelect = (service: Service) => {
    navigate(`/book/service?serviceId=${service.id}`);
  };

  const getCategoryMeta = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('manicura') || lower.includes('extension') || lower.includes('uña')) {
      return { label: 'Uñas', icon: Layers };
    }
    if (lower.includes('pestaña') || lower.includes('lash')) {
      return { label: 'Pestañas', icon: Eye };
    }
    if (lower.includes('ceja') || lower.includes('brow')) {
      return { label: 'Cejas', icon: Feather };
    }
    if (lower.includes('pedi') || lower.includes('pie')) {
      return { label: 'Pedicura', icon: Footprints };
    }
    return { label: 'Spa', icon: Flower2 };
  };

  return (
    <div className="w-full liquid-glass rounded-[28px] overflow-hidden flex flex-col">
      {/* 1. Category Filter Pills - Clean Lucide Icons */}
      <div className="px-4 py-2.5 border-b border-black/[0.04] dark:border-white/[0.06] overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {CATEGORY_TABS.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'h-8 px-3 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap',
                  isActive
                    ? 'bg-[#1D1D1F] text-white shadow-2xs font-bold'
                    : 'bg-white text-[#636366] hover:text-[#1D1D1F] border border-black/[0.06] hover:bg-neutral-50'
                )}
              >
                <Icon className={cn('size-3.5', isActive ? 'text-white' : 'text-[#86868B]')} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Quick Search (Clean, low visual noise) */}
      {showSearch && (
        <div className="px-4 py-2 bg-white border-b border-black/[0.04]">
          <div className="relative flex items-center">
            <Search className="size-3.5 text-[#86868B] absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar servicio o técnica..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#FAF9F7] border border-black/[0.06] rounded-xl text-xs placeholder:text-[#86868B] focus:outline-hidden focus:ring-1 focus:ring-[#1D1D1F] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-[11px] text-[#86868B] hover:text-[#1D1D1F] font-semibold cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. AI Nail Quote Calculator - Clean & Elegant Spotlight */}
      <div className="px-4 py-3 bg-[#FAF9F7] border-b border-black/[0.06]">
        <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-black/[0.06] shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
              <Camera className="size-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D1D1F] bg-neutral-100 px-1.5 py-0.5 rounded-sm border border-black/10">
                  Cotizador IA
                </span>
                <span className="text-[11px] font-semibold text-[#1D1D1F] truncate">
                  ¿Tienes foto de diseño?
                </span>
              </div>
              <p className="text-[11px] text-[#86868B] truncate mt-0.5">
                Calcula técnica, tiempo y precio exacto en 30s sin esperar respuesta.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/quotes/new')}
            className="h-8 px-3 rounded-lg bg-[#1D1D1F] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="size-3.5 text-amber-300" />
            <span>Cotizar Foto</span>
          </button>
        </div>
      </div>

      {/* 4. Streamlined Service List */}
      <div className="divide-y divide-black/[0.04]">
        {filteredServices.length > 0 ? (
          filteredServices.map((service, idx) => {
            const isPopular = idx === 0 || service.price >= 700;
            const meta = getCategoryMeta(service.category);
            const CatIcon = meta.icon;

            return (
              <div
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className="p-3.5 sm:p-4 hover:bg-[#FAF9F7] active:bg-neutral-100 transition-all cursor-pointer group flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-medium text-[#636366] bg-black/[0.03] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CatIcon className="size-3 text-[#86868B]" />
                      {meta.label}
                    </span>
                    {isPopular && (
                      <span className="text-[10px] font-bold text-[#1D1D1F] bg-neutral-100 px-2 py-0.5 rounded-full flex items-center gap-1 border border-black/10">
                        <Flame className="size-2.5 text-amber-600 fill-amber-600" />
                        Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-[#1D1D1F] group-hover:text-primary transition-colors truncate">
                    {service.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-[#86868B] mt-0.5">
                    <span className="flex items-center gap-1 font-medium text-[#1D1D1F]">
                      <Clock className="size-3 text-[#86868B]" />
                      {service.duration} min
                    </span>
                    {service.description && (
                      <>
                        <span className="text-black/15">•</span>
                        <span className="truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                          {service.description}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-bold text-[#1D1D1F] block">
                      ${service.price} <span className="text-[10px] font-normal text-[#86868B]">MXN</span>
                    </span>
                    <span className="text-[10px] font-semibold text-primary block">
                      Elegir &rarr;
                    </span>
                  </div>

                  <div className="size-7 rounded-full bg-[#FAF9F7] border border-black/[0.06] group-hover:bg-[#1D1D1F] group-hover:text-white group-hover:border-[#1D1D1F] flex items-center justify-center transition-all">
                    <ChevronRight className="size-3.5" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center space-y-2">
            <p className="text-xs font-medium text-[#86868B]">
              No hay servicios en esta categoría con &ldquo;{searchQuery}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todos');
              }}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Mostrar todos los servicios
            </button>
          </div>
        )}
      </div>

      {/* 5. Minimal Footer */}
      <div className="p-3 bg-[#FAF9F7] border-t border-black/[0.04] flex items-center justify-between text-xs text-[#86868B] px-4">
        <span className="flex items-center gap-1.5 text-[11px] font-medium">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          Anticipo 100% deducible el día de tu cita
        </span>
        <button
          type="button"
          onClick={() => navigate('/booking')}
          className="font-semibold text-xs text-[#1D1D1F] hover:text-primary hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>Ver catálogo completo</span>
          <ArrowRight className="size-3" />
        </button>
      </div>
    </div>
  );
}
