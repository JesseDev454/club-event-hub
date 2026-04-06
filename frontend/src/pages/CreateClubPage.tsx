import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { clubsApi } from "../api/clubsApi";
import { getApiErrorMessage } from "../api/client";
import { ClubForm } from "../components/common/ClubForm";
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
      });

      setAuthState({
        token: creationResult.token,
        user: creationResult.user,
      });

      const tagline = normalizeNullableString(formData.tagline);

      if (tagline) {
        try {
          await clubsApi.updateClub(creationResult.club.id, {
            tagline,
          });
        } catch (taglineError) {
          navigate(`/clubs/${creationResult.club.id}/edit`, {
            replace: true,
            state: {
              notice:
                getApiErrorMessage(
                  taglineError,
                  "Your club was created, but we couldn't save the optional tagline yet.",
                ) || "Your club was created, but we couldn't save the optional tagline yet.",
            },
          });
          return;
        }
      }

      navigate(`/clubs/${creationResult.club.id}/edit`, { replace: true });
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
    <section className="space-y-8">
      <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
            Create Your Club
          </h1>
          <p className="mt-4 text-base leading-7 text-on-surface-variant">
            Start a new campus community. Once your club is created, your account is promoted to
            club admin immediately and you can manage your club profile and events from inside the
            app.
          </p>
        </div>
      </section>

      <ClubForm
        error={error}
        formData={formData}
        helperText="Creating a club promotes your account to club admin and unlocks club management."
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Create Club"
        submitting={submitting}
      />
    </section>
  );
}
