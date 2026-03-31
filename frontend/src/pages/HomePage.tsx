import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-white/70 bg-white px-6 py-10 shadow-card sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          Sprint 0 Frontend
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-900">
          Discover campus clubs and events in one place.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink-700">
          The UI foundation is in place. Real data and user flows will be connected in later
          sprints.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            to="/events"
          >
            Browse events
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink-900 ring-1 ring-ink-100 transition hover:bg-ink-50"
            to="/clubs"
          >
            Browse clubs
          </Link>
        </div>
      </div>
    </section>
  );
}
