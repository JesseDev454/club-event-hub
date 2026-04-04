type StatCardProps = {
  label: string;
  value: string | number;
  supportingText?: string;
};

export function StatCard({ label, value, supportingText }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-white/70 bg-white/90 px-5 py-5 shadow-card backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-700">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-ink-900">{value}</p>
      {supportingText ? <p className="mt-2 text-sm text-ink-700">{supportingText}</p> : null}
    </article>
  );
}
