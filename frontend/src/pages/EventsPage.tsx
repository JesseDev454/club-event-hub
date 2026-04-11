import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { getCategoryVisual } from "../lib/presentation";
import { formatDate, formatTimeRange, getInitials } from "../lib/utils";
import type { EventListItem } from "../types/domain";

const ALL_CATEGORIES = "All Events";

export function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);

  useEffect(() => {
    const urlQuery = searchParams.get("q") ?? "";
    setSearchQuery((current) => (current === urlQuery ? current : urlQuery));
  }, [searchParams]);

  useEffect(() => {
    const normalizedQuery = searchQuery.trim();
    const currentQuery = searchParams.get("q") ?? "";

    if (normalizedQuery === currentQuery) {
      return;
    }

    if (normalizedQuery) {
      setSearchParams({ q: normalizedQuery }, { replace: true });
      return;
    }

    setSearchParams({}, { replace: true });
  }, [searchParams, searchQuery, setSearchParams]);

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

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const categoryOptions = useMemo(
    () => [
      ALL_CATEGORIES,
      ...Array.from(new Set(events.map((event) => event.category))).sort((left, right) =>
        left.localeCompare(right),
      ),
    ],
    [events],
  );

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      normalizedSearchQuery.length === 0 ||
      [event.title, event.description, event.club.name].some((value) =>
        value.toLowerCase().includes(normalizedSearchQuery),
      );
    const matchesCategory =
      selectedCategory === ALL_CATEGORIES || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalRsvps = events.reduce((sum, event) => sum + (event.rsvpCount ?? 0), 0);

  return (
    <section className="space-y-8 lg:space-y-14">
      <section className="rounded-[2rem] bg-surface px-2 py-6 sm:px-0">
        <div className="max-w-4xl">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.22em] text-secondary">
            Campus Life
          </span>
          <h1 className="nc-text-safe font-headline text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-7xl">
            Discover What's Next
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-on-surface-variant sm:mt-6 sm:text-lg sm:leading-8">
            Your portal to everything happening across Nile University. From career-defining workshops to social nights and sports energy, find the events worth showing up for.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-primary-container px-4 py-2 text-sm font-semibold text-white">
              {events.length} published event{events.length === 1 ? "" : "s"}
            </span>
            <span className="rounded-full bg-surface-container-low px-4 py-2 text-sm font-semibold text-on-surface">
              {totalRsvps} total RSVPs
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] bg-surface-container-lowest/90 p-4 shadow-soft backdrop-blur-xl md:sticky md:top-24 md:z-20 md:rounded-[1.75rem] md:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <label className="relative w-full xl:max-w-md">
              <MaterialIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" name="search" />
              <input
                className="w-full rounded-xl bg-surface-container-low py-3 pl-12 pr-4 text-sm text-on-surface outline-none transition focus:ring-2 focus:ring-primary"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by title, club, or keyword..."
                value={searchQuery}
              />
            </label>

            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 sm:flex-wrap sm:overflow-visible">
              {categoryOptions.map((category) => (
                <button
                  className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition ${
                    category === selectedCategory
                      ? "bg-primary-container text-white"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {!loading && !error ? (
            <p className="text-sm text-on-surface-variant">
              Showing <span className="font-semibold text-primary">{filteredEvents.length}</span> event
              {filteredEvents.length === 1 ? "" : "s"} matching your current view.
            </p>
          ) : null}
        </div>
      </section>

      {loading ? <LoadingState label="Loading events..." /> : null}
      <ErrorMessage message={error} />

      {!loading && !error && events.length === 0 ? (
        <EmptyState
          description="No upcoming events have been published yet."
          title="No upcoming events"
        />
      ) : null}

      {!loading && !error && events.length > 0 && filteredEvents.length === 0 ? (
        <EmptyState
          description="Try a different title or category to explore more upcoming events."
          title="No events match your search right now"
        />
      ) : null}

      {!loading && !error && filteredEvents.length > 0 ? (
        <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => {
            const visual = getCategoryVisual(event.category);

            return (
              <article
                className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] bg-surface-container-lowest shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                key={event.id}
              >
                <div className="relative h-56 overflow-hidden">
                  <img alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" decoding="async" loading="lazy" src={visual.image} />
                  <div className="absolute left-4 top-4">
                    <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] ${visual.pillClassName}`}>
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold text-secondary">
                    <MaterialIcon className="text-base text-primary" filled name="calendar_today" />
                    <span className="nc-text-safe">{formatDate(event.eventDate)} | {formatTimeRange(event.startTime, event.endTime)}</span>
                  </div>

                  <h3 className="nc-line-clamp-2 nc-text-safe font-headline text-2xl font-extrabold text-primary">{event.title}</h3>
                  <p className="nc-line-clamp-3 mt-3 flex-grow text-sm leading-7 text-on-surface-variant">{event.description}</p>

                  <div className="mt-6 border-t border-surface-container pt-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-outline">
                          Hosted By
                        </span>
                        <span className="nc-line-clamp-2 nc-text-safe text-xs font-bold text-primary">{event.club.name}</span>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 text-xs font-bold text-on-surface">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${visual.accentClassName}`}>
                          {getInitials(event.club.name)}
                        </div>
                        <MaterialIcon className="text-base text-secondary" filled name="groups" />
                        <span>{event.rsvpCount ?? 0} Attending</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-on-surface-variant">
                      <MaterialIcon className="text-lg text-primary" filled name="location_on" />
                      <span className="nc-line-clamp-2 nc-text-safe">{event.venue}</span>
                    </div>
                  </div>

                  <Link
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-surface-container-low py-3 font-bold text-primary transition hover:bg-surface-container-high"
                    to={`/events/${event.id}`}
                  >
                    View Details
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}

      {!loading && !error && events.length > 0 ? (
        <section className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-16 text-center shadow-soft sm:px-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-secondary-fixed blur-3xl" />
            <div className="absolute bottom-0 left-0 h-56 w-56 -translate-x-1/3 translate-y-1/3 rounded-full bg-primary-fixed blur-3xl" />
          </div>
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="font-headline text-4xl font-extrabold text-white md:text-5xl">
              Never Miss a Beat
            </h2>
            <p className="mt-5 text-lg leading-8 text-primary-fixed">
              Keep exploring upcoming NileConnect events and use the detail pages to decide what deserves your time this week.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-xl bg-secondary-fixed px-8 py-4 font-bold text-on-secondary-fixed transition hover:bg-secondary-container"
                to="/register"
              >
                Create Your Account
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-bold text-white transition hover:bg-white/20"
                to="/clubs"
              >
                Explore Clubs Too
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </section>
  );
}
