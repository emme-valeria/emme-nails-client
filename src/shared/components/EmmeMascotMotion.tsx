import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export type MascotMood = 'idle' | 'peeking' | 'excited' | 'celebrating' | 'thinking';

interface EmmeMascotMotionProps {
  mood?: MascotMood;
  size?: number | string;
  className?: string;
  showPawsOnLedge?: boolean;
}

/** Mascota oficial de Emme, con movimiento sutil según el momento del flujo. */
export const EmmeMascotMotion: React.FC<EmmeMascotMotionProps> = ({
  mood = 'idle',
  size = 140,
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const motionProps = prefersReducedMotion
    ? { animate: { opacity: 1 } }
    : {
        animate: mood === 'celebrating'
          ? { y: [0, -10, 0], rotate: [-2, 2, -2], scale: [1, 1.035, 1] }
          : mood === 'excited'
            ? { y: [0, -6, 0], scale: [1, 1.025, 1] }
            : mood === 'thinking'
              ? { rotate: [-2, 2, -2] }
              : { y: [0, -4, 0] },
        transition: {
          repeat: Infinity,
          duration: mood === 'celebrating' ? 1.1 : mood === 'excited' ? 1.6 : 3,
          ease: 'easeInOut' as const,
        },
      };

  return (
    <motion.div
      className={`pointer-events-none flex shrink-0 items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      initial={prefersReducedMotion ? false : { scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <motion.img
        src="/rabbit.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="h-full w-full object-contain"
        {...motionProps}
      />
    </motion.div>
  );
};
