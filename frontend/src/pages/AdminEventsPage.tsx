import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { formatDate } from "../lib/utils";
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
          setError(getApiErrorMessage(loadError, "Unable to load your events right now."));
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
    const confirmed = window.confirm("Delete this event?");

    if (!confirmed) {
      return;
    }

    setDeletingId(eventId);
    setError(null);

    try {
      await eventsApi.deleteEvent(eventId);
      setEvents((current) => current.filter((event) => event.id !== eventId));
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, "Unable to delete this event right now."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink-900">Manage events</h1>
          <p className="mt-2 text-sm text-ink-700">
            Create, update, and remove the events published by your club.
          </p>
        </div>

        <Link
          className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          to="/admin/events/new"
        >
          Create event
        </Link>
      </div>

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
          description="Your club does not have any events published yet."
          title="No events yet"
        />
      ) : null}

      {!loading && !error && events.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-card">
          <div className="hidden grid-cols-[2fr_1fr_1.3fr_1fr] gap-4 border-b border-ink-100 px-6 py-4 text-sm font-semibold text-ink-700 md:grid">
            <span>Title</span>
            <span>Date</span>
            <span>Venue</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-ink-100">
            {events.map((event) => (
              <div
                className="grid gap-4 px-6 py-5 md:grid-cols-[2fr_1fr_1.3fr_1fr] md:items-center"
                key={event.id}
              >
                <div>
                  <p className="font-semibold text-ink-900">{event.title}</p>
                  <p className="mt-1 text-sm text-ink-700">{event.category}</p>
                </div>
                <p className="text-sm text-ink-700">{formatDate(event.eventDate)}</p>
                <p className="text-sm text-ink-700">{event.venue}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <Link
                    className="font-semibold text-brand-700 transition hover:text-brand-600"
                    to={`/events/${event.id}`}
                  >
                    View
                  </Link>
                  <Link
                    className="font-semibold text-brand-700 transition hover:text-brand-600"
                    to={`/admin/events/${event.id}/edit`}
                  >
                    Edit
                  </Link>
                  <button
                    className="font-semibold text-red-700 transition hover:text-red-600"
                    disabled={deletingId === event.id}
                    onClick={() => handleDelete(event.id)}
                    type="button"
                  >
                    {deletingId === event.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
