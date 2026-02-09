import { api } from "./api";
import type { LoginFormData } from "@/schemas/login-schema";

export async function loginRequest(data: LoginFormData) {
  const response = await api.post("/login", {
    email: data.email,
    password: data.password,
  });

  return response.data;
}
