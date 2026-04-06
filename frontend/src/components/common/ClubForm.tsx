import { type FormEvent } from "react";
import { Link } from "react-router-dom";

import { getCategoryVisual } from "../../lib/presentation";
import { getInitials } from "../../lib/utils";
import type { ClubFormValues } from "../../types/domain";
import { ErrorMessage } from "../ui/ErrorMessage";
import { MaterialIcon } from "./MaterialIcon";

type ClubFormProps = {
  formData: ClubFormValues;
  error: string | null;
  helperText?: string | null;
  submitting: boolean;
  submitLabel: string;
  cancelHref?: string;
  cancelLabel?: string;
  onChange: (field: keyof ClubFormValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

const categoryOptions = [
  "Technology",
  "Career",
  "Social",
  "Sports",
  "Arts",
  "Academic",
  "Faith",
  "Volunteering",
];

function FieldLabel({ children }: { children: string }) {
  return (
    <label className="block text-sm font-bold uppercase tracking-[0.18em] text-primary">
      {children}
    </label>
  );
}

export function ClubForm({
  formData,
  error,
  helperText,
  submitting,
  submitLabel,
  cancelHref,
  cancelLabel = "Cancel",
  onChange,
  onSubmit,
}: ClubFormProps) {
  const visual = getCategoryVisual(formData.category || "Technology");

  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
        <div className="flex flex-col gap-6 md:col-span-4">
          <div className="group relative aspect-square cursor-default overflow-hidden rounded-xl border-2 border-dashed border-outline-variant/30 bg-surface-container-lowest p-6 shadow-soft">
            <img
              alt="Club preview"
              className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              src={visual.image}
            />
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
              <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-3xl ${visual.accentClassName}`}>
                <span className="text-2xl font-extrabold">{getInitials(formData.name || "NC")}</span>
              </div>
              <span className="text-sm font-bold text-primary">
                {formData.name || "Your club identity"}
              </span>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Live preview from current details
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-surface-container-low p-6">
            <h3 className="mb-2 flex items-center gap-2 font-headline font-bold text-primary">
              <MaterialIcon className="text-secondary" name="tips_and_updates" />
              Leader Tip
            </h3>
            <p className="text-sm italic text-on-surface-variant">
              "A strong tagline helps students understand your club in a single glance. Keep it short, specific, and memorable."
            </p>
          </div>
        </div>

        <div className="space-y-6 rounded-xl bg-surface-container-lowest p-8 shadow-soft md:col-span-8">
          <div className="space-y-1">
            <FieldLabel>Club Name</FieldLabel>
            <input
              className="w-full rounded-lg border-none bg-surface-container-low p-4 text-on-surface placeholder:text-slate-400 focus:ring-2 focus:ring-primary"
              onChange={(event) => onChange("name", event.target.value)}
              placeholder="e.g. The Nile Tech Innovators"
              required
              value={formData.name}
            />
            <p className="px-1 text-xs text-slate-500">
              This is how your club will appear in discovery and search results.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <FieldLabel>Category</FieldLabel>
              <select
                className="w-full rounded-lg border-none bg-surface-container-low p-4 text-on-surface focus:ring-2 focus:ring-primary"
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

            <div className="space-y-1">
              <FieldLabel>Optional Tagline</FieldLabel>
              <input
                className="w-full rounded-lg border-none bg-surface-container-low p-4 text-on-surface focus:ring-2 focus:ring-primary"
                onChange={(event) => onChange("tagline", event.target.value)}
                placeholder="Building the future today"
                value={formData.tagline}
              />
            </div>
          </div>

          <div className="space-y-1">
            <FieldLabel>Contact Email</FieldLabel>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <MaterialIcon name="mail" />
              </span>
              <input
                className="w-full rounded-lg border-none bg-surface-container-low p-4 pl-12 text-on-surface focus:ring-2 focus:ring-primary"
                onChange={(event) => onChange("contactEmail", event.target.value)}
                placeholder="contact@yourclub.com"
                type="email"
                value={formData.contactEmail}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-surface-container-lowest p-8 shadow-soft">
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-outline-variant/30" />
          <span className="text-sm font-bold uppercase tracking-[0.3em] text-secondary">
            The Narrative
          </span>
          <div className="h-px flex-1 bg-outline-variant/30" />
        </div>

        <div className="space-y-1">
          <FieldLabel>Club Description</FieldLabel>
          <textarea
            className="min-h-48 w-full resize-none rounded-lg border-none bg-surface-container-low p-4 text-on-surface focus:ring-2 focus:ring-primary"
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="Describe your club's mission, regular activities, and what new members can expect..."
            required
            rows={6}
            value={formData.description}
          />
          <p className="flex items-center gap-2 py-2 text-sm text-on-surface-variant">
            <MaterialIcon className="text-secondary" name="info" />
            Your description appears on the public club profile. Use clear, energetic language to help students decide whether to join.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border-l-4 border-secondary bg-surface-container-low p-6">
          <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Category</label>
          <p className="font-medium text-on-surface">{formData.category || "Choose a category"}</p>
        </div>
        <div className="rounded-xl border-l-4 border-primary bg-surface-container-low p-6">
          <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Public Contact</label>
          <p className="font-medium text-on-surface">
            {formData.contactEmail.trim() || "No public email yet"}
          </p>
        </div>
        <div className="rounded-xl border-l-4 border-on-tertiary-container bg-surface-container-low p-6">
          <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Tagline</label>
          <p className="font-medium text-on-surface">
            {formData.tagline.trim() || "Optional short identity line"}
          </p>
        </div>
      </div>

      <ErrorMessage message={error} />

      <div className="flex flex-col gap-6 border-t border-outline-variant/20 pt-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 text-on-surface-variant">
          <MaterialIcon name="check_circle" />
          <span className="text-sm">
            {helperText ?? "Review your club details before continuing."}
          </span>
        </div>
        <div className="flex w-full gap-4 md:w-auto">
          {cancelHref ? (
            <Link
              className="flex-1 rounded-lg border border-outline-variant/20 px-8 py-4 text-center font-bold text-primary transition hover:bg-surface-container-high md:flex-none"
              to={cancelHref}
            >
              {cancelLabel}
            </Link>
          ) : null}
          <button
            className="flex-1 rounded-lg bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] px-12 py-4 font-extrabold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60 md:flex-none"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
