import { apiClient } from "./client";

export const eventsApi = {
  getEvents() {
    return apiClient.get("/events");
  },
  getEventById(id: string) {
    return apiClient.get(`/events/${id}`);
  },
  createEvent(payload: unknown) {
    return apiClient.post("/events", payload);
  },
  updateEvent(id: string, payload: unknown) {
    return apiClient.put(`/events/${id}`, payload);
  },
  deleteEvent(id: string) {
    return apiClient.delete(`/events/${id}`);
  },
  getAdminEvents() {
    return apiClient.get("/admin/events");
  },
};
