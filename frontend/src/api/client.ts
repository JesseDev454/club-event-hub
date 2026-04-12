import axios, { AxiosError } from "axios";

type ApiErrorPayload = {
  message?: string;
  errors?: Array<{
    message?: string;
    path?: string;
  }>;
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setApiClientToken(token: string | null): void {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
}

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorPayload>;
    const responseData = axiosError.response?.data;
    const validationMessages = responseData?.errors
      ?.map((item) => item.message)
      .filter(Boolean);

    if (validationMessages?.length) {
      return validationMessages.join(" ");
    }

    return responseData?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
