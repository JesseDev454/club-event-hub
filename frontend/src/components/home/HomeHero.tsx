import { Link } from "react-router-dom";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-brand-50 via-white to-ink-50 px-6 py-12 shadow-card sm:px-10 lg:px-12 lg:py-16">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(31,143,85,0.18),transparent_55%)] lg:block" />
      <div className="absolute -right-12 top-10 hidden h-36 w-36 rounded-full bg-brand-100/70 blur-2xl lg:block" />
      <div className="absolute bottom-0 left-1/3 hidden h-28 w-28 rounded-full bg-ink-100/80 blur-2xl lg:block" />

      <div className="relative grid gap-10 lg:grid-cols-[1.25fr_0.9fr] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">
            Campus discovery, simplified
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
            Discover campus clubs and events in one place
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ink-700 sm:text-lg">
            Find active student communities, explore upcoming events, and RSVP in seconds.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              to="/events"
            >
              Explore Events
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-900 ring-1 ring-ink-100 transition hover:bg-ink-50"
              to="/clubs"
            >
              Browse Clubs
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <article className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-card backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              Student communities
            </p>
            <p className="mt-3 text-lg font-semibold text-ink-900">
              Explore clubs that are active, visible, and easy to join.
            </p>
          </article>
          <article className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-card backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              Upcoming events
            </p>
            <p className="mt-3 text-lg font-semibold text-ink-900">
              See what is happening on campus without chasing scattered updates.
            </p>
          </article>
          <article className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-card backdrop-blur sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              Quick RSVP
            </p>
            <p className="mt-3 text-lg font-semibold text-ink-900">
              Let clubs know you are attending with a simple RSVP flow.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
