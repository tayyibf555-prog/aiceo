"use client";

/* Fires exactly one pageview per route, first-party. The ref guard
   keeps StrictMode's double effect (and any re-render) from inflating
   the numbers the dashboard reports. */
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/track";

export default function Track() {
  const pathname = usePathname();
  const sent = useRef<string | null>(null);

  useEffect(() => {
    if (sent.current === pathname) return;
    sent.current = pathname;
    trackEvent("pageview");
  }, [pathname]);

  return null;
}
