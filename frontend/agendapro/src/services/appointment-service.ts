import { api } from "./api"
import { type ApiResponse, type AppointmentItem, type AppointmentItemCreated, type CreateAppointmentPayload, type PaginatedResponse } from "@/types";

export async function getAppointmentsRequest(page: number = 1) {
  const response = await api.get<PaginatedResponse<AppointmentItem>>("/appointments", {
    params: { page },
  });

  return response.data;
}

export async function createAppointmentRequest(data: CreateAppointmentPayload) {
  const response = await api.post<ApiResponse<AppointmentItemCreated>>("/appointments", data);
  return response.data;
}