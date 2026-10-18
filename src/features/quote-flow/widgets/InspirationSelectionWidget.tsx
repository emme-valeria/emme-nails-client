import React, { useState, useEffect } from 'react';
import { useQuoteFlow } from '../model/quote-flow.context';
import { CuratedInspirationProvider } from '@/domain/quotes/infrastructure/inspiration/curated-inspiration-provider';
import { DesignInspiration } from '@/domain/quotes/entities/Inspiration';
import { Sparkles, Check, Link, Upload, Heart, Search } from 'lucide-react';
import { Button } from '@emme/ui/button';
import { Input } from '@emme/ui/input';
import { Badge } from '@emme/ui/badge';
import { cn } from '@emme/ui/lib/utils';
import { SegmentedCapsuleTabs } from '@/shared/components/SegmentedCapsuleTabs';

const inspirationProvider = new CuratedInspirationProvider();

export function InspirationSelectionWidget() {
  const { state, dispatch } = useQuoteFlow();
  const [activeTab, setActiveTab] = useState<'salon' | 'curated' | 'external'>('salon');
  const [inspirations, setInspirations] = useState<DesignInspiration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [pastedStatus, setPastedStatus] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const results = await inspirationProvider.searchInspirations({
        source: activeTab === 'salon' ? 'salon_portfolio' : 'emme_curated',
        query: searchQuery,
      });
      setInspirations(results);
    }
    load();
  }, [activeTab, searchQuery]);

  const handleSelectInspiration = (insp: DesignInspiration) => {
    dispatch({ type: 'SELECT_INSPIRATION', payload: insp });
  };

  const handleAddExternalLink = () => {
    if (!externalUrl.trim()) return;
    dispatch({ type: 'ADD_REFERENCE_IMAGE', payload: externalUrl.trim() });
    setPastedStatus('¡Enlace de referencia guardado correctamente!');
    setExternalUrl('');
    setTimeout(() => setPastedStatus(null), 3000);
  };

  return (
    <div className="space-y-4 text-left">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary shrink-0" />
          <h3 className="text-sm font-bold text-[#1D1D1F]">Biblioteca de Inspiración & Portafolio</h3>
        </div>
        <p className="text-[11px] text-[#86868B] mt-0.5">
          Selecciona un diseño real del salón o de nuestra biblioteca curada para sugerir tus atributos de manicura.
        </p>
      </div>

      {/* Segmented Apple-Style Tabs */}
      <SegmentedCapsuleTabs<'salon' | 'curated' | 'external'>
        value={activeTab}
        onChange={(tab) => setActiveTab(tab)}
        layoutId="inspirationSelectionTabPill"
        fullWidth
        size="sm"
        items={[
          { id: 'salon', label: 'Portafolio Salón' },
          { id: 'curated', label: 'Tendencias 2026' },
          { id: 'external', label: 'Pinterest / Foto' },
        ]}
      />

      {/* Search Input for Salon & Curated Tabs */}
      {activeTab !== 'external' && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#86868B]" />
          <Input
            placeholder="Buscar por estilo (Chrome, Aura, Cat-Eye, Francés)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 bg-white border border-black/10 rounded-xl pl-9 text-xs"
          />
        </div>
      )}

      {/* Grid view for portfolio items */}
      {activeTab !== 'external' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {inspirations.map((item) => {
            const isSelected = state.selectedInspiration?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectInspiration(item)}
                className={cn(
                  "group relative rounded-2xl overflow-hidden border transition-all cursor-pointer bg-white",
                  isSelected ? "border-primary ring-2 ring-primary/20 shadow-xs" : "border-black/[0.06] hover:border-black/20"
                )}
              >
                <div className="aspect-square w-full overflow-hidden relative bg-neutral-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {isSelected && (
                    <div className="absolute top-2 right-2 size-6 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                      <Check className="size-3.5 stroke-[3]" />
                    </div>
                  )}
                  {item.source === 'salon_portfolio' && (
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[9px] font-bold backdrop-blur-xs">
                      Real
                    </span>
                  )}
                </div>
                <div className="p-2 space-y-0.5">
                  <h4 className="text-[11px] font-bold text-[#1D1D1F] truncate">{item.title}</h4>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[9.5px] text-[#86868B] bg-black/[0.04] px-1 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* External Link Input Tab (Pinterest / IG) */}
      {activeTab === 'external' && (
        <div className="p-4 rounded-2xl bg-white border border-black/[0.06] space-y-3">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
              <Link className="size-3.5 text-primary" />
              <span>Pegar Enlace de Pinterest o Instagram</span>
            </h4>
            <p className="text-[11px] text-[#86868B]">
              Copia la URL del diseño para vincularla a tu cotización directa.
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="https://pinterest.com/pin/123456789..."
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              className="h-9 bg-white border border-black/10 rounded-xl text-xs flex-1"
            />
            <Button
              type="button"
              onClick={handleAddExternalLink}
              className="shrink-0 h-9 px-3 rounded-xl bg-primary hover:brightness-105 text-white text-xs font-bold cursor-pointer"
            >
              Guardar
            </Button>
          </div>

          {pastedStatus && (
            <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-center">
              {pastedStatus}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
