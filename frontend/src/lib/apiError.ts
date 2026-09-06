import { AxiosError } from "axios";

/**
 * Normalise an unknown error into a human-readable string.
 *
 * The backend is inconsistent: `/users/*` send a bare string body, while most
 * other routes send JSON `{ message }`. Handle both, plus network failures.
 */
export function normalizeError(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object") {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string" && message.trim()) return message;
    }
    if (error.code === "ERR_NETWORK") {
      return "Can't reach the server. Is the backend running?";
    }
    if (error.message) return error.message;
  }

  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}
