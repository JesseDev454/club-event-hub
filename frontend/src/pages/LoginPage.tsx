import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { MaterialIcon } from "../components/common/MaterialIcon";
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
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-10">
        <div className="absolute inset-0">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-secondary/10 blur-[100px]" />
          <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-10 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-soft">
              <MaterialIcon className="text-4xl" name="account_balance" />
            </div>
            <h1 className="mt-5 font-headline text-3xl font-extrabold tracking-tight text-primary">
              NileConnect
            </h1>
            <p className="mt-2 text-sm font-medium text-on-surface-variant">
              Academic Excellence for 2026
            </p>
          </div>

          <div className="rounded-[1.75rem] bg-white p-8 shadow-soft lg:p-10">
            <div className="mb-8">
              <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Please enter your credentials to access the portal.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface" htmlFor="email">
                  University Email
                </label>
                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
                    <MaterialIcon className="text-[20px]" name="mail" />
                  </div>
                  <input
                    className="w-full rounded-xl border-0 bg-surface-container-low py-3 pl-11 pr-4 text-on-surface outline-none transition group-focus-within:border-b-2 group-focus-within:border-primary"
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
                <label className="block text-sm font-semibold text-on-surface" htmlFor="password">
                  Password
                </label>
                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
                    <MaterialIcon className="text-[20px]" name="lock" />
                  </div>
                  <input
                    className="w-full rounded-xl border-0 bg-surface-container-low py-3 pl-11 pr-4 text-on-surface outline-none transition group-focus-within:border-b-2 group-focus-within:border-primary"
                    id="password"
                    name="password"
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, password: event.target.value }))
                    }
                    placeholder="••••••••"
                    required
                    type="password"
                    value={formData.password}
                  />
                </div>
              </div>

              <ErrorMessage message={error} />

              <button
                className="w-full rounded-full bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] py-4 text-sm font-bold tracking-wide text-white shadow-soft transition hover:shadow-ambient disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting}
                type="submit"
              >
                {submitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-on-surface-variant">
                New to Nile University?
                <Link className="ml-1 font-bold text-secondary hover:underline" to="/register">
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-secondary-fixed px-3 py-1 text-xs font-bold text-[#00522d]">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              Systems Operational
            </div>
            <div className="text-xs font-semibold text-outline">v4.2.0-stable</div>
          </div>
        </div>
      </main>

      <footer className="border-t border-outline-variant/10 px-8 py-8 text-outline">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-headline font-bold text-primary">NileConnect</span>
            <span className="text-xs">|</span>
            <p className="text-xs font-medium">
              © 2026 Nile University. All intellectual growth reserved.
            </p>
          </div>
          <div className="flex gap-6 text-xs font-semibold">
            <Link className="transition hover:text-primary" to="/">
              Home
            </Link>
            <Link className="transition hover:text-primary" to="/events">
              Events
            </Link>
            <Link className="transition hover:text-primary" to="/clubs">
              Clubs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
