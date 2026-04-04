import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { clubsApi } from "../api/clubsApi";
import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { FeaturedClubCard } from "../components/home/FeaturedClubCard";
import { FeaturedEventCard } from "../components/home/FeaturedEventCard";
import { HomeHero } from "../components/home/HomeHero";
import { HomeSectionHeader } from "../components/home/HomeSectionHeader";
import { HomeStatsStrip } from "../components/home/HomeStatsStrip";
import { HomeValueSection } from "../components/home/HomeValueSection";
import type { ClubSummary, EventDetail, EventSummary } from "../types/domain";

type ClubUpcomingCounts = Record<string, number>;
type EventRsvpCounts = Record<string, number>;

export function HomePage() {
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRsvps, setTotalRsvps] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [featuredEventRsvpCounts, setFeaturedEventRsvpCounts] = useState<EventRsvpCounts>({});
  const [featuredClubUpcomingCounts, setFeaturedClubUpcomingCounts] = useState<ClubUpcomingCounts>({});

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

      const featuredEvents = events.slice(0, 3);
      const featuredClubs = clubs.slice(0, 3);

      if (events.length === 0) {
        if (isMounted) {
          setTotalRsvps(0);
          setStatsLoading(false);
        }
      } else {
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

        const allEventDetailsLoaded = successfulEventDetails.length === events.length;
        const featuredEventCounts: EventRsvpCounts = {};

        successfulEventDetails.forEach((eventDetail) => {
          if (featuredEvents.some((featuredEvent) => featuredEvent.id === eventDetail.id)) {
            featuredEventCounts[eventDetail.id] = eventDetail.rsvpCount;
          }
        });

        setFeaturedEventRsvpCounts(featuredEventCounts);
        setTotalRsvps(
          allEventDetailsLoaded
            ? successfulEventDetails.reduce((sum, eventDetail) => sum + eventDetail.rsvpCount, 0)
            : null,
        );
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
  const featuredClubs = clubs.slice(0, 3);

  return (
    <div className="space-y-12">
      <HomeHero />

      <HomeStatsStrip
        activeClubs={clubs.length}
        activityLoading={statsLoading}
        loading={loading}
        totalRsvps={totalRsvps}
        upcomingEvents={events.length}
      />

      {error ? <ErrorMessage message={error} /> : null}

      <section className="space-y-6">
        <HomeSectionHeader
          actionLabel="See all events"
          actionTo="/events"
          description="A quick preview of upcoming campus activities students can discover right now."
          title="Featured Upcoming Events"
        />

        {loading ? <LoadingState label="Loading featured events..." /> : null}

        {!loading && !error && featuredEvents.length === 0 ? (
          <EmptyState
            action={
              <Link
                className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                to="/events"
              >
                Explore events
              </Link>
            }
            description="Upcoming events will appear here as clubs publish new activities."
            title="No featured events yet"
          />
        ) : null}

        {!loading && !error && featuredEvents.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-3">
            {featuredEvents.map((event) => {
              const rsvpCount = Object.prototype.hasOwnProperty.call(featuredEventRsvpCounts, event.id)
                ? featuredEventRsvpCounts[event.id]
                : undefined;

              return <FeaturedEventCard event={event} key={event.id} rsvpCount={rsvpCount} />;
            })}
          </div>
        ) : null}
      </section>

      <section className="space-y-6">
        <HomeSectionHeader
          actionLabel="See all clubs"
          actionTo="/clubs"
          description="Meet student communities that are active on campus and hosting events students can join."
          title="Featured Clubs"
        />

        {loading ? <LoadingState label="Loading featured clubs..." /> : null}

        {!loading && !error && featuredClubs.length === 0 ? (
          <EmptyState
            action={
              <Link
                className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                to="/clubs"
              >
                Browse clubs
              </Link>
            }
            description="Featured clubs will appear here as active communities are added to the platform."
            title="No featured clubs yet"
          />
        ) : null}

        {!loading && !error && featuredClubs.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-3">
            {featuredClubs.map((club) => {
              const upcomingEventCount = Object.prototype.hasOwnProperty.call(
                featuredClubUpcomingCounts,
                club.id,
              )
                ? featuredClubUpcomingCounts[club.id]
                : undefined;

              return (
                <FeaturedClubCard
                  club={club}
                  key={club.id}
                  upcomingEventCount={upcomingEventCount}
                />
              );
            })}
          </div>
        ) : null}
      </section>

      <HomeValueSection />

      {!loading && !error && !statsLoading && clubs.length > 0 && events.length > 0 ? (
        <section className="rounded-[1.75rem] border border-white/70 bg-white px-6 py-8 shadow-card sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Ready to explore what is happening on campus?
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-700 sm:text-base">
                Jump straight into upcoming events or browse clubs to discover new communities.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                to="/events"
              >
                Explore Events
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink-900 ring-1 ring-ink-100 transition hover:bg-ink-50"
                to="/clubs"
              >
                Browse Clubs
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
