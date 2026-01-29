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

export type Row = {
  id: number;
  user_id: number;
  service_id: number;
  start_time: string;
  end_time: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user: User;
  service: ServiceItem;
};