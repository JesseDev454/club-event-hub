import { EmptyState } from "../components/ui/EmptyState";

export function ClubsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Campus clubs</h1>
        <p className="mt-2 text-sm text-ink-700">Club listing UI placeholder for Sprint 0.</p>
      </div>

      <EmptyState
        description="Club data will be connected when the backend club endpoints are ready."
        title="No clubs loaded yet"
      />
    </section>
  );
}
