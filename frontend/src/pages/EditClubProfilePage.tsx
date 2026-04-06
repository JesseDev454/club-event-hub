import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";

import { clubsApi } from "../api/clubsApi";
import { getApiErrorMessage } from "../api/client";
import { ClubForm } from "../components/common/ClubForm";
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
        const club = await clubsApi.getManagedClub(user.clubId);

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
    <section className="space-y-8">
      <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
            Edit Club Profile
          </h1>
          <p className="mt-4 text-base leading-7 text-on-surface-variant">
            Update the public identity of your club while preserving the ownership and admin rules
            already enforced by the backend.
          </p>
        </div>
      </section>

      <ClubForm
        error={error}
        formData={formData}
        helperText="Changes update the public club profile and remain scoped to your owned club."
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Save Club Profile"
        submitting={submitting}
      />
    </section>
  );
}
