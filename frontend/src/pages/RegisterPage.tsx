import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { AuthSplitLayout } from "../components/auth/AuthSplitLayout";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { useAuth } from "../state/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await register(formData);
      navigate("/", { replace: true });
    } catch (submissionError) {
      setError(
        getApiErrorMessage(
          submissionError,
          "We couldn't create your account yet. Review your details and try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState label="Preparing registration..." />;
  }

  if (isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  return (
    <AuthSplitLayout
      eyebrow="Student Access"
      footerPrompt={
        <>
          Already have an account?{" "}
          <Link className="font-bold text-primary hover:underline" to="/login">
            Login
          </Link>
        </>
      }
      helperText="Create your NileConnect student account to discover clubs, RSVP to events, and later start a club of your own inside the same product."
      subtitle="Enter your details to create your student account."
      title="Create your account"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="ml-1 block text-sm font-semibold text-on-surface" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
                <MaterialIcon className="text-lg" name="person" />
              </div>
              <input
                className="w-full rounded-xl border-none bg-surface-container-low py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary"
                id="name"
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                placeholder="John Doe"
                required
                value={formData.name}
              />
            </div>
          </div>

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
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                placeholder="name@nileuniversity.edu"
                required
                type="email"
                value={formData.email}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-1 block text-sm font-semibold text-on-surface" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
                <MaterialIcon className="text-lg" name="lock" />
              </div>
              <input
                className="w-full rounded-xl border-none bg-surface-container-low py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary"
                id="password"
                minLength={8}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, password: event.target.value }))
                }
                placeholder="At least 8 characters"
                required
                type="password"
                value={formData.password}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
          Registration creates a <span className="font-semibold text-primary">student</span> account.
          Club admin access happens later only when you create a club inside the app.
        </div>

        <ErrorMessage message={error} />

        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] py-4 font-headline text-lg font-bold text-white shadow-[0px_12px_32px_rgba(0,30,64,0.15)] transition-all duration-300 hover:shadow-[0px_12px_32px_rgba(0,30,64,0.25)] hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          <span>{submitting ? "Creating account..." : "Register"}</span>
          <MaterialIcon className="text-sm" name="arrow_forward" />
        </button>
      </form>
    </AuthSplitLayout>
  );
}
