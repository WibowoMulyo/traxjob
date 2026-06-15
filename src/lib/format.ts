/** Small formatting / id helpers shared across the app. */

export const isUrl = (s: string): boolean => /^https?:\/\//i.test(s);

export const isEmail = (s: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** Time-based unique id (sufficient for a single-client localStorage app). */
export const uid = (): string =>
  Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);

/** Today's date as YYYY-MM-DD. */
export const todayStr = (): string => new Date().toISOString().slice(0, 10);
