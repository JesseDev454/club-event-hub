type ValuePointCardProps = {
  index: string;
  title: string;
  description: string;
};

export function ValuePointCard({ index, title, description }: ValuePointCardProps) {
  return (
    <article className="rounded-2xl border border-white/70 bg-white p-6 shadow-card">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-sm font-semibold text-brand-700">
        {index}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink-700">{description}</p>
    </article>
  );
}
