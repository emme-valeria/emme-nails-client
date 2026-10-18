import { useState, useEffect, useCallback } from 'react';
import { AppLifecyclePhase, PwaPlatform, AppLifecycleState } from '../types';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function useAppLifecycle() {
  const [phase, setPhase] = useState<AppLifecyclePhase>('initializing');
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [hasUpdateAvailable, setHasUpdateAvailable] = useState<boolean>(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('default');

  // Detect platform & standalone mode
  const detectPlatform = (): { platform: PwaPlatform; isStandalone: boolean } => {
    if (typeof window === 'undefined') {
      return { platform: 'desktop', isStandalone: false };
    }

    let isStandalone = false;
    try {
      isStandalone = 
        (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) || 
        (window.navigator as unknown as { standalone?: boolean })?.standalone === true;
    } catch {
      isStandalone = false;
    }

    const ua = (window.navigator?.userAgent || '').toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (isStandalone) return { platform: 'standalone', isStandalone: true };
    if (isIOS) return { platform: 'ios', isStandalone: false };
    if (isAndroid) return { platform: 'android', isStandalone: false };
    return { platform: 'desktop', isStandalone: false };
  };

  const { platform, isStandalone } = detectPlatform();

  // Initialization routine with simulated cold-start handshake
  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();
    const minSplashDuration = 400; // ms to ensure smooth visual transition without jank

    const initApp = async () => {
      try {
        // Check notification capability
        if (typeof window !== 'undefined' && 'Notification' in window) {
          try {
            setNotificationPermission(Notification.permission);
          } catch {
            setNotificationPermission('unsupported');
          }
        } else {
          setNotificationPermission('unsupported');
        }

        // Check if user dismissed install prompt recently
        let isDismissedRecently = false;
        try {
          const dismissedAt = localStorage.getItem('emme_pwa_install_dismissed');
          isDismissedRecently = Boolean(dismissedAt && Date.now() - parseInt(dismissedAt, 10) < 1000 * 60 * 60 * 24 * 3); // 3 days
        } catch {
          isDismissedRecently = false;
        }

        if (!isStandalone && !isDismissedRecently) {
          // Delay showing install prompt so it doesn't collide with onboarding
          setTimeout(() => {
            if (isMounted) setShowInstallPrompt(true);
          }, 3500);
        }

        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, minSplashDuration - elapsed);

        setTimeout(() => {
          if (isMounted) {
            setPhase(typeof navigator !== 'undefined' && navigator.onLine ? 'ready' : 'offline_ready');
          }
        }, remainingDelay);
      } catch (err) {
        console.warn('App initialization warning:', err);
        if (isMounted) setPhase('ready');
      }
    };

    initApp();

    // Listen for online / offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Capture PWA beforeinstallprompt on Chrome/Android/Desktop
    const handleBeforeInstall = (e: Event) => {
      try {
        e.preventDefault();
        setDeferredInstallPrompt(e as BeforeInstallPromptEvent);
      } catch (err) {
        console.warn('beforeinstallprompt error:', err);
      }
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      isMounted = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, [isStandalone]);

  // Trigger PWA installation
  const promptPwaInstall = useCallback(async () => {
    if (!deferredInstallPrompt) return false;
    try {
      await deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowInstallPrompt(false);
        setDeferredInstallPrompt(null);
        return true;
      }
    } catch (err) {
      console.warn('Install prompt error:', err);
    }
    return false;
  }, [deferredInstallPrompt]);

  const dismissInstallPrompt = useCallback((snoozeDays = 3) => {
    setShowInstallPrompt(false);
    try {
      localStorage.setItem('emme_pwa_install_dismissed', Date.now().toString());
    } catch {}
  }, []);

  // Request Notification permission
  const requestNotifications = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      return perm;
    } catch {
      return 'denied';
    }
  }, []);

  const state: AppLifecycleState = {
    phase,
    isOnline,
    isStandalone,
    canInstallPwa: Boolean(deferredInstallPrompt) || (platform === 'ios' && !isStandalone),
    platform,
    hasUpdateAvailable,
    notificationPermission
  };

  return {
    state,
    promptPwaInstall,
    dismissInstallPrompt,
    showInstallPrompt,
    setShowInstallPrompt,
    requestNotifications,
    setHasUpdateAvailable
  };
}
