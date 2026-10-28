import type { Auth, User } from 'firebase/auth';

/** Fixture de autenticación local: no abre OAuth ni contacta Firebase/Google. */
export const auth: Auth | null = null;

const demoUser = {
  uid: 'emme-demo-client',
  displayName: 'Valeria Arriaza',
  email: 'valeria@emmestudio.app',
  phoneNumber: '+52 55 0000 0000',
} as unknown as User;

const demoToken = 'emme-local-fixture-token';
let cachedUser: User | null = null;
let cachedAccessToken: string | null = null;
const subscribers = new Set<(user: User | null, token: string | null) => void>();

const notifySubscribers = (user: User | null, token: string | null) => {
  subscribers.forEach((callback) => callback(user, token));
};

export const buildAuthListener = (callback: (user: User | null, token: string | null) => void) => {
  subscribers.add(callback);
  callback(cachedUser, cachedAccessToken);
  return () => {
    subscribers.delete(callback);
  };
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  await new Promise<void>((resolve) => setTimeout(resolve, 250));
  cachedUser = demoUser;
  cachedAccessToken = demoToken;
  notifySubscribers(cachedUser, cachedAccessToken);
  return { user: demoUser, accessToken: demoToken };
};

export const getAccessToken = async (): Promise<string | null> => cachedAccessToken;
export const getGoogleUser = (): User | null => cachedUser;

export const googleSignOut = async () => {
  cachedUser = null;
  cachedAccessToken = null;
  notifySubscribers(null, null);
};
