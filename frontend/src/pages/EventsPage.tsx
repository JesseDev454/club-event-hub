import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { formatDate, formatTimeRange, getInitials } from "../lib/utils";
import { getCategoryVisual } from "../lib/presentation";
import type { EventSummary } from "../types/domain";

const ALL_CATEGORIES = "All Events";

export function EventsPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const data = await eventsApi.getEvents();
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

  const totalRsvps = Object.values(rsvpCounts).reduce((sum, value) => sum + value, 0);

  return (
    <section className="space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-primary px-8 py-10 text-white shadow-soft md:px-12 md:py-14">
        <div className="absolute inset-0 opacity-20">
          <img
            alt="Explore campus events"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB47vYS6K3LOTDUW85J-5Js3CAsOBcGeOWSrsrHpfXLNyNQoeAEAmo5MsVaPs8krPQ6LzdHEXz9wZp5nRJIHFmZOvSNwfurrYE7ewLVzaMPYvEmKhbRiz0oG6Im6x_Wuv9CCdY2cxm5FYRsuibIvFdUe_zOoddCt4GHg7zOik7AC7X7PvyFbsrgQH63bIJ4HfijB8bDEdbpww9UAsvP8xjBvWkGlDFTtOltvDj2aOkOpxpL1uSWW1zsCKq-Tn7UJxujGk1A-3moITAP"
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl">
            Explore Campus Events
          </h1>
          <p className="mt-4 text-lg leading-8 text-white/80">
            Join the pulse of Nile University. From academic breakthroughs to social mixers, find
            your next opportunity to connect and grow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 bg-secondary-container/20 px-4 py-2 text-sm font-medium text-secondary-fixed">
              {events.length} event{events.length === 1 ? "" : "s"} published
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium">
              {totalRsvps} total RSVPs
            </span>
          </div>
        </div>
      </section>

      {loading ? <LoadingState label="Loading events..." /> : null}
      <ErrorMessage message={error} />

      {!loading && !error && events.length > 0 ? (
        <section className="sticky top-24 z-20 rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="no-scrollbar flex gap-3 overflow-x-auto">
                {categoryOptions.map((category) => (
                  <button
                    className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                      category === selectedCategory
                        ? "bg-primary text-white"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest"
                    }`}
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex w-full items-center gap-3 xl:w-auto">
                <label className="relative block w-full xl:w-80">
                  <MaterialIcon
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"
                    name="search"
                  />
                  <input
                    className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search events, clubs, or topics..."
                    value={searchQuery}
                  />
                </label>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant">
              Showing <span className="font-semibold text-primary">{filteredEvents.length}</span>{" "}
              event{filteredEvents.length === 1 ? "" : "s"} matching your current view.
            </p>
          </div>
        </section>
      ) : null}

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
        <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {filteredEvents.map((event) => {
            const visual = getCategoryVisual(event.category);

            return (
              <article
                className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-soft transition duration-300 hover:-translate-y-1"
                key={event.id}
              >
                <div className="relative h-52 overflow-hidden">
                  <img alt={event.title} className="h-full w-full object-cover" src={visual.image} />
                  <div className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${visual.pillClassName}`}>
                    {event.category}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-outline">
                      <MaterialIcon className="text-sm" name="schedule" />
                      <span>
                        {formatDate(event.eventDate)} • {formatTimeRange(event.startTime, event.endTime)}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-secondary">
                      {rsvpCounts[event.id] ?? 0} RSVP
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-on-surface transition group-hover:text-primary">
                    {event.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-on-surface-variant">
                    {event.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold ${visual.accentClassName}`}>
                      {getInitials(event.club.name)}
                    </div>
                    <span className="text-xs font-semibold text-on-surface-variant">
                      {event.club.name}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-on-surface-variant">
                    <MaterialIcon className="text-base" name="location_on" />
                    <span>{event.venue}</span>
                  </div>

                  <Link
                    className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-surface-container-low py-3 font-bold text-primary transition hover:bg-primary hover:text-white"
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
    </section>
  );
}
