import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, RefreshCw } from 'lucide-react';

interface AppStartupSplashProps {
  isOffline?: boolean;
  onRetry?: () => void;
  onAnimationComplete?: () => void;
}

/**
 * Animated Splash Screen inspired by the Lemonade App onboarding flow:
 * 1. Vivid brand pink canvas (#FF007A / #E05286).
 * 2. Cursive script logo typing/flowing onto the screen from left to right.
 * 3. Animated liquid wave curtain rising smoothly from bottom to top with fluid wave crests.
 * 4. Crisp reveal of the bright white canvas with floating sparkling bubbles.
 * 5. Elegant brand logo transition into soft graphite.
 * 6. Smooth rounded loading pill indicator with sweeping gradient sheen.
 * 7. Seamless fade transition directly into the application onboarding/login.
 */
export function AppStartupSplash({ isOffline, onRetry, onAnimationComplete }: AppStartupSplashProps) {
  // Animation stage:
  // 1: initial text write-in on pink
  // 2: wave sweeps up
  // 3: white screen with logo & progress bar
  // 4: exit fade
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Stage 1 -> 2: Text has written in, start wave rise after 1.1s
    const t1 = setTimeout(() => {
      setStage(2);
    }, 1200);

    // Stage 2 -> 3: Wave finishes rising, show loading progress bar
    const t2 = setTimeout(() => {
      setStage(3);
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Animate progress bar during stage 3
  useEffect(() => {
    if (stage === 3) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setStage(4);
              onAnimationComplete?.();
            }, 300);
            return 100;
          }
          return prev + 6;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [stage, onAnimationComplete]);

  return (
    <AnimatePresence>
      {stage !== 4 && (
        <motion.div
          key="splash-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] overflow-hidden select-none touch-none flex flex-col items-center justify-center bg-[#FF007A]"
          style={{
            fontFamily: "'Pacifico', 'Playfair Display', cursive, sans-serif",
          }}
        >
          {/* Status Bar safe area mock for mobile-like feel */}
          <div className="absolute top-0 inset-x-0 h-10 flex items-center justify-between px-6 z-50 text-white/80 pointer-events-none text-xs font-sans font-medium tracking-tight">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold">5G</span>
              <div className="w-5 h-2.5 rounded-sm border border-current p-0.5 flex items-center">
                <div className="h-full bg-current rounded-xs w-3/4" />
              </div>
            </div>
          </div>

          {/* BACKGROUND LAYER 1: Full Vivid Pink Stage */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FF007A] via-[#FF007A] to-[#E6006E] z-0" />

          {/* STAGE 1: White script logo written on Pink */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Elegant Brand Reveal with font-display matching HomeScreen */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative flex flex-col items-center"
            >
              <div className="relative overflow-hidden px-4 py-2">
                <motion.div
                  initial={{ clipPath: 'inset(0 100% 0 0)' }}
                  animate={{ clipPath: 'inset(0 0% 0 0)' }}
                  transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex flex-col items-center"
                >
                  <h1 className="text-5xl sm:text-6xl font-display tracking-tight font-extrabold flex items-center leading-none">
                    <span className="text-white mr-1.5 drop-shadow-sm">emme</span>
                    <span className="text-white/95 font-medium drop-shadow-sm">studio</span>
                  </h1>
                  <p className="text-xs tracking-[0.25em] uppercase text-white/90 font-medium mt-2 font-display">
                    Nails & Beauty Lounge
                  </p>
                </motion.div>
              </div>

              {/* Trailing sparkly dot that leads the reveal */}
              <motion.div
                initial={{ left: '10%', opacity: 0 }}
                animate={{
                  left: ['10%', '90%'],
                  opacity: [0, 1, 1, 0],
                  scale: [0.8, 1.3, 1, 0.5],
                }}
                transition={{ duration: 1.15, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
              >
                <div className="size-3.5 rounded-full bg-white shadow-lg shadow-white/60 blur-[0.5px]" />
              </motion.div>
            </motion.div>
          </div>

          {/* STAGE 2: Liquid Wave Curtain that rises from bottom to top */}
          <motion.div
            initial={{ y: '105%' }}
            animate={{
              y: stage >= 2 ? '-5%' : '105%',
            }}
            transition={{
              duration: 1.25,
              ease: [0.4, 0.0, 0.2, 1], // fluid cubic-bezier curve
            }}
            className="absolute inset-0 z-20 flex flex-col pointer-events-none"
          >
            {/* Flowing Organic Liquid SVG Wave Crests */}
            <div className="w-full relative shrink-0 -mb-[1px]">
              {/* Layer 1: Semi-transparent secondary pink froth wave */}
              <svg
                viewBox="0 0 1440 180"
                className="w-full h-16 sm:h-24 fill-white/40 block overflow-visible -mb-10 sm:-mb-14"
                preserveAspectRatio="none"
              >
                <motion.path
                  animate={{
                    d: [
                      'M0,60 C320,130 520,10 820,70 C1120,130 1320,30 1440,70 L1440,180 L0,180 Z',
                      'M0,70 C280,20 600,120 900,40 C1180,100 1340,50 1440,60 L1440,180 L0,180 Z',
                      'M0,60 C320,130 520,10 820,70 C1120,130 1320,30 1440,70 L1440,180 L0,180 Z',
                    ],
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </svg>

              {/* Layer 2: Pure White Solid Wave Surface */}
              <svg
                viewBox="0 0 1440 180"
                className="w-full h-16 sm:h-24 fill-white block overflow-visible drop-shadow-[0_-8px_16px_rgba(255,0,122,0.15)]"
                preserveAspectRatio="none"
              >
                <motion.path
                  animate={{
                    d: [
                      'M0,70 C360,10 680,110 1020,40 C1240,0 1360,70 1440,50 L1440,180 L0,180 Z',
                      'M0,40 C340,90 680,20 1000,80 C1240,40 1380,10 1440,50 L1440,180 L0,180 Z',
                      'M0,70 C360,10 680,110 1020,40 C1240,0 1360,70 1440,50 L1440,180 L0,180 Z',
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </svg>
            </div>

            {/* Solid White Body Covering the Full Screen */}
            <div className="flex-1 w-full bg-white relative flex flex-col items-center justify-center shadow-2xl">
              {/* Floating Pink Effervescent Bubbles (Identical to Lemonade video) */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[
                  { size: 14, left: '18%', delay: 0.1, duration: 2.2, color: '#FF007A' },
                  { size: 9, left: '28%', delay: 0.4, duration: 2.5, color: '#FF6EA7' },
                  { size: 18, left: '76%', delay: 0.2, duration: 2.8, color: '#FF007A' },
                  { size: 7, left: '68%', delay: 0.6, duration: 2.1, color: '#FF007A' },
                  { size: 12, left: '84%', delay: 0.3, duration: 2.4, color: '#FF8BB6' },
                  { size: 10, left: '42%', delay: 0.5, duration: 2.6, color: '#FF007A' },
                ].map((bubble, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 260, opacity: 0, scale: 0.5 }}
                    animate={
                      stage >= 2
                        ? {
                            y: [-40, -420],
                            opacity: [0, 0.9, 0.8, 0],
                            scale: [0.6, 1.1, 1, 0.4],
                            x: [0, (i % 2 === 0 ? 12 : -12), 0],
                          }
                        : {}
                    }
                    transition={{
                      delay: bubble.delay,
                      duration: bubble.duration,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    style={{
                      left: bubble.left,
                      width: bubble.size,
                      height: bubble.size,
                      backgroundColor: bubble.color,
                    }}
                    className="absolute rounded-full shadow-sm"
                  />
                ))}
              </div>

              {/* STAGE 3: Final White Screen Content (HomeScreen typography + Loading Pill) */}
              <div className="relative z-30 flex flex-col items-center text-center px-6 max-w-sm w-full">
                {/* Brand Logo Matching HomeScreen exactly */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: stage >= 2 ? 1 : 0,
                    scale: stage >= 2 ? 1 : 0.95,
                  }}
                  transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                  className="flex flex-col items-center"
                >
                  <h1 className="text-4xl sm:text-5xl font-display tracking-tight font-extrabold flex items-center leading-none">
                    <span className="text-[#E05286] mr-1">emme</span>
                    <span className="text-[#1D1D1F] font-medium">studio</span>
                  </h1>
                  <p className="text-xs tracking-[0.25em] uppercase text-[#8E8B8E] font-medium mt-2 font-display">
                    Nails & Beauty Lounge
                  </p>
                </motion.div>

                {/* Rounded Loading Capsule / Progress Bar (As seen in the recording) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: stage >= 3 ? 1 : 0,
                    y: stage >= 3 ? 0 : 10,
                  }}
                  transition={{ duration: 0.4 }}
                  className="mt-8 w-44 h-2.5 bg-[#F6F4F6] rounded-full p-0.5 overflow-hidden shadow-inner border border-gray-100 flex items-center"
                >
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#FF007A] to-[#FF4593] relative shadow-sm"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: 'easeInOut' }}
                  >
                    {/* Animated Shimmer sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                  </motion.div>
                </motion.div>

                {/* Offline Alert if required */}
                {isOffline && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 flex flex-col items-center gap-1.5"
                  >
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-sans font-semibold">
                      <WifiOff className="size-3" />
                      <span>Modo sin conexión</span>
                    </div>
                    {onRetry && (
                      <button
                        onClick={onRetry}
                        className="mt-1 flex items-center gap-1 text-[11px] font-sans font-bold text-[#FF007A] hover:underline cursor-pointer"
                      >
                        <RefreshCw className="size-3" />
                        <span>Reintentar</span>
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
