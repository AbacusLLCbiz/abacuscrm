/**
 * Timezone-aware date/time formatting utilities.
 * All functions accept an ISO string or Date and a timezone (IANA string).
 */

export function fmtTime(iso: string | Date, tz: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  })
}

export function fmtDate(
  iso: string | Date,
  tz: string,
  opts: Intl.DateTimeFormatOptions = {}
): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: tz,
    ...opts,
  })
}

export function fmtDateKey(iso: string | Date, tz: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: tz,
  })
}

export function fmtDateTime(iso: string | Date, tz: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  })
}
