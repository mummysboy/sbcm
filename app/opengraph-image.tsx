import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Santa Barbara Chinese Medicine — Kristen Swegles, LAc, MTCM, CMP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

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

async function logoDataUri(): Promise<string | null> {
  try {
    const buf = await readFile(path.join(process.cwd(), "public", "logo.png"));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OgImage() {
  const [font, logo] = await Promise.all([interBlack(), logoDataUri()]);

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
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" width={520} height={143} />
          ) : (
            <div
              style={{
                display: "flex",
                fontSize: 60,
                fontWeight: 900,
                color: PLUM,
                letterSpacing: 3,
              }}
            >
              SANTA BARBARA CHINESE MEDICINE
            </div>
          )}
          <div
            style={{
              marginTop: 22,
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
            924 Anacapa St, Santa Barbara · santa-barbara-chinese-medicine.vercel.app
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
