import { Link } from "react-router-dom";

import { formatDate, formatTimeRange } from "../../lib/utils";
import type { ClubEventSummary, EventSummary } from "../../types/domain";

type EventCardProps = {
  event: EventSummary | ClubEventSummary;
  clubName?: string;
};

export function EventCard({ event, clubName }: EventCardProps) {
  return (
    <article className="rounded-2xl border border-white/70 bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            {event.category}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-ink-900">{event.title}</h2>
        </div>
        <div className="rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-700">
          {formatDate(event.eventDate)}
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-ink-700">{event.description}</p>

      <div className="mt-4 grid gap-2 text-sm text-ink-700 sm:grid-cols-2">
        <p>
          <span className="font-medium text-ink-900">Time:</span>{" "}
          {formatTimeRange(event.startTime, event.endTime)}
        </p>
        <p>
          <span className="font-medium text-ink-900">Venue:</span> {event.venue}
        </p>
        {clubName ? (
          <p className="sm:col-span-2">
            <span className="font-medium text-ink-900">Hosted by:</span> {clubName}
          </p>
        ) : null}
      </div>

      <div className="mt-5">
        <Link
          className="text-sm font-semibold text-brand-700 transition hover:text-brand-600"
          to={`/events/${event.id}`}
        >
          View event details
        </Link>
      </div>
    </article>
  );
}
