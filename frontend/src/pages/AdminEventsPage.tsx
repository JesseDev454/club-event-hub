import { Link } from "react-router-dom";

import { EmptyState } from "../components/ui/EmptyState";

export function AdminEventsPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink-900">Manage events</h1>
          <p className="mt-2 text-sm text-ink-700">
            Minimal admin dashboard placeholder for Sprint 0.
          </p>
        </div>

        <Link
          className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          to="/admin/events/new"
        >
          Create event
        </Link>
      </div>

      <EmptyState
        description="Admin event management data will be connected after auth and event modules are built."
        title="No admin events loaded yet"
      />
    </section>
  );
}
