import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarsAtlas | Interplanetary Survival Guide: Martian Map",
  description: "Hyperlocalized Extravehicular Activity (EVA) Traverse & Science Decision-Support System for NASA Space Apps Challenge 2026. Explore Jezero & Gale Craters, calculate 32-bit Horn's slope, and optimize astronaut traverses via NASA JSC CSRM physiology.",
  keywords: ["Mars", "NASA Space Apps Challenge 2026", "Perseverance", "Jezero Crater", "Gale Crater", "EVA Route Planning", "HiRISE DTM", "THEMIS"],
  authors: [{ name: "MarsAtlas Engineering Team" }]
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
