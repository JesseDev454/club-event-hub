import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { clubsApi } from "../api/clubsApi";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { getCategoryVisual } from "../lib/presentation";
import type { ClubSummary } from "../types/domain";

const ALL_CATEGORIES = "All Categories";

export function ClubsPage() {
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [upcomingCounts, setUpcomingCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let isMounted = true;

    const loadClubs = async () => {
      try {
        const data = await clubsApi.getClubs();
        if (isMounted) {
          setClubs(data);
        }

        const details = await Promise.allSettled(data.map(async (club) => clubsApi.getClubById(club.id)));

        if (isMounted) {
          const nextCounts: Record<string, number> = {};
          details.forEach((result) => {
            if (result.status === "fulfilled") {
              nextCounts[result.value.id] = result.value.upcomingEvents.length;
            }
          });
          setUpcomingCounts(nextCounts);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getApiErrorMessage(loadError, "Unable to load clubs right now."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadClubs();

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryOptions = useMemo(
    () => [
      ALL_CATEGORIES,
      ...Array.from(new Set(clubs.map((club) => club.category))).sort((left, right) =>
        left.localeCompare(right),
      ),
    ],
    [clubs],
  );

  const filteredClubs = clubs.filter((club) => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [club.name, club.description, club.category].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      );
    const matchesCategory =
      selectedCategory === ALL_CATEGORIES || club.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="space-y-10">
      <section className="space-y-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-headline text-5xl font-extrabold tracking-tight text-primary md:text-6xl">
              Join a Nile University Community
            </h1>
            <p className="mt-4 text-lg leading-8 text-on-surface-variant">
              Discover student-led organizations, professional societies, and creative circles
              that foster intellectual growth and lasting connections.
            </p>
          </div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto">
            {categoryOptions.map((category) => (
              <button
                className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                  category === selectedCategory
                    ? "bg-secondary-container text-[#00210f]"
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

        <div className="relative lg:max-w-md">
          <MaterialIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"
            name="search"
          />
          <input
            className="w-full rounded-[1.25rem] border border-outline-variant/30 bg-surface-container-low py-4 pl-12 pr-4 text-base outline-none transition focus:border-primary"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Find your tribe..."
            value={searchQuery}
          />
        </div>
      </section>

      {loading ? <LoadingState label="Loading clubs..." /> : null}
      <ErrorMessage message={error} />

      {!loading && !error && clubs.length === 0 ? (
        <EmptyState
          description="Clubs will appear here as communities are added to the platform."
          title="No clubs available"
        />
      ) : null}

      {!loading && !error && clubs.length > 0 && filteredClubs.length === 0 ? (
        <EmptyState
          description="Try a different search or category to explore more communities."
          title="No clubs match your search"
        />
      ) : null}

      {!loading && !error && filteredClubs.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredClubs.map((club) => {
            const visual = getCategoryVisual(club.category);
            const eventCount = upcomingCounts[club.id] ?? 0;

            return (
              <article
                className="group overflow-hidden rounded-[1.5rem] bg-white shadow-soft transition duration-300 hover:-translate-y-1"
                key={club.id}
              >
                <div className="relative h-52 overflow-hidden">
                  <img alt={club.name} className="h-full w-full object-cover" src={visual.image} />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                    {club.category}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${visual.accentClassName}`}>
                      <MaterialIcon className="text-2xl" name={visual.icon} />
                    </div>
                    <span className="rounded-full bg-secondary-fixed px-3 py-1 text-xs font-semibold text-[#00210f]">
                      Upcoming Events: {eventCount}
                    </span>
                  </div>

                  <h2 className="mt-6 font-headline text-2xl font-bold text-primary">
                    {club.name}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                    {club.description}
                  </p>

                  {club.contactEmail ? (
                    <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-outline">
                      Contact: {club.contactEmail}
                    </p>
                  ) : null}

                  <Link
                    className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] py-3 font-medium text-white transition hover:shadow-soft"
                    to={`/clubs/${club.id}`}
                  >
                    View Club Profile
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
