import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { EventForm } from "../components/common/EventForm";
import type { EventFormValues } from "../types/domain";

const initialFormValues: EventFormValues = {
  title: "",
  description: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  venue: "",
  category: "",
  highlightsText: "",
  targetAudienceText: "",
  additionalInfo: "",
};

export function AdminCreateEventPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EventFormValues>(initialFormValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof EventFormValues, value: string) => {
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
    <section className="space-y-10">
      <header className="max-w-3xl">
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-secondary">
          Event Architect
        </span>
        <h1 className="text-4xl font-extrabold tracking-tighter text-primary lg:text-5xl">
          Build Your Event Page
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
          Create a high-impact discovery page for your club&apos;s next activity. This keeps the
          current event publishing flow intact while helping you shape a richer public event detail page.
        </p>
      </header>

      <EventForm
        cancelHref="/admin/events"
        error={error}
        formData={formData}
        helperText="Publishing creates a live public event immediately using the current NileConnect event contract."
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Publish Event"
        submitting={submitting}
      />
    </section>
  );
}
