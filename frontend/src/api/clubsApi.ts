import type { ClubCreateInput, ClubDetail, ClubSummary, ClubUpdateInput } from "../types/domain";
import type { ClubCreationSuccessPayload } from "../types/auth";
import { apiClient } from "./client";

type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export const clubsApi = {
  async getClubs(): Promise<ClubSummary[]> {
    const response = await apiClient.get<ApiSuccessResponse<ClubSummary[]>>("/clubs");
    return response.data.data;
  },

  async getClubById(id: string): Promise<ClubDetail> {
    const response = await apiClient.get<ApiSuccessResponse<ClubDetail>>(`/clubs/${id}`);
    return response.data.data;
  },

  async getManagedClub(clubId: string): Promise<ClubDetail> {
    return this.getClubById(clubId);
  },

  async getAdminClub(): Promise<ClubSummary> {
    const response = await apiClient.get<ApiSuccessResponse<ClubSummary>>("/admin/club");
    return response.data.data;
  },

  async createClub(payload: ClubCreateInput): Promise<ClubCreationSuccessPayload> {
    const response = await apiClient.post<ApiSuccessResponse<ClubCreationSuccessPayload>>("/clubs", {
      ...payload,
      contactEmail: payload.contactEmail ?? "",
      tagline: payload.tagline ?? "",
    });

    return response.data.data;
  },

  async updateClub(id: string, payload: ClubUpdateInput): Promise<ClubSummary> {
    const response = await apiClient.patch<ApiSuccessResponse<ClubSummary>>(`/clubs/${id}`, {
      ...payload,
      ...(payload.contactEmail === null ? { contactEmail: "" } : {}),
      ...(payload.tagline === null ? { tagline: "" } : {}),
    });

    return response.data.data;
  },
};
