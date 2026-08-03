"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Logs Core Web Vitals in production only (observability lite).
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== "production") return;

    const payload = {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      rating: metric.rating,
      navigationType: metric.navigationType,
    };

    // Prefer sendBeacon so unload doesn't drop the sample.
    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/vitals", body);
      return;
    }

    void fetch("/api/vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  });

  return null;
}
