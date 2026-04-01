import { useEffect, useState } from "react";

import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { EventCard } from "../components/common/EventCard";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import type { EventSummary } from "../types/domain";

export function EventsPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const data = await eventsApi.getEvents();
        if (isMounted) {
          setEvents(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getApiErrorMessage(loadError, "Unable to load events right now."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Upcoming events</h1>
        <p className="mt-2 text-sm text-ink-700">
          Browse campus events in date order and open any listing for full details.
        </p>
      </div>

      {loading ? <LoadingState label="Loading events..." /> : null}
      <ErrorMessage message={error} />

      {!loading && !error && events.length === 0 ? (
        <EmptyState
          description="No upcoming events have been published yet."
          title="No upcoming events"
        />
      ) : null}

      {!loading && !error && events.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {events.map((event) => (
            <EventCard clubName={event.club.name} event={event} key={event.id} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
