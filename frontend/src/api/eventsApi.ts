import type { EventDetail, EventFormInput, EventSummary, EventUpdateInput } from "../types/domain";
import { apiClient } from "./client";

type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export const eventsApi = {
  async getEvents(): Promise<EventSummary[]> {
    const response = await apiClient.get<ApiSuccessResponse<EventSummary[]>>("/events");
    return response.data.data;
  },

  async getEventById(id: string): Promise<EventDetail> {
    const response = await apiClient.get<ApiSuccessResponse<EventDetail>>(`/events/${id}`);
    return response.data.data;
  },

  async createEvent(payload: EventFormInput): Promise<EventDetail> {
    const response = await apiClient.post<ApiSuccessResponse<EventDetail>>("/events", {
      ...payload,
      endTime: payload.endTime || undefined,
    });

    return response.data.data;
  },

  async updateEvent(id: string, payload: EventUpdateInput): Promise<EventDetail> {
    const response = await apiClient.put<ApiSuccessResponse<EventDetail>>(`/events/${id}`, {
      ...payload,
      ...(payload.endTime === "" ? { endTime: null } : {}),
    });

    return response.data.data;
  },

  async deleteEvent(id: string): Promise<void> {
    await apiClient.delete(`/events/${id}`);
  },

  async getAdminEvents(): Promise<EventSummary[]> {
    const response = await apiClient.get<ApiSuccessResponse<EventSummary[]>>("/admin/events");
    return response.data.data;
  },
};
