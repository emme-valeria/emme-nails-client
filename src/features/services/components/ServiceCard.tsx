import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@emme/ui/button';
import { cn } from '@emme/ui/lib/utils';
import { Calendar, Clock, Sparkle, Layers, Droplets, Brush, Blend, ArrowUpRight } from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import type { Service } from '@/app/AppContext';

export interface ServiceCardProps {
  key?: React.Key;
  service: Service;
  onClick: () => void;
  layoutMode?: 'grid' | 'list';
}

const iconMap: Record<string, React.ElementType> = {
  'Manicura y Cuidado Natural': Sparkle,
  'Extensiones y Estructura': Layers,
  'Pedicura': Droplets,
  'Nail Art y Efectos': Brush,
  'Servicios Complementarios': Blend,
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    filter: 'blur(3px)',
    transition: { duration: 0.15 }
  }
};

export function ServiceCard({ service, onClick, layoutMode = 'grid' }: ServiceCardProps) {
  const navigate = useNavigate();
  const Icon = iconMap[service.category] || Sparkle;

  if (layoutMode === 'list') {
    return (
      <motion.div
        layout
        variants={itemVariants}
        onClick={onClick}
        className={cn(
          "group relative bg-white/70 dark:bg-[#1E1E1E]/60 backdrop-blur-[20px] border border-white/40 dark:border-white/10 hover:border-primary/30 rounded-[24px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_8px_25px_-8px_rgba(0,0,0,0.06)] hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.99]",
          !service.isActive && "opacity-40"
        )}
      >
        <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
          <div className={cn(
            "size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-primary/20",
            service.isActive ? "text-primary" : "text-[#86868B]/40"
          )}>
            <Icon className="size-6 stroke-[2]" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                {service.category}
              </span>
            </div>
            <h3 className="text-base font-display font-bold text-[#1D1D1F] dark:text-white group-hover:text-primary transition-colors truncate">
              {service.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#86868B] font-medium line-clamp-1 leading-relaxed">
              {service.description || "Experiencia exclusiva para resaltar tu belleza natural."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-black/[0.04] dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#86868B] bg-black/[0.04] dark:bg-white/[0.06] px-2.5 py-1 rounded-full">
              <Clock className="size-3.5 text-primary" />
              <span>{service.duration}m</span>
            </span>
            <span className="text-lg sm:text-xl font-display font-extrabold text-[#1D1D1F] dark:text-white tabular-nums">
              ${service.price} <span className="text-xs font-semibold text-[#86868B]">MXN</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              className="min-h-[44px] h-11 px-5 rounded-full bg-primary text-white hover:brightness-105 text-xs font-bold shadow-[0_4px_14px_rgba(224,82,134,0.3)] transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/agenda?add=true&serviceId=${service.id}`);
              }}
            >
              <Calendar className="size-3.5" />
              <span>Agendar</span>
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      variants={itemVariants}
      onClick={onClick}
      className={cn(
        "group relative bg-white/70 dark:bg-[#1E1E1E]/60 backdrop-blur-[20px] border border-white/40 dark:border-white/10 hover:border-primary/30 rounded-[28px] p-5 sm:p-6 flex flex-col justify-between h-full overflow-hidden transition-all duration-300 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer active:scale-[0.98]",
        !service.isActive && "opacity-40"
      )}
    >
      <div className="relative z-10 space-y-4">
        {/* Top Header: Icon & Category */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn(
              "size-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 border border-primary/20",
              service.isActive ? "text-primary" : "text-[#86868B]/40"
            )}>
              <Icon className="size-5.5 stroke-[2]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20 truncate">
              {service.category}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#86868B] bg-black/[0.04] dark:bg-white/[0.06] px-2.5 py-1 rounded-full shrink-0">
            <Clock className="size-3.5 text-primary" />
            <span>{service.duration}m</span>
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-display font-bold tracking-tight text-[#1D1D1F] dark:text-white leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2 min-h-[2.75rem]">
            {service.name}
          </h3>
          <p className="text-xs sm:text-sm text-[#86868B] font-normal line-clamp-2 leading-relaxed">
            {service.description || "Experiencia exclusiva para resaltar tu belleza natural."}
          </p>
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="relative z-10 mt-5 pt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#86868B] block leading-none">Inversión</span>
          <p className="text-lg sm:text-2xl font-display font-extrabold tracking-tight text-[#1D1D1F] dark:text-white tabular-nums leading-tight mt-1">
            ${service.price} <span className="text-xs font-semibold text-[#86868B]">MXN</span>
          </p>
        </div>

        <Button 
          size="sm" 
          className="min-h-[44px] h-11 px-4 sm:px-5 rounded-full bg-primary text-white hover:brightness-105 text-xs font-bold shadow-[0_4px_14px_rgba(224,82,134,0.3)] transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/agenda?add=true&serviceId=${service.id}`);
          }}
        >
          <Calendar className="size-3.5" />
          <span>Agendar</span>
        </Button>
      </div>
    </motion.div>
  );
}

