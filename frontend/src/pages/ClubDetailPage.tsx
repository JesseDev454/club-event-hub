import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { clubsApi } from "../api/clubsApi";
import { EventCard } from "../components/common/EventCard";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import type { ClubDetail } from "../types/domain";

export function ClubDetailPage() {
  const { id } = useParams();
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadClub = async () => {
      if (!id) {
        setError("Club id is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await clubsApi.getClubById(id);
        if (isMounted) {
          setClub(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getApiErrorMessage(loadError, "Unable to load this club right now."));
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
  }, [id]);

  return (
    <section className="space-y-6">
      {loading ? <LoadingState label="Loading club details..." /> : null}
      <ErrorMessage message={error} />

      {!loading && !error && !club ? (
        <EmptyState
          description="The club could not be found."
          title="Club unavailable"
        />
      ) : null}

      {!loading && !error && club ? (
        <>
          <div className="rounded-3xl border border-white/70 bg-white px-6 py-8 shadow-card sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
              {club.category}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink-900">{club.name}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-ink-700">{club.description}</p>
            {club.contactEmail ? (
              <p className="mt-5 text-sm text-ink-700">
                Contact: <span className="font-medium text-ink-900">{club.contactEmail}</span>
              </p>
            ) : null}
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-ink-900">Upcoming events</h2>
              <p className="mt-1 text-sm text-ink-700">
                Events hosted by {club.name} that are currently upcoming.
              </p>
            </div>

            {club.upcomingEvents.length === 0 ? (
              <EmptyState
                description="This club does not have any upcoming events yet."
                title="No upcoming events"
              />
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {club.upcomingEvents.map((event) => (
                  <EventCard clubName={club.name} event={event} key={event.id} />
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </section>
  );
}
