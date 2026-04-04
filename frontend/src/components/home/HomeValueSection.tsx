import { ValuePointCard } from "./ValuePointCard";

const valuePoints = [
  {
    index: "01",
    title: "Discover active clubs",
    description:
      "See student communities that are visible, active, and easy to explore in one place.",
  },
  {
    index: "02",
    title: "Find upcoming events fast",
    description:
      "Browse campus events in date order without relying on scattered posts or last-minute updates.",
  },
  {
    index: "03",
    title: "RSVP without friction",
    description:
      "Open an event, review the details, and confirm attendance with a simple, fast RSVP flow.",
  },
];

export function HomeValueSection() {
  return (
    <section className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          Why students use Club & Event Hub
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink-700 sm:text-base">
          A cleaner way to discover student communities, keep up with campus activity, and respond
          to events quickly.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {valuePoints.map((point) => (
          <ValuePointCard
            description={point.description}
            index={point.index}
            key={point.index}
            title={point.title}
          />
        ))}
      </div>
    </section>
  );
}
