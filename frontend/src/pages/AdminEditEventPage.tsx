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
          setError(
            getApiErrorMessage(
              loadError,
              "We couldn't load this event for editing right now.",
            ),
          );
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

  return (
    <section className="space-y-8">
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
            description="This event could not be loaded for editing. It may no longer exist, or your account may not have access to manage it."
            title="Cannot edit event"
          />
        </>
      ) : null}

      {!loading && id && !loadFailed ? (
        <>
          <section className="rounded-[1.75rem] border border-white/70 bg-white p-6 shadow-card sm:p-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
                Club admin
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                Edit event details
              </h1>
              <p className="mt-3 text-sm leading-6 text-ink-700 sm:text-base">
                Update the event information students see on the public event page.
              </p>
            </div>
          </section>

          <EventForm
            error={error}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
            submitting={submitting}
          />
        </>
      ) : null}
    </section>
  );
}
