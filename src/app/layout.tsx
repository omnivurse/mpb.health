import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | MPB Health",
    default: "MPB Health - Access Top Health Sharing Plans",
  },
  description: "Join thousands who've discovered affordable healthcare through medical cost sharing. Compare plans, get instant quotes, and access quality care without high premiums.",
  keywords: [
    "health sharing",
    "medical cost sharing", 
    "health care sharing ministry",
    "affordable healthcare",
    "health insurance alternative",
    "HCSM",
    "healthcare plans"
  ],
  authors: [{ name: "MPB Health" }],
  creator: "MPB Health",
  publisher: "MPB Health",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mpbhealth.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "MPB Health - Access Top Health Sharing Plans",
    description: "Join thousands who've discovered affordable healthcare through medical cost sharing. Compare plans, get instant quotes, and access quality care.",
    siteName: "MPB Health",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "MPB Health - Health Sharing Plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MPB Health - Access Top Health Sharing Plans",
    description: "Join thousands who've discovered affordable healthcare through medical cost sharing. Compare plans and get instant quotes.",
    images: ["/images/og-image.png"],
    creator: "@mpbhealth",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
