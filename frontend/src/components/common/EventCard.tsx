import { Link } from "react-router-dom";

import { formatDate, formatTimeRange } from "../../lib/utils";
import type { ClubEventSummary, EventSummary } from "../../types/domain";

type EventCardProps = {
  event: EventSummary | ClubEventSummary;
  clubName?: string;
};

export function EventCard({ event, clubName }: EventCardProps) {
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

      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink-900">{event.title}</h2>
      <p className="mt-3 text-sm leading-6 text-ink-700">{event.description}</p>

      <div className="mt-5 grid gap-3 text-sm text-ink-700 sm:grid-cols-2">
        <p>
          <span className="font-medium text-ink-900">Venue:</span> {event.venue}
        </p>
        <p>
          <span className="font-medium text-ink-900">Time:</span>{" "}
          {formatTimeRange(event.startTime, event.endTime)}
        </p>
        {clubName ? (
          <p className="sm:col-span-2">
            <span className="font-medium text-ink-900">Hosted by:</span> {clubName}
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
