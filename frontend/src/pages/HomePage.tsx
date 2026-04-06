import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { clubsApi } from "../api/clubsApi";
import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { getCategoryVisual } from "../lib/presentation";
import { formatDate, formatTimeRange, getInitials } from "../lib/utils";
import type { ClubSummary, EventDetail, EventListItem } from "../types/domain";

type ClubUpcomingCounts = Record<string, number>;
type EventRsvpCounts = Record<string, number>;

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBOEWRyf5X9zzEdWC5vYAFEaoefOybyo5-pfGVrsJx-QWElvc_jRByG7XQfF8u_IqMUpLoW2vKKUpAMM7AolqL-ULWcKVrnOIbIXrNO6QL1VISlgHVeYdh-hyTMVPP1AOyFO5gZVNkoWTMRU1XeFORQaPEypwtYYahlTAcH-T773D_wqPgbrPTAj3s87UVZN76Y6HG1xABRbyKwZBHRJZxl7LEMzNgJjgI-CzVzwllivhAp5q33GGIASAAiGa9okLeFlv5gjsjsKE01";

function formatMonth(dateString: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
  }).format(new Date(`${dateString}T00:00:00`));
}

function formatDay(dateString: string) {
  return new Date(`${dateString}T00:00:00`).getDate().toString().padStart(2, "0");
}

function HomepageStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="text-center">
      <p className="font-headline text-4xl font-extrabold text-white">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.24em] text-on-primary-container">
        {label}
      </p>
    </div>
  );
}

function ValueCard({
  description,
  icon,
  title,
}: {
  description: string;
  icon: string;
  title: string;
}) {
  return (
    <div className="rounded-[1.75rem] bg-surface p-6 shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-low text-primary">
        <MaterialIcon name={icon} />
      </div>
      <h3 className="mt-4 font-headline text-xl font-bold text-primary">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-on-surface-variant">{description}</p>
    </div>
  );
}

