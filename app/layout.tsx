import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import CookieConsent from "@/components/shared/CookieConsent";
import RollbarProvider from "@/components/shared/RollbarProvider";
import PwaProvider from "@/components/shared/PwaProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medsolutionhealthcare.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Med Solution Healthcare - Medical Tourism in India",
    template: "%s | Med Solution Healthcare",
  },
  description:
    "Connect with India's top hospitals and doctors. Affordable medical treatments, world-class healthcare, and personalized care for international patients.",
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Med Solution Healthcare - Medical Tourism in India",
    description:
      "Connect with India's top hospitals and doctors. Affordable medical treatments, world-class healthcare.",
    siteName: "Med Solution Healthcare",
    type: "website",
    locale: "en_US",
    url: siteUrl,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@medsolutionhc",
    creator: "@medsolutionhc",
    title: "Med Solution Healthcare - Medical Tourism in India",
    description: "Connect with India's top hospitals and doctors for affordable, world-class medical treatment.",
    images: ["/opengraph-image"],
  },
  other: {
    "google-site-verification": "REPLACE_WITH_YOUR_GSC_CODE",
    "geo.region": "IN-DL",
    "geo.placename": "New Delhi",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL?.split("/").slice(0, 3).join("/") || "https://cjqfgshjpqpfcjdvfpgc.supabase.co"} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL?.split("/").slice(0, 3).join("/") || "https://cjqfgshjpqpfcjdvfpgc.supabase.co"} />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="alternate" type="application/rss+xml" title="Med Solution Healthcare Blog" href="/api/rss" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Med Solution" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180.png" />
        <link rel="apple-touch-startup-image" href="/icons/icon-512.png" />
      </head>
      <body className="font-sans antialiased">
        <RollbarProvider>
          <AppShell>{children}</AppShell>
          <CookieConsent />
          <PwaProvider />
        </RollbarProvider>
      </body>
    </html>
  );
}
