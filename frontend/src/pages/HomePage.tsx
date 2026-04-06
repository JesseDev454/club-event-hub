import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { clubsApi } from "../api/clubsApi";
import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { formatDate } from "../lib/utils";
import { getCategoryVisual } from "../lib/presentation";
import type { ClubSummary, EventDetail, EventListItem } from "../types/domain";

type ClubUpcomingCounts = Record<string, number>;
type EventRsvpCounts = Record<string, number>;

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBOEWRyf5X9zzEdWC5vYAFEaoefOybyo5-pfGVrsJx-QWElvc_jRByG7XQfF8u_IqMUpLoW2vKKUpAMM7AolqL-ULWcKVrnOIbIXrNO6QL1VISlgHVeYdh-hyTMVPP1AOyFO5gZVNkoWTMRU1XeFORQaPEypwtYYahlTAcH-T773D_wqPgbrPTAj3s87UVZN76Y6HG1xABRbyKwZBHRJZxl7LEMzNgJjgI-CzVzwllivhAp5q33GGIASAAiGa9okLeFlv5gjsjsKE01";

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
              "We couldn't load the latest homepage highlights right now. You can still browse clubs and events directly.",
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

      const featuredEvents = events.slice(0, 4);
      const featuredClubs = clubs.slice(0, 3);

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

  const featuredEvents = events.slice(0, 4);
  const featuredClubs = clubs.slice(0, 3);
  const categoryPills = useMemo(() => {
    const categories = new Set<string>();

    [...events, ...clubs].forEach((item) => {
      categories.add(item.category);
    });

    return ["All Activities", ...Array.from(categories).slice(0, 7)];
  }, [clubs, events]);

  return (
    <div className="space-y-16">
      <section className="overflow-hidden rounded-[2rem] bg-white px-6 py-8 shadow-soft lg:px-10 lg:py-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-secondary-container px-4 py-1.5 text-sm font-semibold text-[#00210f]">
              Live Your Campus Life
            </span>
            <h1 className="mt-6 max-w-3xl font-headline text-5xl font-extrabold leading-[1.05] tracking-tight text-primary md:text-6xl xl:text-7xl">
              Discover Nile University <span className="text-secondary">clubs and events</span> in
              one place
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-on-surface-variant md:text-lg">
              Find active student communities, explore upcoming campus events, and RSVP in
              seconds. Your gateway to a vibrant university experience.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] px-8 py-4 text-base font-bold text-white shadow-soft transition hover:scale-[1.02]"
                to="/events"
              >
                Explore Events
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full bg-surface-container-highest px-8 py-4 text-base font-bold text-primary transition hover:bg-surface-container-high"
                to="/clubs"
              >
                View All Clubs
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface-container-low p-5">
                <MaterialIcon className="mb-3 text-primary" name="groups" />
                <p className="text-sm font-semibold text-primary">Student communities</p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Explore clubs built around academics, culture, leadership, and innovation.
                </p>
              </div>
              <div className="rounded-2xl bg-surface-container-low p-5">
                <MaterialIcon className="mb-3 text-secondary" name="event" />
                <p className="text-sm font-semibold text-secondary">Campus events</p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Track what is happening next and move from browsing to RSVP in one flow.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-soft">
              <img
                alt="Campus environment"
                className="h-[420px] w-full object-cover md:h-[520px]"
                src={heroImage}
              />
            </div>
            <div className="absolute -bottom-6 left-4 max-w-[220px] rounded-3xl border-l-4 border-secondary bg-white p-5 shadow-ambient sm:left-8">
              <div className="flex items-center gap-3">
                <MaterialIcon className="text-secondary" filled name="groups" />
                <span className="font-semibold text-primary">Join Today</span>
              </div>
              <p className="mt-2 text-sm text-on-surface-variant">
                Connect with students already exploring campus life on NileConnect.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="no-scrollbar overflow-x-auto rounded-full bg-surface-container-low px-4 py-4">
        <div className="flex min-w-max items-center gap-3">
          <span className="mr-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Categories:
          </span>
          {categoryPills.map((category, index) => (
            <span
              className={`rounded-full px-5 py-2 text-sm font-medium ${
                index === 0
                  ? "bg-primary text-white"
                  : "bg-surface-container-highest text-on-surface-variant"
              }`}
              key={category}
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[1.75rem] bg-primary px-8 py-10 text-white shadow-soft">
          <p className="font-headline text-5xl font-extrabold text-secondary-fixed">
            {loading ? "..." : `${clubs.length}+`}
          </p>
          <p className="mt-3 text-lg text-white/80">Active student clubs</p>
        </div>
        <div className="rounded-[1.75rem] bg-white px-8 py-10 shadow-soft">
          <p className="font-headline text-5xl font-extrabold text-primary">
            {loading ? "..." : `${events.length}+`}
          </p>
          <p className="mt-3 text-lg text-on-surface-variant">Upcoming events</p>
        </div>
        <div className="rounded-[1.75rem] bg-white px-8 py-10 shadow-soft">
          <p className="font-headline text-5xl font-extrabold text-secondary">
            {statsLoading || totalRsvps === null ? "..." : `${totalRsvps}+`}
          </p>
          <p className="mt-3 text-lg text-on-surface-variant">Student RSVPs</p>
        </div>
      </section>

      {loading ? <LoadingState label="Loading homepage highlights..." /> : null}
      {error ? <ErrorMessage message={error} /> : null}

      {!loading && !error ? (
        <>
          <section className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-headline text-3xl font-bold text-primary">Upcoming Events</h2>
                <p className="mt-2 text-on-surface-variant">
                  Never miss out on what’s happening on campus.
                </p>
              </div>
              <Link className="font-semibold text-secondary transition hover:underline" to="/events">
                View full calendar
              </Link>
            </div>

            {featuredEvents.length === 0 ? (
              <EmptyState
                description="Upcoming events will appear here as clubs publish new activities."
                title="No featured events yet"
              />
            ) : (
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                {featuredEvents.map((event) => {
                  const visual = getCategoryVisual(event.category);
                  const rsvpCount = featuredEventRsvpCounts[event.id];

                  return (
                    <article
                      className="overflow-hidden rounded-[1.75rem] bg-white shadow-soft transition duration-300 hover:-translate-y-1"
                      key={event.id}
                    >
                      <div className="relative h-52 overflow-hidden">
                        <img alt={event.title} className="h-full w-full object-cover" src={visual.image} />
                        <div className="absolute left-4 top-4 rounded-2xl bg-white/90 px-3 py-2 text-center shadow-sm">
                          <span className="block text-xs font-bold uppercase text-secondary">
                            {new Date(`${event.eventDate}T00:00:00`).toLocaleString(undefined, {
                              month: "short",
                            })}
                          </span>
                          <span className="block text-xl font-bold text-primary">
                            {new Date(`${event.eventDate}T00:00:00`).getDate()}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-primary">{event.title}</h3>
                        <div className="mt-4 space-y-2 text-sm text-on-surface-variant">
                          <p className="flex items-center gap-2">
                            <MaterialIcon className="text-base" name="location_on" />
                            <span>{event.venue}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <MaterialIcon className="text-base" name="diversity_3" />
                            <span>{event.club.name}</span>
                          </p>
                        </div>
                        <div className="mt-5 flex items-center justify-between border-t border-surface-container pt-4">
                          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-outline">
                            {rsvpCount ?? 0} RSVP’d
                          </span>
                          <Link
                            className="rounded-full bg-secondary-container px-4 py-2 text-xs font-bold text-[#00210f] transition hover:brightness-95"
                            to={`/events/${event.id}`}
                          >
                            View details
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] bg-surface-container-low px-6 py-10 shadow-soft lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary">
                  Featured Clubs
                </h2>
                <p className="mt-3 text-lg leading-8 text-on-surface-variant">
                  Join a community that shares your passions. From competitive coding to volunteer
                  work, there&apos;s a home for everyone at Nile.
                </p>
              </div>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-white px-6 py-3 font-bold text-primary transition hover:bg-surface-container-highest"
                to="/clubs"
              >
                Browse all clubs
                <MaterialIcon name="explore" />
              </Link>
            </div>

            {featuredClubs.length === 0 ? (
              <div className="mt-8">
                <EmptyState
                  description="Featured clubs will appear here as active communities are added to the platform."
                  title="No featured clubs yet"
                />
              </div>
            ) : (
              <div className="mt-10 grid gap-8 lg:grid-cols-3">
                {featuredClubs.map((club) => {
                  const visual = getCategoryVisual(club.category);
                  const upcomingCount = featuredClubUpcomingCounts[club.id] ?? 0;

                  return (
                    <article className="rounded-[1.75rem] bg-white p-8 shadow-soft" key={club.id}>
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-container">
                        <MaterialIcon className="text-3xl text-[#00210f]" filled name={visual.icon} />
                      </div>
                      <span className="mt-6 block text-xs font-bold uppercase tracking-[0.22em] text-secondary">
                        {club.category}
                      </span>
                      <h3 className="mt-3 text-2xl font-bold text-primary">{club.name}</h3>
                      <p className="mt-4 line-clamp-4 text-sm leading-7 text-on-surface-variant">
                        {club.description}
                      </p>
                      <div className="mt-8 flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-outline">
                            Upcoming events
                          </p>
                          <p className="mt-1 text-lg font-bold text-primary">{upcomingCount}</p>
                        </div>
                        <Link
                          className="inline-flex items-center gap-1 font-bold text-primary transition hover:text-secondary"
                          to={`/clubs/${club.id}`}
                        >
                          View Club
                          <MaterialIcon className="text-lg" name="chevron_right" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] px-8 py-12 text-center shadow-soft sm:px-12 sm:py-16">
            <h2 className="font-headline text-4xl font-extrabold text-white sm:text-5xl">
              Ready to transform your campus experience?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/80">
              Join students who are already discovering their communities, clubs, and event
              moments on NileConnect.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                className="inline-flex w-full items-center justify-center rounded-full bg-secondary px-10 py-4 text-lg font-bold text-white transition hover:scale-[1.02] sm:w-auto"
                to="/register"
              >
                Get Started Now
              </Link>
              <Link
                className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-10 py-4 text-lg font-bold text-white transition hover:bg-white/20 sm:w-auto"
                to="/clubs"
              >
                Browse Clubs
              </Link>
            </div>
          </section>
        </>
      ) : null}

      {!loading && !error && featuredEvents.length === 0 && featuredClubs.length === 0 ? (
        <section className="rounded-[1.75rem] bg-white p-8 shadow-soft">
          <p className="text-sm text-on-surface-variant">
            NileConnect is ready. Once clubs and events are populated, this homepage will
            automatically surface them here.
          </p>
        </section>
      ) : null}
    </div>
  );
}