export function HomePage() {
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRsvps, setTotalRsvps] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [featuredEventRsvpCounts, setFeaturedEventRsvpCounts] = useState<EventRsvpCounts>({});
  const [featuredClubUpcomingCounts, setFeaturedClubUpcomingCounts] = useState<ClubUpcomingCounts>(
    {},
  );

  useEffect(() => {
    let isMounted = true;

    const loadHomepageContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const [clubsData, eventsData] = await Promise.all([clubsApi.getClubs(), eventsApi.getEvents()]);

        if (isMounted) {
          setClubs(clubsData);
          setEvents(eventsData);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            getApiErrorMessage(
              loadError,
              "We couldn't load the latest campus highlights right now. You can still browse clubs and events directly.",
            ),
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadHomepageContent();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const enrichHomepageContent = async () => {
      if (loading || error) {
        return;
      }

      const featuredEvents = events.slice(0, 3);
      const featuredClubs = clubs.slice(0, 4);

      if (events.length > 0) {
        if (isMounted) {
          setStatsLoading(true);
        }

        const eventDetailResults = await Promise.allSettled(
          events.map(async (event) => eventsApi.getEventById(event.id)),
        );

        if (!isMounted) {
          return;
        }

        const successfulEventDetails = eventDetailResults
          .filter(
            (
              result,
            ): result is PromiseFulfilledResult<EventDetail> => result.status === "fulfilled",
          )
          .map((result) => result.value);

        const featuredEventCounts: EventRsvpCounts = {};

        successfulEventDetails.forEach((eventDetail) => {
          if (featuredEvents.some((featuredEvent) => featuredEvent.id === eventDetail.id)) {
            featuredEventCounts[eventDetail.id] = eventDetail.rsvpCount;
          }
        });

        setFeaturedEventRsvpCounts(featuredEventCounts);
        setTotalRsvps(successfulEventDetails.reduce((sum, eventDetail) => sum + eventDetail.rsvpCount, 0));
        setStatsLoading(false);
      } else if (isMounted) {
        setTotalRsvps(0);
        setStatsLoading(false);
      }

      if (featuredClubs.length === 0) {
        if (isMounted) {
          setFeaturedClubUpcomingCounts({});
        }

        return;
      }

      const clubDetailResults = await Promise.allSettled(
        featuredClubs.map(async (club) => clubsApi.getClubById(club.id)),
      );

      if (!isMounted) {
        return;
      }

      const featuredClubCounts: ClubUpcomingCounts = {};

      clubDetailResults.forEach((result) => {
        if (result.status === "fulfilled") {
          featuredClubCounts[result.value.id] = result.value.upcomingEvents.length;
        }
      });

      setFeaturedClubUpcomingCounts(featuredClubCounts);
    };

    void enrichHomepageContent();

    return () => {
      isMounted = false;
    };
  }, [clubs, error, events, loading]);

  const featuredEvents = events.slice(0, 3);
  const featuredClubs = clubs.slice(0, 4);

  const categoryPills = useMemo(() => {
    const categories = new Set<string>();

    [...events, ...clubs].forEach((item) => {
      categories.add(item.category);
    });

    return Array.from(categories).slice(0, 6);
  }, [clubs, events]);

  const activeCategoryCount = useMemo(() => {
    const categories = new Set<string>();

    [...events, ...clubs].forEach((item) => {
      categories.add(item.category);
    });

    return categories.size;
  }, [clubs, events]);

  return (
    <div className="space-y-16 lg:space-y-24">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-surface px-4 py-8 sm:px-6 lg:min-h-[48rem] lg:px-8 lg:py-16">
        <div className="absolute inset-0 rounded-[2.5rem]">
          <img alt="Nile University campus life" className="h-full w-full object-cover" src={heroImage} />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,249,255,0.97)_5%,rgba(247,249,255,0.9)_48%,rgba(247,249,255,0.2)_100%)]" />
        </div>
        <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-secondary-container/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary-fixed/30 blur-3xl" />

        <div className="relative z-10 grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center rounded-full bg-secondary-container px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-on-secondary-container">
              Campus life, in motion
            </div>

            <div className="space-y-6">
              <h1 className="font-headline text-5xl font-extrabold leading-[1.05] tracking-tight text-primary md:text-6xl lg:text-7xl">
                Discover Nile University <span className="text-secondary">clubs and events</span> in one place
              </h1>
              <p className="max-w-xl text-lg leading-8 text-on-surface-variant lg:text-xl">
                See what is happening across campus right now, find the communities already shaping
                student life, and move from curiosity to RSVP without missing the moment.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] px-8 py-4 text-lg font-bold text-white shadow-soft transition hover:scale-[1.02]"
                to="/events"
              >
                Explore Events
                <MaterialIcon name="arrow_forward" />
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-8 py-4 text-lg font-bold text-primary transition hover:bg-surface-container-high"
                to="/clubs"
              >
                Join a Club
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                {featuredClubs.slice(0, 3).map((club) => (
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-surface bg-primary-fixed text-sm font-bold text-on-primary-fixed"
                    key={club.id}
                    title={club.name}
                  >
                    {getInitials(club.name)}
                  </div>
                ))}
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-surface bg-primary text-xs font-bold text-white">
                  {clubs.length > 0 ? `+${clubs.length}` : "+0"}
                </div>
              </div>
              <p className="text-sm font-medium text-on-surface-variant">
                Active across <span className="font-bold text-primary">{activeCategoryCount}</span> campus activity lanes.
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="overflow-hidden rounded-[1.75rem] bg-surface-container-lowest p-2 shadow-soft">
                  <img
                    alt="Featured event moment"
                    className="aspect-[4/5] w-full rounded-[1.25rem] object-cover"
                    src={featuredEvents[0] ? getCategoryVisual(featuredEvents[0].category).image : heroImage}
                  />
                </div>
                <div className="flex items-center gap-4 rounded-[1.5rem] bg-surface-container-lowest p-4 shadow-soft">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                    <MaterialIcon filled name="verified" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                      Campus momentum
                    </p>
                    <p className="font-bold text-primary">
                      {featuredEvents[0]?.title ?? "Events loading"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="overflow-hidden rounded-[1.75rem] bg-surface-container-lowest p-2 shadow-soft">
                  <img
                    alt="Featured club moment"
                    className="aspect-[4/3] w-full rounded-[1.25rem] object-cover"
                    src={featuredClubs[0] ? getCategoryVisual(featuredClubs[0].category).image : heroImage}
                  />
                </div>
                <div className="overflow-hidden rounded-[1.75rem] bg-surface-container-lowest p-2 shadow-soft">
                  <img
                    alt="Featured campus moment"
                    className="aspect-square w-full rounded-[1.25rem] object-cover"
                    src={featuredEvents[1] ? getCategoryVisual(featuredEvents[1].category).image : heroImage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-primary px-6 py-10 text-white shadow-soft sm:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <HomepageStat label="active events" value={loading ? "..." : `${events.length}+`} />
          <HomepageStat label="registered clubs" value={loading ? "..." : `${clubs.length}+`} />
          <HomepageStat label="campus categories" value={loading ? "..." : `${activeCategoryCount}+`} />
          <HomepageStat
            label="student RSVPs"
            value={statsLoading || totalRsvps === null ? "..." : `${totalRsvps}+`}
          />
        </div>
      </section>

      <section className="rounded-[2rem] bg-surface-container-low px-6 py-10 shadow-soft sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="mr-2 text-sm font-bold uppercase tracking-[0.18em] text-on-surface-variant">
            Explore by
          </span>
          <Link className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white" to="/events">
            All Categories
          </Link>
          {categoryPills.map((category) => (
            <span
              className="rounded-full bg-surface-container-lowest px-6 py-2 text-sm font-medium text-on-surface hover:bg-secondary-container"
              key={category}
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      {loading ? <LoadingState label="Loading homepage highlights..." /> : null}
      {error ? <ErrorMessage message={error} /> : null}

      {!loading && !error ? (
        <>
          <section className="space-y-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="block text-sm font-bold uppercase tracking-[0.22em] text-secondary">
                  Happening Soon
                </span>
                <h2 className="mt-3 font-headline text-4xl font-extrabold text-primary">
                  Featured upcoming events
                </h2>
                <p className="mt-3 text-lg leading-8 text-on-surface-variant">
                  See what students can actually join next, from workshops and talks to social moments that give campus life its energy.
                </p>
              </div>
              <Link className="inline-flex items-center gap-2 font-bold text-primary transition hover:text-secondary" to="/events">
                See all events
                <MaterialIcon name="arrow_right_alt" />
              </Link>
            </div>

            {featuredEvents.length === 0 ? (
              <EmptyState
                description="Upcoming events will appear here as clubs publish new activities."
                title="No featured events yet"
              />
            ) : (
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {featuredEvents.map((event) => {
                  const visual = getCategoryVisual(event.category);
                  const rsvpCount = featuredEventRsvpCounts[event.id] ?? 0;

                  return (
                    <article
                      className="group overflow-hidden rounded-[1.5rem] bg-surface-container-lowest shadow-soft transition duration-300 hover:-translate-y-1"
                      key={event.id}
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img alt={event.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={visual.image} />
                        <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-2 text-center shadow-sm backdrop-blur-sm">
                          <p className="text-xs font-bold uppercase text-on-surface-variant">{formatMonth(event.eventDate)}</p>
                          <p className="text-xl font-extrabold text-primary">{formatDay(event.eventDate)}</p>
                        </div>
                        <div className="absolute bottom-4 right-4 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-white">
                          {rsvpCount} Joined
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                          <MaterialIcon className="text-sm" name={visual.icon} />
                          {event.category}
                        </div>
                        <h3 className="font-headline text-2xl font-bold text-primary transition group-hover:text-secondary">
                          {event.title}
                        </h3>

                        <div className="mt-4 space-y-2 text-sm text-on-surface-variant">
                          <p className="flex items-center gap-2">
                            <MaterialIcon className="text-base" name="schedule" />
                            {formatTimeRange(event.startTime, event.endTime)}
                          </p>
                          <p className="flex items-center gap-2">
                            <MaterialIcon className="text-base" name="location_on" />
                            {event.venue}
                          </p>
                          <p className="flex items-center gap-2">
                            <MaterialIcon className="text-base" name="diversity_3" />
                            {event.club.name}
                          </p>
                        </div>

                        <Link
                          className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-outline-variant/30 py-3 font-bold text-primary transition hover:bg-primary hover:text-white"
                          to={`/events/${event.id}`}
                        >
                          View Details
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="bg-surface-container-lowest px-6 py-12 sm:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <ValueCard
                    description="Find people already building around tech, arts, sports, volunteering, and student life."
                    icon="hub"
                    title="Find your crew"
                  />
                  <div className="translate-x-4">
                    <ValueCard
                      description="Start a club, publish events, and give your community a real public presence on campus."
                      icon="rocket_launch"
                      title="Lead and grow"
                    />
                  </div>
                </div>
                <div className="space-y-6 pt-12">
                  <ValueCard
                    description="Use real upcoming events and clear details to decide what is worth showing up for this week."
                    icon="event_available"
                    title="Never miss out"
                  />
                  <div className="translate-x-4">
                    <ValueCard
                      description="Build a more meaningful campus record through communities and events you actually participate in."
                      icon="emoji_events"
                      title="Build your story"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <span className="text-sm font-bold uppercase tracking-[0.22em] text-secondary">Why NileConnect?</span>
                <div className="space-y-6">
                  <h2 className="font-headline text-5xl font-extrabold leading-tight text-primary">
                    Your gateway to a richer campus experience
                  </h2>
                  <p className="text-lg leading-8 text-on-surface-variant">
                    University life is more than lectures and exams. It is about finding your people,
                    exploring new interests, and staying close to the communities already making campus feel alive.
                  </p>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MaterialIcon className="text-secondary" filled name="check_circle" />
                    <span className="font-medium text-on-surface">See real student-run communities with public profiles and upcoming events.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MaterialIcon className="text-secondary" filled name="check_circle" />
                    <span className="font-medium text-on-surface">RSVP in seconds and keep track of what you are joining across campus.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MaterialIcon className="text-secondary" filled name="check_circle" />
                    <span className="font-medium text-on-surface">Create a club when you are ready to build a community of your own.</span>
                  </li>
                </ul>

                <Link
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-white shadow-soft transition hover:scale-[1.02]"
                  to="/clubs"
                >
                  Learn more by exploring clubs
                </Link>
              </div>
            </div>
          </section>

          <section className="space-y-10 rounded-[2rem] bg-surface-container-low px-6 py-12 shadow-soft sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="block text-sm font-bold uppercase tracking-[0.22em] text-secondary">
                Our Communities
              </span>
              <h2 className="mt-3 font-headline text-4xl font-extrabold text-primary">
                Discover clubs that match your passion
              </h2>
              <p className="mt-4 text-lg leading-8 text-on-surface-variant">
                Browse active NileConnect communities and see which ones already have upcoming activity you can join.
              </p>
            </div>

            {featuredClubs.length === 0 ? (
              <EmptyState
                description="Featured clubs will appear here as active communities are added to the platform."
                title="No featured clubs yet"
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {featuredClubs.map((club) => {
                  const visual = getCategoryVisual(club.category);
                  const upcomingCount = featuredClubUpcomingCounts[club.id] ?? 0;

                  return (
                    <article
                      className="group flex flex-col rounded-[1.5rem] bg-surface-container-lowest p-6 shadow-soft transition hover:-translate-y-1"
                      key={club.id}
                    >
                      <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${visual.accentClassName}`}>
                        <MaterialIcon className="text-3xl" name={visual.icon} />
                      </div>
                      <h3 className="font-headline text-xl font-bold text-primary">{club.name}</h3>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                        {club.category}
                      </p>
                      {club.tagline ? (
                        <p className="mt-3 text-sm font-medium text-secondary">{club.tagline}</p>
                      ) : null}
                      <p className="mt-4 line-clamp-4 text-sm leading-7 text-on-surface-variant">
                        {club.description}
                      </p>

                      <div className="mt-auto pt-6">
                        <div className="flex items-center justify-between border-t border-outline-variant/10 pt-4">
                          <span className="text-xs font-bold text-secondary">
                            {upcomingCount} Upcoming
                          </span>
                          <Link
                            className="inline-flex items-center gap-1 text-primary transition group-hover:text-secondary"
                            to={`/clubs/${club.id}`}
                          >
                            <span className="text-sm font-bold">View Club</span>
                            <MaterialIcon name="add_circle" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] px-6 py-12 text-center shadow-soft sm:px-8 sm:py-16">
            <div className="mx-auto max-w-2xl space-y-8">
              <h2 className="font-headline text-4xl font-extrabold text-white sm:text-5xl">
                Ready to join the community?
              </h2>
              <p className="text-lg leading-8 text-primary-fixed">
                Sign up today to start discovering Nile University clubs, upcoming events, and the communities already shaping campus life.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  className="inline-flex items-center justify-center rounded-xl bg-secondary px-10 py-4 text-lg font-extrabold text-white transition hover:scale-[1.02]"
                  to="/register"
                >
                  Get Started
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-10 py-4 text-lg font-extrabold text-white transition hover:bg-white/20"
                  to="/events"
                >
                  Browse Anonymously
                </Link>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
