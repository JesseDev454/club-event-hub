import { useEffect, useState } from "react";

import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { EventCard } from "../components/common/EventCard";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Input } from "../components/ui/Input";
import { LoadingState } from "../components/ui/LoadingState";
import type { EventSummary } from "../types/domain";

const ALL_CATEGORIES = "All categories";

export function EventsPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);

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
  const categoryOptions = [
    ALL_CATEGORIES,
    ...Array.from(new Set(events.map((event) => event.category))).sort((left, right) =>
      left.localeCompare(right),
    ),
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      normalizedSearchQuery.length === 0 ||
      event.title.toLowerCase().includes(normalizedSearchQuery);
    const matchesCategory =
      selectedCategory === ALL_CATEGORIES || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const hasActiveFilters =
    normalizedSearchQuery.length > 0 || selectedCategory !== ALL_CATEGORIES;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(ALL_CATEGORIES);
  };

  return (
    <section className="space-y-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
          Campus activity
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Upcoming events
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-700 sm:text-base">
          Browse campus events, search by title, and filter by category to find the activities
          that matter most right now.
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
        <>
          <section className="rounded-[1.75rem] border border-white/70 bg-white p-5 shadow-card sm:p-6">
            <div className="flex flex-col gap-5">
              <div className="max-w-2xl">
                <h2 className="text-lg font-semibold text-ink-900 sm:text-xl">
                  Find the right event faster
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink-700">
                  Search for an event by title or narrow the list by category using the controls
                  below.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.5fr_0.9fr]">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-ink-900">Search by event title</span>
                  <Input
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search events by title"
                    value={searchQuery}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-ink-900">Category</span>
                  <select
                    className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm text-ink-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    value={selectedCategory}
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-ink-700">
                  Showing{" "}
                  <span className="font-semibold text-ink-900">{filteredEvents.length}</span>{" "}
                  event{filteredEvents.length === 1 ? "" : "s"}
                  {hasActiveFilters ? " matching your current search." : "."}
                </p>

                {hasActiveFilters ? (
                  <Button onClick={resetFilters} variant="secondary">
                    Clear filters
                  </Button>
                ) : null}
              </div>
            </div>
          </section>

          {filteredEvents.length === 0 ? (
            <EmptyState
              action={
                hasActiveFilters ? (
                  <Button onClick={resetFilters} variant="secondary">
                    Reset search and filter
                  </Button>
                ) : undefined
              }
              description="Try a different title or category to explore more upcoming events."
              title="No events match your search right now"
            />
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              {filteredEvents.map((event) => (
                <EventCard clubName={event.club.name} event={event} key={event.id} />
              ))}
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}
