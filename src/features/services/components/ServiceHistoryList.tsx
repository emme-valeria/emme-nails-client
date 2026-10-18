import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, type Appointment, type AppointmentStatus } from '@/app/AppContext';
import { Button } from '@emme/ui/button';
import { Input } from '@emme/ui/input';
import { Badge } from '@emme/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@emme/ui/dialog';
import { cn, parseLocalDate } from '@emme/ui/lib/utils';
import { 
  Search, Filter, Calendar, Clock, DollarSign, User, Sparkles, 
  CheckCircle2, FileText, ChevronRight, MessageSquare, Repeat, 
  Copy, Star, Layers, RefreshCw, CalendarDays, ArrowUpRight, Check, X, Award, Heart,
  ChevronLeft, XCircle
} from 'lucide-react';
import { format, isThisMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

const ITEMS_PER_PAGE = 5;

export function ServiceHistoryList() {
  const navigate = useNavigate();
  const { appointments, clients, services, profile } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDetailApt, setSelectedDetailApt] = useState<Appointment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // We assume current client is Valeria
  const currentClient = clients.find(c => c.isVip) || clients[0];

  // Filter appointments for history list
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const service = services.find(s => s.id === apt.serviceId);
      
      // Search query check
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        service?.name.toLowerCase().includes(query) ||
        service?.category.toLowerCase().includes(query) ||
        apt.notes?.toLowerCase().includes(query) ||
        apt.date.includes(query);

      // Status check
      const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus;

      // Category check
      const matchesCategory = selectedCategory === 'all' || service?.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    }).sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.startTime.localeCompare(a.startTime);
    });
  }, [appointments, services, searchQuery, selectedStatus, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedAppointments = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredAppointments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAppointments, safeCurrentPage]);

  // KPI Calculations for Client
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const totalSpent = completedAppointments.reduce((sum, apt) => {
    const srv = services.find(s => s.id === apt.serviceId);
    return sum + (srv?.price || 0);
  }, 0);

  const averagePrice = completedAppointments.length > 0 
    ? Math.round(totalSpent / completedAppointments.length) 
    : 0;

  const categories = Array.from(new Set(services.map(s => s.category)));

  const handleCopyReceipt = (apt: Appointment) => {
    const client = clients.find(c => c.id === apt.clientId) || currentClient;
    const service = services.find(s => s.id === apt.serviceId);
    const text = `COMPROBANTE DE SERVICIO - ${profile.name || 'EmmeStudio'}\n` +
      `----------------------------------------\n` +
      `Fecha: ${apt.date} (${apt.startTime} hrs)\n` +
      `Clienta: ${client?.name || 'Clienta'}\n` +
      `Servicio: ${service?.name || 'Servicio'}\n` +
      `Duración: ${service?.duration || 60} min\n` +
      `Monto: $${service?.price || 0} MXN\n` +
      `Estado: ${apt.status.toUpperCase()}\n` +
      `----------------------------------------\n` +
      `¡Gracias por tu visita!`;
    
    navigator.clipboard.writeText(text);
    toast.success('Comprobante copiado al portapapeles', {
      icon: <CheckCircle2 className="size-4 text-primary" />
    });
  };

  const handleRebook = (apt: Appointment) => {
    navigate(`/agenda?add=true&serviceId=${apt.serviceId}`);
    toast.info('Redirigiendo a la agenda para programar tu nuevo servicio');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Client Summary Header - Translucent Grouped Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-xs border border-black/[0.05] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Sesiones</span>
            <div className="size-8 sm:size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <CheckCircle2 className="size-4.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-display font-semibold text-[#1D1D1F]">
            {completedAppointments.length} <span className="text-xs font-normal text-[#86868B]">visitas</span>
          </p>
          <p className="text-[11px] text-[#86868B] font-medium truncate">De {appointments.length} citas totales</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-xs border border-black/[0.05] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Inversión</span>
            <div className="size-8 sm:size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <DollarSign className="size-4.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-display font-semibold text-[#1D1D1F]">
            ${totalSpent.toLocaleString('es-MX')}
          </p>
          <p className="text-[11px] text-[#86868B] font-medium truncate">Total acumulado</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-xs border border-black/[0.05] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Promedio</span>
            <div className="size-8 sm:size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Sparkles className="size-4.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-display font-semibold text-[#1D1D1F]">
            ${averagePrice.toLocaleString('es-MX')}
          </p>
          <p className="text-[11px] text-[#86868B] font-medium truncate">Por tratamiento</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-xs border border-black/[0.05] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Nivel VIP</span>
            <div className="size-8 sm:size-9 rounded-xl bg-[#FAF5EC] border border-[#ECDCC2] flex items-center justify-center text-[#C59B4E] shrink-0">
              <Award className="size-4.5" />
            </div>
          </div>
          <p className="text-base sm:text-xl font-display font-semibold text-[#1D1D1F] truncate">
            {currentClient?.isVip ? 'Platinum VIP' : 'Clienta'}
          </p>
          <p className="text-[11px] text-[#86868B] font-medium truncate">Atención prioritaria</p>
        </div>
      </div>

      {/* Control Bar: Search & Filter Chips */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-xs border border-black/[0.05] shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#86868B]" />
            <Input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Buscar por tratamiento, fecha o notas..."
              className="pl-10 h-10 rounded-xl bg-neutral-50 border-black/5 focus:bg-white text-xs font-medium focus-visible:ring-primary"
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#86868B] hover:text-[#1D1D1F] cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="h-10 px-3 rounded-xl bg-neutral-50 border border-black/5 text-xs font-bold text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="all">Todos los Estados</option>
              <option value="completed">Completados</option>
              <option value="confirmed">Confirmados</option>
              <option value="pending">Pendientes</option>
              <option value="cancelled">Cancelados</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="h-10 px-3 rounded-xl bg-neutral-50 border border-black/5 text-xs font-bold text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="all">Todas las Categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Historical List Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg sm:text-xl font-display font-bold text-[#1D1D1F] flex items-center gap-2">
            <span>Visitas & Historial</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-[#86868B]">
              {filteredAppointments.length}
            </span>
          </h3>
          <span className="text-xs font-medium text-[#86868B]">
            Orden cronológico
          </span>
        </div>

        {paginatedAppointments.length > 0 ? (
          <div className="space-y-3">
            {paginatedAppointments.map((apt) => {
              const service = services.find(s => s.id === apt.serviceId);
              const aptDate = parseLocalDate(apt.date);

              const statusBadgeStyles: Record<AppointmentStatus, { bg: string, text: string, label: string, icon: React.ComponentType<{ className?: string }> }> = {
                completed: { bg: 'bg-neutral-100/90 border-black/[0.06]', text: 'text-[#444446]', label: 'Completado', icon: CheckCircle2 },
                confirmed: { bg: 'bg-primary/10 border-primary/20', text: 'text-primary', label: 'Confirmado', icon: Calendar },
                pending: { bg: 'bg-[#FAF5EC] border-[#ECDCC2]', text: 'text-[#845E1B]', label: 'Pendiente', icon: Clock },
                cancelled: { bg: 'bg-rose-50/70 border-rose-200/50', text: 'text-rose-700', label: 'Cancelado', icon: XCircle },
              };
              const statusStyle = statusBadgeStyles[apt.status] || statusBadgeStyles.pending;
              const StatusIcon = statusStyle.icon;

              return (
                <motion.div
                  key={apt.id}
                  whileHover={{ y: -1 }}
                  className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-xs border border-black/[0.05] hover:border-black/[0.1] shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  {/* Left Info */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    {/* Date Indicator */}
                    <div className="shrink-0 text-center px-3 py-2 rounded-2xl bg-neutral-50 border border-black/[0.04] min-w-[54px]">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary block leading-tight">
                        {format(aptDate, 'MMM', { locale: es })}
                      </span>
                      <span className="text-xl font-display font-bold text-[#1D1D1F] leading-none block mt-0.5">
                        {format(aptDate, 'd')}
                      </span>
                      <span className="text-[9px] font-semibold text-[#86868B] block mt-0.5">
                        {apt.startTime}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display font-bold text-sm sm:text-base text-[#1D1D1F] group-hover:text-primary transition-colors truncate">
                          {service?.name || 'Servicio de Manicura'}
                        </h4>
                        <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 border", statusStyle.bg, statusStyle.text)}>
                          <StatusIcon className="size-3" />
                          <span>{statusStyle.label}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-[#86868B] flex-wrap">
                        <span className="text-primary">{service?.category || 'Manicura'}</span>
                        <span className="text-black/20">•</span>
                        <span>{service?.duration || 60} mins</span>
                        {service?.price && (
                          <>
                            <span className="text-black/20">•</span>
                            <span className="font-bold text-[#1D1D1F]">${service.price} MXN</span>
                          </>
                        )}
                      </div>

                      {apt.notes && (
                        <p className="text-[11px] text-[#86868B] line-clamp-1 italic bg-neutral-50 px-2.5 py-1 rounded-lg border border-black/[0.02] mt-1">
                          "{apt.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-black/[0.04]">
                    <Button
                      onClick={() => setSelectedDetailApt(apt)}
                      size="sm"
                      variant="outline"
                      className="h-9 px-3 rounded-xl border-black/10 text-[#1D1D1F] hover:bg-neutral-50 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="size-3.5 text-[#86868B]" />
                      <span>Ficha</span>
                    </Button>

                    <Button
                      onClick={() => handleCopyReceipt(apt)}
                      size="sm"
                      variant="ghost"
                      className="size-9 rounded-xl hover:bg-neutral-100 p-0 text-[#86868B] hover:text-[#1D1D1F] cursor-pointer"
                      title="Copiar comprobante"
                    >
                      <Copy className="size-3.5" />
                    </Button>

                    {apt.status === 'completed' && (
                      <Button
                        onClick={() => handleRebook(apt)}
                        size="sm"
                        className="h-9 px-3.5 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
                      >
                        <Repeat className="size-3.5" />
                        <span>Re-agendar</span>
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center rounded-3xl bg-white/60 border border-black/[0.04] p-8 space-y-3">
            <div className="size-12 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-[#86868B]">
              <CalendarDays className="size-6 opacity-40" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-[#1D1D1F]">Sin registros de servicios en este filtro</h4>
              <p className="text-xs text-[#86868B] mt-0.5 max-w-sm mx-auto">
                No se encontraron tratamientos que coincidan con la búsqueda o filtro activo.
              </p>
            </div>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
                setSelectedCategory('all');
                setCurrentPage(1);
              }}
              variant="outline"
              className="h-9 px-4 rounded-xl text-xs font-bold cursor-pointer"
            >
              Restablecer Filtros
            </Button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1 px-1 text-xs text-[#86868B]">
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

      {/* Service Details Dialog */}
      <Dialog open={!!selectedDetailApt} onOpenChange={(open) => !open && setSelectedDetailApt(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6 space-y-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-display font-bold text-[#1D1D1F]">
              Detalles de tu Servicio
            </DialogTitle>
          </DialogHeader>

          {selectedDetailApt && (() => {
            const service = services.find(s => s.id === selectedDetailApt.serviceId);
            const aptDate = parseLocalDate(selectedDetailApt.date);

            return (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.04] space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#86868B]">Tratamiento Realizado</span>
                  <div>
                    <h5 className="font-display font-bold text-base text-primary">{service?.name}</h5>
                    <p className="text-xs text-[#86868B] mt-0.5 leading-relaxed">{service?.description}</p>
                    <div className="flex items-center justify-between mt-2.5 text-xs font-bold text-[#1D1D1F]">
                      <span>Duración: {service?.duration} mins</span>
                      <span className="text-primary text-sm">${service?.price} MXN</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.04] space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#86868B]">Fecha & Horario de la Visita</span>
                  <p className="text-xs font-bold text-[#1D1D1F] capitalize">
                    {format(aptDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                  <p className="text-xs font-semibold text-primary">
                    Horario: {selectedDetailApt.startTime} - {selectedDetailApt.endTime} hrs
                  </p>
                </div>

                {selectedDetailApt.notes && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF5EC] border border-[#ECDCC2] space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#845E1B]">Notas & Personalización</span>
                    <p className="text-xs text-[#1D1D1F] font-medium leading-relaxed">
                      {selectedDetailApt.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2.5 pt-2">
                  <Button
                    onClick={() => {
                      handleCopyReceipt(selectedDetailApt);
                      setSelectedDetailApt(null);
                    }}
                    variant="outline"
                    className="flex-1 h-10 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    <Copy className="size-3.5 mr-1.5" />
                    Copiar Recibo
                  </Button>
                  <Button
                    onClick={() => {
                      const apt = selectedDetailApt;
                      setSelectedDetailApt(null);
                      handleRebook(apt);
                    }}
                    className="flex-1 h-10 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-xs cursor-pointer"
                  >
                    <Repeat className="size-3.5 mr-1.5" />
                    Re-agendar
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
