import { type FormEvent } from "react";
import { Link } from "react-router-dom";

import { getCategoryVisual } from "../../lib/presentation";
import { formatDate, formatTimeRange } from "../../lib/utils";
import type { EventFormValues } from "../../types/domain";
import { ErrorMessage } from "../ui/ErrorMessage";
import { MaterialIcon } from "./MaterialIcon";

type EventFormProps = {
  formData: EventFormValues;
  error: string | null;
  submitting: boolean;
  submitLabel: string;
  helperText?: string | null;
  cancelHref?: string;
  cancelLabel?: string;
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
    <label className="block text-sm font-semibold text-on-surface-variant">
      {children}
    </label>
  );
}

export function EventForm({
  formData,
  error,
  submitting,
  submitLabel,
  helperText,
  cancelHref,
  cancelLabel = "Cancel",
  onChange,
  onSubmit,
}: EventFormProps) {
  const highlightItems = splitTextareaLines(formData.highlightsText);
  const audienceItems = splitTextareaLines(formData.targetAudienceText);
  const completionSteps = [
    Boolean(formData.title.trim()),
    Boolean(formData.category.trim() && formData.venue.trim()),
    Boolean(formData.eventDate && formData.startTime),
    Boolean(formData.description.trim()),
    Boolean(highlightItems.length > 0 && audienceItems.length > 0),
  ];
  const completedCount = completionSteps.filter(Boolean).length;
  const visual = getCategoryVisual(formData.category || "Technology");
  const schedulePreview =
    formData.eventDate || formData.startTime
      ? `${formData.eventDate ? formatDate(formData.eventDate) : "Choose a date"} | ${
          formData.startTime ? formatTimeRange(formData.startTime, formData.endTime || null) : "Choose a time"
        }`
      : "Your event schedule will appear here.";

  return (
    <form className="grid grid-cols-12 gap-8 items-start" onSubmit={onSubmit}>
      <div className="col-span-12 flex flex-col gap-8 lg:col-span-8">
        <section className="rounded-xl bg-surface-container-lowest p-8 transition-shadow hover:shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <MaterialIcon className="text-primary-container" name="info" />
            <h2 className="text-xl font-bold text-primary">Basic Info</h2>
          </div>

          <div className="space-y-6">
            <div>
              <FieldLabel>Event Title</FieldLabel>
              <input
                className="mt-2 w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 font-body transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary"
                onChange={(event) => onChange("title", event.target.value)}
                placeholder="e.g. Annual Tech Symposium 2026"
                required
                value={formData.title}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <FieldLabel>Category</FieldLabel>
                <select
                  className="mt-2 w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 font-body transition-all focus:ring-2 focus:ring-primary"
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

              <div>
                <FieldLabel>Venue</FieldLabel>
                <input
                  className="mt-2 w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 font-body transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary"
                  onChange={(event) => onChange("venue", event.target.value)}
                  placeholder="e.g. Main Auditorium, Block B"
                  required
                  value={formData.venue}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-8">
          <div className="mb-6 flex items-center gap-3">
            <MaterialIcon className="text-primary-container" name="schedule" />
            <h2 className="text-xl font-bold text-primary">Date & Time</h2>
          </div>

          <div className="space-y-6">
            <div>
              <FieldLabel>Event Date</FieldLabel>
              <input
                className="mt-2 w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 font-body transition-all focus:ring-2 focus:ring-primary"
                onChange={(event) => onChange("eventDate", event.target.value)}
                required
                type="date"
                value={formData.eventDate}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                  Start Time
                </p>
                <input
                  className="w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 font-body transition-all focus:ring-2 focus:ring-primary"
                  onChange={(event) => onChange("startTime", event.target.value)}
                  required
                  type="time"
                  value={formData.startTime}
                />
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-outline">
                  End Time
                </p>
                <input
                  className="w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 font-body transition-all focus:ring-2 focus:ring-primary"
                  onChange={(event) => onChange("endTime", event.target.value)}
                  type="time"
                  value={formData.endTime}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-8">
          <div className="mb-6 flex items-center gap-3">
            <MaterialIcon className="text-primary-container" name="edit_note" />
            <h2 className="text-xl font-bold text-primary">Rich Content</h2>
          </div>

          <div className="space-y-8">
            <div>
              <FieldLabel>Event Overview</FieldLabel>
              <textarea
                className="mt-2 min-h-48 w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 font-body transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary"
                onChange={(event) => onChange("description", event.target.value)}
                placeholder="Describe the purpose, flow, and key details of the event..."
                required
                value={formData.description}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <FieldLabel>Key Highlights</FieldLabel>
                <textarea
                  className="mt-2 min-h-32 w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 font-body transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary"
                  onChange={(event) => onChange("highlightsText", event.target.value)}
                  placeholder={"One highlight per line\nNetworking session\nHands-on workshop\nLive Q&A"}
                  required
                  value={formData.highlightsText}
                />
              </div>

              <div>
                <FieldLabel>Target Audience</FieldLabel>
                <textarea
                  className="mt-2 min-h-32 w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 font-body transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary"
                  onChange={(event) => onChange("targetAudienceText", event.target.value)}
                  placeholder={"One audience segment per line\nUndergraduate students\nClub members\nCareer-focused students"}
                  required
                  value={formData.targetAudienceText}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Additional Info</FieldLabel>
              <textarea
                className="mt-2 min-h-32 w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 font-body transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary"
                onChange={(event) => onChange("additionalInfo", event.target.value)}
                placeholder="Anything extra students should know, like preparation notes, what to bring, or arrival guidance."
                value={formData.additionalInfo}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="col-span-12 flex flex-col gap-8 lg:sticky lg:top-12 lg:col-span-4">
        <section className="overflow-hidden rounded-xl bg-surface-container-lowest p-8">
          <div className="mb-6 flex items-center gap-3">
            <MaterialIcon className="text-primary-container" name="visibility" />
            <h2 className="text-xl font-bold text-primary">Live Preview</h2>
          </div>

          <div className="overflow-hidden rounded-xl bg-surface-container-low">
            <div className="relative h-40">
              <img
                alt="Event visual preview"
                className="h-full w-full object-cover"
                src={visual.image}
              />
              <div className="absolute inset-0 bg-primary/15" />
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                {formData.category || "Category"}
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <h3 className="font-headline text-xl font-bold text-primary">
                  {formData.title || "Your event title"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                  {formData.description || "Your event overview will appear here as you type."}
                </p>
              </div>

              <div className="space-y-3 text-sm text-on-surface-variant">
                <div className="flex items-start gap-2">
                  <MaterialIcon className="mt-0.5 text-lg text-primary" filled name="calendar_today" />
                  <span>{schedulePreview}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon className="mt-0.5 text-lg text-primary" filled name="location_on" />
                  <span>{formData.venue || "Venue will appear here."}</span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
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

        <section className="rounded-xl bg-primary p-8 text-on-primary shadow-xl">
          <h3 className="text-lg font-bold">Finalize Event</h3>
          <p className="mt-2 text-sm leading-relaxed text-on-primary-container">
            This form publishes or updates the real public event page immediately using the existing NileConnect backend flow.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-secondary to-[#008a4e] py-4 font-bold text-white shadow-lg shadow-secondary/20 transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting}
              type="submit"
            >
              <MaterialIcon filled name="rocket_launch" />
              {submitting ? "Saving..." : submitLabel}
            </button>
            {cancelHref ? (
              <Link
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-4 font-bold text-white/80 transition-colors hover:bg-primary-container/80"
                to={cancelHref}
              >
                <MaterialIcon name="arrow_back" />
                {cancelLabel}
              </Link>
            ) : null}
          </div>
        </section>

        <div className="rounded-xl border border-tertiary-fixed-dim/30 bg-tertiary-fixed p-6">
          <div className="flex items-start gap-4">
            <MaterialIcon className="text-tertiary" name="tips_and_updates" />
            <div>
              <h4 className="text-sm font-bold text-on-tertiary-fixed">Curator Tip</h4>
              <p className="mt-1 text-xs leading-relaxed text-on-tertiary-fixed-variant">
                Events with strong highlights, clear audience targeting, and practical preparation notes tend to earn more clicks and RSVPs.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-surface-container-low p-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between lg:flex-col lg:items-start">
            <div className="flex-1">
              <h3 className="font-bold text-primary">Setup Completion</h3>
              <p className="text-sm text-on-surface-variant">
                Complete the essential event sections before saving.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-1">
                {completionSteps.map((completed, index) => (
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-surface shadow-sm ${
                      completed ? "bg-secondary" : "bg-surface-dim"
                    }`}
                    key={index}
                  >
                    {completed ? (
                      <MaterialIcon className="text-sm text-white" name="check" />
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold uppercase text-secondary">
                  {completedCount} of {completionSteps.length}
                </span>
                <span className="text-sm font-bold text-primary">Sections complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 space-y-6">
        <ErrorMessage message={error} />
        <div className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-on-surface-variant">
            {helperText ?? "Review the event details carefully before saving changes."}
          </p>
          <div className="flex gap-3">
            {cancelHref ? (
              <Link
                className="inline-flex items-center justify-center rounded-full border border-outline-variant px-6 py-3 font-semibold text-primary transition hover:bg-surface-container-low"
                to={cancelHref}
              >
                {cancelLabel}
              </Link>
            ) : null}
            <button
              className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] px-8 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting}
              type="submit"
            >
              {submitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
