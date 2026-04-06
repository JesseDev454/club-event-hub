import { type FormEvent } from "react";

import type { ClubFormValues } from "../../types/domain";
import { ErrorMessage } from "../ui/ErrorMessage";
import { MaterialIcon } from "./MaterialIcon";

type ClubFormProps = {
  formData: ClubFormValues;
  error: string | null;
  helperText?: string | null;
  submitting: boolean;
  submitLabel: string;
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
    <label className="block text-xs font-bold uppercase tracking-[0.18em] text-outline">
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
  onChange,
  onSubmit,
}: ClubFormProps) {
  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <section className="rounded-[1.75rem] bg-white p-8 shadow-soft">
            <div className="mb-8 flex items-center gap-3">
              <MaterialIcon className="text-primary" name="info" />
              <h2 className="font-headline text-xl font-bold text-on-surface">Club Identity</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <FieldLabel>Club Name</FieldLabel>
                <input
                  className="w-full rounded-t-xl border-0 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-b-2 focus:border-primary"
                  onChange={(event) => onChange("name", event.target.value)}
                  placeholder="e.g. Nile AI Research Circle"
                  required
                  value={formData.name}
                />
              </div>

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
                <FieldLabel>Tagline (Optional)</FieldLabel>
                <input
                  className="w-full rounded-t-xl border-0 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-b-2 focus:border-primary"
                  onChange={(event) => onChange("tagline", event.target.value)}
                  placeholder="A short line that captures your club identity"
                  value={formData.tagline}
                />
              </div>

              <div className="space-y-2">
                <FieldLabel>Club Description</FieldLabel>
                <textarea
                  className="min-h-48 w-full resize-none rounded-t-xl border-0 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-b-2 focus:border-primary"
                  onChange={(event) => onChange("description", event.target.value)}
                  placeholder="What is your club about, who should join, and what kinds of activities do you run?"
                  required
                  value={formData.description}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-[1.75rem] bg-surface-container-low p-8">
            <div className="mb-6 flex items-center gap-3">
              <MaterialIcon className="text-primary" name="mail" />
              <h2 className="font-headline text-lg font-bold text-on-surface">Communication</h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <FieldLabel>Contact Email</FieldLabel>
                <input
                  className="w-full rounded-xl border-0 bg-white px-4 py-3 text-on-surface outline-none transition focus:ring-2 focus:ring-primary/15"
                  onChange={(event) => onChange("contactEmail", event.target.value)}
                  placeholder="club@nileuniversity.edu"
                  type="email"
                  value={formData.contactEmail}
                />
                <p className="text-xs text-outline">
                  Leave blank if you do not want to publish a contact email yet.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] bg-white p-8 shadow-soft">
            <div className="mb-6 flex items-center gap-3">
              <MaterialIcon className="text-primary" name="visibility" />
              <h2 className="font-headline text-lg font-bold text-on-surface">Profile Preview</h2>
            </div>

            <div className="rounded-[1.5rem] bg-surface-container-low p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-outline">Preview</p>
              <h3 className="mt-4 font-headline text-2xl font-bold text-primary">
                {formData.name || "Your club name"}
              </h3>
              {formData.tagline.trim() ? (
                <p className="mt-2 text-sm font-medium text-secondary">{formData.tagline.trim()}</p>
              ) : null}
              <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                {formData.description || "Your club story will appear here as you type."}
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-on-surface-variant">
                <span className="rounded-full bg-white px-4 py-2">
                  {formData.category || "Category"}
                </span>
                <span className="rounded-full bg-white px-4 py-2">
                  {formData.contactEmail.trim() || "No public contact email"}
                </span>
              </div>
            </div>
          </section>

          <div className="rounded-[1.5rem] border-l-4 border-tertiary bg-tertiary-fixed p-6">
            <div className="flex items-start gap-3">
              <MaterialIcon className="text-tertiary" name="lightbulb" />
              <div>
                <p className="font-headline text-sm font-bold text-tertiary">Practical Tip</p>
                <p className="mt-1 text-xs leading-6 text-on-surface-variant">
                  Clear club descriptions and a strong tagline make it easier for students to
                  understand what your community stands for.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} />

      <div className="flex flex-col gap-4 rounded-[1.75rem] bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-on-surface-variant">
          {helperText ?? "Review your club profile details before saving."}
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
