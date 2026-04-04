import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { MaterialIcon } from "../components/common/MaterialIcon";
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
    <div className="flex min-h-screen flex-col bg-background text-on-background">
      <main className="relative flex flex-1 items-center justify-center overflow-hidden p-6">
        <div className="absolute right-[-5%] top-[-10%] h-[500px] w-[500px] rounded-full bg-secondary-fixed/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />

        <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-soft lg:grid-cols-2">
          <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-white lg:flex">
            <div className="relative z-10">
              <div className="mb-12 flex items-center gap-2">
                <span className="font-headline text-3xl font-bold tracking-tight">NileConnect</span>
              </div>
              <h1 className="font-headline text-5xl font-extrabold leading-tight tracking-tight">
                The future of campus life, <span className="text-secondary-fixed">reimagined.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-8 text-white/80">
                Join the Nile University ecosystem. Access clubs, events, and campus opportunities
                in one editorial experience.
              </p>
            </div>

            <div className="relative z-10 mt-10 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20">
                <MaterialIcon className="text-secondary-fixed" name="school" />
              </div>
              <div>
                <p className="text-sm font-semibold">Nile University Excellence</p>
                <p className="text-xs text-white/60">Academic Year 2026/2027</p>
              </div>
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] opacity-95" />
          </div>

          <div className="p-8 md:p-16">
            <div className="mb-10">
              <h2 className="font-headline text-3xl font-bold text-primary">Create Account</h2>
              <p className="mt-2 text-on-surface-variant">
                Welcome to NileConnect 2026. Enter your student details to begin.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-outline" htmlFor="name">
                  Full Name
                </label>
                <input
                  className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-b-2 focus:border-primary"
                  id="name"
                  onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                  placeholder="John Doe"
                  required
                  value={formData.name}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-outline" htmlFor="email">
                  University Email
                </label>
                <input
                  className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-b-2 focus:border-primary"
                  id="email"
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  placeholder="username@nile.edu"
                  required
                  type="email"
                  value={formData.email}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-outline" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-b-2 focus:border-primary"
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

              <ErrorMessage message={error} />

              <div className="space-y-4 pt-4">
                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] py-4 text-lg font-semibold text-white shadow-soft transition hover:shadow-ambient disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={submitting}
                  type="submit"
                >
                  <span>{submitting ? "Creating account..." : "Create Account"}</span>
                  <MaterialIcon className="text-sm" name="arrow_forward" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="h-px grow bg-outline-variant/30" />
                  <span className="text-xs font-medium text-outline">Already have an account?</span>
                  <div className="h-px grow bg-outline-variant/30" />
                </div>

                <Link
                  className="block w-full rounded-full bg-secondary-container py-3.5 text-center font-semibold text-[#00210f] transition hover:bg-secondary-fixed"
                  to="/login"
                >
                  Sign In to NileConnect
                </Link>
              </div>
            </form>

            <div className="mt-8 border-t border-surface-container-high pt-8">
              <p className="text-center text-[10px] uppercase tracking-[0.2em] text-outline">
                By creating an account, you agree to Nile University&apos;s academic code of conduct
                and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-slate-100 px-8 py-10">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="font-headline text-lg font-bold text-primary">NileConnect</span>
            <p className="text-sm text-slate-600">
              © 2026 Nile University. All intellectual growth reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
            <Link className="transition hover:text-emerald-600" to="/">
              Home
            </Link>
            <Link className="transition hover:text-emerald-600" to="/events">
              Events
            </Link>
            <Link className="transition hover:text-emerald-600" to="/clubs">
              Clubs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
