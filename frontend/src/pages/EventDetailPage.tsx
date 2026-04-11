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
import { getCategoryVisual } from "../lib/presentation";
import { formatLongDate, formatTimeRange, getInitials } from "../lib/utils";
import { useAuth } from "../state/AuthContext";
import type { EventDetail } from "../types/domain";

const detailImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBqubXrX9I5hPSqnhEWcxXER2mageAjK0OdCZF_2WaeQsrFstjnpey9H60uItJlE3dkKCIbIy8Gb_Co_1OVMDq1Mlt0-ObaQ91wdOHBuTc25YYBiUmuap75v9_IjQiMSrqu9tErZiH9iDzTk5bA7Gg5iEuIC86QctVkMUHKROM8wRfEVbzT4ZmWgtIpQduv_OF2zwknBjRJzmizuPKKsi78YAXOh99djkDC7TC-jrTbNy25XjlkeFTEmSB5xBqWl5ZPe6Bl8OQuseU";

type HighlightCardProps = {
  icon: string;
  text: string;
};

function HighlightCard({ icon, text }: HighlightCardProps) {
  return (
    <div className="rounded-xl bg-surface-container-low p-8">
      <MaterialIcon className="mb-4 text-4xl text-primary" name={icon} />
      <p className="text-sm leading-7 text-on-surface-variant">{text}</p>
    </div>
  );
}

