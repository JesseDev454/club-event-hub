import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm text-ink-900 shadow-sm outline-none transition placeholder:text-ink-700/60 focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
        className,
      )}
      {...props}
    />
  );
});
