import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Route 9 Web — Websites for Businesses on Route 9";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#080503",
          position: "relative",
        }}
      >
        {/* Warm amber glow radial behind the sign */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "900px",
            height: "500px",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(ellipse at center, rgba(212,104,42,0.22) 0%, rgba(212,104,42,0.07) 45%, transparent 72%)",
            display: "flex",
          }}
        />

        {/* Neon sign frame */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "2.5px solid rgba(212,104,42,0.55)",
            borderRadius: "28px",
            padding: "52px 88px 48px",
            boxShadow:
              "0 0 0 1px rgba(212,104,42,0.15), 0 0 48px rgba(212,104,42,0.28), 0 0 96px rgba(212,104,42,0.10)",
            background: "rgba(212,104,42,0.035)",
            position: "relative",
          }}
        >
          {/* Corner accents */}
          {[
            { top: 10, left: 10 },
            { top: 10, right: 10 },
            { bottom: 10, left: 10 },
            { bottom: 10, right: 10 },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: "rgba(212,104,42,0.7)",
                boxShadow: "0 0 10px rgba(212,104,42,0.9)",
                display: "flex",
                ...pos,
              }}
            />
          ))}

          {/* Route 9 Web wordmark */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "18px",
            }}
          >
            <span
              style={{
                fontSize: "100px",
                fontWeight: 800,
                color: "#FF8030",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                display: "flex",
              }}
            >
              Route 9
            </span>
            <span
              style={{
                fontSize: "100px",
                fontWeight: 800,
                color: "#FFB060",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                display: "flex",
              }}
            >
              Web
            </span>
          </div>

          {/* Horizontal rule */}
          <div
            style={{
              width: "320px",
              height: "1.5px",
              background:
                "linear-gradient(90deg, transparent, rgba(212,104,42,0.6) 20%, rgba(212,104,42,0.6) 80%, transparent)",
              margin: "22px 0 18px",
              display: "flex",
            }}
          />

          {/* Shrewsbury, MA */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: 400,
              color: "rgba(212,104,42,0.75)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Shrewsbury, MA
          </div>
        </div>

        {/* Tagline at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "1px",
              background: "rgba(243,233,213,0.2)",
              display: "flex",
            }}
          />
          <span
            style={{
              fontSize: "16px",
              color: "rgba(243,233,213,0.28)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Websites for independent shops on Route 9
          </span>
          <div
            style={{
              width: "32px",
              height: "1px",
              background: "rgba(243,233,213,0.2)",
              display: "flex",
            }}
          />
        </div>

        {/* Subtle floor glow */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: "700px",
            height: "80px",
            transform: "translate(-50%, 0)",
            background:
              "radial-gradient(ellipse at center bottom, rgba(212,104,42,0.14) 0%, transparent 70%)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
