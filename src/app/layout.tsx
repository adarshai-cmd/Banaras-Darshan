import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

export const metadata: Metadata = {
  title: "Banaras Darshan | Discover Banaras. Your Way.",
  description:
    "The all-in-one digital travel companion and AI guide for Varanasi. Discover Kashi Vishwanath temple, 84 ghats, iconic street food, hotels, hidden galliyan, transit routes and live traveler community.",
  keywords: [
    "Banaras travel guide",
    "Varanasi places to visit",
    "Kashi Vishwanath temple darshan",
    "Ganga Aarti timings Dashashwamedh",
    "Best street food in Banaras",
    "Banaras itinerary 2 days 3 days",
    "Varanasi boat ride rates",
    "Banaras Darshan",
  ],
  authors: [{ name: "Banaras Darshan Team" }],
  openGraph: {
    title: "Banaras Darshan | Discover Banaras. Your Way.",
    description:
      "Explore the soul of Kashi — temples, ghats, food, stays, hidden streets and unforgettable experiences.",
    url: "https://banarasdarshan.com",
    siteName: "Banaras Darshan",
    images: [
      {
        url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Banaras Darshan Ganga Aarti",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Banaras Darshan | Discover Banaras. Your Way.",
    description: "Your AI-powered digital gateway to exploring Varanasi.",
    images: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-slate-900 antialiased selection:bg-amber-500 selection:text-white">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
