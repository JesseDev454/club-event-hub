import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function AdminCreateEventPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Create event</h1>
        <p className="mt-2 text-sm text-ink-700">Sprint 0 placeholder for admin event creation.</p>
      </div>

      <form className="space-y-4 rounded-3xl border border-white/70 bg-white p-6 shadow-card">
        <Input disabled placeholder="Event title" />
        <Input disabled placeholder="Venue" />
        <Input disabled placeholder="Category" />
        <Button disabled type="submit">
          Save event
        </Button>
      </form>
    </section>
  );
}
