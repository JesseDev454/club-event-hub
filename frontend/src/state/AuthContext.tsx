import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type UserRole = "student" | "club_admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clubId: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  setAuthState: (next: { user: AuthUser | null; token: string | null }) => void;
  clearAuthState: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = "club_event_hub_token";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    setToken(storedToken);
    setLoading(false);
  }, []);

  const setAuthState = (next: { user: AuthUser | null; token: string | null }) => {
    setUser(next.user);
    setToken(next.token);

    if (next.token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, next.token);
      return;
    }

    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  const clearAuthState = () => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        loading,
        setAuthState,
        clearAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
