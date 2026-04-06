import { Link } from "react-router-dom";

import { formatDate, formatTimeRange } from "../../lib/utils";
import type { EventListItem } from "../../types/domain";

type FeaturedEventCardProps = {
  event: EventListItem;
  rsvpCount?: number;
};

export function FeaturedEventCard({ event, rsvpCount }: FeaturedEventCardProps) {
  return (
    <article className="group rounded-[1.75rem] border border-white/70 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
          {event.category}
        </span>
        <div className="rounded-2xl bg-ink-50 px-3 py-2 text-right text-sm text-ink-700">
          <p className="font-semibold text-ink-900">{formatDate(event.eventDate)}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-700">
            {formatTimeRange(event.startTime, event.endTime)}
          </p>
        </div>
      </div>

      <h3 className="mt-5 text-xl font-semibold text-ink-900">{event.title}</h3>
      <p className="mt-3 text-sm leading-6 text-ink-700">{event.description}</p>

      <div className="mt-5 grid gap-3 text-sm text-ink-700">
        <p>
          <span className="font-medium text-ink-900">Venue:</span> {event.venue}
        </p>
        <p>
          <span className="font-medium text-ink-900">Hosted by:</span> {event.club.name}
        </p>
        {rsvpCount !== undefined ? (
          <p>
            <span className="font-medium text-ink-900">Current RSVPs:</span> {rsvpCount}
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        <Link
          className="inline-flex items-center text-sm font-semibold text-brand-700 transition hover:text-brand-600"
          to={`/events/${event.id}`}
        >
          View details
        </Link>
      </div>
    </article>
  );
}
