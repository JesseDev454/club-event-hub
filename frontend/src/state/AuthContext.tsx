import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

import { authApi } from "../api/authApi";
import { getApiErrorMessage, setApiClientToken } from "../api/client";
import type { AuthSuccessPayload, AuthUser, LoginInput, RegisterStudentInput } from "../types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  sessionCheckFailed: boolean;
  sessionError: string | null;
  register: (payload: RegisterStudentInput) => Promise<AuthUser>;
  login: (payload: LoginInput) => Promise<AuthUser>;
  logout: () => void;
  refreshSession: () => Promise<void>;
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
  const [sessionCheckFailed, setSessionCheckFailed] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const setAuthState = useCallback((next: AuthSuccessPayload | { user: null; token: null }) => {
    setUser(next.user);
    setToken(next.token);
    setApiClientToken(next.token);
    setSessionCheckFailed(false);
    setSessionError(null);

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

  const refreshSession = useCallback(async (): Promise<void> => {
    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!storedToken) {
      setApiClientToken(null);
      setAuthState({ user: null, token: null });
      setLoading(false);
      return;
    }

    setToken(storedToken);
    setApiClientToken(storedToken);
    setSessionCheckFailed(false);
    setSessionError(null);

    try {
      const currentUser = await authApi.getCurrentUser();

      setAuthState({
        token: storedToken,
        user: currentUser,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setAuthState({ user: null, token: null });
      } else {
        setToken(storedToken);
        setApiClientToken(storedToken);
        setSessionCheckFailed(true);
        setSessionError(
          getApiErrorMessage(error, "We could not verify your session right now. Please try again."),
        );
      }
    } finally {
      setLoading(false);
    }
  }, [setAuthState]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        loading,
        sessionCheckFailed,
        sessionError,
        register,
        login,
        logout,
        refreshSession,
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
