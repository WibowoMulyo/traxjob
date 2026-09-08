export const isUrl = (s: string): boolean => /^https?:\/\//i.test(s);

export const isEmail = (s: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export const uid = (): string =>
  Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);

export const todayStr = (): string => new Date().toISOString().slice(0, 10);

export function isoToDate(s: string): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export function dateToISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDateDisplay(s: string): string {
  const d = isoToDate(s);
  if (!d) return "";
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
