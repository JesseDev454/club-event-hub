import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { clubsApi } from "../api/clubsApi";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { getCategoryVisual } from "../lib/presentation";
import { getInitials } from "../lib/utils";
import { useAuth } from "../state/AuthContext";
import type { ClubSummary } from "../types/domain";

const ALL_CATEGORIES = "All Clubs";
const clubsHeroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDCWtFmDe960KyWDporlilNySOvXN8L6O1SKmmQioKj34VSrR5spYyimzae7Fgtq51E18l_o-5x3GKi79VRjMmBDOCnCAbfqoAbBQiu0g54Al0mbjojffuIWtbjsoAAX-2b--MT486NSKIk5pCGocLl0U7v_V3wmSJO50LzSDejpwnVotMvNaFINERffOgsL84XGvRQaq8ofdDORSEIpkl4_-BIbDaTP7PmAxXS_S2M4b5EfOQOHlRsNrQRge-oVopYXCNQkLsruQk";

export function ClubsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [upcomingCounts, setUpcomingCounts] = useState<Record<string, number>>({});

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

  const leadClub = filteredClubs[0] ?? null;
  const supportingClubs = filteredClubs.slice(1, 5);

  return (
    <section className="space-y-8 lg:space-y-16">
      <section className="relative overflow-hidden rounded-[2rem] bg-primary text-white shadow-soft sm:rounded-[2.5rem]">
        <div className="absolute inset-0 opacity-40">
          <img alt="Nile University student communities" className="h-full w-full object-cover" src={clubsHeroImage} />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-3xl px-6 py-10 sm:px-8 sm:py-14 md:px-12 md:py-20">
          <span className="mb-6 inline-block rounded-full bg-secondary-container px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-on-secondary-container">
            Campus Life
          </span>
          <h1 className="nc-text-safe font-headline text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-7xl">
            Find Your Community
          </h1>
          <p className="mt-4 text-base leading-7 text-on-primary-container/90 sm:mt-6 sm:text-xl sm:leading-9">
            Discover student organizations that spark your interests, build your skills, and create the friendships that make campus feel like home.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              className="inline-flex w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] px-8 py-4 font-bold text-white shadow-soft sm:w-auto"
              href="#explore-clubs"
            >
              Start Exploring
            </a>
            {user?.role === "student" ? (
              <Link
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-bold text-white transition hover:bg-white/20 sm:w-auto"
                to="/clubs/new"
              >
                Start a Club
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-8" id="explore-clubs">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-headline text-3xl font-extrabold text-primary sm:text-4xl">Explore Categories</h2>
            <p className="mt-2 text-base leading-7 text-on-surface-variant sm:text-lg">
              Filter through active Nile University student clubs and find the communities already building momentum.
            </p>
          </div>

          <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 sm:flex-wrap sm:overflow-visible">
            {categoryOptions.map((category) => (
              <button
                className={`shrink-0 rounded-full px-6 py-2 font-semibold transition ${
                  category === selectedCategory
                    ? "bg-secondary-container text-on-secondary-container"
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

        <label className="relative block max-w-lg">
          <MaterialIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" name="search" />
          <input
            className="w-full rounded-xl bg-surface-container-low py-4 pl-12 pr-4 text-base outline-none transition focus:ring-2 focus:ring-primary"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search clubs by name, category, or purpose..."
            value={searchQuery}
          />
        </label>
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
        <section className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {leadClub ? (
              <article className="group relative min-w-0 overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-soft transition-all duration-300 hover:-translate-y-1 md:col-span-8">
                <div className="relative h-56 overflow-hidden sm:h-80">
                  <img
                    alt={leadClub.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={getCategoryVisual(leadClub.category).image}
                  />
                  <span className="absolute left-6 top-6 rounded-full bg-tertiary-fixed px-4 py-1.5 text-xs font-bold uppercase text-on-tertiary-fixed">
                    Active Community
                  </span>
                </div>
                <div className="p-8">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="nc-text-safe font-headline text-2xl font-extrabold text-primary sm:text-3xl">{leadClub.name}</h3>
                      <span className="mt-2 block text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                        {leadClub.category}
                      </span>
                    </div>
                    <div className="flex -space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary-fixed text-sm font-bold text-on-primary-fixed">
                        {getInitials(leadClub.name)}
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-surface-container-highest text-xs font-bold text-on-surface">
                        +{upcomingCounts[leadClub.id] ?? 0}
                      </div>
                    </div>
                  </div>

                  {leadClub.tagline ? (
                    <p className="nc-text-safe mb-4 text-base font-medium text-secondary">{leadClub.tagline}</p>
                  ) : null}
                  <p className="nc-line-clamp-3 text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8">{leadClub.description}</p>

                  <div className="mt-6 flex flex-col gap-4 border-t border-outline-variant/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <span className="flex items-center text-sm text-on-surface-variant">
                      <MaterialIcon className="mr-2 text-primary" name="groups" />
                      {upcomingCounts[leadClub.id] ?? 0} upcoming event{(upcomingCounts[leadClub.id] ?? 0) === 1 ? "" : "s"}
                    </span>
                    <Link
                      className="inline-flex items-center gap-2 font-bold text-primary transition hover:gap-3"
                      to={`/clubs/${leadClub.id}`}
                    >
                      View Profile
                      <MaterialIcon name="arrow_forward" />
                    </Link>
                  </div>
                </div>
              </article>
            ) : null}

            {supportingClubs.slice(0, 1).map((club) => (
              <article
                className="group flex min-w-0 flex-col overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-soft transition-all hover:-translate-y-1 md:col-span-4"
                key={club.id}
              >
                <div className="h-48 overflow-hidden">
                  <img alt={club.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={getCategoryVisual(club.category).image} />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="mb-2 text-xs font-bold uppercase text-secondary">{club.category}</span>
                  <h3 className="nc-line-clamp-2 nc-text-safe font-headline text-2xl font-bold text-primary">{club.name}</h3>
                  <p className="nc-line-clamp-3 mt-3 flex-grow text-sm leading-7 text-on-surface-variant">{club.description}</p>
                  <Link
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-surface-container-low py-3 font-bold text-primary transition hover:bg-primary hover:text-white"
                    to={`/clubs/${club.id}`}
                  >
                    View Club
                  </Link>
                </div>
              </article>
            ))}

            {supportingClubs.slice(1).map((club) => (
              <article
                className="group flex min-w-0 flex-col overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-soft transition-all hover:-translate-y-1 md:col-span-4"
                key={club.id}
              >
                <div className="h-48 overflow-hidden">
                  <img alt={club.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={getCategoryVisual(club.category).image} />
                </div>
                <div className="p-6">
                  <span className="mb-2 block text-xs font-bold uppercase text-secondary">{club.category}</span>
                  <h3 className="nc-line-clamp-2 nc-text-safe font-headline text-2xl font-bold text-primary">{club.name}</h3>
                  {club.tagline ? (
                    <p className="nc-line-clamp-2 nc-text-safe mt-2 text-sm font-medium text-secondary">{club.tagline}</p>
                  ) : null}
                  <p className="nc-line-clamp-3 mt-3 text-sm leading-7 text-on-surface-variant">{club.description}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-outline-variant/10 pt-4">
                    <span className="text-xs font-bold text-secondary">
                      {upcomingCounts[club.id] ?? 0} Upcoming
                    </span>
                    <Link
                      className="inline-flex items-center gap-2 rounded-xl border border-outline-variant/20 px-4 py-2 font-bold text-primary transition hover:bg-surface-container-high"
                      to={`/clubs/${club.id}`}
                    >
                      View Club
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-[2.5rem] bg-surface-container-low px-8 py-12 shadow-soft">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-headline text-4xl font-extrabold leading-tight text-primary">
              Can't find your people?
              <br />
              <span className="text-secondary">Start a new legacy.</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-on-surface-variant">
              NileConnect makes it easy to create a club, define its public identity, and start building a real student community around your idea.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {user?.role === "student" ? (
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-white"
                  to="/clubs/new"
                >
                  <MaterialIcon name="add" />
                  Propose a Club
                </Link>
              ) : (
                <Link
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 font-bold text-white"
                  to="/register"
                >
                  Create an Account
                </Link>
              )}
              <Link
                className="inline-flex items-center justify-center rounded-xl border border-outline-variant/30 bg-white px-8 py-4 font-bold text-primary"
                to="/events"
              >
                See Club Events
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-8">
              <img
                alt="Students building together"
                className="w-full rounded-2xl shadow-soft"
                src={leadClub ? getCategoryVisual(leadClub.category).image : clubsHeroImage}
              />
              <img
                alt="Student community moment"
                className="w-full rounded-2xl shadow-soft"
                src={supportingClubs[0] ? getCategoryVisual(supportingClubs[0].category).image : clubsHeroImage}
              />
            </div>
            <div className="space-y-4">
              <img
                alt="Student collaboration"
                className="w-full rounded-2xl shadow-soft"
                src={supportingClubs[1] ? getCategoryVisual(supportingClubs[1].category).image : clubsHeroImage}
              />
              <img
                alt="Student leadership"
                className="w-full rounded-2xl shadow-soft"
                src={supportingClubs[2] ? getCategoryVisual(supportingClubs[2].category).image : clubsHeroImage}
              />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
