import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "StudyinBrazil - Find universities and postgraduate programs in Brazil";
export const size = {
  width: 1200,
  height: 630
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
          overflow: "hidden",
          background: "#f8fbfa",
          color: "#0f172a",
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(135deg, rgba(7,122,83,0.14) 0%, rgba(247,198,69,0.16) 48%, rgba(37,99,235,0.12) 100%)"
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 16,
            display: "flex",
            background: "linear-gradient(90deg, #077a53 0%, #f7c645 50%, #2563eb 100%)"
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -150,
            bottom: -160,
            width: 520,
            height: 520,
            borderRadius: 520,
            background: "rgba(37,99,235,0.12)"
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 92,
            top: 92,
            width: 240,
            height: 240,
            borderRadius: 240,
            background: "rgba(247,198,69,0.24)"
          }}
        />
        <main
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "72px 80px 64px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#077a53",
                  color: "white",
                  fontSize: 28,
                  fontWeight: 900
                }}
              >
                SB
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: 0 }}>StudyinBrazil</span>
                <span style={{ fontSize: 18, color: "#475569" }}>International student discovery platform</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                borderRadius: 999,
                padding: "12px 18px",
                background: "white",
                border: "1px solid rgba(15,23,42,0.08)",
                color: "#077a53",
                fontSize: 18,
                fontWeight: 800
              }}
            >
              Brazil programs now indexed
            </div>
          </div>

          <section style={{ display: "flex", flexDirection: "column", maxWidth: 835 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 76,
                lineHeight: 0.98,
                fontWeight: 900,
                letterSpacing: 0,
                color: "#07111f"
              }}
            >
              Find universities and postgraduate programs in Brazil
            </h1>
            <p
              style={{
                margin: "28px 0 0",
                maxWidth: 760,
                fontSize: 28,
                lineHeight: 1.35,
                color: "#334155"
              }}
            >
              Search MSc, PhD, professional master's, postgraduate, and university opportunities across Brazilian states.
            </p>
          </section>

          <div style={{ display: "flex", gap: 18 }}>
            {["Universities", "Programs", "Open applications"].map((item, index) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px 20px",
                  borderRadius: 14,
                  background: "white",
                  border: "1px solid rgba(15,23,42,0.08)",
                  boxShadow: "0 14px 35px rgba(15,23,42,0.08)"
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 12,
                    background: index === 0 ? "#077a53" : index === 1 ? "#f7c645" : "#2563eb"
                  }}
                />
                <span style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{item}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    ),
    size
  );
}
