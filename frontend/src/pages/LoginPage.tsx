import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { Button } from "../components/ui/Button";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Input } from "../components/ui/Input";
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
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
          Sign in
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Welcome back
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-700 sm:text-base">
          Sign in to RSVP to events or manage your club event listings.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ink-900" htmlFor="email">
            Email address
          </label>
          <Input
            id="email"
            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            placeholder="you@example.com"
            required
            type="email"
            value={formData.email}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ink-900" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            onChange={(event) =>
              setFormData((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="Enter your password"
            required
            type="password"
            value={formData.password}
          />
        </div>

        <ErrorMessage message={error} />

        <Button className="w-full" disabled={submitting} type="submit">
          {submitting ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-sm text-ink-700">
          Need an account?{" "}
          <Link className="font-medium text-brand-700 hover:text-brand-600" to="/register">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
