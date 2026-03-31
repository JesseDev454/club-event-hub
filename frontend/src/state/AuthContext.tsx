import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authApi } from "../api/authApi";
import { getApiErrorMessage, setApiClientToken } from "../api/client";
import type { AuthSuccessPayload, AuthUser, LoginInput, RegisterStudentInput } from "../types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  register: (payload: RegisterStudentInput) => Promise<AuthUser>;
  login: (payload: LoginInput) => Promise<AuthUser>;
  logout: () => void;
  setAuthState: (next: AuthSuccessPayload | { user: null; token: null }) => void;
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

  const setAuthState = useCallback((next: AuthSuccessPayload | { user: null; token: null }) => {
    setUser(next.user);
    setToken(next.token);
    setApiClientToken(next.token);

    if (next.token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, next.token);
      return;
    }

    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  const logout = useCallback(() => {
    setAuthState({ user: null, token: null });
  }, [setAuthState]);

  const register = useCallback(
    async (payload: RegisterStudentInput): Promise<AuthUser> => {
      const result = await authApi.registerStudent(payload);
      setAuthState(result);
      return result.user;
    },
    [setAuthState],
  );

  const login = useCallback(
    async (payload: LoginInput): Promise<AuthUser> => {
      const result = await authApi.loginUser(payload);
      setAuthState(result);
      return result.user;
    },
    [setAuthState],
  );

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!storedToken) {
        if (isMounted) {
          setApiClientToken(null);
          setLoading(false);
        }
        return;
      }

      setApiClientToken(storedToken);

      try {
        const currentUser = await authApi.getCurrentUser();

        if (isMounted) {
          setAuthState({
            token: storedToken,
            user: currentUser,
          });
        }
      } catch (error) {
        console.error("Failed to restore auth session:", getApiErrorMessage(error));

        if (isMounted) {
          setAuthState({ user: null, token: null });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [setAuthState]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        loading,
        register,
        login,
        logout,
        setAuthState,
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
