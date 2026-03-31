import { apiClient } from "./client";

export const authApi = {
  register(payload: unknown) {
    return apiClient.post("/auth/register", payload);
  },
  login(payload: unknown) {
    return apiClient.post("/auth/login", payload);
  },
  getCurrentUser() {
    return apiClient.get("/auth/me");
  },
};
