import { apiClient } from "./client";

export const rsvpsApi = {
  createRsvp(eventId: string) {
    return apiClient.post(`/events/${eventId}/rsvp`);
  },
  cancelRsvp(eventId: string) {
    return apiClient.delete(`/events/${eventId}/rsvp`);
  },
};
