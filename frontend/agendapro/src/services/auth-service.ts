import { api } from "./api";
import type { LoginFormData } from "@/schemas/login-schema";
import type { RegisterFormData } from "@/schemas/register-schema";

export async function loginRequest(data: LoginFormData) {
  const response = await api.post("/login", {
    email: data.email,
    password: data.password,
  });

  return response.data;
}

export async function registerRequest(data: RegisterFormData){
  const response = await api.post("/register", {
    name: data.name,
    email: data.email,
    password: data.password,
    password_confirmation: data.password_confirmation,
  });

  return response.data;
}
