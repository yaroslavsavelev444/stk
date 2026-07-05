// app/api/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "СТК-Актив";
  const subtitle =
    searchParams.get("subtitle") ?? "Производство дорожных знаков по ГОСТ";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "linear-gradient(135deg, #2E2D8F 0%, #24226F 100%)",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 28, opacity: 0.75, marginBottom: 24 }}>
        СТК-Актив
      </div>
      <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15 }}>
        {title}
      </div>
      <div style={{ fontSize: 30, marginTop: 24, opacity: 0.85 }}>
        {subtitle}
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
