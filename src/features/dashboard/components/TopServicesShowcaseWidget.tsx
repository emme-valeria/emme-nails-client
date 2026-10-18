import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@emme/ui/badge';
import { Button } from '@emme/ui/button';
import { Sparkles, Calendar, Clock, Star, ArrowRight, Check, Layers, Eye, Feather } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import type { Service } from '@/app/AppContext';

interface TopServicesShowcaseWidgetProps {
  services: Service[];
}

export function TopServicesShowcaseWidget({ services }: TopServicesShowcaseWidgetProps) {
  const navigate = useNavigate();

  // Select top featured services across categories
  const featuredServices = [
    {
      id: 'top-1',
      serviceId: 'structured-gel',
      name: 'Manicura Rusa con Base Rubber',
      category: 'Uñas & Manicura',
      categoryIcon: Layers,
      price: 520,
      duration: 60,
      rating: 4.95,
      reviewsCount: 210,
      badge: 'Top Popular',
      badgeColor: 'bg-neutral-100 text-[#1D1D1F] border-black/10',
      description: 'Limpieza profunda con torno y tijera, nivelación de uña natural y máxima resistencia sin extensiones.',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80',
      tags: ['Sin Daño', 'Duración 4 Semanas']
    },
    {
      id: 'top-2',
      serviceId: 'gel-x-extensions',
      name: 'Extensiones Soft Gel (Gel-X)',
      category: 'Extensiones',
      categoryIcon: Layers,
      price: 850,
      duration: 90,
      rating: 4.92,
      reviewsCount: 148,
      badge: 'Tendencia Top',
      badgeColor: 'bg-neutral-100 text-[#1D1D1F] border-black/10',
      description: 'Extensiones completas ultralivianas de gel con forma estilizada inmediata y acabado de lujo.',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80',
      tags: ['Ligeras', 'Sin Monómero']
    },
    {
      id: 'top-3',
      serviceId: 'lashes-volume-natural',
      name: 'Extensiones de Pestañas (1 a 1)',
      category: 'Pestañas',
      categoryIcon: Eye,
      price: 750,
      duration: 80,
      rating: 4.89,
      reviewsCount: 94,
      badge: 'Mirada Impactante',
      badgeColor: 'bg-neutral-100 text-[#1D1D1F] border-black/10',
      description: 'Efecto rímel natural pelo a pelo con fibras de seda hipoalergénicas que despiertan tu mirada.',
      image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=600&auto=format&fit=crop&q=80',
      tags: ['Seda Hipoalergénica', 'Fibras Livianas']
    },
    {
      id: 'top-4',
      serviceId: 'brows-lamination-keratin',
      name: 'Laminado de Cejas con Keratina',
      category: 'Cejas',
      categoryIcon: Feather,
      price: 480,
      duration: 45,
      rating: 4.98,
      reviewsCount: 112,
      badge: 'Efecto Fluffy',
      badgeColor: 'bg-neutral-100 text-[#1D1D1F] border-black/10',
      description: 'Fijación direccional de cejas con botox de keratina, perfilado con hilo y tinte híbrido.',
      image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&auto=format&fit=crop&q=80',
      tags: ['Cejas Pobladas', 'Incluye Perfilado']
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              Menú de Servicios Destacados
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-[#1D1D1F] tracking-tight mt-0.5">
            Tratamientos Estrella
          </h2>
          <p className="text-xs sm:text-sm text-[#86868B] font-medium">
            Uñas, cejas y pestañas realizadas por especialistas certificadas
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate('/services')}
          className="self-start sm:self-auto h-9 sm:h-10 px-4 rounded-xl text-xs font-bold border-black/10 hover:bg-neutral-50 text-[#1D1D1F] flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <span>Ver Todo el Menú</span>
          <ArrowRight className="size-3" />
        </Button>
      </div>

      {/* Services Showcase Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {featuredServices.map((service) => {
          const CatIcon = service.categoryIcon;
          return (
            <div
              key={service.id}
              className="rounded-2xl sm:rounded-3xl liquid-glass liquid-glass-interactive p-3 sm:p-3.5 space-y-2.5 flex flex-col justify-between transition-all duration-300 group cursor-pointer"
              onClick={() => navigate(`/book/service?serviceId=${service.serviceId}`)}
            >
              <div className="space-y-2.5">
                {/* Image Container with Badges */}
                <div className="relative h-36 sm:h-44 rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-100">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

                  {/* Top Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className={cn("text-[9px] font-extrabold uppercase tracking-wider backdrop-blur-md px-2 py-0.5 border shadow-2xs", service.badgeColor)}>
                      {service.badge}
                    </Badge>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2 z-10 bg-black/40 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5 border border-white/20">
                    <Star className="size-2.5 fill-amber-400 text-amber-400" />
                    <span>{service.rating}</span>
                  </div>

                  {/* Price tag on image */}
                  <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between text-white">
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-90 truncate max-w-[120px] flex items-center gap-1">
                      <CatIcon className="size-2.5" />
                      {service.category}
                    </span>
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-display font-extrabold drop-shadow-md">
                        ${service.price} <span className="text-[10px] font-normal">MXN</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-0.5 px-0.5">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-[#1D1D1F] group-hover:text-primary transition-colors line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="text-[11px] text-[#86868B] line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-1 px-0.5">
                  {service.tags.map((tag, i) => (
                    <span key={i} className="text-[9px] font-semibold text-[#1D1D1F]/80 bg-neutral-100 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                      <Check className="size-2.5 text-emerald-600 shrink-0" /> {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between gap-2 px-0.5">
                <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider flex items-center gap-1">
                  <Clock className="size-3 text-primary" /> {service.duration} mins
                </span>

                <Button
                  size="sm"
                  className="h-8 px-3 rounded-xl bg-[#1D1D1F] hover:bg-black text-white text-xs font-bold shadow-2xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/book/service?serviceId=${service.serviceId}`);
                  }}
                >
                  <Calendar className="size-3" />
                  <span>Agendar</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
