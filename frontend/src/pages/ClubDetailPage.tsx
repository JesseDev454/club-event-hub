import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { clubsApi } from "../api/clubsApi";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { formatDate } from "../lib/utils";
import { getCategoryVisual } from "../lib/presentation";
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
    <section className="space-y-12">
      <section className="relative overflow-hidden rounded-[2rem] shadow-soft">
        <div className="relative h-80 w-full">
          <img alt={club.name} className="h-full w-full object-cover" src={visual.image} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 px-8 py-8 md:px-12 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-6 md:flex-row md:items-end">
              <div className="flex h-32 w-32 items-center justify-center rounded-[1.5rem] bg-white p-4 shadow-soft">
                <MaterialIcon className="text-6xl text-primary" name={visual.icon} />
              </div>
              <div>
                <span className="inline-flex rounded-full bg-secondary-fixed px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#00210f]">
                  {club.category}
                </span>
                <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                  {club.name}
                </h1>
                {club.tagline ? (
                  <p className="mt-3 text-lg font-medium text-secondary-fixed">{club.tagline}</p>
                ) : null}
                <p className="mt-3 max-w-2xl text-base leading-7 text-white/80">
                  Discover the club mission, current activity, and public event presence on
                  NileConnect.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-secondary-container px-8 py-3 font-bold text-[#00210f] transition hover:brightness-95"
                to="/events"
              >
                Explore Events
              </Link>
              {isManagingClub ? (
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-bold text-primary transition hover:bg-surface-container-highest"
                  to={`/clubs/${club.id}/edit`}
                >
                  Edit Club Profile
                </Link>
              ) : null}
              {club.contactEmail ? (
                <a
                  className="inline-flex items-center justify-center rounded-full bg-white/20 px-4 py-3 text-white backdrop-blur-md transition hover:bg-white/30"
                  href={`mailto:${club.contactEmail}`}
                >
                  <MaterialIcon name="mail" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-[1.25fr_0.85fr]">
        <div className="space-y-10">
          <section className="rounded-[1.75rem] bg-white p-8 shadow-soft">
            <h2 className="font-headline text-3xl font-bold text-primary">Our Mission</h2>
            <p className="mt-5 text-base leading-8 text-on-surface-variant">{club.description}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low px-5 py-3">
                <MaterialIcon className="text-primary" name="groups" />
                <span className="font-semibold text-on-surface">
                  {club.upcomingEvents.length} upcoming event{club.upcomingEvents.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low px-5 py-3">
                <MaterialIcon className="text-primary" name="mail" />
                <span className="font-semibold text-on-surface">
                  {club.contactEmail ?? "No public contact email"}
                </span>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-headline text-3xl font-bold text-primary">Upcoming Events</h2>
                <p className="mt-2 text-on-surface-variant">
                  See the public events this club currently has listed on the platform.
                </p>
              </div>
              <Link className="font-semibold text-primary transition hover:underline" to="/events">
                View calendar
              </Link>
            </div>

            {club.upcomingEvents.length === 0 ? (
              <EmptyState
                description="This club does not have any upcoming events listed right now."
                title="No upcoming events"
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {club.upcomingEvents.map((event) => {
                  const eventVisual = getCategoryVisual(event.category);

                  return (
                    <article
                      className="overflow-hidden rounded-[1.75rem] bg-white shadow-soft transition hover:-translate-y-1"
                      key={event.id}
                    >
                      <div className="h-48 overflow-hidden">
                        <img alt={event.title} className="h-full w-full object-cover" src={eventVisual.image} />
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-3">
                          <span className="rounded-lg bg-tertiary-fixed px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-tertiary">
                            {event.category}
                          </span>
                          <span className="text-sm font-semibold text-outline">
                            {formatDate(event.eventDate)}
                          </span>
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-primary">{event.title}</h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-on-surface-variant">
                          {event.description}
                        </p>
                        <p className="mt-4 text-sm font-medium text-on-surface-variant">
                          {event.venue}
                        </p>
                        <Link
                          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-surface-container-high py-3 font-bold text-primary transition hover:bg-primary hover:text-white"
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
        </div>

        <aside className="space-y-8">
          <section className="rounded-[1.75rem] bg-surface-container-low p-8">
            <h3 className="font-headline text-xl font-bold text-primary">Contact Info</h3>
            <div className="mt-6 space-y-4">
              {club.contactEmail ? (
                <a className="flex items-center gap-4" href={`mailto:${club.contactEmail}`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                    <MaterialIcon name="mail" />
                  </div>
                  <span className="font-medium text-on-surface-variant">{club.contactEmail}</span>
                </a>
              ) : (
                <p className="text-sm text-on-surface-variant">
                  This club has not published a contact email yet.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-[1.75rem] bg-[linear-gradient(135deg,#006d3d_0%,#00522d_100%)] p-8 text-white shadow-soft">
            <h3 className="font-headline text-xl font-bold">Activity Snapshot</h3>
            <div className="mt-5 space-y-4 text-sm leading-7 text-white/85">
              <p>
                Category: <span className="font-semibold text-white">{club.category}</span>
              </p>
              <p>
                Public events:{" "}
                <span className="font-semibold text-white">{club.upcomingEvents.length}</span>
              </p>
              <p>NileConnect keeps this profile synced with the current public club listing.</p>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
