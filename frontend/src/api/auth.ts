import { api } from "@/lib/axios";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Both endpoints return the raw JWT as a plain-text body on success
 * (backend/src/services/userService.ts), so `response.data` IS the token.
 */
export async function register(payload: RegisterPayload): Promise<string> {
  const { data } = await api.post<string>("/users/register", payload);
  return data;
}

export async function login(payload: LoginPayload): Promise<string> {
  const { data } = await api.post<string>("/users/login", payload);
  return data;
}
