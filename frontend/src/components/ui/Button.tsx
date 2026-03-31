import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600",
  secondary:
    "bg-white text-ink-900 ring-1 ring-ink-100 hover:bg-ink-50 focus-visible:outline-ink-900",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-100 focus-visible:outline-ink-700",
};

export function Button({
  children,
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
