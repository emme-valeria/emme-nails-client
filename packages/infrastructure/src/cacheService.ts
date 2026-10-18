
type CacheKey = 'services' | 'clients' | 'appointments' | 'profile' | 'isAuthenticated' | 'isFirstTime' | 'activeClientId' | 'googleSpreadsheetId' | 'isGoogleAutoSync' | 'isGoogleSheetsAutoExport' | 'socialAccounts' | 'activeSocialProvider' | 'hasCompletedTour';

interface CacheData<T> {
  data: T;
  timestamp: number;
  version: string;
}

const CACHE_VERSION = '1.0.1';
const DEFAULT_TTL = 1000 * 60 * 60 * 24 * 30; // 30 days

const memoryStore = new Map<string, string>();

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {
    // Fallback to memoryStore
  }
  return memoryStore.get(key) || null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch (e) {
    // Fallback to memoryStore
  }
  memoryStore.set(key, value);
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (e) {
    // ignore
  }
  memoryStore.delete(key);
}

export const cacheService = {
  set: <T>(key: CacheKey, data: T): void => {
    try {
      const cacheData: CacheData<T> = {
        data,
        timestamp: Date.now(),
        version: CACHE_VERSION,
      };
      safeSetItem(`emmenails_cache_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn(`Warning saving to cache: ${key}`, error);
    }
  },

  get: <T>(key: CacheKey, ttl: number = DEFAULT_TTL): T | null => {
    try {
      const saved = safeGetItem(`emmenails_cache_${key}`);
      if (!saved) return null;

      const cacheData: CacheData<T> = JSON.parse(saved);
      
      // Check version
      if (!cacheData || typeof cacheData !== 'object' || cacheData.version !== CACHE_VERSION) {
        safeRemoveItem(`emmenails_cache_${key}`);
        return null;
      }

      // Check expiration
      const age = Date.now() - cacheData.timestamp;
      if (age > ttl) {
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.warn(`Warning reading from cache: ${key}`, error);
      return null;
    }
  },

  clear: (key?: CacheKey): void => {
    try {
      if (key) {
        safeRemoveItem(`emmenails_cache_${key}`);
      } else {
        memoryStore.clear();
        if (typeof window !== 'undefined' && window.localStorage) {
          Object.keys(window.localStorage).forEach(k => {
            if (k.startsWith('emmenails_cache_')) {
              safeRemoveItem(k);
            }
          });
        }
      }
    } catch (e) {
      memoryStore.clear();
    }
  }
};
