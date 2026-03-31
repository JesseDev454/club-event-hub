import type { AuthSuccessPayload, AuthUser, LoginInput, RegisterStudentInput } from "../types/auth";
import { apiClient } from "./client";

type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export const authApi = {
  async registerStudent(payload: RegisterStudentInput): Promise<AuthSuccessPayload> {
    const response = await apiClient.post<ApiSuccessResponse<AuthSuccessPayload>>(
      "/auth/register",
      payload,
    );

    return response.data.data;
  },

  async loginUser(payload: LoginInput): Promise<AuthSuccessPayload> {
    const response = await apiClient.post<ApiSuccessResponse<AuthSuccessPayload>>(
      "/auth/login",
      payload,
    );

    return response.data.data;
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await apiClient.get<ApiSuccessResponse<AuthUser>>("/auth/me");

    return response.data.data;
  },
};
