import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import DemoOverlay from "./DemoOverlay";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// TODO: metadataBase/openGraph URLs use a placeholder domain until a real
// domain is purchased and confirmed.
export const metadata: Metadata = {
  title: "Santa Barbara Chinese Medicine — Kristen Swegles, LAc, MTCM, CMP",
  description:
    "Activate and replenish your body's qi for optimal health. Acupuncture, herbal medicine, cupping, and traditional Chinese medicine in Santa Barbara, CA. Complimentary consultations available.",
  metadataBase: new URL("https://www.santabarbarachinesemedicine.com"),
  openGraph: {
    title: "Santa Barbara Chinese Medicine",
    description:
      "Acupuncture, herbal medicine, and traditional Chinese medicine with Kristen Swegles, LAc, MTCM, CMP in Santa Barbara, CA.",
    url: "https://www.santabarbarachinesemedicine.com",
    siteName: "Santa Barbara Chinese Medicine",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DemoOverlay />
        {children}
      </body>
    </html>
  );
}
