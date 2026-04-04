import { StatCard } from "./StatCard";

type HomeStatsStripProps = {
  activeClubs: number;
  upcomingEvents: number;
  totalRsvps: number | null;
  loading?: boolean;
  activityLoading?: boolean;
};

export function HomeStatsStrip({
  activeClubs,
  upcomingEvents,
  totalRsvps,
  loading = false,
  activityLoading = false,
}: HomeStatsStripProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <StatCard
        label="Active Clubs"
        supportingText="Communities currently visible on the platform."
        value={loading ? "..." : activeClubs}
      />
      <StatCard
        label="Upcoming Events"
        supportingText="Events students can discover right now."
        value={loading ? "..." : upcomingEvents}
      />
      <StatCard
        label="Total RSVPs"
        supportingText={
          loading || activityLoading
            ? "Loading live activity."
            : totalRsvps === null
              ? "Live on event details."
              : "Live attendance interest across upcoming events."
        }
        value={loading || activityLoading ? "..." : totalRsvps ?? "Live"}
      />
    </section>
  );
}
