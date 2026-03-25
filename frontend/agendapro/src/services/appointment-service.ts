import { api } from "./api"
import type { AppointmentItem, PaginatedResponse } from "@/types";

export async function getAppointmentsRequest(page: number = 1) {
  const response = await api.get<PaginatedResponse<AppointmentItem>>("/appointments", {
    params: { page },
  });

  return response.data;
}