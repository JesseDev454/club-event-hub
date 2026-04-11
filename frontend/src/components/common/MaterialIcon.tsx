type MaterialIconProps = {
  name: string;
  className?: string;
  filled?: boolean;
};

export function MaterialIcon({ className, filled = false, name }: MaterialIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined shrink-0 leading-none ${filled ? "icon-filled" : ""} ${className ?? ""}`}
    >
      {name}
    </span>
  );
}
