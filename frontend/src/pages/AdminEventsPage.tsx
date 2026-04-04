import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { formatDate, formatTimeRange } from "../lib/utils";
import type { EventSummary } from "../types/domain";

export function AdminEventsPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const data = await eventsApi.getAdminEvents();
        if (isMounted) {
          setEvents(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            getApiErrorMessage(
              loadError,
              "We couldn't load your club events right now. Please refresh and try again.",
            ),
          );
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

  const handleDelete = async (eventId: string) => {
    const eventToDelete = events.find((event) => event.id === eventId);
    const eventTitle = eventToDelete?.title ?? "this event";
    const confirmed = window.confirm(
      `Delete "${eventTitle}" from your club events? This will remove the event listing for students and cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(eventId);
    setError(null);

    try {
      await eventsApi.deleteEvent(eventId);
      setEvents((current) => current.filter((event) => event.id !== eventId));
    } catch (deleteError) {
      setError(
        getApiErrorMessage(
          deleteError,
          "We couldn't delete that event right now. Please try again.",
        ),
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-8">
      <section className="rounded-[1.75rem] border border-white/70 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
              Club admin
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Manage Your Club Events
            </h1>
            <p className="mt-3 text-sm leading-6 text-ink-700 sm:text-base">
              Create, update, and manage events for your club in one place.
            </p>
            {!loading && !error && events.length > 0 ? (
              <p className="mt-4 text-sm text-ink-700">
                You currently have{" "}
                <span className="font-semibold text-ink-900">{events.length}</span> published
                event{events.length === 1 ? "" : "s"} visible from this dashboard.
              </p>
            ) : null}
          </div>

          <Link
            className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            to="/admin/events/new"
          >
            Create new event
          </Link>
        </div>
      </section>

      {loading ? <LoadingState label="Loading your club events..." /> : null}
      <ErrorMessage message={error} />

      {!loading && !error && events.length === 0 ? (
        <EmptyState
          action={
            <Link
              className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              to="/admin/events/new"
            >
              Create your first event
            </Link>
          }
          description="Create your first event and make your club visible on campus."
          title="No events yet"
        />
      ) : null}

      {!loading && !error && events.length > 0 ? (
        <div className="grid gap-5">
          {events.map((event) => (
            <article
              className="rounded-[1.75rem] border border-white/70 bg-white p-5 shadow-card sm:p-6"
              key={event.id}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                      {event.category}
                    </span>
                    <span className="text-sm text-ink-700">
                      {formatDate(event.eventDate)}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink-900">
                    {event.title}
                  </h2>

                  <div className="mt-4 grid gap-3 text-sm text-ink-700 sm:grid-cols-2">
                    <p>
                      <span className="font-medium text-ink-900">Time:</span>{" "}
                      {formatTimeRange(event.startTime, event.endTime)}
                    </p>
                    <p>
                      <span className="font-medium text-ink-900">Venue:</span> {event.venue}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <Link
                    className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink-900 ring-1 ring-ink-100 transition hover:bg-ink-50"
                    to={`/admin/events/${event.id}/edit`}
                  >
                    Edit
                  </Link>
                  <button
                    className="inline-flex items-center justify-center rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 ring-1 ring-red-100 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={deletingId === event.id}
                    onClick={() => handleDelete(event.id)}
                    type="button"
                  >
                    {deletingId === event.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
