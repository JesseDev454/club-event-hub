import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { rsvpsApi } from "../api/rsvpsApi";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { formatLongDate, formatTimeRange, getInitials } from "../lib/utils";
import { getCategoryVisual } from "../lib/presentation";
import { useAuth } from "../state/AuthContext";
import type { EventDetail } from "../types/domain";

const highlightIcons = ["tips_and_updates", "rocket_launch", "groups", "school"];

type RichListCardProps = {
  icon: string;
  text: string;
};

function RichListCard({ icon, text }: RichListCardProps) {
  return (
    <div className="flex gap-4 rounded-[1.5rem] bg-surface-container-low p-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary-container text-[#00210f]">
        <MaterialIcon name={icon} />
      </div>
      <p className="text-sm leading-7 text-on-surface-variant">{text}</p>
    </div>
  );
}

export function EventDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<"rsvp" | "cancel" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [needsAuthSync, setNeedsAuthSync] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadEvent = async () => {
      if (!id) {
        setError("Event id is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await eventsApi.getEventById(id);

        if (isMounted) {
          setEvent(data);
          setNeedsAuthSync(authLoading);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getApiErrorMessage(loadError, "We couldn't load this event right now."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadEvent();

    return () => {
      isMounted = false;
    };
  }, [id, authLoading]);

  useEffect(() => {
    let isMounted = true;

    const syncEventAfterAuth = async () => {
      if (!needsAuthSync || authLoading || !id) {
        return;
      }

      if (!user) {
        setNeedsAuthSync(false);
        return;
      }

      try {
        const data = await eventsApi.getEventById(id);

        if (isMounted) {
          setEvent(data);
        }
      } finally {
        if (isMounted) {
          setNeedsAuthSync(false);
        }
      }
    };

    void syncEventAfterAuth();

    return () => {
      isMounted = false;
    };
  }, [authLoading, id, needsAuthSync, user]);

  const isStudent = user?.role === "student";
  const isAdmin = user?.role === "club_admin";
  const isGuest = !user;
  const hasRsvped = event?.hasRsvped === true;

  const handleRsvp = async () => {
    if (!id || !event) {
      return;
    }

    setActionLoading("rsvp");
    setActionError(null);

    try {
      const result = await rsvpsApi.createRsvp(id);
      setEvent((current) =>
        current
          ? {
              ...current,
              rsvpCount: result.rsvpCount,
              hasRsvped: result.hasRsvped,
            }
          : current,
      );
    } catch (rsvpError) {
      setActionError(getApiErrorMessage(rsvpError, "We couldn't save your RSVP right now."));
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelRsvp = async () => {
    if (!id || !event) {
      return;
    }

    setActionLoading("cancel");
    setActionError(null);

    try {
      const result = await rsvpsApi.cancelRsvp(id);
      setEvent((current) =>
        current
          ? {
              ...current,
              rsvpCount: result.rsvpCount,
              hasRsvped: result.hasRsvped,
            }
          : current,
      );
    } catch (rsvpError) {
      setActionError(getApiErrorMessage(rsvpError, "We couldn't cancel your RSVP right now."));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <LoadingState label="Loading event details..." />;
  }

  if (!loading && error) {
    return (
      <div className="space-y-6">
        <EmptyState
          description="This event may have been removed, or the link may no longer be valid."
          title="Event unavailable"
        />
        <ErrorMessage className="max-w-2xl" message={error} />
      </div>
    );
  }

  if (!event) {
    return (
      <EmptyState
        description="This event may have been removed, or the link may no longer be valid."
        title="Event unavailable"
      />
    );
  }

  const visual = getCategoryVisual(event.category);

  return (
    <section className="space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-primary shadow-soft">
        <div className="absolute inset-0 opacity-40">
          <img alt={event.title} className="h-full w-full object-cover" src={visual.image} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        <div className="relative z-10 flex flex-col gap-8 px-8 py-12 lg:px-14 lg:py-16">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full bg-secondary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#00210f]">
              {event.category}
            </span>
            <h1 className="mt-6 font-headline text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              {event.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-white backdrop-blur-md transition hover:bg-white/20"
                to={`/clubs/${event.club.id}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-sm font-bold">
                  {getInitials(event.club.name)}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">Hosted by</p>
                  <p className="font-semibold">{event.club.name}</p>
                </div>
              </Link>
              <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                <MaterialIcon className="icon-filled" name="verified" />
                <span>Campus event listing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.85fr]">
        <div className="space-y-10">
          <section>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
              Hosted by
            </h2>
            <div className="mt-5 rounded-[1.75rem] bg-white p-8 shadow-soft">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-surface-container-low text-lg font-bold text-primary">
                    {getInitials(event.club.name)}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-outline">
                      Club organizer
                    </p>
                    <h2 className="mt-1 font-headline text-2xl font-bold text-primary">
                      {event.club.name}
                    </h2>
                    <p className="mt-1 text-sm text-on-surface-variant">{event.club.category}</p>
                    {event.club.contactEmail ? (
                      <p className="mt-2 text-sm text-on-surface-variant">
                        Contact: {event.club.contactEmail}
                      </p>
                    ) : null}
                  </div>
                </div>

                <Link
                  className="inline-flex items-center justify-center rounded-full border border-outline-variant/40 px-5 py-3 font-semibold text-primary transition hover:bg-surface-container-low"
                  to={`/clubs/${event.club.id}`}
                >
                  View club profile
                </Link>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
              About this event
            </h2>
            <div className="mt-5 rounded-[1.75rem] bg-white p-8 shadow-soft">
              <p className="text-base leading-8 text-on-surface-variant">{event.description}</p>
            </div>
          </section>

          {event.highlights.length > 0 ? (
            <section>
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
                What to expect
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {event.highlights.map((highlight, index) => (
                  <RichListCard
                    icon={highlightIcons[index % highlightIcons.length]}
                    key={`${highlight}-${index}`}
                    text={highlight}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {event.targetAudience.length > 0 ? (
            <section>
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
                Who should attend
              </h2>
              <div className="mt-5 rounded-[1.75rem] bg-white p-8 shadow-soft">
                <div className="flex flex-wrap gap-3">
                  {event.targetAudience.map((audience, index) => (
                    <span
                      className="rounded-full bg-surface-container-low px-4 py-2 text-sm font-medium text-on-surface-variant"
                      key={`${audience}-${index}`}
                    >
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {event.additionalInfo ? (
            <section>
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
                Additional info
              </h2>
              <div className="mt-5 rounded-[1.75rem] bg-white p-8 shadow-soft">
                <p className="text-base leading-8 text-on-surface-variant">{event.additionalInfo}</p>
              </div>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-28">
          <div className="rounded-[2rem] bg-white p-8 shadow-soft">
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-surface-container-low p-3">
                  <MaterialIcon className="text-primary" name="calendar_today" />
                </div>
                <div>
                  <p className="font-bold text-on-surface">{formatLongDate(event.eventDate)}</p>
                  <p className="text-sm text-outline">Save the date</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-surface-container-low p-3">
                  <MaterialIcon className="text-primary" name="schedule" />
                </div>
                <div>
                  <p className="font-bold text-on-surface">
                    {formatTimeRange(event.startTime, event.endTime)}
                  </p>
                  <p className="text-sm text-outline">Event time</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-surface-container-low p-3">
                  <MaterialIcon className="text-primary" name="location_on" />
                </div>
                <div>
                  <p className="font-bold text-on-surface">{event.venue}</p>
                  <p className="text-sm text-outline">Venue details</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-outline-variant/30 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-on-surface">{event.rsvpCount}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-outline">
                    Students attending
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${visual.accentClassName}`}
                >
                  <MaterialIcon name={visual.icon} />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {isGuest ? (
                  <Link
                    className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] py-4 text-lg font-bold text-white transition hover:scale-[0.99]"
                    to="/login"
                  >
                    Log in to RSVP
                  </Link>
                ) : null}

                {isStudent ? (
                  hasRsvped ? (
                    <Button
                      className="w-full rounded-full bg-secondary-container py-4 text-lg font-bold text-[#00210f] hover:brightness-95"
                      disabled={actionLoading !== null}
                      onClick={handleCancelRsvp}
                      variant="primary"
                    >
                      {actionLoading === "cancel" ? "Cancelling..." : "Cancel RSVP"}
                    </Button>
                  ) : (
                    <Button
                      className="w-full rounded-full bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] py-4 text-lg font-bold text-white hover:opacity-95"
                      disabled={actionLoading !== null}
                      onClick={handleRsvp}
                      variant="primary"
                    >
                      {actionLoading === "rsvp" ? "Saving RSVP..." : "RSVP Now"}
                    </Button>
                  )
                ) : null}

                {isAdmin ? (
                  <div className="rounded-2xl bg-surface-container-low p-5 text-sm leading-7 text-on-surface-variant">
                    Club admin accounts can review attendance interest here, but RSVP actions remain
                    student-only.
                  </div>
                ) : null}

                <p className="text-center text-xs text-outline">
                  {hasRsvped
                    ? "Your attendance is confirmed for this event."
                    : "Registration closes when the event listing is removed or updated."}
                </p>
                <ErrorMessage message={actionError} />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
