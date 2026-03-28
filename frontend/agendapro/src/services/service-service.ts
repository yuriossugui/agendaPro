import { api } from "./api"
import { type ApiResponse, type CreateServicePayload, type PaginatedResponse, type ServiceItem } from "@/types";

export async function getServicesRequest(page: number = 1) {
  const response = await api.get<PaginatedResponse<ServiceItem>>("/services", {
    params: { page },
  });

  return response.data;
}

export async function createServiceRequest(data: CreateServicePayload) {
  const response = await api.post<ApiResponse<ServiceItem>>("/services", data);
  return response.data;
}