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
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Campus clubs</h1>
        <p className="mt-2 text-sm text-ink-700">
          Explore active campus communities and discover where events are happening.
        </p>
      </div>

      {loading ? <LoadingState label="Loading clubs..." /> : null}
      <ErrorMessage message={error} />

      {!loading && !error && clubs.length === 0 ? (
        <EmptyState
          description="No clubs have been published yet."
          title="No clubs available"
        />
      ) : null}

      {!loading && !error && clubs.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {clubs.map((club) => (
            <ClubCard club={club} key={club.id} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
