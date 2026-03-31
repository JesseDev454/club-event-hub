import { useParams } from "react-router-dom";

import { EmptyState } from "../components/ui/EmptyState";

export function ClubDetailPage() {
  const { id } = useParams();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Club detail</h1>
        <p className="mt-2 text-sm text-ink-700">Placeholder route for club ID: {id}</p>
      </div>

      <EmptyState
        description="This page is wired and ready for club detail data in a later sprint."
        title="Club information coming soon"
      />
    </section>
  );
}
