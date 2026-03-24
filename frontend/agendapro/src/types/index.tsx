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