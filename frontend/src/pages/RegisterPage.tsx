import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { Button } from "../components/ui/Button";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Input } from "../components/ui/Input";
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
      setError(getApiErrorMessage(submissionError, "Unable to create your account."));
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Create account</h1>
        <p className="mt-2 text-sm text-ink-700">
          Sign up as a student to browse campus clubs and events.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ink-900" htmlFor="name">
            Full name
          </label>
          <Input
            id="name"
            onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
            placeholder="Jane Student"
            required
            value={formData.name}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ink-900" htmlFor="email">
            Email address
          </label>
          <Input
            id="email"
            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            placeholder="jane@example.com"
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

        <Button className="w-full" disabled={submitting} type="submit">
          {submitting ? "Creating account..." : "Register"}
        </Button>

        <p className="text-center text-sm text-ink-700">
          Already have an account?{" "}
          <Link className="font-medium text-brand-700 hover:text-brand-600" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
