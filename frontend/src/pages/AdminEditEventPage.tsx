import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { EventForm } from "../components/common/EventForm";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import type { EventFormValues } from "../types/domain";

export function AdminEditEventPage() {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadEvent = async () => {
      if (!id) {
        setError("Event id is missing.");
        setLoading(false);
        return;
      }

      try {
        const event = await eventsApi.getEventById(id);

        if (isMounted) {
          setLoadFailed(false);
          setFormData({
            title: event.title,
            description: event.description,
            eventDate: event.eventDate,
            startTime: event.startTime,
            endTime: event.endTime ?? "",
            venue: event.venue,
            category: event.category,
            highlightsText: event.highlights.join("\n"),
            targetAudienceText: event.targetAudience.join("\n"),
            additionalInfo: event.additionalInfo ?? "",
          });
        }
      } catch (loadError) {
        if (isMounted) {
          setLoadFailed(true);
          setError(getApiErrorMessage(loadError, "We couldn't load this event for editing right now."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadEvent();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (field: keyof EventFormValues, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      setError("Event id is missing.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await eventsApi.updateEvent(id, formData);
      navigate("/admin/events", { replace: true });
    } catch (submissionError) {
      setError(
        getApiErrorMessage(
          submissionError,
          "We couldn't save your changes right now. Please review the form and try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading event for editing..." />;
  }

  if (!id) {
    return (
      <EmptyState
        description="The event id is missing from this route."
        title="Cannot edit event"
      />
    );
  }

  if (loadFailed) {
    return (
      <div className="space-y-6">
        <ErrorMessage message={error} />
        <EmptyState
          description="This event could not be loaded for editing. It may no longer exist, or your account may not have access to manage it."
          title="Cannot edit event"
        />
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
            Edit Event Details
          </h1>
          <p className="mt-4 text-base leading-7 text-on-surface-variant">
            Update the event information students see on the public event page while preserving the
            same route, payload shape, and backend contract.
          </p>
        </div>
      </section>

      <EventForm
        error={error}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        submitting={submitting}
      />
    </section>
  );
}
