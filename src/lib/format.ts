/** Small formatting / id helpers shared across the app. */

export const isUrl = (s: string): boolean => /^https?:\/\//i.test(s);

export const isEmail = (s: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** Time-based unique id (sufficient for a single-client localStorage app). */
export const uid = (): string =>
  Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);

/** Today's date as YYYY-MM-DD. */
export const todayStr = (): string => new Date().toISOString().slice(0, 10);

/** Parse a `YYYY-MM-DD` string into a local Date (no timezone shift). */
export function isoToDate(s: string): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

/** Format a Date as a local `YYYY-MM-DD` string. */
export function dateToISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Human-friendly date label, e.g. "15 Jun 2026" (empty string if unset). */
export function formatDateDisplay(s: string): string {
  const d = isoToDate(s);
  if (!d) return "";
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
