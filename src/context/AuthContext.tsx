import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "supervisor" | "operator";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// ─── Helpers token ────────────────────────────────────────────────────────────

const TOKEN_KEY = "gabo_token";
const ACTIVITY_KEY = "gabo_last_activity";
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
const removeToken = () => localStorage.removeItem(TOKEN_KEY);
const getLastActivity = () => Number(localStorage.getItem(ACTIVITY_KEY) ?? "0");
const setLastActivity = (time: number) =>
  localStorage.setItem(ACTIVITY_KEY, time.toString());
const removeLastActivity = () => localStorage.removeItem(ACTIVITY_KEY);

// ─── Constante base URL ───────────────────────────────────────────────────────

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimer = useRef<number | null>(null);

  const clearInactivityTimer = () => {
    if (inactivityTimer.current !== null) {
      window.clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
  };

  const logout = () => {
    clearInactivityTimer();
    removeToken();
    removeLastActivity();
    setUser(null);
  };

  const scheduleInactivityLogout = () => {
    clearInactivityTimer();
    inactivityTimer.current = window.setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT_MS);
  };

  const refreshActivity = () => {
    setLastActivity(Date.now());
    scheduleInactivityLogout();
  };

  const checkInactivity = () => {
    const last = getLastActivity();
    if (!last) return false;
    return Date.now() - last > INACTIVITY_TIMEOUT_MS;
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    if (checkInactivity()) {
      logout();
      setLoading(false);
      return;
    }

    setLastActivity(Date.now());
    scheduleInactivityLogout();

    const loadProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          removeToken();
          setUser(null);
          return;
        }

        const data = (await res.json()) as User;
        setUser(data);
      } catch (error) {
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const handleUserActivity = () => {
      refreshActivity();
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];
    events.forEach((event) =>
      window.addEventListener(event, handleUserActivity),
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleUserActivity),
      );
      clearInactivityTimer();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Credenciales incorrectas");
      }

      setToken(data.token);
      setUser(data.user);
      refreshActivity();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}

// Helper para obtener el token en cualquier fetch fuera del contexto
export { getToken, API_URL };
