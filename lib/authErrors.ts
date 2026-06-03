import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { ApiError } from "@/services/http";

export function formatLoginRateLimitMessage(locale: Locale, retryAfterSeconds: number): string {
  const dict = getDictionary(locale);

  if (retryAfterSeconds < 60) {
    return (dict["auth.login.rateLimited.seconds"] ?? "").replace("{{seconds}}", String(retryAfterSeconds));
  }

  const minutes = Math.ceil(retryAfterSeconds / 60);
  if (minutes < 60) {
    const key = minutes === 1 ? "auth.login.rateLimited.minute" : "auth.login.rateLimited.minutes";
    return (dict[key] ?? "").replace("{{minutes}}", String(minutes));
  }

  const hours = Math.ceil(minutes / 60);
  const key = hours === 1 ? "auth.login.rateLimited.hour" : "auth.login.rateLimited.hours";
  return (dict[key] ?? "").replace("{{hours}}", String(hours));
}

export function getLoginErrorMessage(error: unknown, locale: Locale): string {
  if (error instanceof ApiError && error.status === 429) {
    const retryAfterSeconds = error.retryAfterSeconds ?? 120;
    return formatLoginRateLimitMessage(locale, retryAfterSeconds);
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return getDictionary(locale)["error.description"] ?? "An unexpected error occurred.";
}
