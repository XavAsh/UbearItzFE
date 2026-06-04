const APP_TIME_ZONE = "Europe/Paris";

/** Same output on server and client; uses app timezone (Annecy), not UTC. */
export function formatDateTime(iso: string, locale = "fr-FR"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: APP_TIME_ZONE,
  }).format(d);
}

/** @deprecated Use formatDateTime — kept for imports during transition */
export const formatDateTimeUtc = formatDateTime;
