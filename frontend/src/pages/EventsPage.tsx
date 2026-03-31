import { EmptyState } from "../components/ui/EmptyState";

export function EventsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Upcoming events</h1>
        <p className="mt-2 text-sm text-ink-700">Events listing UI placeholder for Sprint 0.</p>
      </div>

      <EmptyState
        description="Event listing data will be connected once the event endpoints are implemented."
        title="No events loaded yet"
      />
    </section>
  );
}
