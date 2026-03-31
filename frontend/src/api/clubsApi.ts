import { apiClient } from "./client";

export const clubsApi = {
  getClubs() {
    return apiClient.get("/clubs");
  },
  getClubById(id: string) {
    return apiClient.get(`/clubs/${id}`);
  },
};
