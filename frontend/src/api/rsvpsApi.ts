import type { RsvpActionResponse } from "../types/domain";
import { apiClient } from "./client";

type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export const rsvpsApi = {
  async createRsvp(eventId: string): Promise<RsvpActionResponse> {
    const response = await apiClient.post<ApiSuccessResponse<RsvpActionResponse>>(
      `/events/${eventId}/rsvp`,
    );

    return response.data.data;
  },

  async cancelRsvp(eventId: string): Promise<RsvpActionResponse> {
    const response = await apiClient.delete<ApiSuccessResponse<RsvpActionResponse>>(
      `/events/${eventId}/rsvp`,
    );

    return response.data.data;
  },
};
