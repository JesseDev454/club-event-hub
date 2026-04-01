import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

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

export function EventDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<"rsvp" | "cancel" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getApiErrorMessage(loadError, "Unable to load this event right now."));
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
  }, [id]);

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
      setActionError(getApiErrorMessage(rsvpError, "Unable to RSVP right now."));
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
      setActionError(getApiErrorMessage(rsvpError, "Unable to cancel your RSVP right now."));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <section className="space-y-6">
      {loading ? <LoadingState label="Loading event details..." /> : null}
      <ErrorMessage message={error} />

      {!loading && !error && !event ? (
        <EmptyState
          description="The event could not be found."
          title="Event unavailable"
        />
      ) : null}

      {!loading && !error && event ? (
        <>
          <div className="rounded-3xl border border-white/70 bg-white px-6 py-8 shadow-card sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
              {event.category}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink-900">{event.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-ink-700">{event.description}</p>

            <div className="mt-6 grid gap-3 text-sm text-ink-700 sm:grid-cols-2">
              <p>
                <span className="font-medium text-ink-900">Date:</span>{" "}
                {formatDate(event.eventDate)}
              </p>
              <p>
                <span className="font-medium text-ink-900">Time:</span>{" "}
                {formatTimeRange(event.startTime, event.endTime)}
              </p>
              <p>
                <span className="font-medium text-ink-900">Venue:</span> {event.venue}
              </p>
              <p>
                <span className="font-medium text-ink-900">Hosting club:</span>{" "}
                <Link
                  className="text-brand-700 transition hover:text-brand-600"
                  to={`/clubs/${event.club.id}`}
                >
                  {event.club.name}
                </Link>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-ink-100 bg-white px-6 py-6 shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink-900">RSVP</h2>
                <p className="mt-2 text-sm text-ink-700">
                  RSVP count: <span className="font-semibold text-ink-900">{event.rsvpCount}</span>
                </p>
                {isGuest ? (
                  <p className="mt-2 text-sm text-ink-700">
                    <Link className="font-semibold text-brand-700 hover:text-brand-600" to="/login">
                      Log in
                    </Link>{" "}
                    to RSVP to this event.
                  </p>
                ) : null}
                {isAdmin ? (
                  <p className="mt-2 text-sm text-ink-700">
                    Club admins can view RSVP counts here, but RSVP actions are student-only.
                  </p>
                ) : null}
                {isStudent ? (
                  <p className="mt-2 text-sm text-ink-700">
                    {hasRsvped
                      ? "You are currently marked as attending."
                      : "RSVP to let the club know you plan to attend."}
                  </p>
                ) : null}
              </div>

              {isStudent ? (
                <div className="flex flex-col items-start gap-3">
                  {hasRsvped ? (
                    <Button
                      disabled={actionLoading !== null}
                      onClick={handleCancelRsvp}
                      variant="secondary"
                    >
                      {actionLoading === "cancel" ? "Cancelling..." : "Cancel RSVP"}
                    </Button>
                  ) : (
                    <Button disabled={actionLoading !== null} onClick={handleRsvp}>
                      {actionLoading === "rsvp" ? "Saving..." : "RSVP to event"}
                    </Button>
                  )}
                </div>
              ) : null}
            </div>

            <div className="mt-4">
              <ErrorMessage message={actionError} />
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
