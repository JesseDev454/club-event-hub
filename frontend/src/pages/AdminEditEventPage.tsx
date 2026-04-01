import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { EventForm } from "../components/common/EventForm";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import type { EventFormInput } from "../types/domain";

export function AdminEditEventPage() {
  const { id } = useParams();
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
          });
        }
      } catch (loadError) {
        if (isMounted) {
          setLoadFailed(true);
          setError(getApiErrorMessage(loadError, "Unable to load this event right now."));
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

  const handleChange = (field: keyof EventFormInput, value: string) => {
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
      setError(getApiErrorMessage(submissionError, "Unable to update this event right now."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      {loading ? <LoadingState label="Loading event for editing..." /> : null}

      {!loading && !id ? (
        <EmptyState
          description="The event id is missing from this route."
          title="Cannot edit event"
        />
      ) : null}

      {!loading && id && loadFailed ? (
        <>
          <ErrorMessage message={error} />
          <EmptyState
            description="This event could not be loaded for editing. It may not exist anymore, or you may not have access to manage it."
            title="Cannot edit event"
          />
        </>
      ) : null}

      {!loading && id && !loadFailed ? (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink-900">Edit event</h1>
            <p className="mt-2 text-sm text-ink-700">
              Update the details for this event. Ownership fields stay hidden.
            </p>
          </div>

          <EventForm
            error={error}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel="Update event"
            submitting={submitting}
          />
        </>
      ) : null}
    </section>
  );
}
