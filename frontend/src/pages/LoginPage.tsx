import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { AuthSplitLayout } from "../components/auth/AuthSplitLayout";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { useAuth } from "../state/AuthContext";
import type { UserRole } from "../types/auth";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPostLoginRedirect = (role: UserRole): string => {
    const state = location.state as LocationState | null;
    const requestedPath = state?.from?.pathname;

    if (role === "club_admin") {
      return requestedPath?.startsWith("/admin") ? requestedPath : "/admin/events";
    }

    if (requestedPath && !requestedPath.startsWith("/admin")) {
      return requestedPath;
    }

    return "/";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const authenticatedUser = await login(formData);
      navigate(getPostLoginRedirect(authenticatedUser.role), { replace: true });
    } catch (submissionError) {
      setError(
        getApiErrorMessage(
          submissionError,
          "We couldn't sign you in. Check your email and password, then try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState label="Checking your session..." />;
  }

  if (isAuthenticated && user) {
    return <Navigate replace to={getPostLoginRedirect(user.role)} />;
  }

  return (
    <AuthSplitLayout
      eyebrow="Academic Excellence"
      footerPrompt={
        <>
          Don&apos;t have an account?{" "}
          <Link className="font-bold text-primary hover:underline" to="/register">
            Register
          </Link>
        </>
      }
      helperText="Join your campus community, manage your clubs, and discover real Nile University events in one place."
      subtitle="Enter your details to access your campus portal."
      title="Welcome back"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="ml-1 block text-sm font-semibold text-on-surface" htmlFor="email">
              University Email
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
                <MaterialIcon className="text-lg" name="mail" />
              </div>
              <input
                className="w-full rounded-xl border-none bg-surface-container-low py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary"
                id="email"
                name="email"
                onChange={(event) =>
                  setFormData((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="name@nileuniversity.edu"
                required
                type="email"
                value={formData.email}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="block text-sm font-semibold text-on-surface" htmlFor="password">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
                <MaterialIcon className="text-lg" name="lock" />
              </div>
              <input
                className="w-full rounded-xl border-none bg-surface-container-low py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary"
                id="password"
                name="password"
                onChange={(event) =>
                  setFormData((current) => ({ ...current, password: event.target.value }))
                }
                placeholder="Enter your password"
                required
                type="password"
                value={formData.password}
              />
            </div>
          </div>
        </div>

        <ErrorMessage message={error} />

        <button
          className="w-full rounded-xl bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] py-4 font-headline text-lg font-bold text-white shadow-[0px_12px_32px_rgba(0,30,64,0.15)] transition-all duration-300 hover:shadow-[0px_12px_32px_rgba(0,30,64,0.25)] hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthSplitLayout>
  );
}
