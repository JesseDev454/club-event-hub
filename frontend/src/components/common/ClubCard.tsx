import { Link } from "react-router-dom";

import type { ClubSummary } from "../../types/domain";

type ClubCardProps = {
  club: ClubSummary;
};

export function ClubCard({ club }: ClubCardProps) {
  return (
    <article className="group rounded-[1.75rem] border border-white/70 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-xl">
      <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
        {club.category}
      </span>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink-900">{club.name}</h2>
      <p className="mt-3 text-sm leading-6 text-ink-700">{club.description}</p>

      {club.contactEmail ? (
        <p className="mt-5 text-sm text-ink-700">
          Contact: <span className="font-medium text-ink-900">{club.contactEmail}</span>
        </p>
      ) : null}

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
