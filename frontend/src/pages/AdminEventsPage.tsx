import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { clubsApi } from "../api/clubsApi";
import { eventsApi } from "../api/eventsApi";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { getCategoryVisual } from "../lib/presentation";
import { formatDate, formatTimeRange, getInitials } from "../lib/utils";
import type { ClubSummary, ManagedEvent } from "../types/domain";

type DashboardLocationState = {
  justCreatedClub?: boolean;
  clubId?: string;
  clubName?: string;
};

function DashboardMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="space-y-2 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
      <MaterialIcon className="text-primary" name={icon} />
      <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-outline">{label}</span>
      <span className="block text-3xl font-extrabold text-primary">{value}</span>
    </div>
  );
}

function AdminNavLink({
  active = false,
  icon,
  label,
  to,
}: {
  active?: boolean;
  icon: string;
  label: string;
  to: string;
}) {
  return (
    <Link
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
        active
          ? "bg-white text-primary shadow-sm"
          : "text-slate-500 hover:bg-surface-container-highest"
      }`}
      to={to}
    >
      <MaterialIcon className="text-[20px]" name={icon} />
      <span>{label}</span>
    </Link>
  );
}

export function AdminEventsPage() {
  const location = useLocation();
  const locationState = (location.state as DashboardLocationState | null) ?? null;
  const [club, setClub] = useState<ClubSummary | null>(null);
  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const [clubData, eventData] = await Promise.all([
          clubsApi.getAdminClub(),
          eventsApi.getAdminEvents(),
        ]);

        if (isMounted) {
          setClub(clubData);
          setEvents(eventData);
        }

        const detailResults = await Promise.allSettled(
          eventData.map(async (event) => {
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
              "We couldn't load your club workspace right now. Please refresh and try again.",
            ),
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();

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
  const today = new Date().setHours(0, 0, 0, 0);
  const upcomingEvents = events.filter(
    (event) => new Date(`${event.eventDate}T00:00:00`).getTime() >= today,
  ).length;
  const totalCategories = new Set(events.map((event) => event.category)).size;
  const showCreationSuccess = Boolean(locationState?.justCreatedClub);

  if (loading) {
    return <LoadingState label="Loading your club workspace..." />;
  }

  const clubVisual = getCategoryVisual(club?.category ?? "Technology");

  return (
    <section className="grid gap-8 xl:grid-cols-[260px_1fr]">
      <aside className="hidden h-fit flex-col gap-2 rounded-2xl bg-[#f1f4f9] p-4 xl:sticky xl:top-28 xl:flex">
        <div className="mb-6 px-2">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-primary-container text-on-primary">
              {club ? (
                <span className="text-sm font-bold">{getInitials(club.name)}</span>
              ) : (
                <MaterialIcon name="shield_person" />
              )}
            </div>
            <div>
              <p className="text-lg font-bold leading-tight text-primary">Admin Portal</p>
              <p className="text-xs text-slate-500">My Club Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <AdminNavLink active icon="dashboard" label="Dashboard" to="/admin/events" />
          {club ? (
            <>
              <AdminNavLink icon="edit_note" label="Edit Club" to={`/clubs/${club.id}/edit`} />
              <AdminNavLink icon="visibility" label="Public Profile" to={`/clubs/${club.id}`} />
            </>
          ) : null}
        </nav>

        <div className="mt-auto border-t border-outline-variant/20 pt-4">
          <Link
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] py-3 text-sm font-bold text-white shadow-md transition-transform active:scale-95"
            to="/admin/events/new"
          >
            <MaterialIcon className="text-sm" name="add" />
            <span>Create Event</span>
          </Link>
          <a
            className="flex items-center gap-3 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-500 hover:underline"
            href="mailto:support@nileconnect.edu"
          >
            <MaterialIcon className="text-sm" name="help" />
            <span>Support</span>
          </a>
        </div>
      </aside>

      <div className="space-y-10">
        {showCreationSuccess && club ? (
          <section className="rounded-[2rem] border border-secondary/20 bg-secondary-container p-8 shadow-soft">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00522d]">
                  Club Created
                </p>
                <h1 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-[#00210f] sm:text-4xl">
                  {locationState?.clubName ?? club.name} is now live on NileConnect.
                </h1>
                <p className="mt-4 text-sm leading-7 text-[#00522d] sm:text-base">
                  You are now managing this club as a club admin. The next best step is to polish the
                  public profile, publish your first event, or check how students will see your club.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-primary transition hover:bg-surface-container-highest"
                  to={`/clubs/${club.id}/edit`}
                >
                  Edit Club
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] px-6 py-3 font-semibold text-white transition hover:shadow-soft"
                  to="/admin/events/new"
                >
                  Create First Event
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-[#00522d]/20 px-6 py-3 font-semibold text-[#00522d] transition hover:bg-white/50"
                  to={`/clubs/${club.id}`}
                >
                  View Public Profile
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Club Administrator
            </span>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary">
              {club?.name ?? "My Club Workspace"}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-on-surface-variant">
            <MaterialIcon name="event_available" />
            <span>{upcomingEvents} upcoming event{upcomingEvents === 1 ? "" : "s"}</span>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="flex flex-col gap-8 rounded-xl bg-surface-container-lowest p-8 shadow-soft md:col-span-8 md:flex-row md:items-start">
            <div className="w-full md:w-1/3">
              <div className="aspect-square overflow-hidden rounded-lg bg-surface-container">
                <img alt={club?.name ?? "Club"} className="h-full w-full object-cover" src={clubVisual.image} />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                {club?.category ? (
                  <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold uppercase tracking-wider text-on-secondary-container">
                    {club.category}
                  </span>
                ) : null}
              </div>

              {club?.tagline ? (
                <p className="text-xl font-medium italic leading-relaxed text-on-surface-variant">
                  "{club.tagline}"
                </p>
              ) : null}

              <p className="text-sm leading-relaxed text-on-surface-variant">
                {club?.description ??
                  "Manage your club profile, publish events, and keep your public presence current for students."}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="rounded-lg bg-surface-container-low px-4 py-2 text-center">
                  <span className="block text-2xl font-extrabold text-primary">{events.length}</span>
                  <span className="text-[10px] font-bold uppercase text-outline">Events Run</span>
                </div>
                <div className="rounded-lg bg-surface-container-low px-4 py-2 text-center">
                  <span className="block text-2xl font-extrabold text-primary">{upcomingEvents}</span>
                  <span className="text-[10px] font-bold uppercase text-outline">Upcoming</span>
                </div>
                <div className="rounded-lg bg-surface-container-low px-4 py-2 text-center">
                  <span className="block text-2xl font-extrabold text-primary">{totalRsvps}</span>
                  <span className="text-[10px] font-bold uppercase text-outline">RSVPs</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:col-span-4">
            <div className="flex h-full flex-col justify-between rounded-xl bg-surface-container-lowest p-6 shadow-soft">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-outline">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {club ? (
                  <>
                    <Link
                      className="group flex w-full items-center justify-between rounded-lg bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high"
                      to={`/clubs/${club.id}/edit`}
                    >
                      <div className="flex items-center gap-3">
                        <MaterialIcon className="text-primary" name="edit_note" />
                        <span className="font-semibold">Edit Club Details</span>
                      </div>
                      <MaterialIcon className="opacity-0 transition-opacity group-hover:opacity-100" name="chevron_right" />
                    </Link>
                    <Link
                      className="group flex w-full items-center justify-between rounded-lg bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high"
                      to={`/clubs/${club.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <MaterialIcon className="text-primary" name="visibility" />
                        <span className="font-semibold">View Public Profile</span>
                      </div>
                      <MaterialIcon className="opacity-0 transition-opacity group-hover:opacity-100" name="chevron_right" />
                    </Link>
                  </>
                ) : null}
                <Link
                  className="group flex w-full items-center justify-between rounded-lg bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high"
                  to="/admin/events/new"
                >
                  <div className="flex items-center gap-3">
                    <MaterialIcon className="text-primary" name="add_circle" />
                    <span className="font-semibold">Create Event</span>
                  </div>
                  <MaterialIcon className="opacity-0 transition-opacity group-hover:opacity-100" name="chevron_right" />
                </Link>
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-3 rounded-lg bg-tertiary-fixed p-4">
                  <MaterialIcon className="text-on-tertiary-fixed-variant" name="campaign" />
                  <p className="text-xs font-medium text-on-tertiary-fixed-variant">
                    Keep your public club profile and upcoming event list current so students can trust what they see.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <DashboardMetric icon="event" label="Total Events" value={`${events.length}`} />
          <DashboardMetric icon="upcoming" label="Upcoming" value={`${upcomingEvents}`} />
          <DashboardMetric icon="groups" label="Total RSVPs" value={`${totalRsvps}`} />
          <DashboardMetric icon="category" label="Categories" value={`${totalCategories}`} />
        </section>

        <ErrorMessage message={error} />

        <section className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                Programming
              </span>
              <h2 className="font-headline text-2xl font-extrabold tracking-tight text-primary">
                Event Management
              </h2>
            </div>
            <label className="relative block w-full sm:w-72">
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

          {!error && events.length === 0 ? (
            <EmptyState
              action={
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] px-6 py-3 font-semibold text-white"
                    to="/admin/events/new"
                  >
                    Create your first event
                  </Link>
                  {club ? (
                    <Link
                      className="inline-flex items-center justify-center rounded-full border border-outline-variant px-6 py-3 font-semibold text-primary transition hover:bg-surface-container-low"
                      to={`/clubs/${club.id}/edit`}
                    >
                      Review club profile
                    </Link>
                  ) : null}
                </div>
              }
              description="Your club is ready. Create your first event to start reaching students and give members something to discover."
              title="No events published yet"
            />
          ) : null}

          {!error && events.length > 0 && filteredEvents.length === 0 ? (
            <EmptyState
              description="Try a different search term to find the event you want to manage."
              title="No events match this search"
            />
          ) : null}

          {!error && filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event) => {
                const eventVisual = getCategoryVisual(event.category);
                const isUpcoming = new Date(`${event.eventDate}T00:00:00`).getTime() >= today;

                return (
                  <article
                    className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-soft transition-transform duration-300 hover:-translate-y-1"
                    key={event.id}
                  >
                    <div className="relative h-40">
                      <img alt={event.title} className="h-full w-full object-cover" src={eventVisual.image} />
                      <div
                        className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                          isUpcoming
                            ? "bg-secondary text-white"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        {isUpcoming ? "Upcoming" : "Past"}
                      </div>
                    </div>

                    <div className="space-y-4 p-6">
                      <div className="space-y-1">
                        <h4 className="font-headline text-lg font-bold leading-tight text-primary">
                          {event.title}
                        </h4>
                        <p className="text-xs font-medium text-outline">
                          {formatDate(event.eventDate)} | {formatTimeRange(event.startTime, event.endTime)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-outline-variant/10 pt-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase text-outline">RSVPs</span>
                          <span className="text-lg font-bold text-primary">{rsvpCounts[event.id] ?? 0}</span>
                        </div>
                        <div className="rounded-lg bg-surface-container-low px-4 py-2">
                          <span className="text-xs font-bold text-secondary">{event.category}</span>
                        </div>
                      </div>

                      <div className="text-sm text-on-surface-variant">
                        <p className="line-clamp-2">{event.venue}</p>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Link
                          className="flex-1 rounded-lg border border-outline-variant/20 py-2 text-center text-xs font-bold transition-colors hover:bg-surface-container-low"
                          to={`/events/${event.id}`}
                        >
                          View
                        </Link>
                        <Link
                          className="flex-1 rounded-lg border border-outline-variant/20 py-2 text-center text-xs font-bold transition-colors hover:bg-surface-container-low"
                          to={`/admin/events/${event.id}/edit`}
                        >
                          Edit
                        </Link>
                        <button
                          className="rounded-lg border border-outline-variant/20 p-2 transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={deletingId === event.id}
                          onClick={() => handleDelete(event.id)}
                          type="button"
                        >
                          <MaterialIcon className="text-[18px]" name={deletingId === event.id ? "hourglass_top" : "delete"} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </section>
      </div>
    </section>
  );
}

