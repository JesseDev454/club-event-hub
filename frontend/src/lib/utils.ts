import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(`${dateString}T00:00:00`));
}

export function formatTimeRange(startTime: string, endTime?: string | null): string {
  const normalizeTime = (value: string) => {
    const [hours = "00", minutes = "00"] = value.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const start = normalizeTime(startTime);

  if (!endTime) {
    return start;
  }

  return `${start} - ${normalizeTime(endTime)}`;
}
