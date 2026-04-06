import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { EventForm } from "../components/common/EventForm";
import type { EventFormValues } from "../types/domain";

export function AdminCreateEventPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EventFormValues>({
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
  });
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
    <section className="space-y-8">
      <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
            Create a New Campus Event
          </h1>
          <p className="mt-4 text-base leading-7 text-on-surface-variant">
            Design an engaging experience for the Nile University community. Fill in the details
            below to publish your club&apos;s next milestone without changing the existing backend flow.
          </p>
        </div>
      </section>

      <EventForm
        error={error}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Publish Event"
        submitting={submitting}
      />
    </section>
  );
}
