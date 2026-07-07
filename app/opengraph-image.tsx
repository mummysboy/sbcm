import { ImageResponse } from "next/og";

export const alt = "Santa Barbara Chinese Medicine — Kristen Swegles, LAc, MTCM, CMP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PLUM = "#964ba9";
const GOLD = "#cea23b";
const SAND = "#f7f5ef";

async function interBlack(): Promise<ArrayBuffer | null> {
  try {
    // Plain fetch (no browser UA) makes Google Fonts return TTF, which Satori accepts.
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Inter:wght@900",
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OgImage() {
  const font = await interBlack();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: SAND,
          padding: 28,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${GOLD}`,
            borderRadius: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              color: GOLD,
            }}
          >
            <div style={{ width: 70, height: 2, background: GOLD }} />
            <div style={{ fontSize: 22 }}>✧</div>
            <div style={{ width: 70, height: 2, background: GOLD }} />
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 60,
              fontWeight: 900,
              color: PLUM,
              letterSpacing: 3,
              textAlign: "center",
            }}
          >
            SANTA BARBARA
          </div>
          <div
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: PLUM,
              letterSpacing: 3,
              textAlign: "center",
            }}
          >
            CHINESE MEDICINE
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 26,
              color: GOLD,
              letterSpacing: 8,
            }}
          >
            KRISTEN SWEGLES, LAc, MTCM, CMP
          </div>
          <div
            style={{
              marginTop: 34,
              fontSize: 22,
              color: "#6b6459",
              letterSpacing: 2,
            }}
          >
            924 Anacapa St, Santa Barbara · santabarbarachinesemedicine.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Inter", data: font, weight: 900 as const, style: "normal" as const }]
        : undefined,
    },
  );
}
