import { api } from "./api"
import type { PaginatedResponse, ServiceItem } from "@/types";

export async function getServicesRequest(page: number = 1) {
  const response = await api.get<PaginatedResponse<ServiceItem>>("/services", {
    params: { page },
  });

  return response.data;
}