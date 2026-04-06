import type {
  EventCreateInput,
  EventDetail,
  EventFormValues,
  EventListItem,
  EventUpdateInput,
  ManagedEvent,
} from "../types/domain";
import { apiClient } from "./client";

type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export const eventsApi = {
  async getEvents(): Promise<EventListItem[]> {
    const response = await apiClient.get<ApiSuccessResponse<EventListItem[]>>("/events");
    return response.data.data;
  },

  async getEventById(id: string): Promise<EventDetail> {
    const response = await apiClient.get<ApiSuccessResponse<EventDetail>>(`/events/${id}`);
    return response.data.data;
  },

  async createEvent(formValues: EventFormValues): Promise<ManagedEvent> {
    const response = await apiClient.post<ApiSuccessResponse<ManagedEvent>>(
      "/events",
      buildCreateEventPayload(formValues),
    );

    return response.data.data;
  },

  async updateEvent(id: string, formValues: EventFormValues): Promise<ManagedEvent> {
    const response = await apiClient.put<ApiSuccessResponse<ManagedEvent>>(
      `/events/${id}`,
      buildUpdateEventPayload(formValues),
    );

    return response.data.data;
  },

  async deleteEvent(id: string): Promise<void> {
    await apiClient.delete(`/events/${id}`);
  },

  async getAdminEvents(): Promise<ManagedEvent[]> {
    const response = await apiClient.get<ApiSuccessResponse<ManagedEvent[]>>("/admin/events");
    return response.data.data;
  },
};

function splitTextareaLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeAdditionalInfo(value: string): string | null {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function buildBaseEventPayload(formValues: EventFormValues): Omit<EventCreateInput, "endTime"> {
  return {
    title: formValues.title,
    description: formValues.description,
    eventDate: formValues.eventDate,
    startTime: formValues.startTime,
    venue: formValues.venue,
    category: formValues.category,
    highlights: splitTextareaLines(formValues.highlightsText),
    targetAudience: splitTextareaLines(formValues.targetAudienceText),
    additionalInfo: normalizeAdditionalInfo(formValues.additionalInfo),
  };
}

function buildCreateEventPayload(formValues: EventFormValues): EventCreateInput {
  return {
    ...buildBaseEventPayload(formValues),
    endTime: formValues.endTime || undefined,
  };
}

function buildUpdateEventPayload(formValues: EventFormValues): EventUpdateInput {
  return {
    ...buildBaseEventPayload(formValues),
    endTime: formValues.endTime === "" ? null : formValues.endTime,
  };
}
