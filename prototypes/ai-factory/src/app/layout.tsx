import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const shareTech = Share_Tech_Mono({
  variable: "--font-share-tech",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "AI Factory · Wayalabs",
  description:
    "Command the AI Factory floor — deploy crews, clear production runs, unlock bays, and climb the cash ladder.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${shareTech.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col">
        <div className="scanlines" aria-hidden />
        {children}
      </body>
    </html>
  );
}
