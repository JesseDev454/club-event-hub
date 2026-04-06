import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { clubsApi } from "../api/clubsApi";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { getCategoryVisual } from "../lib/presentation";
import { formatDate, formatTimeRange, getInitials } from "../lib/utils";
import { useAuth } from "../state/AuthContext";
import type { ClubDetail } from "../types/domain";

export function ClubDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadClub = async () => {
      if (!id) {
        setError("Club id is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await clubsApi.getClubById(id);
        if (isMounted) {
          setClub(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getApiErrorMessage(loadError, "Unable to load this club right now."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadClub();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <LoadingState label="Loading club details..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorMessage message={error} />
        <EmptyState
          description="This club may no longer be available, or the link may be out of date."
          title="Club unavailable"
        />
      </div>
    );
  }

  if (!club) {
    return (
      <EmptyState
        description="This club may no longer be available, or the link may be out of date."
        title="Club unavailable"
      />
    );
  }

  const visual = getCategoryVisual(club.category);
  const isManagingClub = user?.role === "club_admin" && user.clubId === club.id;

  return (
    <section className="space-y-16">
      <section className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.22em] text-secondary">
            {club.category}
          </span>
          <h1 className="font-headline text-5xl font-extrabold tracking-tight text-primary lg:text-6xl">
            {club.name}
          </h1>
          {club.tagline ? (
            <p className="mb-8 mt-6 text-xl font-medium italic text-on-surface-variant">
              "{club.tagline}"
            </p>
          ) : null}

          <div className="mb-12 flex flex-wrap gap-4">
            <Link
              className="rounded-lg bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] px-8 py-3 font-bold text-white shadow-soft transition hover:scale-[1.02]"
              to="/events"
            >
              Explore Club Events
            </Link>
            {isManagingClub ? (
              <Link
                className="rounded-lg border border-outline-variant/20 px-8 py-3 font-bold text-primary transition hover:bg-surface-container-high"
                to={`/clubs/${club.id}/edit`}
              >
                Edit Club
              </Link>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low px-5 py-3">
              <MaterialIcon className="text-primary" name="event" />
              <span className="font-semibold text-on-surface">
                {club.upcomingEvents.length} upcoming event{club.upcomingEvents.length === 1 ? "" : "s"}
              </span>
            </div>
            {club.contactEmail ? (
              <a
                className="flex items-center gap-3 rounded-2xl bg-surface-container-low px-5 py-3"
                href={`mailto:${club.contactEmail}`}
              >
                <MaterialIcon className="text-primary" name="mail" />
                <span className="font-semibold text-on-surface">{club.contactEmail}</span>
              </a>
            ) : null}
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative z-10 aspect-square overflow-hidden rounded-2xl bg-surface-container-lowest p-4 shadow-soft">
            <img alt={club.name} className="h-full w-full rounded-xl object-cover" src={visual.image} />
          </div>
          <div className="absolute -bottom-6 -right-6 h-48 w-48 rounded-2xl bg-secondary-container opacity-30" />
          <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-primary-container opacity-10" />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="rounded-xl bg-surface-container-lowest p-8 shadow-soft md:col-span-2">
          <h3 className="mb-6 font-headline text-2xl font-bold text-primary">Our Mission</h3>
          <div className="space-y-6 leading-relaxed text-on-surface-variant">
            <p>{club.description}</p>
            <p>
              This public profile helps students understand what the club is about, how to reach it,
              and what upcoming events are currently active on NileConnect.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <MaterialIcon className="text-secondary" filled name="check_circle" />
              <div>
                <p className="font-bold text-primary">Public Club Profile</p>
                <p className="text-xs text-on-surface-variant">Discover its identity, focus, and current activity</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MaterialIcon className="text-secondary" filled name="check_circle" />
              <div>
                <p className="font-bold text-primary">Upcoming Events</p>
                <p className="text-xs text-on-surface-variant">See what this club is actively publishing right now</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl bg-surface-container-low p-8">
          <div>
            <h3 className="mb-6 font-headline text-xl font-bold text-primary">Club Snapshot</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-highest text-sm font-bold text-primary">
                  {getInitials(club.name)}
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">{club.name}</p>
                  <p className="text-xs text-on-surface-variant">{club.category}</p>
                </div>
              </div>

              {club.contactEmail ? (
                <div className="rounded-lg bg-surface-container-lowest p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-outline">Public Contact</p>
                  <p className="mt-1 text-sm font-medium text-primary">{club.contactEmail}</p>
                </div>
              ) : (
                <div className="rounded-lg bg-surface-container-lowest p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-outline">Public Contact</p>
                  <p className="mt-1 text-sm text-on-surface-variant">No public contact email yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-outline-variant/20 pt-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Upcoming activity</span>
              <span className="text-lg font-bold text-secondary">{club.upcomingEvents.length}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
              <div
                className="h-full rounded-full bg-secondary"
                style={{ width: `${club.upcomingEvents.length === 0 ? 18 : Math.min(100, club.upcomingEvents.length * 25)}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
              Live from current club listings
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-2 inline-block rounded bg-tertiary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-tertiary-container">
              Save the date
            </span>
            <h3 className="font-headline text-3xl font-bold text-primary">Upcoming Events by This Club</h3>
          </div>
          <Link className="inline-flex items-center gap-2 font-bold text-primary transition hover:underline" to="/events">
            View All Events
            <MaterialIcon name="arrow_forward" />
          </Link>
        </div>

        {club.upcomingEvents.length === 0 ? (
          <EmptyState
            description="This club does not have any upcoming events listed right now."
            title="No upcoming events"
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {club.upcomingEvents.map((event) => {
              const eventVisual = getCategoryVisual(event.category);

              return (
                <article
                  className="group overflow-hidden rounded-xl bg-surface-container-lowest shadow-soft transition-transform duration-300 hover:-translate-y-1"
                  key={event.id}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src={eventVisual.image}
                    />
                    <div className="absolute right-4 top-4 rounded-lg bg-white/90 px-3 py-1 text-center backdrop-blur-sm">
                      <span className="block text-sm font-bold text-primary">
                        {new Intl.DateTimeFormat(undefined, { month: "short" }).format(
                          new Date(`${event.eventDate}T00:00:00`),
                        )}
                      </span>
                      <span className="mt-[-0.25rem] block text-lg font-extrabold text-secondary">
                        {new Date(`${event.eventDate}T00:00:00`).getDate()}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-headline text-lg font-bold text-primary">{event.title}</h4>
                    <div className="mb-4 mt-3 space-y-2 text-sm text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <MaterialIcon className="text-sm" name="schedule" />
                        <span>{formatDate(event.eventDate)} · {formatTimeRange(event.startTime, event.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MaterialIcon className="text-sm" name="location_on" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                    <Link
                      className="inline-flex w-full items-center justify-center rounded-lg bg-surface-container-low py-2 font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                      to={`/events/${event.id}`}
                    >
                      View Event
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="relative overflow-hidden rounded-2xl bg-primary p-12 text-white">
        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="mb-4 font-headline text-3xl font-bold">Get in touch with this club</h3>
            <p className="max-w-md text-on-primary-container">
              Want to learn more about the club or keep up with its next activity? Use the public contact information or follow its upcoming events on NileConnect.
            </p>
          </div>
          <div className="w-full rounded-xl bg-white p-8 text-primary shadow-soft md:w-96">
            <div className="mb-4">
              <label className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">Club Name</label>
              <p className="text-lg font-medium">{club.name}</p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">Email</label>
              <p className="text-lg font-medium">{club.contactEmail ?? "No public email yet"}</p>
            </div>
            {club.contactEmail ? (
              <a
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-secondary py-4 font-bold text-white shadow-soft transition hover:scale-[1.02]"
                href={`mailto:${club.contactEmail}`}
              >
                Send a Message
              </a>
            ) : (
              <Link
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-secondary py-4 font-bold text-white shadow-soft transition hover:scale-[1.02]"
                to="/events"
              >
                Browse Events Instead
              </Link>
            )}
          </div>
        </div>
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-secondary opacity-20 blur-3xl" />
        <div className="absolute right-40 top-0 h-60 w-60 rounded-full bg-blue-400 opacity-10 blur-3xl" />
      </section>
    </section>
  );
}
