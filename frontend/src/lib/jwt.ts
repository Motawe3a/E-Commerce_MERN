import type { AuthUser } from "@/types/api";

/**
 * Decode the payload of a JWT without verifying the signature. The backend mints
 * tokens with `{ id, email, role }` (see backend/src/services/userService.ts).
 * Returns null for anything that doesn't parse as a token payload.
 */
export function decodeToken(token: string): AuthUser | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(json) as Partial<AuthUser> & { exp?: number };

    if (!data.id || !data.email) return null;
    if (data.exp && data.exp * 1000 < Date.now()) return null;

    return {
      id: data.id,
      email: data.email,
      role: data.role === "admin" ? "admin" : "user",
    };
  } catch {
    return null;
  }
}
