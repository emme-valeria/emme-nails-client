import React from 'react';
import { MapPin, MessageSquare } from 'lucide-react';
import type { BusinessProfile } from '@/features/profile/domain';

interface StudioProfileCardProps {
  profile: BusinessProfile;
}

export function StudioProfileCard({ profile }: StudioProfileCardProps) {
  return (
    <div className="bg-white border border-black/[0.04] rounded-[32px] p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex items-center gap-3.5">
        <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
          <MapPin className="size-6" />
        </div>
        <div>
          <h3 className="text-lg font-display font-bold text-[#1D1D1F]">{profile.name || 'Emme Studio'}</h3>
          <p className="text-xs text-[#86868B]">Tu salón de belleza asignado</p>
        </div>
      </div>

      <div className="space-y-3 text-xs text-[#86868B] font-medium">
        <div className="p-3.5 rounded-2xl bg-[#FBFBFD] border border-black/[0.03] flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary block">Dirección</span>
            <p className="text-[#1D1D1F] font-bold text-xs truncate">{profile.address || 'Av. Insurgentes Sur 142, CDMX'}</p>
          </div>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address || 'Av. Insurgentes Sur 142, CDMX')}`}
            target="_blank"
            rel="noreferrer"
            className="size-9 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200/50 transition-all active:scale-95"
            title="Abrir en Google Maps"
          >
            <MapPin className="size-4" />
          </a>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FBFBFD] border border-black/[0.03] flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary block">WhatsApp</span>
            <p className="text-[#1D1D1F] font-bold text-xs truncate">{profile.phone || '+52 55 9876 5432'}</p>
          </div>
          <button
            onClick={() => {
              const phoneClean = (profile.phone || '525598765432').replace(/\D/g, '');
              window.open(`https://wa.me/${phoneClean}`, '_blank');
            }}
            className="size-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/50 transition-all active:scale-95"
            title="Escribir por WhatsApp"
          >
            <MessageSquare className="size-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FBFBFD] border border-black/[0.03] flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary block">Instagram</span>
            <p className="text-[#1D1D1F] font-bold text-xs truncate">@{profile.instagram || 'emmestudio.atelier'}</p>
          </div>
          <a 
            href={`https://instagram.com/${(profile.instagram || 'emmestudio.atelier').replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
            className="size-9 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200/50 transition-all active:scale-95"
            title="Ver Instagram"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
