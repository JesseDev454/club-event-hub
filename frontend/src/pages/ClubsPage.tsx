import { useEffect, useState } from "react";

import { getApiErrorMessage } from "../api/client";
import { clubsApi } from "../api/clubsApi";
import { ClubCard } from "../components/common/ClubCard";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import type { ClubSummary } from "../types/domain";

export function ClubsPage() {
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadClubs = async () => {
      try {
        const data = await clubsApi.getClubs();
        if (isMounted) {
          setClubs(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getApiErrorMessage(loadError, "Unable to load clubs right now."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadClubs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="space-y-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
          Student communities
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Campus clubs
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-700 sm:text-base">
          Explore active student communities, learn what they are about, and discover the clubs
          shaping campus life.
        </p>
        {!loading && !error && clubs.length > 0 ? (
          <p className="mt-4 text-sm text-ink-700">
            Showing <span className="font-semibold text-ink-900">{clubs.length}</span> active club
            {clubs.length === 1 ? "" : "s"}.
          </p>
        ) : null}
      </div>

      {loading ? <LoadingState label="Loading clubs..." /> : null}
      <ErrorMessage message={error} />

      {!loading && !error && clubs.length === 0 ? (
        <EmptyState
          description="Clubs will appear here as communities are added to the platform."
          title="No clubs available"
        />
      ) : null}

      {!loading && !error && clubs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {clubs.map((club) => (
            <ClubCard club={club} key={club.id} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
