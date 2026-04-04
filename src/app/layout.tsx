import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
    default: "WayaLabs — AI Solutions Studio",
    template: "%s | WayaLabs",
  },
  description:
    "WayaLabs builds AI chatbots, AI agents, and intelligent web platforms that reduce support load, increase conversion, and automate workflows for ambitious businesses.",
  metadataBase: new URL("https://wayalabs.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wayalabs.com",
    siteName: "WayaLabs",
    title: "WayaLabs — AI Solutions Studio",
    description:
      "AI chatbots, AI agents, and intelligent web platforms for ambitious businesses.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "WayaLabs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WayaLabs — AI Solutions Studio",
    description:
      "AI chatbots, AI agents, and intelligent web platforms for ambitious businesses.",
    creator: "@wayalabs",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WayaLabs",
  url: "https://wayalabs.com",
  logo: "https://wayalabs.com/logo.png",
  description:
    "AI solutions studio building chatbots, AI agents, and intelligent web platforms for ambitious businesses.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cincinnati",
    addressRegion: "OH",
    addressCountry: "US",
  },
  sameAs: [
    "https://github.com/0xwaya",
    "https://x.com/wayalabs",
    "https://linkedin.com/company/wayalabs",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

