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
      setError(getApiErrorMessage(submissionError, "Unable to create this event right now."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Create event</h1>
        <p className="mt-2 text-sm text-ink-700">
          Publish a new event for your club. Ownership is handled automatically.
        </p>
      </div>

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
