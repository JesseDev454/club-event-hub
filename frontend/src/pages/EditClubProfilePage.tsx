import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";

import { clubsApi } from "../api/clubsApi";
import { getApiErrorMessage } from "../api/client";
import { ClubForm } from "../components/common/ClubForm";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
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

export function EditClubProfilePage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<ClubFormValues>(initialFormValues);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    typeof location.state === "object" &&
      location.state &&
      "notice" in location.state &&
      typeof location.state.notice === "string"
      ? location.state.notice
      : null,
  );
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadClub = async () => {
      if (!user?.clubId) {
        setError("Your account is not linked to a club.");
        setLoading(false);
        return;
      }

      try {
        const club = await clubsApi.getAdminClub();

        if (isMounted) {
          setLoadFailed(false);
          setFormData({
            name: club.name,
            description: club.description,
            category: club.category,
            contactEmail: club.contactEmail ?? "",
            tagline: club.tagline ?? "",
          });
        }
      } catch (loadError) {
        if (isMounted) {
          setLoadFailed(true);
          setError(getApiErrorMessage(loadError, "We couldn't load your club profile right now."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadClub();

    return () => {
      isMounted = false;
    };
  }, [user?.clubId]);

  if (!user?.clubId) {
    return (
      <EmptyState
        description="Your account needs an assigned club before you can edit a club profile."
        title="No managed club"
      />
    );
  }

  const managedClubId = user.clubId;

  if (id && id !== managedClubId) {
    return <Navigate replace to={`/clubs/${managedClubId}/edit`} />;
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
      await clubsApi.updateClub(managedClubId, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        contactEmail: normalizeNullableString(formData.contactEmail),
        tagline: normalizeNullableString(formData.tagline),
      });

      navigate(`/clubs/${managedClubId}`, { replace: true });
    } catch (submissionError) {
      setError(
        getApiErrorMessage(
          submissionError,
          "We couldn't save your club profile right now. Please review the form and try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading club profile..." />;
  }

  if (loadFailed) {
    return (
      <div className="space-y-6">
        <ErrorMessage message={error} />
        <EmptyState
          description="Your club profile could not be loaded. It may no longer exist, or your account may not have access to manage it."
          title="Cannot edit club profile"
        />
      </div>
    );
  }

  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <span className="mb-2 block text-sm font-bold uppercase tracking-[0.2em] text-secondary">
            My Club Workspace
          </span>
          <h1 className="font-headline text-5xl font-extrabold tracking-tight text-primary">
            Shape Your Club Presence
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
            Update the public identity of your club while keeping ownership and admin permissions scoped to your account.
          </p>
        </div>

        <div className="rounded-xl bg-surface-container-low p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed text-primary-container">
              <MaterialIcon name="edit_note" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary">Public profile update</p>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                These changes go straight to the public club page students see.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ClubForm
        cancelHref={`/clubs/${managedClubId}`}
        error={error}
        formData={formData}
        helperText="Saving updates the public club profile while preserving the current ownership rules enforced by the backend."
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Save Club Profile"
        submitting={submitting}
      />
    </section>
  );
}
