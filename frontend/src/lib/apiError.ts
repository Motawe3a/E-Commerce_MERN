import { AxiosError } from "axios";
import type { TKey } from "@/i18n/dict";

type Translate = (key: TKey) => string;

/**
 * Normalise an unknown error into a human-readable string.
 *
 * The backend is inconsistent: `/users/*` send a bare string body, while most
 * other routes send JSON `{ message }`. Handle both, plus network failures.
 * Server messages are English-only (the API isn't localised); the client-side
 * fallbacks are translated when a `t` is passed.
 */
export function normalizeError(error: unknown, t?: Translate): string {
  const network = t ? t("err.network") : "Can't reach the server. Is the backend running?";
  const generic = t ? t("err.generic") : "Something went wrong. Please try again.";

  if (error instanceof AxiosError) {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object") {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string" && message.trim()) return message;
    }
    if (error.code === "ERR_NETWORK") return network;
    if (error.message) return error.message;
  }

  if (error instanceof Error && error.message) return error.message;
  return generic;
}
