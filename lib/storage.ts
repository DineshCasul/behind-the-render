/**
 * Thin, SSR-safe wrapper around localStorage. Next.js renders this app's
 * components on the server first (no `window`), so every read has to check
 * `typeof window` before touching browser-only APIs, and fall back to a
 * default value when there is nothing stored yet (first visit) or storage
 * is unavailable (private browsing, disabled storage).
 */
export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked — progress simply won't persist this session.
  }
}
