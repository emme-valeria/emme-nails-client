export type AppLifecyclePhase = 'initializing' | 'ready' | 'offline_ready' | 'error';

export type PwaPlatform = 'ios' | 'android' | 'desktop' | 'standalone';

export interface AppLifecycleState {
  phase: AppLifecyclePhase;
  isOnline: boolean;
  isStandalone: boolean;
  canInstallPwa: boolean;
  platform: PwaPlatform;
  hasUpdateAvailable: boolean;
  notificationPermission: NotificationPermission | 'unsupported';
}
