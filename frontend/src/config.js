export const PRIMARY_URL = (import.meta.env.VITE_BASE_URL || "https://blinkup-08j8.onrender.com").replace(/\/$/, "");
export const FALLBACK_URL = "http://localhost:8000";

export const BASE_URL = PRIMARY_URL;

/**
 * Robust fetch helper that attempts primary URL first, and if network fails,
 * falls back to local backend (http://localhost:8000).
 */
export async function apiFetch(endpoint, options = {}) {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  try {
    const res = await fetch(`${PRIMARY_URL}${path}`, options);
    return res;
  } catch (primaryErr) {
    console.warn(`Primary API endpoint (${PRIMARY_URL}${path}) unreachable:`, primaryErr);

    // Attempt fallback if PRIMARY is not already localhost
    if (!PRIMARY_URL.includes("localhost")) {
      try {
        const fallbackRes = await fetch(`${FALLBACK_URL}${path}`, options);
        return fallbackRes;
      } catch (fallbackErr) {
        console.warn(`Fallback API endpoint (${FALLBACK_URL}${path}) unreachable:`, fallbackErr);
      }
    }

    throw primaryErr;
  }
}
