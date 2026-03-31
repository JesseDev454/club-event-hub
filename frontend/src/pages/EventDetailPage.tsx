import { useParams } from "react-router-dom";

import { EmptyState } from "../components/ui/EmptyState";

export function EventDetailPage() {
  const { id } = useParams();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Event detail</h1>
        <p className="mt-2 text-sm text-ink-700">Placeholder route for event ID: {id}</p>
      </div>

      <EmptyState
        description="Event details and RSVP state will be connected in later sprints."
        title="Event content coming soon"
      />
    </section>
  );
}
