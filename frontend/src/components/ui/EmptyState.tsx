type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-100 bg-white px-6 py-10 text-center shadow-card">
      <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-700">{description}</p>
    </div>
  );
}
