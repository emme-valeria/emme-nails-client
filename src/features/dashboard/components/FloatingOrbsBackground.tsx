import React from 'react';

interface FloatingOrbsBackgroundProps {
  className?: string;
}

export function FloatingOrbsBackground({ className = '' }: FloatingOrbsBackgroundProps) {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Base Canvas */}
      <div className="absolute inset-0 bg-[#FBFBFD] dark:bg-black" />
    </div>
  );
}

export default FloatingOrbsBackground;
