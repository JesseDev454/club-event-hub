import { cn } from "../../lib/utils";

type ErrorMessageProps = {
  message?: string | null;
  className?: string;
};

export function ErrorMessage({ className, message }: ErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm leading-6 text-red-700 shadow-sm",
        className,
      )}
      role="alert"
    >
      {message}
    </div>
  );
}
