import { type FormEvent } from "react";

import { formatTimeRange } from "../../lib/utils";
import type { EventFormValues } from "../../types/domain";
import { ErrorMessage } from "../ui/ErrorMessage";
import { MaterialIcon } from "./MaterialIcon";

type EventFormProps = {
  formData: EventFormValues;
  error: string | null;
  submitting: boolean;
  submitLabel: string;
  onChange: (field: keyof EventFormValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

const categoryOptions = ["Technology", "Career", "Social", "Sports", "Arts", "Academic"];

function splitTextareaLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function FieldLabel({ children }: { children: string }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-[0.18em] text-outline">
      {children}
    </label>
  );
}

export function EventForm({
  formData,
  error,
  submitting,
  submitLabel,
  onChange,
  onSubmit,
}: EventFormProps) {
  const hasSchedulePreview = Boolean(formData.eventDate || formData.startTime || formData.venue);
  const highlightItems = splitTextareaLines(formData.highlightsText);
  const audienceItems = splitTextareaLines(formData.targetAudienceText);

  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-8">
          <section className="rounded-[1.75rem] bg-white p-8 shadow-soft">
            <div className="mb-8 flex items-center gap-3">
              <MaterialIcon className="text-primary" name="info" />
              <h2 className="font-headline text-xl font-bold text-on-surface">Core Details</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <FieldLabel>Event Title</FieldLabel>
                <input
                  className="w-full rounded-t-xl border-0 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-b-2 focus:border-primary"
                  onChange={(event) => onChange("title", event.target.value)}
                  placeholder="e.g. Annual Tech Symposium 2026"
                  required
                  value={formData.title}
                />
                <p className="text-xs italic text-outline">Make it catchy and descriptive.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <FieldLabel>Category</FieldLabel>
                  <select
                    className="w-full rounded-t-xl border-0 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-b-2 focus:border-primary"
                    onChange={(event) => onChange("category", event.target.value)}
                    required
                    value={formData.category}
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <FieldLabel>Venue</FieldLabel>
                  <input
                    className="w-full rounded-t-xl border-0 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-b-2 focus:border-primary"
                    onChange={(event) => onChange("venue", event.target.value)}
                    placeholder="e.g. Grand Auditorium"
                    required
                    value={formData.venue}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel>Overview / Description</FieldLabel>
                <textarea
                  className="min-h-48 w-full resize-none rounded-t-xl border-0 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-b-2 focus:border-primary"
                  onChange={(event) => onChange("description", event.target.value)}
                  placeholder="Describe the event purpose, what attendees can expect, and why they should join."
                  required
                  value={formData.description}
                />
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] bg-white p-8 shadow-soft">
            <div className="mb-8 flex items-center gap-3">
              <MaterialIcon className="text-primary" name="star" />
              <h2 className="font-headline text-xl font-bold text-on-surface">
                Experience & Audience
              </h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <FieldLabel>Highlights / What to expect</FieldLabel>
                <textarea
                  className="min-h-40 w-full resize-none rounded-t-xl border-0 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-b-2 focus:border-primary"
                  onChange={(event) => onChange("highlightsText", event.target.value)}
                  placeholder={"One highlight per line\nHands-on coding lab\nIndustry guest speakers\nCertificate of participation"}
                  required
                  value={formData.highlightsText}
                />
                <p className="text-xs text-outline">
                  Enter one highlight per line. These power the richer event detail experience.
                </p>
              </div>

              <div className="space-y-2">
                <FieldLabel>Target Audience</FieldLabel>
                <textarea
                  className="min-h-32 w-full resize-none rounded-t-xl border-0 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-b-2 focus:border-primary"
                  onChange={(event) => onChange("targetAudienceText", event.target.value)}
                  placeholder={"One audience segment per line\nComputer science students\nFreshers exploring clubs\nStudent founders and builders"}
                  required
                  value={formData.targetAudienceText}
                />
                <p className="text-xs text-outline">
                  Enter one audience segment per line so students can quickly tell who the event is
                  for.
                </p>
              </div>

              <div className="space-y-2">
                <FieldLabel>Additional Info (Optional)</FieldLabel>
                <textarea
                  className="min-h-32 w-full resize-none rounded-t-xl border-0 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-b-2 focus:border-primary"
                  onChange={(event) => onChange("additionalInfo", event.target.value)}
                  placeholder="Share anything extra students should know, like what to bring, dress code, or preparation notes."
                  value={formData.additionalInfo}
                />
                <p className="text-xs text-outline">
                  Leave this blank to keep the event detail page focused on the essentials.
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-surface-container-low p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-outline">
                  Content Preview
                </p>
                <h3 className="mt-4 font-headline text-2xl font-bold text-primary">
                  {formData.title || "Your event title"}
                </h3>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                  {formData.description || "Your event overview will appear here as you type."}
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-on-surface-variant">
                  <span className="rounded-full bg-white px-4 py-2">
                    {formData.category || "Category"}
                  </span>
                  <span className="rounded-full bg-white px-4 py-2">
                    {hasSchedulePreview
                      ? `${formData.eventDate || "Date"} • ${
                          formData.startTime
                            ? formatTimeRange(formData.startTime, formData.endTime || null)
                            : "Time"
                        }`
                      : "Schedule preview"}
                  </span>
                  <span className="rounded-full bg-white px-4 py-2">
                    {formData.venue || "Venue"}
                  </span>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-outline">
                      Highlights
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-on-surface-variant">
                      {(highlightItems.length > 0
                        ? highlightItems
                        : ["Add at least one highlight"]).map((item, index) => (
                        <li className="flex gap-2" key={`${item}-${index}`}>
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-secondary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-outline">
                      Target Audience
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(audienceItems.length > 0
                        ? audienceItems
                        : ["Add at least one audience segment"]).map((item, index) => (
                        <span
                          className="rounded-full bg-white px-3 py-2 text-xs font-medium text-on-surface-variant"
                          key={`${item}-${index}`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-[1.75rem] bg-surface-container-low p-8">
            <div className="mb-6 flex items-center gap-3">
              <MaterialIcon className="text-primary" name="calendar_today" />
              <h2 className="font-headline text-lg font-bold text-on-surface">Logistics</h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <FieldLabel>Date</FieldLabel>
                <input
                  className="w-full rounded-xl border-0 bg-white px-4 py-3 text-on-surface outline-none transition focus:ring-2 focus:ring-primary/15"
                  onChange={(event) => onChange("eventDate", event.target.value)}
                  required
                  type="date"
                  value={formData.eventDate}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FieldLabel>Start Time</FieldLabel>
                  <input
                    className="w-full rounded-xl border-0 bg-white px-4 py-3 text-on-surface outline-none transition focus:ring-2 focus:ring-primary/15"
                    onChange={(event) => onChange("startTime", event.target.value)}
                    required
                    type="time"
                    value={formData.startTime}
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel>End Time</FieldLabel>
                  <input
                    className="w-full rounded-xl border-0 bg-white px-4 py-3 text-on-surface outline-none transition focus:ring-2 focus:ring-primary/15"
                    onChange={(event) => onChange("endTime", event.target.value)}
                    type="time"
                    value={formData.endTime}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] bg-white p-8 shadow-soft">
            <div className="mb-6 flex items-center gap-3">
              <MaterialIcon className="text-primary" name="image" />
              <h2 className="font-headline text-lg font-bold text-on-surface">Event Poster</h2>
            </div>

            <div className="relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed border-outline-variant/40 bg-surface-container-low p-6 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,30,64,0.08),transparent_55%)]" />
              <div className="relative z-10">
                <MaterialIcon className="mb-3 text-4xl text-outline" name="upload_file" />
                <p className="text-sm font-medium text-on-surface">Poster upload coming soon</p>
                <p className="mt-1 text-xs text-outline">
                  The current MVP preserves your real event publishing flow without adding a new
                  media endpoint.
                </p>
              </div>
            </div>
          </section>

          <div className="rounded-[1.5rem] border-l-4 border-tertiary bg-tertiary-fixed p-6">
            <div className="flex items-start gap-3">
              <MaterialIcon className="text-tertiary" name="lightbulb" />
              <div>
                <p className="font-headline text-sm font-bold text-tertiary">Pro Tip</p>
                <p className="mt-1 text-xs leading-6 text-on-surface-variant">
                  The strongest campus event pages clearly explain what students will experience,
                  who the event is for, and any extra preparation notes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} />

      <div className="flex flex-col gap-4 rounded-[1.75rem] bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-on-surface-variant">
          Double-check the event details before publishing changes.
        </p>
        <button
          className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] px-8 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
