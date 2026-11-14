import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarsAtlas | Planetary Geospatial Intelligence & EVA Traverse Copilot",
  description: "NASA Space Apps Challenge 2026: Martian Map (Interplanetary Survival Guide). Integrated orbital observation, USGS HiRISE topography, and Perseverance telemetry for EVA traverse planning.",
  keywords: ["Mars", "NASA Space Apps Challenge 2026", "Perseverance", "Jezero Crater", "Gale Crater", "EVA Route Planning", "HiRISE DTM", "THEMIS"],
  authors: [{ name: "MarsAtlas Engineering Team" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" }
    ],
    shortcut: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#070A10] text-[#F3F5F7] selection:bg-[#E46A43] selection:text-white">
        {children}
      </body>
    </html>
  );
}
