import { api } from "./api"
import { type ApiResponse, type CreateServicePayload, type PaginatedResponse, type ServiceItem, type UpdateServicePayload } from "@/types";

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

export async function updateServiceRequest(id: number,data: UpdateServicePayload) {
  const response = await api.put<ApiResponse<ServiceItem>>(`/services/${id}`, data);
  return response.data;
}

export async function deleteServiceRequest(id: number){
  const response = await api.delete<ApiResponse<void>>(`/services/${id}`);
  return response.data;
}