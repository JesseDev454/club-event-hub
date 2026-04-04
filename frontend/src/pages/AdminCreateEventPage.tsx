import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { EventForm } from "../components/common/EventForm";
import type { EventFormInput } from "../types/domain";

export function AdminCreateEventPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EventFormInput>({
    title: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    venue: "",
    category: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof EventFormInput, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await eventsApi.createEvent(formData);
      navigate("/admin/events", { replace: true });
    } catch (submissionError) {
      setError(
        getApiErrorMessage(
          submissionError,
          "We couldn't create this event right now. Please review the details and try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-8">
      <section className="rounded-[1.75rem] border border-white/70 bg-white p-6 shadow-card sm:p-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
            Club admin
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Create a new event
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-700 sm:text-base">
            Add the details students need to discover, understand, and attend your club event.
          </p>
        </div>
      </section>

      <EventForm
        error={error}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Create event"
        submitting={submitting}
      />
    </section>
  );
}
