import React, { useState } from 'react';
import { Service } from '@/app/AppContext';
import { Clock, Sparkles, ChevronRight, Search } from 'lucide-react';
import { Button } from '@emme/ui/button';
import { Badge } from '@emme/ui/badge';
import { cn } from '@emme/ui/lib/utils';

interface ServiceCatalogChatWidgetProps {
  services: Service[];
  onSelectService: (service: Service) => void;
}

export function ServiceCatalogChatWidget({ services, onSelectService }: ServiceCatalogChatWidgetProps) {
  const categories = Array.from(new Set(services.filter(s => s.isActive).map(s => s.category)));
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = services.filter(s => 
    s.isActive && 
    (selectedCategory === 'Todas' || s.category === selectedCategory) &&
    (searchTerm ? s.name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
  );

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm text-left w-full max-w-md my-1.5">
      {/* Header */}
      <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary shrink-0" />
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1D1D1F]">Catálogo de Tratamientos</h4>
            <p className="text-[10.5px] text-[#86868B]">Precios y duraciones oficiales</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[9.5px] font-bold text-primary border-primary/20 bg-primary/5">
          {filtered.length} Servicios
        </Badge>
      </div>

      {/* Category Horizontal Filter */}
      <div className="px-3 py-2 bg-[#FBFBFD] border-b border-black/[0.04] flex gap-1.5 overflow-x-auto custom-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedCategory('Todas')}
          className={cn(
            "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0 cursor-pointer",
            selectedCategory === 'Todas'
              ? "bg-[#1D1D1F] text-white"
              : "text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.04]"
          )}
        >
          Todas
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0 whitespace-nowrap cursor-pointer",
              selectedCategory === cat
                ? "bg-[#1D1D1F] text-white"
                : "text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.04]"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Containerless Flush Service List with Hairline Dividers */}
      <div className="divide-y divide-black/[0.05] max-h-[280px] overflow-y-auto custom-scrollbar">
        {filtered.map(service => (
          <div
            key={service.id}
            onClick={() => onSelectService(service)}
            className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#F8F8FA] active:bg-[#F2F2F5] transition-colors cursor-pointer group"
          >
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs sm:text-sm text-[#1D1D1F] truncate group-hover:text-primary transition-colors">
                  {service.name}
                </span>
                <span className="text-[9px] font-medium text-[#86868B] bg-black/[0.04] px-1.5 py-0.2 rounded shrink-0">
                  {service.category}
                </span>
              </div>
              {service.description && (
                <p className="text-[11px] text-[#86868B] line-clamp-1">{service.description}</p>
              )}
              <div className="flex items-center gap-2 text-[11px] text-[#86868B] pt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="size-3 text-primary/80" /> {service.duration} min
                </span>
                <span>•</span>
                <span className="font-bold text-[#1D1D1F]">${service.price} MXN</span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1 text-primary font-bold text-xs pl-2">
              <span className="hidden sm:inline">Elegir</span>
              <ChevronRight className="size-4 text-primary group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
