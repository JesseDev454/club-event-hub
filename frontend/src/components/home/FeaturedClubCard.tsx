import { Link } from "react-router-dom";

import type { ClubSummary } from "../../types/domain";

type FeaturedClubCardProps = {
  club: ClubSummary;
  upcomingEventCount?: number;
};

export function FeaturedClubCard({ club, upcomingEventCount }: FeaturedClubCardProps) {
  return (
    <article className="group rounded-[1.75rem] border border-white/70 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-xl">
      <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
        {club.category}
      </span>

      <h3 className="mt-5 text-xl font-semibold text-ink-900">{club.name}</h3>
      <p className="mt-3 text-sm leading-6 text-ink-700">{club.description}</p>

      <div className="mt-5 space-y-2 text-sm text-ink-700">
        {upcomingEventCount !== undefined ? (
          <p>
            <span className="font-medium text-ink-900">Upcoming events:</span> {upcomingEventCount}
          </p>
        ) : null}
        {club.contactEmail ? (
          <p>
            <span className="font-medium text-ink-900">Contact:</span> {club.contactEmail}
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        <Link
          className="inline-flex items-center text-sm font-semibold text-brand-700 transition hover:text-brand-600"
          to={`/clubs/${club.id}`}
        >
          View Club
        </Link>
      </div>
    </article>
  );
}
