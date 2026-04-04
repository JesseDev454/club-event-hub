type MaterialIconProps = {
  name: string;
  className?: string;
  filled?: boolean;
};

export function MaterialIcon({ className, filled = false, name }: MaterialIconProps) {
  return (
    <span className={`material-symbols-outlined ${filled ? "icon-filled" : ""} ${className ?? ""}`}>
      {name}
    </span>
  );
}
