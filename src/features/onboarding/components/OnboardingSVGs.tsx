import React from 'react';
import { NailLengthSVG } from '@/shared/components/NailLengthSVG';

// Custom Crisp Vector Graphics for EMME Studio Onboarding (Ahead & Luma App Inspired)

export function LashStyleSVG({ type, className = "size-8" }: { type: string; className?: string }) {
  const norm = type.toLowerCase();
  if (norm.includes('foxy') || norm.includes('cat')) {
    return (
      <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M4 16C12 7 32 6 44 9C34 22 14 23 4 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M28 8C33 3 39 2 44 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M33 10C39 6 44 6 46 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M22 9C26 5 30 5 34 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 11C19 8 23 8 26 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="25" cy="15" r="4.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    );
  }

  if (norm.includes('classic') || norm.includes('clásic') || norm.includes('1:1')) {
    return (
      <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M6 16C14 8 34 8 42 16C34 24 14 24 6 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 12C13 6 15 3 17 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M20 10C20 4 23 2 25 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M27 10C28 4 31 3 33 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M34 12C36 7 39 6 41 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="24" cy="16" r="4.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    );
  }

  if (norm.includes('volume') || norm.includes('volumen') || norm.includes('híbrid')) {
    return (
      <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M6 16C14 8 34 8 42 16C34 24 14 24 6 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M15 11C13 5 15 2 18 1M18 11C17 4 21 2 23 1M21 11C21 3 26 2 28 2M27 11C28 4 33 3 35 3M32 11C35 5 39 4 41 5M36 13C40 8 44 8 45 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="16" r="5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    );
  }

  // Lash Lift
  return (
    <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 18C14 10 34 10 42 18C34 24 14 24 6 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M14 14C14 7 18 4 22 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 12C23 5 28 3 32 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M30 13C33 7 38 6 41 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M10 24C16 28 32 28 38 24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
    </svg>
  );
}

export function ServiceCategorySVG({ category, className = "size-8" }: { category: string; className?: string }) {
  const norm = category.toLowerCase();
  
  if (norm.includes('nail') || norm.includes('uña') || norm.includes('manicura') || norm.includes('extension')) {
    return (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Sleek luxury nail polish bottle */}
        <rect x="11" y="4" width="10" height="7" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="8" y="11" width="16" height="17" rx="4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.6"/>
        {/* Polish drop / sparkle */}
        <circle cx="16" cy="19" r="2.5" fill="currentColor"/>
        <path d="M19.5 8.5L20.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }

  if (norm.includes('lash') || norm.includes('pestaña') || norm.includes('mirada') || norm.includes('brow')) {
    return (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Curled Lash & Brow Silhouette */}
        <path d="M6 18C12 11 20 11 26 18C20 23 12 23 6 18Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="16" cy="17.5" r="3.2" fill="currentColor"/>
        {/* Individual curled lashes */}
        <path d="M10 13C10 8 13 6 15 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M16 12C17 7 20 6 22 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M22 13.5C24 9 27 8 28 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    );
  }

  if (norm.includes('pedi') || norm.includes('pie') || norm.includes('spa')) {
    return (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Spa bowl & floating lotus petals */}
        <path d="M5 16C5 23 10 26 16 26C22 26 27 23 27 16H5Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M16 8C13 11 13 14 16 15C19 14 19 11 16 8Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M11 11C11 13 13 14 15 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M21 11C21 13 19 14 17 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        {/* Water surface line */}
        <path d="M3 16H29" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    );
  }

  // Natural care / Selfcare botanical serum & gentle touch
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16 4C16 4 9 13 9 19C9 23 12 26 16 26C20 26 23 23 23 19C23 13 16 4 16 4Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M16 11V22M16 17C14 15 12 16 12 18M16 19C18 17 20 18 20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function LengthIndicatorSVG({ lengthId, className = "w-12 h-10" }: { lengthId: string; className?: string }) {
  return (
    <NailLengthSVG length={lengthId} className={className} compact={true} />
  );
}
