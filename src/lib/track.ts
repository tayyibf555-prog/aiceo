"use client";

/*
  Client half of the first-party tracker. Everything meaningful on the
  site reports through here so the owner dashboard can show real
  numbers: visitors, pageviews, checkout clicks, enquiries.
*/
const KEY = "aiceo_sid";

export function sessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export function trackEvent(
  name: string,
  meta: Record<string, unknown> = {},
  surface = "site"
) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({
    name,
    meta,
    surface,
    session_id: sessionId(),
    path: window.location.pathname,
    referrer: document.referrer || "",
  });
  try {
    /* sendBeacon survives the page leaving, which is exactly what a
       checkout click does */
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([payload], { type: "application/json" })
      );
      return;
    }
  } catch {
    /* fall through to fetch */
  }
  void fetch("/api/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}
