import { ImageResponse } from "next/og";
import { SITE } from "@/constants/seo";

export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0E0E0F",
          color: "#FFFFFF",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
            <path
              d="M8 24L16 8L24 24"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </svg>
          <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: "0.18em" }}>
            {SITE.name}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: 760 }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.04em" }}>
            {SITE.tagline}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.5, color: "rgba(255,255,255,0.62)" }}>
            {SITE.description}
          </div>
        </div>
      </div>
    ),
    size
  );
}
