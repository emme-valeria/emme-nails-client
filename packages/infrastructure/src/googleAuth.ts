import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut, Auth } from 'firebase/auth';
import firebaseConfig from '../../../firebase-applet-config.json';

// Initialize Firebase App safely if not already initialized
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
} catch (e) {
  console.warn('Firebase app / auth initialization skipped or failed:', e);
}

export { auth };

let provider: GoogleAuthProvider | null = null;
try {
  provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'consent'
  });
} catch (e) {
  console.warn('GoogleAuthProvider initialization fallback:', e);
}

let isSigningIn = false;
let cachedAccessToken: string | null = null;
let cachedUser: User | null = null;

// Load connection state from secure cache/session for persistence during page refreshes (just user profile, auth token behaves in memory)
try {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const savedToken = sessionStorage.getItem('g_token');
    if (savedToken) {
      cachedAccessToken = savedToken;
    }
  }
} catch (e) {
  console.warn('SessionStorage not available:', e);
}

// Set up listeners for auth status
const subscribers = new Set<(user: User | null, token: string | null) => void>();

export const buildAuthListener = (callback: (user: User | null, token: string | null) => void) => {
  subscribers.add(callback);
  // Initial callback with current values
  callback(cachedUser, cachedAccessToken);
  return () => {
    subscribers.delete(callback);
  };
};

const notifySubscribers = (user: User | null, token: string | null) => {
  subscribers.forEach(cb => cb(user, token));
};

// Initialize auth state listener
if (auth) {
  try {
    onAuthStateChanged(
      auth,
      async (user: User | null) => {
        cachedUser = user;
        if (!user) {
          cachedAccessToken = null;
          try {
            if (typeof window !== 'undefined' && window.sessionStorage) {
              sessionStorage.removeItem('g_token');
            }
          } catch (e) {}
        }
        notifySubscribers(user, cachedAccessToken);
      },
      (error) => {
        console.warn('Firebase auth state listener error:', error);
      }
    );
  } catch (e) {
    console.warn('Failed to attach onAuthStateChanged listener:', e);
  }
}

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (!auth || !provider) {
    throw new Error('Google Auth no está disponible en este entorno.');
  }
  if (isSigningIn) return null;
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No se pudo obtener el token de acceso desde Google Auth.');
    }

    cachedAccessToken = credential.accessToken;
    cachedUser = result.user;
    
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('g_token', cachedAccessToken);
      }
    } catch (e) {}

    notifySubscribers(cachedUser, cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    // Handle standard user cancellation or popup dismissal gracefully
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/user-cancelled' ||
      error?.message?.includes('popup-closed-by-user')
    ) {
      console.info('Google Sign-in: ventana emergente cerrada por el usuario.');
      return null;
    }
    console.error('Sign-in Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const getGoogleUser = (): User | null => {
  return cachedUser;
};

export const googleSignOut = async () => {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Error signing out from Firebase:', e);
    }
  }
  cachedAccessToken = null;
  cachedUser = null;
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem('g_token');
    }
  } catch (e) {}
  notifySubscribers(null, null);
};