function EventMetaIcon({ name }: { name: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-[0px_10px_24px_rgba(0,30,64,0.18)]">
      <MaterialIcon className="text-2xl" filled name={name} />
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
  const canRsvp = isStudent || isAdmin;
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
  const isManagingHostClub = user?.role === "club_admin" && user.clubId === event.club.id;
  const highlightIcons = ["local_pizza", "psychology", "card_membership", "event_available"];

  return (
    <section className="space-y-8 sm:space-y-12">
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="group overflow-hidden rounded-xl bg-surface-container-low lg:col-span-8">
          <div className="relative aspect-[16/9]">
            <img
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={visual.image || detailImage}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8">
              <span className="mb-3 inline-block rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-on-tertiary-fixed">
                {event.category}
              </span>
              <h1 className="nc-line-clamp-3 nc-text-safe font-headline text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {event.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <div className="flex h-full flex-col justify-between rounded-xl bg-surface-container-low p-5 sm:p-8">
            <div>
              <div className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-secondary">
                <MaterialIcon filled name="verified" />
                Hosted by {event.club.name}
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <EventMetaIcon name="calendar_today" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-outline">Date & Time</p>
                    <p className="nc-text-safe font-headline text-base font-bold text-primary sm:text-lg">{formatLongDate(event.eventDate)}</p>
                    <p className="text-sm text-on-surface-variant">{formatTimeRange(event.startTime, event.endTime)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <EventMetaIcon name="location_on" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-outline">Venue</p>
                    <p className="nc-text-safe font-headline text-base font-bold text-primary sm:text-lg">{event.venue}</p>
                    <p className="text-sm text-on-surface-variant">NileConnect event listing</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <EventMetaIcon name="groups" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-outline">Current RSVPs</p>
                    <p className="font-headline text-base font-bold text-primary sm:text-lg">{event.rsvpCount} Students</p>
                    <p className="text-sm text-on-surface-variant">Live attendance on this event page</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {isGuest ? (
                <Link
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] py-4 font-headline text-lg font-bold text-white transition hover:shadow-soft"
                  to="/login"
                >
                  Log in to RSVP
                </Link>
              ) : canRsvp ? (
                hasRsvped ? (
                  <Button
                    className="w-full rounded-lg bg-secondary py-4 font-headline text-lg font-bold text-white hover:bg-on-secondary-container"
                    disabled={actionLoading !== null}
                    onClick={handleCancelRsvp}
                    variant="primary"
                  >
                    {actionLoading === "cancel" ? "Cancelling..." : "Cancel RSVP"}
                  </Button>
                ) : (
                  <Button
                    className="w-full rounded-lg bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] py-4 font-headline text-lg font-bold text-white hover:opacity-95"
                    disabled={actionLoading !== null}
                    onClick={handleRsvp}
                    variant="primary"
                  >
                    {actionLoading === "rsvp" ? "Saving RSVP..." : "RSVP Now"}
                  </Button>
                )
              ) : null}

              <p className="text-center text-xs text-outline">
                {hasRsvped
                  ? "You're on the list. Your RSVP is saved."
                  : "Free entry for registered NileConnect users while the event is live."}
              </p>
              <ErrorMessage message={actionError} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-12 lg:col-span-8">
          <article className="rounded-xl bg-surface-container-lowest p-6 shadow-soft md:p-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary">The Deep Dive</p>
            <h2 className="mb-6 font-headline text-2xl font-extrabold text-primary sm:text-3xl">About This Event</h2>
            <div className="space-y-6 text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-relaxed">
              <p>{event.description}</p>
              {event.additionalInfo ? <p>{event.additionalInfo}</p> : null}
            </div>
          </article>

          {event.highlights.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {event.highlights.map((highlight, index) => (
                <HighlightCard
                  icon={highlightIcons[index % highlightIcons.length] ?? "tips_and_updates"}
                  key={`${highlight}-${index}`}
                  text={highlight}
                />
              ))}
            </div>
          ) : null}

          {event.targetAudience.length > 0 ? (
            <section>
              <h3 className="mb-6 font-headline text-2xl font-bold text-primary">Who Should Attend?</h3>
              <div className="flex flex-wrap gap-4">
                {event.targetAudience.map((audience, index) => (
                  <span
                    className="rounded-r-lg border-l-4 border-secondary bg-surface-container-low px-5 py-3 font-medium text-on-surface"
                    key={`${audience}-${index}`}
                  >
                    {audience}
                  </span>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="flex flex-col gap-8 lg:col-span-4">
          <div className="space-y-4 rounded-xl bg-surface-container-low p-6">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-outline">Registration Status</h4>

            {isGuest ? (
              <div className="rounded-lg border-l-2 border-primary-container bg-surface-container-lowest p-4">
                <p className="mb-1 text-xs text-outline">Viewing as Guest</p>
                <p className="text-sm font-semibold text-primary">
                  Log in to your NileConnect account to claim your free spot.
                </p>
              </div>
            ) : null}

            {canRsvp ? (
              <div className="rounded-lg border-l-2 border-secondary bg-secondary-container/30 p-4">
                <p className="mb-1 text-xs font-bold text-on-secondary-container">
                  Nile User Verified
                </p>
                <p className="text-sm font-semibold text-on-secondary-container">
                  Your account is eligible to RSVP for this event.
                </p>
              </div>
            ) : null}

            {isManagingHostClub ? (
              <div className="rounded-lg border-l-2 border-on-tertiary-fixed bg-tertiary-fixed/30 p-4">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-on-tertiary-fixed">Club Admin View</p>
                  <span className="rounded-full bg-on-tertiary-fixed px-2 py-0.5 text-[10px] uppercase text-white">
                    Owner
                  </span>
                </div>
                <p className="mb-2 text-sm font-semibold text-on-tertiary-fixed">
                  You manage the hosting club for this event.
                </p>
                <Link className="text-xs font-bold text-on-tertiary-fixed underline underline-offset-4" to="/admin/events">
                  Open Admin Console
                </Link>
              </div>
            ) : null}
          </div>

          {hasRsvped ? (
            <div className="relative overflow-hidden rounded-xl bg-secondary p-6 text-white shadow-soft">
              <div className="absolute -right-4 -top-4 opacity-10">
                <MaterialIcon className="text-[6rem]" name="task_alt" />
              </div>
              <h4 className="mb-2 font-headline text-xl font-bold">See you there!</h4>
              <p className="mb-4 text-sm text-white/80">
                You're on the list. Come back here any time if you need to cancel your RSVP.
              </p>
              <div className="flex gap-2">
                <Link
                  className="rounded-lg bg-white/20 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/30"
                  to={`/clubs/${event.club.id}`}
                >
                  View Club
                </Link>
                <button
                  className="rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20"
                  onClick={handleCancelRsvp}
                  type="button"
                >
                  {actionLoading === "cancel" ? "Cancelling..." : "Cancel"}
                </button>
              </div>
            </div>
          ) : null}

          <div className="relative h-64 overflow-hidden rounded-xl bg-surface-container-low shadow-soft">
            <img
              alt={`Location for ${event.title}`}
              className="h-full w-full object-cover grayscale"
              src={detailImage}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-primary p-2 text-white shadow-xl">
                <MaterialIcon filled name="location_on" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-white/90 p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-outline">Venue</p>
                  <p className="text-sm font-bold text-primary">{event.venue}</p>
                </div>
                <MaterialIcon className="text-primary" name="open_in_new" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-soft">
            <h3 className="font-headline text-xl font-bold text-primary">Hosted by</h3>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-low text-sm font-bold text-primary">
                {getInitials(event.club.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-primary">{event.club.name}</p>
                <p className="text-sm text-on-surface-variant">{event.club.category}</p>
              </div>
            </div>
            {event.club.contactEmail ? (
              <p className="mt-4 text-sm text-on-surface-variant">Contact: {event.club.contactEmail}</p>
            ) : null}
            <Link
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-outline-variant/20 px-4 py-3 font-bold text-primary transition hover:bg-surface-container-high"
              to={`/clubs/${event.club.id}`}
            >
              View Club Profile
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
