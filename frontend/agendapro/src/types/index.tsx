export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ServiceItem = {
  id: number;
  name: string;
  description: string;
  duration_minutes: number;
  price: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type AppointmentItem = {
  id: number;
  user_id: number;
  service_id: number;
  start_time: string;
  end_time: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user: User;
  service: ServiceItem;
};

export type PaginatedResponse<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface CreateServicePayload {
  name: string,
  duration_minutes: number,
  price: number,
  description: string
}

export interface UpdateServicePayload {
  name? : string;
  description?: string;
  duration_minutes?: number;
  price?: number;
}