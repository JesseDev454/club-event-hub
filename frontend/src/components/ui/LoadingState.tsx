type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({
  label = "Loading Club & Event Hub...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={`flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-ink-100 bg-white/70 px-6 text-sm text-ink-700 shadow-card ${className ?? ""}`}
    >
      {label}
    </div>
  );
}
