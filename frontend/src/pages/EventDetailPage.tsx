import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { formatDate, formatTimeRange } from "../lib/utils";
import type { EventDetail } from "../types/domain";

export function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEvent = async () => {
      if (!id) {
        setError("Event id is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await eventsApi.getEventById(id);
        if (isMounted) {
          setEvent(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getApiErrorMessage(loadError, "Unable to load this event right now."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadEvent();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <section className="space-y-6">
      {loading ? <LoadingState label="Loading event details..." /> : null}
      <ErrorMessage message={error} />

      {!loading && !error && !event ? (
        <EmptyState
          description="The event could not be found."
          title="Event unavailable"
        />
      ) : null}

      {!loading && !error && event ? (
        <>
          <div className="rounded-3xl border border-white/70 bg-white px-6 py-8 shadow-card sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
              {event.category}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink-900">{event.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-ink-700">{event.description}</p>

            <div className="mt-6 grid gap-3 text-sm text-ink-700 sm:grid-cols-2">
              <p>
                <span className="font-medium text-ink-900">Date:</span>{" "}
                {formatDate(event.eventDate)}
              </p>
              <p>
                <span className="font-medium text-ink-900">Time:</span>{" "}
                {formatTimeRange(event.startTime, event.endTime)}
              </p>
              <p>
                <span className="font-medium text-ink-900">Venue:</span> {event.venue}
              </p>
              <p>
                <span className="font-medium text-ink-900">Hosting club:</span>{" "}
                <Link
                  className="text-brand-700 transition hover:text-brand-600"
                  to={`/clubs/${event.club.id}`}
                >
                  {event.club.name}
                </Link>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-ink-100 bg-white px-6 py-6 shadow-card">
            <h2 className="text-lg font-semibold text-ink-900">RSVP coming next</h2>
            <p className="mt-2 text-sm text-ink-700">
              RSVP actions will be added in Sprint 3. This page is intentionally leaving room for
              that next step.
            </p>
          </div>
        </>
      ) : null}
    </section>
  );
}
