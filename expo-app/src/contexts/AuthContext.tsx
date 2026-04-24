import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthAPI, setAuthToken } from "../services/api";

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const KEYS = {
  USER: "@motor_auth",
  ACCESS_TOKEN: "@motor_access_token",
  REFRESH_TOKEN: "@motor_refresh_token",
};

// All car-data keys that belong to a specific user session.
// These are wiped when a different (or new) user logs in.
const CAR_DATA_KEYS = [
  "@motor_car_details",
  "@motor_oil_changes",
  "@motor_fuel_logs",
  "@motor_expenses",
  "@motor_car_id",
  "@motor_pending_actions",
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  /**
   * On startup: load saved tokens + user from AsyncStorage, inject the
   * access token into the API module, then attempt a silent refresh so
   * the user stays logged in across app restarts without re-entering credentials.
   */
  const restoreSession = async () => {
    try {
      const [userRaw, accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(KEYS.USER),
        AsyncStorage.getItem(KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(KEYS.REFRESH_TOKEN),
      ]);

      if (!userRaw || !refreshToken) return;

      const storedUser: AuthUser = JSON.parse(userRaw);

      // Restore access token immediately so in-flight requests have auth
      if (accessToken) setAuthToken(accessToken);

      // Silently refresh to get a fresh access token
      try {
        const { accessToken: freshToken } = await AuthAPI.refresh(refreshToken);
        await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, freshToken);
        setAuthToken(freshToken);
      } catch {
        // Refresh failed (token expired / server unreachable).
        // Still restore the session from cache — the user can use offline data.
        // If the server rejects a cached token later, the 401 will trigger logout.
      }

      setUser(storedUser);
    } catch {
      // Corrupt storage — treat as logged out
    } finally {
      setIsLoading(false);
    }
  };

  /** Wipe all car data when a new (or different) user logs in. */
  const clearCarData = async () => {
    await AsyncStorage.multiRemove(CAR_DATA_KEYS);
  };

  /** Persist auth state and arm the API module with the new token. */
  const persistSession = async (
    authUser: AuthUser,
    accessToken: string,
    refreshToken: string,
    prevEmail?: string,
  ) => {
    // Clear car data when switching users
    if (!prevEmail || prevEmail !== authUser.email) {
      await clearCarData();
    }
    await Promise.all([
      AsyncStorage.setItem(KEYS.USER, JSON.stringify(authUser)),
      AsyncStorage.setItem(KEYS.ACCESS_TOKEN, accessToken),
      AsyncStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken),
    ]);
    setAuthToken(accessToken);
    setUser(authUser);
  };

  const login = async (email: string, password: string): Promise<void> => {
    const prevRaw = await AsyncStorage.getItem(KEYS.USER);
    const prevUser: AuthUser | null = prevRaw ? JSON.parse(prevRaw) : null;

    const {
      user: authUser,
      accessToken,
      refreshToken,
    } = await AuthAPI.login(email, password);

    await persistSession(authUser, accessToken, refreshToken, prevUser?.email);
  };

  const register = async (email: string, password: string): Promise<void> => {
    const {
      user: authUser,
      accessToken,
      refreshToken,
    } = await AuthAPI.register(email, password);
    await persistSession(authUser, accessToken, refreshToken);
  };

  const logout = async (): Promise<void> => {
    await AuthAPI.logout(); // best-effort server-side logout
    await clearCarData();
    await AsyncStorage.multiRemove([
      KEYS.USER,
      KEYS.ACCESS_TOKEN,
      KEYS.REFRESH_TOKEN,
    ]);
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
