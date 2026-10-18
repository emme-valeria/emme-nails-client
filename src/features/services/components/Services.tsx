import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp, type Service } from '@/app/AppContext';
import { Button } from '@emme/ui/button';
import { cn } from '@emme/ui/lib/utils';
import { Calendar, Briefcase, ChevronLeft, ChevronRight, Layers, History, Sparkles } from 'lucide-react';
import { ServiceHistoryList } from './ServiceHistoryList';
import { ServiceToolbar } from './ServiceToolbar';
import { ServiceCard } from './ServiceCard';
import { ServiceDetailsDialog } from './ServiceDetailsDialog';
import { TopServicesShowcaseWidget } from '@/features/dashboard/components/TopServicesShowcaseWidget';
import { SegmentedCapsuleTabs } from '@/shared/components/SegmentedCapsuleTabs';
import { motion, AnimatePresence } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

export function Services() {
  const navigate = useNavigate();
  const { services } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [mainTab, setMainTab] = useState<'top' | 'catalog' | 'history'>(() => {
    const tabParam = searchParams.get('tab');
    const catParam = searchParams.get('cat');
    if (catParam || tabParam === 'catalog' || tabParam === 'todos') return 'catalog';
    if (tabParam === 'history' || tabParam === 'historial') return 'history';
    return 'top';
  });

  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [selectedServiceForDetails, setSelectedServiceForDetails] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = Array.from(new Set(services.map(s => s.category))) as string[];

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const catParam = searchParams.get('cat')?.toLowerCase();
    if (catParam) {
      if (catParam.includes('mani')) {
        const found = services.find(s => s.category.toLowerCase().includes('mani'));
        if (found) return found.category;
      } else if (catParam.includes('pedi')) {
        const found = services.find(s => s.category.toLowerCase().includes('pedi'));
        if (found) return found.category;
      } else if (catParam.includes('lash') || catParam.includes('ceja')) {
        const found = services.find(s => s.category.toLowerCase().includes('lash') || s.category.toLowerCase().includes('ceja') || s.category.toLowerCase().includes('mirada'));
        if (found) return found.category;
      }
    }
    return 'Todas';
  });

  useEffect(() => {
    const catParam = searchParams.get('cat')?.toLowerCase();
    const tabParam = searchParams.get('tab');
    if (catParam) {
      setMainTab('catalog');
      if (catParam.includes('mani')) {
        const found = services.find(s => s.category.toLowerCase().includes('mani'));
        if (found) setSelectedCategory(found.category);
      } else if (catParam.includes('pedi')) {
        const found = services.find(s => s.category.toLowerCase().includes('pedi'));
        if (found) setSelectedCategory(found.category);
      } else if (catParam.includes('lash') || catParam.includes('ceja')) {
        const found = services.find(s => s.category.toLowerCase().includes('lash') || s.category.toLowerCase().includes('ceja') || s.category.toLowerCase().includes('mirada'));
        if (found) setSelectedCategory(found.category);
      }
    } else if (tabParam === 'catalog' || tabParam === 'todos') {
      setMainTab('catalog');
    } else if (tabParam === 'history' || tabParam === 'historial') {
      setMainTab('history');
    } else if (tabParam === 'top') {
      setMainTab('top');
    }
  }, [searchParams, services]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = layoutMode === 'list' ? 10 : 8;

  const filteredServices = services.filter((service: Service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         service.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedServices = filteredServices.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, layoutMode]);

  const activeCount = services.filter(s => s.isActive).length;

  return (
    <div className="space-y-5 sm:space-y-7 animate-in fade-in duration-500 w-full mx-auto pb-12">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pt-1">
        <div className="space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            {mainTab === 'history' 
              ? 'Historial de Atenciones' 
              : mainTab === 'top' 
              ? 'Los Más Solicitados' 
              : 'Menú Completo de Tratamientos'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight text-[#1D1D1F] leading-tight flex items-center gap-2.5">
            {mainTab === 'history' ? (
              <History className="size-6 sm:size-8 text-primary shrink-0" />
            ) : mainTab === 'top' ? (
              <Sparkles className="size-6 sm:size-8 text-primary shrink-0" />
            ) : (
              <Briefcase className="size-6 sm:size-8 text-primary shrink-0" />
            )}
            <span>
              {mainTab === 'history' 
                ? 'Mis Servicios' 
                : mainTab === 'top' 
                ? 'Tratamientos Estrella' 
                : 'Catálogo Studio'}
            </span>
          </h2>
          <p className="text-[#86868B] text-xs sm:text-sm font-medium">
            {mainTab === 'history' 
              ? 'Consulta el registro de tus atenciones anteriores y recibos digitalizados' 
              : mainTab === 'top'
              ? 'Nuestras técnicas y acabados favoritos elegidos por las clientas VIP'
              : `${activeCount} tratamientos de manicure, gel y cuidado disponibles`
            }
          </p>
        </div>

        <Button
          type="button"
          onClick={() => navigate('/agenda?add=true')}
          className="h-9 sm:h-10 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-primary text-white hover:brightness-105 font-bold text-xs shadow-2xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Calendar className="size-3.5" />
          <span>Agendar Cita</span>
        </Button>
      </div>

      {/* Top Submenu / Apple iOS Segmented Navigation Bar */}
      <SegmentedCapsuleTabs<'top' | 'catalog' | 'history'>
        value={mainTab}
        onChange={(tab) => setMainTab(tab)}
        layoutId="servicesTabPill"
        fullWidth
        containerClassName="max-w-xl"
        items={[
          { id: 'top', label: 'Top Servicios', icon: Sparkles },
          { id: 'catalog', label: `Catálogo (${activeCount})`, icon: Layers },
          { id: 'history', label: 'Historial', icon: History },
        ]}
      />

      {mainTab === 'history' && (
        <ServiceHistoryList />
      )}

      {mainTab === 'top' && (
        <div className="max-w-6xl mx-auto">
          <TopServicesShowcaseWidget services={services} />
        </div>
      )}

      {mainTab === 'catalog' && (
        <>
          {/* Service Search & Filter Toolbar */}
          <ServiceToolbar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            layoutMode={layoutMode}
            onLayoutModeChange={setLayoutMode}
            totalCount={services.length}
          />

          <AnimatePresence mode="wait">
            <motion.div 
              key={`${selectedCategory}-${safeCurrentPage}-${searchQuery}-${layoutMode}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={cn(
                "pt-1",
                layoutMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 items-stretch"
                  : "space-y-2.5"
              )}
            >
              {paginatedServices.map((service) => (
                <ServiceCard 
                  key={service.id}
                  service={service}
                  layoutMode={layoutMode}
                  onClick={() => setSelectedServiceForDetails(service)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 px-1 text-xs text-[#86868B]">
              <span className="font-medium">
                Página <strong className="text-[#1D1D1F]">{safeCurrentPage}</strong> de <strong className="text-[#1D1D1F]">{totalPages}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={safeCurrentPage <= 1}
                  className="h-8 px-2.5 rounded-lg border-black/10 text-xs font-bold cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="size-3.5 mr-0.5" />
                  Anterior
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "size-8 rounded-lg text-xs font-bold transition-all cursor-pointer hidden sm:inline-flex items-center justify-center",
                      pageNum === safeCurrentPage
                        ? "bg-primary text-white shadow-2xs"
                        : "bg-white border border-black/[0.06] text-[#1D1D1F] hover:bg-neutral-50"
                    )}
                  >
                    {pageNum}
                  </button>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={safeCurrentPage >= totalPages}
                  className="h-8 px-2.5 rounded-lg border-black/10 text-xs font-bold cursor-pointer disabled:opacity-40"
                >
                  Siguiente
                  <ChevronRight className="size-3.5 ml-0.5" />
                </Button>
              </div>
            </div>
          )}

          {filteredServices.length === 0 && (
            <div className="py-12 text-center bg-white/70 backdrop-blur-xs rounded-3xl border border-black/[0.04] my-4 p-8 space-y-2">
              <div className="size-12 rounded-2xl mx-auto flex items-center justify-center bg-neutral-100 text-neutral-400">
                <Briefcase className="size-6" />
              </div>
              <h3 className="text-base font-display font-semibold text-[#1D1D1F]">No se encontraron servicios</h3>
              <p className="text-xs text-[#86868B] max-w-sm mx-auto">
                Prueba buscar con otro término o selecciona otra categoría.
              </p>
            </div>
          )}

          {/* Service Details Dialog */}
          <ServiceDetailsDialog 
            service={selectedServiceForDetails}
            onClose={() => setSelectedServiceForDetails(null)}
          />
        </>
      )}
    </div>
  );
}
