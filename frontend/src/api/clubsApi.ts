import type { ClubDetail, ClubSummary } from "../types/domain";
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
};
