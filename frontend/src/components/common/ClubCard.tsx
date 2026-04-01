import { Link } from "react-router-dom";

import type { ClubSummary } from "../../types/domain";

type ClubCardProps = {
  club: ClubSummary;
};

export function ClubCard({ club }: ClubCardProps) {
  return (
    <article className="rounded-2xl border border-white/70 bg-white p-6 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
        {club.category}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-ink-900">{club.name}</h2>
      <p className="mt-3 text-sm leading-6 text-ink-700">{club.description}</p>

      {club.contactEmail ? (
        <p className="mt-4 text-sm text-ink-700">
          Contact: <span className="font-medium text-ink-900">{club.contactEmail}</span>
        </p>
      ) : null}

      <div className="mt-5">
        <Link
          className="text-sm font-semibold text-brand-700 transition hover:text-brand-600"
          to={`/clubs/${club.id}`}
        >
          View club details
        </Link>
      </div>
    </article>
  );
}
