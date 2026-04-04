import { type FormEvent } from "react";

import { formatTimeRange } from "../../lib/utils";
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
  const hasSchedulePreview = Boolean(formData.eventDate || formData.startTime || formData.venue);

  return (
    <form
      className="space-y-6 rounded-[1.75rem] border border-white/70 bg-white p-6 shadow-card sm:p-8"
      onSubmit={onSubmit}
    >
      <section className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
            Event basics
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-700">
            Add the core details students need first, then set the date, time, and location below.
          </p>
        </div>

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

        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ink-900" htmlFor="description">
            Description
          </label>
          <textarea
            className="min-h-36 w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm leading-6 text-ink-900 shadow-sm outline-none transition placeholder:text-ink-700/60 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            id="description"
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="Describe the event clearly for students."
            required
            value={formData.description}
          />
        </div>
      </section>

      <section className="grid gap-6 rounded-2xl border border-ink-100 bg-ink-50/70 p-5 lg:grid-cols-[1.25fr_0.8fr]">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
              Schedule and location
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-700">
              Make the timing easy to understand so students can decide quickly whether to attend.
            </p>
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
        </div>

        <aside className="rounded-2xl border border-white/80 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-700">
            Preview
          </p>
          {hasSchedulePreview ? (
            <div className="mt-4 space-y-3 text-sm text-ink-700">
              <p>
                <span className="font-medium text-ink-900">Date:</span>{" "}
                {formData.eventDate || "Choose a date"}
              </p>
              <p>
                <span className="font-medium text-ink-900">Time:</span>{" "}
                {formData.startTime
                  ? formatTimeRange(formData.startTime, formData.endTime || null)
                  : "Choose a start time"}
              </p>
              <p>
                <span className="font-medium text-ink-900">Venue:</span>{" "}
                {formData.venue || "Add a venue"}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-ink-700">
              Date, time, and location will appear here as you fill out the form.
            </p>
          )}
        </aside>
      </section>

      <ErrorMessage message={error} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-700">
          Double-check the event details before publishing changes.
        </p>
        <Button className="w-full sm:w-auto" disabled={submitting} type="submit">
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
