import { cn } from "../../lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-dashed border-ink-100 bg-white px-6 py-10 text-center shadow-card sm:px-8",
        className,
      )}
    >
      <h3 className="text-xl font-semibold tracking-tight text-ink-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-ink-700">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
