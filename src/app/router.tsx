import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, MobileNav } from '@/features/navigation';
import { DashboardPage } from '@/features/dashboard';
import { AppointmentsPage } from '@/features/appointments';
import { ServicesPage } from '@/features/services';
import { ProfilePage } from '@/features/profile';
import { ChatPage } from '@/features/chat';
import { BookingEntryPage } from '@/pages/booking/BookingEntryPage';
import { DirectBookingPage } from '@/pages/direct-booking/DirectBookingPage';
import { QuoteRequestPage } from '@/pages/quote-request/QuoteRequestPage';
import { InspirationPage } from '@/pages/inspiration/InspirationPage';
import { QuoteBookingPage } from '@/pages/quote-booking/QuoteBookingPage';
import { LoginPage, WhatsAppRedirectDetector } from '@/features/auth';
import { OnboardingPage, ClientTourModal } from '@/features/onboarding';
import { EmmeAiChatWidget } from '@/features/chat';
import {
  useAppLifecycle,
  AppStartupSplash,
  OfflineBanner,
  PwaInstallPrompt,
  WebNotificationPrompt,
  AppUpdateBanner
} from '@/features/lifecycle';
import { useApp } from '@/app/AppContext';
import { cn } from '@emme/ui/lib/utils';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { isAuthenticated, isFirstTime, isTourActive } = useApp();
  const {
    state: lifecycleState,
    promptPwaInstall,
    dismissInstallPrompt,
    showInstallPrompt,
    requestNotifications,
    setHasUpdateAvailable
  } = useAppLifecycle();

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split('/')[1] || 'booking';
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  // Detect whether current route is part of the booking funnel to eliminate distractions
  const isBookingFunnel = 
    location.pathname.startsWith('/book') ||
    location.pathname.startsWith('/booking') ||
    location.pathname.startsWith('/agendar') ||
    location.pathname.startsWith('/appointments/new') ||
    location.pathname.startsWith('/quotes');

  // App Initialization Cold Start Splash
  if (lifecycleState.phase === 'initializing') {
    return <AppStartupSplash isOffline={!lifecycleState.isOnline} />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <OfflineBanner isOnline={lifecycleState.isOnline} />
        <LoginPage />
        <WhatsAppRedirectDetector />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex relative overflow-hidden font-sans selection:bg-primary/5">
      {/* Global Lifecycle Overlays - Never overlap with onboarding or active tour */}
      <OfflineBanner isOnline={lifecycleState.isOnline} />
      <WhatsAppRedirectDetector />
      <AppUpdateBanner
        hasUpdate={lifecycleState.hasUpdateAvailable}
        onUpdate={() => window.location.reload()}
      />
      {!isFirstTime && !isTourActive && (
        <>
          <PwaInstallPrompt
            isOpen={showInstallPrompt}
            platform={lifecycleState.platform}
            onInstall={promptPwaInstall}
            onDismiss={dismissInstallPrompt}
          />
          {!showInstallPrompt && (
            <WebNotificationPrompt
              permission={lifecycleState.notificationPermission}
              onRequestPermission={requestNotifications}
            />
          )}
        </>
      )}

      {isFirstTime && <OnboardingPage />}
      <AnimatePresence>
        {isTourActive && <ClientTourModal />}
      </AnimatePresence>
      <Sidebar activeTab={currentPath} />

      <main 
        id="main-scroll-container"
        className={cn(
        "flex-1 custom-scrollbar relative",
        currentPath === 'chat' 
          ? "h-[100dvh] overflow-hidden flex flex-col pb-0" 
          : isBookingFunnel
            ? "h-screen overflow-y-auto pb-24 md:pb-12 lg:pb-0"
            : "h-screen overflow-y-auto pb-32 lg:pb-0"
      )}>
        <div className={cn(
          "max-w-[1800px] mx-auto w-full",
          currentPath === 'chat' 
            ? "px-0 sm:px-6 lg:px-16 pt-0 pb-0 lg:py-8 flex-1 flex flex-col min-h-0 h-full overflow-hidden" 
            : currentPath === 'inicio' || currentPath === 'dashboard'
              ? "px-0 pt-0 pb-8 lg:pt-0 lg:pb-12"
              : "px-4 sm:px-10 lg:px-16 pt-2 sm:pt-3 pb-8 lg:pt-4 lg:pb-12"
        )}>

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className={cn(currentPath === 'chat' && "h-full flex-1 flex flex-col")}
            >
              <Routes location={location}>
                {/* 1. Entry Flow */}
                <Route path="/booking" element={<BookingEntryPage />} />

                {/* 2. Direct Booking Wizard Flow */}
                <Route path="/book/service" element={<DirectBookingPage />} />
                <Route path="/appointments/new" element={<DirectBookingPage />} />
                <Route path="/agendar" element={<DirectBookingPage />} />

                {/* 3. Custom Quote Wizard Flow */}
                <Route path="/quotes/new" element={<QuoteRequestPage />} />
                <Route path="/cotizacion" element={<QuoteRequestPage />} />
                <Route path="/quotes" element={<QuoteRequestPage />} />

                {/* 4. Optional Inspiration Flow */}
                <Route path="/quotes/inspiration" element={<InspirationPage />} />

                {/* 5. Accepted Quote Booking Flow */}
                <Route path="/quotes/:quoteId/book" element={<QuoteBookingPage />} />

                {/* Admin & Salon Dashboard Views */}
                <Route path="/inicio" element={<DashboardPage />} />
                <Route path="/agenda" element={<AppointmentsPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/history" element={<ServicesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<ProfilePage />} />

                {/* Default Entry */}
                <Route path="/" element={<Navigate to="/inicio" replace />} />
                <Route path="*" element={<Navigate to="/inicio" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating EMME AI Chat Widget Trigger (Hidden on mobile only; visible on tablet and desktop) */}
      {currentPath !== 'chat' && (
        <>
          <motion.button
            data-tour="ai-floating-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
            className="hidden lg:flex fixed bottom-20 lg:bottom-8 left-4 md:left-6 lg:left-auto lg:right-24 z-[100] min-h-[44px] h-11 px-4 rounded-full bg-primary text-white font-bold text-xs shadow-md shadow-primary/25 items-center gap-2 border border-primary/20 hover:brightness-110 transition-all cursor-pointer"
          >
            <div className="size-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="size-3.5 text-white" />
            </div>
            <span className="text-xs">EMME AI</span>
          </motion.button>

          <AnimatePresence>
            {isFloatingChatOpen && (
              <EmmeAiChatWidget isFloating onClose={() => setIsFloatingChatOpen(false)} />
            )}
          </AnimatePresence>
        </>
      )}

      {/* Persistent Bottom Navigation - Oculto durante todo el embudo de reserva */}
      {!isBookingFunnel && <MobileNav activeTab={currentPath} />}
    </div>
  );
}

export function AppRouter() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
