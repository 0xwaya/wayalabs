import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background:
            "radial-gradient(circle at top right, rgba(155,109,255,0.20), transparent 30%), radial-gradient(circle at bottom left, rgba(34,211,238,0.16), transparent 30%), linear-gradient(135deg, #06060e 0%, #0b1020 55%, #11172b 100%)",
          color: "#f0f0f8",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(79, 142, 247, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(79, 142, 247, 0.06) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px",
            width: "100%",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "72px",
                height: "72px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #4f8ef7, #9b6dff 55%, #22d3ee)",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 40px rgba(155, 109, 255, 0.35)",
                fontSize: "30px",
                fontWeight: 800,
              }}
            >
              W
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "34px", fontWeight: 700 }}>WayaLabs</div>
              <div style={{ fontSize: "20px", color: "#aab0cc" }}>
                AI Solutions Studio
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: "760px" }}>
            <div
              style={{
                display: "flex",
                fontSize: "26px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#7dd3fc",
                marginBottom: "18px",
              }}
            >
              Chatbots · Agents · Intelligent Web Platforms
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "68px",
                lineHeight: 1.05,
                fontWeight: 800,
                marginBottom: "20px",
              }}
            >
              Build AI that drives real outcomes.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "30px",
                lineHeight: 1.35,
                color: "#c9cce0",
              }}
            >
              Production-grade AI systems that reduce support load, increase conversion,
              and automate workflows.
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {[
              "LangGraph",
              "AI Agents",
              "Automations",
              "Full-Stack Delivery",
            ].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  padding: "14px 22px",
                  borderRadius: "999px",
                  border: "1px solid rgba(155,109,255,0.35)",
                  background: "rgba(13, 13, 31, 0.72)",
                  color: "#f0f0f8",
                  fontSize: "21px",
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}