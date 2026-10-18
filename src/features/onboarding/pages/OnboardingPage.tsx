import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useApp } from '@/app/AppContext';
import { OnboardingState, OnboardingGoalId } from '../types';
import {
  OnboardingStepSplash,
  OnboardingStepAiShowcase,
  OnboardingStepName,
  OnboardingStepWhatsApp,
  OnboardingDeviceMockup
} from '../components';

export function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeOnboarding, updateClient, clients, profile, googleUser, userStyleProfile, updateUserStyleProfile } = useApp();

  // Parse URL search params
  const searchParams = new URLSearchParams(location.search);
  const urlPhone = searchParams.get('phone') || searchParams.get('wa') || searchParams.get('whatsapp') || searchParams.get('tel') || searchParams.get('cel');
  const urlName = searchParams.get('name') || searchParams.get('cliente') || searchParams.get('client') || searchParams.get('nombre');
  const initialStepParam = searchParams.get('step');

  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (initialStepParam !== null) {
      const parsed = parseInt(initialStepParam, 10);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
    return 0;
  });

  const initialName = urlName || userStyleProfile?.clientName || googleUser?.displayName || profile?.owner || (clients.length > 0 ? clients[0].name : 'Valeria Arriaza');
  const initialPhone = urlPhone || userStyleProfile?.clientContact || googleUser?.phoneNumber || (clients.length > 0 ? clients[0].phone : '+52 3331733925');

  const [state, setState] = useState<OnboardingState>({
    clientName: initialName,
    clientContact: initialPhone,
    goal: (userStyleProfile?.goal as OnboardingGoalId) || 'extensions',
    specificService: userStyleProfile?.specificService || 'Soft Gel Tips',
    shape: userStyleProfile?.shape || 'Almendra',
    length: userStyleProfile?.length || 'Medio',
    finish: userStyleProfile?.finish || 'Glossy',
    artLevel: userStyleProfile?.artLevel || 'Glazed Chrome',
    lashStyle: userStyleProfile?.lashStyle || 'Foxy / Cat Eye',
    browStyle: userStyleProfile?.browStyle || 'Laminado de Cejas',
    colorName: userStyleProfile?.colorName || 'Milky White',
    colorHex: userStyleProfile?.colorHex || '#FFFFFF',
    styleVibe: userStyleProfile?.styleVibe || 'Clean Girl',
    comfortPreferences: userStyleProfile?.comfortPreferences || ['Café frío o té', 'Música suave']
  });

  useEffect(() => {
    if (urlPhone || urlName) {
      setState(prev => ({
        ...prev,
        clientName: urlName || prev.clientName,
        clientContact: urlPhone || prev.clientContact
      }));
    }
  }, [urlPhone, urlName]);

  const totalSteps = 4; // 0: Splash, 1: AI, 2: Name, 3: WhatsApp

  const userName = state.clientName.trim() || initialName;

  const handleUpdate = (updates: Partial<OnboardingState>) => {
    setState(prev => {
      const next = { ...prev, ...updates };
      // Schedule the context update after render to avoid the "Cannot update a component while rendering a different component" error
      Promise.resolve().then(() => {
        updateUserStyleProfile(next);
      });
      return next;
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinishAndSave = (destination: 'booking' | 'explore' = 'booking') => {
    updateUserStyleProfile({
      ...state,
      lastUpdated: new Date().toISOString()
    });

    if (clients.length > 0) {
      const mainClient = clients[0];
      updateClient(mainClient.id, {
        name: state.clientName.trim() || mainClient.name,
        phone: state.clientContact.trim() || mainClient.phone,
        isVip: true
      });
    }

    if (destination === 'booking') {
      completeOnboarding(false);
      navigate('/booking');
    } else {
      completeOnboarding(true);
      navigate('/');
    }
  };

  const handleSkip = () => {
    handleFinishAndSave('booking');
  };

  return (
    <div className="fixed inset-0 z-[250] h-[100dvh] w-full bg-white text-[#1D1D1F] flex flex-col justify-between overflow-hidden select-none touch-pan-y">
      {/* Top Header Bar */}
      <AnimatePresence>
        {currentStep > 0 && currentStep < totalSteps && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-3 flex flex-col gap-2 z-30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="size-8 rounded-full bg-white hover:bg-pink-50 border border-pink-100 flex items-center justify-center text-[#1D1D1F] hover:text-[#E05286] transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="Volver"
                >
                  <ChevronLeft className="size-4.5" />
                </button>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-luxury-italic font-extrabold text-[#E05286] tracking-tight">emme</span>
                  <span className="text-xs font-luxury font-bold tracking-[0.15em] text-[#1D1D1F]/80 uppercase">studio</span>
                </div>
              </div>

              {/* Segmented Pill Progress Indicator */}
              <div className="flex-1 max-w-[140px] sm:max-w-xs mx-4">
                <div className="h-1.5 w-full bg-pink-100/60 rounded-full overflow-hidden flex gap-1 p-0.5">
                  {Array.from({ length: totalSteps - 1 }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      initial={false}
                      animate={{
                        backgroundColor: idx < currentStep ? '#E05286' : 'rgba(251, 207, 222, 0.4)'
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex-1 rounded-full"
                    />
                  ))}
                </div>
              </div>

              {/* Quick action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-[10px] font-bold text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer active:scale-95"
                >
                  Omitir
                </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center relative w-full h-full">
        {currentStep === 0 ? (
          <AnimatePresence mode="wait">
            <OnboardingStepSplash
              key="splash"
              onStart={handleNext}
              onExplore={() => handleFinishAndSave('explore')}
            />
          </AnimatePresence>
        ) : (
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 h-full flex items-center gap-8 lg:gap-16">
            
            {/* Left Column: Contextual Device Mockup - Hidden on Mobile */}
            <div className="hidden lg:flex flex-1 justify-end h-[600px] items-center">
              <OnboardingDeviceMockup
                currentStep={currentStep}
                state={state}
                userName={userName}
              />
            </div>

            {/* Right Column: Active Configuration View */}
            <div className="flex-1 w-full max-w-md mx-auto lg:mx-0 h-full flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <div key="ai" className="pb-8">
                    <OnboardingStepAiShowcase onNext={handleNext} />
                  </div>
                )}
                
                {currentStep === 2 && (
                  <OnboardingStepName
                    key="name"
                    clientName={state.clientName}
                    clientContact={state.clientContact}
                    googleDisplayName={googleUser?.displayName}
                    googlePhotoUrl={googleUser?.photoURL}
                    onUpdate={handleUpdate}
                    onConfirmAdvance={handleNext}
                  />
                )}

                {currentStep === 3 && (
                  <OnboardingStepWhatsApp
                    key="wa"
                    clientContact={state.clientContact}
                    onUpdate={handleUpdate}
                    onAdvance={() => handleFinishAndSave('booking')}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
