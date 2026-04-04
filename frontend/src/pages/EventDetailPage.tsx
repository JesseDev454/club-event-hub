import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { rsvpsApi } from "../api/rsvpsApi";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { formatDate, formatTimeRange } from "../lib/utils";
import { useAuth } from "../state/AuthContext";
import type { EventDetail } from "../types/domain";

type EventMetaItemProps = {
  label: string;
  value: React.ReactNode;
};

function EventMetaItem({ label, value }: EventMetaItemProps) {
  return (
    <article className="rounded-2xl border border-white/70 bg-white p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-700">{label}</p>
      <div className="mt-3 text-base font-semibold text-ink-900">{value}</div>
    </article>
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
          setError(
            getApiErrorMessage(loadError, "We couldn't load this event right now."),
          );
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
      setActionError(
        getApiErrorMessage(rsvpError, "We couldn't save your RSVP right now."),
      );
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
      setActionError(
        getApiErrorMessage(rsvpError, "We couldn't cancel your RSVP right now."),
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <section className="space-y-8">
      {loading ? <LoadingState label="Loading event details..." /> : null}

      {!loading && error ? (
        <>
          <EmptyState
            description="This event may have been removed, or the link may no longer be valid."
            title="Event unavailable"
          />
          <ErrorMessage
            className="max-w-2xl"
            message={error}
          />
        </>
      ) : null}

      {!loading && !error && !event ? (
        <EmptyState
          description="This event may have been removed, or the link may no longer be valid."
          title="Event unavailable"
        />
      ) : null}

      {!loading && !error && event ? (
        <>
          <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-brand-50 via-white to-ink-50 px-6 py-8 shadow-card sm:px-8 sm:py-10 lg:px-10">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(31,143,85,0.16),transparent_55%)] lg:block" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                    {event.category}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink-700 ring-1 ring-white/80">
                    Event details
                  </span>
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
                  {event.title}
                </h1>

                <p className="mt-4 text-base leading-7 text-ink-700 sm:text-lg">
                  Hosted by{" "}
                  <Link
                    className="font-semibold text-brand-700 transition hover:text-brand-600"
                    to={`/clubs/${event.club.id}`}
                  >
                    {event.club.name}
                  </Link>
                </p>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-700 sm:text-base">
                  Explore the key event details below, then RSVP if you plan to attend.
                </p>
              </div>

              <aside className="w-full max-w-sm rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-card backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                  Attendance interest
                </p>
                <p className="mt-3 text-4xl font-bold tracking-tight text-ink-900">
                  {event.rsvpCount}
                </p>
                <p className="mt-2 text-sm text-ink-700">
                  {event.rsvpCount === 1 ? "Student RSVP so far" : "Student RSVPs so far"}
                </p>

                <div className="mt-5 rounded-2xl bg-ink-50 px-4 py-4">
                  <p className="text-sm font-semibold text-ink-900">Quick summary</p>
                  <div className="mt-3 space-y-2 text-sm text-ink-700">
                    <p>{formatDate(event.eventDate)}</p>
                    <p>{formatTimeRange(event.startTime, event.endTime)}</p>
                    <p>{event.venue}</p>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <EventMetaItem
                  label="Date"
                  value={formatDate(event.eventDate)}
                />
                <EventMetaItem
                  label="Time"
                  value={formatTimeRange(event.startTime, event.endTime)}
                />
                <EventMetaItem
                  label="Venue"
                  value={event.venue}
                />
                <EventMetaItem
                  label="Hosting club"
                  value={
                    <Link
                      className="text-brand-700 transition hover:text-brand-600"
                      to={`/clubs/${event.club.id}`}
                    >
                      {event.club.name}
                    </Link>
                  }
                />
              </div>

              <section className="rounded-[1.75rem] border border-white/70 bg-white px-6 py-7 shadow-card sm:px-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
                  About this event
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink-900">
                  Event description
                </h2>
                <div className="mt-5 max-w-3xl text-sm leading-7 text-ink-700 sm:text-base">
                  <p>{event.description}</p>
                </div>
              </section>
            </div>

            <section className="rounded-[1.75rem] border border-white/70 bg-white px-6 py-7 shadow-card sm:px-7">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
                RSVP
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink-900">
                Attendance status
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-700">
                {isGuest
                  ? "Log in with a student account to RSVP and let the hosting club know you plan to attend."
                  : isAdmin
                    ? "Club admins can review attendance interest here, but RSVP actions remain student-only in the MVP."
                    : hasRsvped
                      ? "You're attending this event. If your plans change, you can cancel your RSVP below."
                      : "Ready to join? RSVP now so the hosting club can see your interest."}
              </p>

              <div
                className={`mt-6 rounded-2xl px-5 py-5 ${
                  isStudent && hasRsvped
                    ? "border border-brand-100 bg-brand-50"
                    : "border border-ink-100 bg-ink-50"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-700">
                  Current status
                </p>
                <p className="mt-3 text-xl font-semibold text-ink-900">
                  {isGuest
                    ? "Viewing as guest"
                    : isAdmin
                      ? "Admin overview only"
                      : hasRsvped
                        ? "You're attending"
                        : "Not RSVP'd yet"}
                </p>
                <p className="mt-2 text-sm text-ink-700">
                  RSVP count: <span className="font-semibold text-ink-900">{event.rsvpCount}</span>
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {isGuest ? (
                  <div className="rounded-2xl border border-dashed border-ink-200 bg-white px-5 py-5">
                    <p className="text-sm text-ink-700">
                      Want to attend?{" "}
                      <Link
                        className="font-semibold text-brand-700 transition hover:text-brand-600"
                        to="/login"
                      >
                        Log in
                      </Link>{" "}
                      to RSVP as a student.
                    </p>
                  </div>
                ) : null}

                {isStudent ? (
                  <div className="space-y-4">
                    {hasRsvped ? (
                      <>
                        <div className="rounded-2xl border border-brand-100 bg-brand-50 px-5 py-5">
                          <p className="text-sm font-semibold text-brand-700">You're attending</p>
                          <p className="mt-2 text-sm leading-6 text-ink-700">
                            Your RSVP is saved for this event. You can still cancel if your plans
                            change.
                          </p>
                        </div>
                        <Button
                          className="w-full"
                          disabled={actionLoading !== null}
                          onClick={handleCancelRsvp}
                          variant="secondary"
                        >
                          {actionLoading === "cancel" ? "Cancelling..." : "Cancel RSVP"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="w-full"
                        disabled={actionLoading !== null}
                        onClick={handleRsvp}
                      >
                        {actionLoading === "rsvp" ? "Saving your RSVP..." : "RSVP to this event"}
                      </Button>
                    )}
                  </div>
                ) : null}

                {isAdmin ? (
                  <div className="rounded-2xl border border-dashed border-ink-200 bg-white px-5 py-5">
                    <p className="text-sm leading-6 text-ink-700">
                      Students use RSVP to express attendance interest. Admin accounts do not RSVP
                      through the MVP.
                    </p>
                  </div>
                ) : null}

                <ErrorMessage message={actionError} />
              </div>
            </section>
          </section>
        </>
      ) : null}
    </section>
  );
}
