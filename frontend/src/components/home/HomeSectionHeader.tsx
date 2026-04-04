import { Link } from "react-router-dom";

type HomeSectionHeaderProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
};

export function HomeSectionHeader({
  title,
  description,
  actionLabel,
  actionTo,
}: HomeSectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-ink-700 sm:text-base">{description}</p>
      </div>

      {actionLabel && actionTo ? (
        <Link
          className="text-sm font-semibold text-brand-700 transition hover:text-brand-600"
          to={actionTo}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
