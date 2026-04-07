import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { clubsApi } from "../api/clubsApi";
import { getApiErrorMessage } from "../api/client";
import { ClubForm } from "../components/common/ClubForm";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { useAuth } from "../state/AuthContext";
import type { ClubFormValues } from "../types/domain";

const initialFormValues: ClubFormValues = {
  name: "",
  description: "",
  category: "",
  contactEmail: "",
  tagline: "",
};

function normalizeNullableString(value: string): string | null {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

export function CreateClubPage() {
  const navigate = useNavigate();
  const { setAuthState, user } = useAuth();
  const [formData, setFormData] = useState<ClubFormValues>(initialFormValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user?.role === "club_admin") {
    return <Navigate replace to={user.clubId ? `/clubs/${user.clubId}/edit` : "/admin/events"} />;
  }

  const handleChange = (field: keyof ClubFormValues, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const creationResult = await clubsApi.createClub({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        contactEmail: normalizeNullableString(formData.contactEmail),
        tagline: normalizeNullableString(formData.tagline),
      });

      setAuthState({
        token: creationResult.token,
        user: creationResult.user,
      });

      navigate("/admin/events", {
        replace: true,
        state: {
          justCreatedClub: true,
          clubId: creationResult.club.id,
          clubName: creationResult.club.name,
        },
      });
    } catch (submissionError) {
      setError(
        getApiErrorMessage(
          submissionError,
          "We couldn't create your club right now. Please review the details and try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <span className="mb-2 block text-sm font-bold uppercase tracking-[0.2em] text-secondary">
            Leadership Journey
          </span>
          <h1 className="font-headline text-5xl font-extrabold tracking-tight text-primary">
            Launch Your Community
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
            Transform your vision into a vibrant campus presence. Define your identity, attract
            members, and start building your legacy at Nile University.
          </p>
        </div>

        <div className="rounded-xl bg-surface-container-low p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed text-primary-container">
              <MaterialIcon name="shield_person" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary">Student-to-admin handoff</p>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                Creating a club upgrades your access so you can manage club profile and events immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ClubForm
        cancelHref="/clubs"
        error={error}
        formData={formData}
        helperText="Launching creates the club using the current backend contract, promotes your account to club admin, and redirects you into the My Club dashboard."
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Launch Club"
        submitting={submitting}
      />

      <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-6">
        <div className="flex items-center gap-3">
          <MaterialIcon className="text-secondary" name="info" />
          <p className="text-sm text-on-surface-variant">
            Registration always creates student accounts first. Club admin access only happens after a real club is created.
          </p>
        </div>
        <Link className="text-sm font-bold text-primary hover:underline" to="/clubs">
          Back to clubs
        </Link>
      </div>
    </section>
  );
}
