import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { formatDate, formatTimeRange } from "../lib/utils";
import type { ManagedEvent } from "../types/domain";

export function AdminEventsPage() {
  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const data = await eventsApi.getAdminEvents();
        if (isMounted) {
          setEvents(data);
        }

        const detailResults = await Promise.allSettled(
          data.map(async (event) => {
            const detail = await eventsApi.getEventById(event.id);
            return { id: event.id, rsvpCount: detail.rsvpCount };
          }),
        );

        if (isMounted) {
          const nextCounts: Record<string, number> = {};
          detailResults.forEach((result) => {
            if (result.status === "fulfilled") {
              nextCounts[result.value.id] = result.value.rsvpCount;
            }
          });
          setRsvpCounts(nextCounts);
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

  const filteredEvents = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();

    if (!normalized) {
      return events;
    }

    return events.filter((event) =>
      [event.title, event.category, event.venue].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [events, searchQuery]);

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
      setRsvpCounts((current) => {
        const next = { ...current };
        delete next[eventId];
        return next;
      });
    } catch (deleteError) {
      setError(
        getApiErrorMessage(deleteError, "We couldn't delete that event right now. Please try again."),
      );
    } finally {
      setDeletingId(null);
    }
  };

  const totalRsvps = Object.values(rsvpCounts).reduce((sum, value) => sum + value, 0);
  const upcomingEvents = events.filter(
    (event) => new Date(`${event.eventDate}T00:00:00`).getTime() >= new Date().setHours(0, 0, 0, 0),
  ).length;
  const totalCategories = new Set(events.map((event) => event.category)).size;

  return (
    <section className="space-y-8">
      <section className="grid gap-8 xl:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] bg-surface-container-low p-6 shadow-soft">
          <div className="px-2 pb-8">
            <div className="font-headline text-2xl font-bold tracking-tight text-primary">
              NileConnect
            </div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
              Admin Suite
            </p>
          </div>

          <nav className="space-y-2">
            <div className="flex items-center gap-3 rounded-2xl bg-primary px-4 py-3 text-white">
              <MaterialIcon name="dashboard" />
              <span className="font-medium">Dashboard</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-on-surface-variant">
              <MaterialIcon name="calendar_today" />
              <span className="font-medium">Events</span>
            </div>
          </nav>

          <div className="mt-10 rounded-[1.5rem] bg-primary p-5 text-white">
            <h3 className="font-headline text-xl font-bold">Recruitment Drive Active</h3>
            <p className="mt-3 text-sm leading-7 text-white/75">
              Your club can keep building momentum by publishing timely events and updating details
              students can trust.
            </p>
          </div>
        </aside>

        <div className="space-y-8">
          <section className="rounded-[2rem] bg-white p-8 shadow-soft">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                  Club Leader Dashboard
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant sm:text-base">
                  Manage your club event listings, review schedule coverage, and keep campus-facing
                  information polished.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-outline-variant px-6 py-3 font-semibold text-primary transition hover:bg-surface-container-low"
                  to="/clubs"
                >
                  View public clubs
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] px-8 py-3 font-bold text-white transition hover:shadow-soft"
                  to="/admin/events/new"
                >
                  Create Event
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
              <MaterialIcon className="mb-3 text-primary" name="database" />
              <p className="text-3xl font-extrabold text-on-surface">{events.length}</p>
              <p className="mt-1 text-sm text-on-surface-variant">Total events</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
              <MaterialIcon className="mb-3 text-secondary" name="event_upcoming" />
              <p className="text-3xl font-extrabold text-on-surface">{upcomingEvents}</p>
              <p className="mt-1 text-sm text-on-surface-variant">Upcoming events</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
              <MaterialIcon className="mb-3 text-primary" name="how_to_reg" />
              <p className="text-3xl font-extrabold text-on-surface">{totalRsvps}</p>
              <p className="mt-1 text-sm text-on-surface-variant">
                Total RSVPs across {totalCategories || 0} categorie{totalCategories === 1 ? "y" : "s"}
              </p>
            </div>
          </section>
        </div>
      </section>

      {loading ? <LoadingState label="Loading your club events..." /> : null}
      <ErrorMessage message={error} />

      {!loading && !error && events.length === 0 ? (
        <EmptyState
          action={
            <Link
              className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] px-6 py-3 font-semibold text-white"
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
        <section className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
          <div className="flex flex-col gap-4 border-b border-surface-container px-8 py-6 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="font-headline text-xl font-bold text-primary">Event Management</h2>
            <label className="relative block w-full lg:w-72">
              <MaterialIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                name="search"
              />
              <input
                className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-low py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search events..."
                value={searchQuery}
              />
            </label>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="px-8 py-10">
              <EmptyState
                description="Try a different search term to find the event you want to manage."
                title="No events match this search"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-surface-container text-xs uppercase tracking-[0.2em] text-outline">
                  <tr>
                    <th className="px-8 py-5">Event Details</th>
                    <th className="px-8 py-5">Date & Time</th>
                    <th className="px-8 py-5">RSVPs</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filteredEvents.map((event) => (
                    <tr className="group transition hover:bg-surface-container-low/50" key={event.id}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary">
                            <MaterialIcon name="event" />
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">{event.title}</p>
                            <p className="text-xs text-on-surface-variant">{event.venue}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-semibold text-on-surface">{formatDate(event.eventDate)}</p>
                        <p className="text-sm text-outline">
                          {formatTimeRange(event.startTime, event.endTime)}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-secondary">
                          {rsvpCounts[event.id] ?? 0} RSVP
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-3">
                          <Link
                            className="rounded-xl bg-surface-container-low px-4 py-2 text-sm font-semibold text-primary transition hover:bg-surface-container-high"
                            to={`/events/${event.id}`}
                          >
                            View
                          </Link>
                          <Link
                            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-on-surface ring-1 ring-outline-variant/30 transition hover:bg-surface-container-low"
                            to={`/admin/events/${event.id}/edit`}
                          >
                            Edit
                          </Link>
                          <button
                            className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={deletingId === event.id}
                            onClick={() => handleDelete(event.id)}
                            type="button"
                          >
                            {deletingId === event.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}
    </section>
  );
}
