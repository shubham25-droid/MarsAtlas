import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

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
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen font-sans selection:bg-[#EA580C] selection:text-white">
        {children}
      </body>
    </html>
  );
}
