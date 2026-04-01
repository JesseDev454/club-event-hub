import { type FormEvent } from "react";

import type { EventFormInput } from "../../types/domain";
import { Button } from "../ui/Button";
import { ErrorMessage } from "../ui/ErrorMessage";
import { Input } from "../ui/Input";

type EventFormProps = {
  formData: EventFormInput;
  error: string | null;
  submitting: boolean;
  submitLabel: string;
  onChange: (field: keyof EventFormInput, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export function EventForm({
  formData,
  error,
  submitting,
  submitLabel,
  onChange,
  onSubmit,
}: EventFormProps) {
  return (
    <form
      className="space-y-4 rounded-3xl border border-white/70 bg-white p-6 shadow-card"
      onSubmit={onSubmit}
    >
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-ink-900" htmlFor="title">
          Title
        </label>
        <Input
          id="title"
          onChange={(event) => onChange("title", event.target.value)}
          placeholder="Campus Builders Meetup"
          required
          value={formData.title}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-ink-900" htmlFor="description">
          Description
        </label>
        <textarea
          className="min-h-32 w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm text-ink-900 shadow-sm outline-none transition placeholder:text-ink-700/60 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          id="description"
          onChange={(event) => onChange("description", event.target.value)}
          placeholder="Describe the event clearly for students."
          required
          value={formData.description}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ink-900" htmlFor="eventDate">
            Event date
          </label>
          <Input
            id="eventDate"
            onChange={(event) => onChange("eventDate", event.target.value)}
            required
            type="date"
            value={formData.eventDate}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ink-900" htmlFor="category">
            Category
          </label>
          <Input
            id="category"
            onChange={(event) => onChange("category", event.target.value)}
            placeholder="Technology"
            required
            value={formData.category}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ink-900" htmlFor="startTime">
            Start time
          </label>
          <Input
            id="startTime"
            onChange={(event) => onChange("startTime", event.target.value)}
            required
            type="time"
            value={formData.startTime}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ink-900" htmlFor="endTime">
            End time
          </label>
          <Input
            id="endTime"
            onChange={(event) => onChange("endTime", event.target.value)}
            type="time"
            value={formData.endTime}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-ink-900" htmlFor="venue">
          Venue
        </label>
        <Input
          id="venue"
          onChange={(event) => onChange("venue", event.target.value)}
          placeholder="Innovation Lab"
          required
          value={formData.venue}
        />
      </div>

      <ErrorMessage message={error} />

      <Button disabled={submitting} type="submit">
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
