import { cn } from "../../lib/utils";

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
      className={cn(
        "flex min-h-[240px] items-center justify-center rounded-[1.75rem] border border-dashed border-ink-100 bg-white/80 px-6 text-center text-sm leading-6 text-ink-700 shadow-card",
        className,
      )}
    >
      {label}
    </div>
  );
}
