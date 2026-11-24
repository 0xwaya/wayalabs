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
  title: "AI Factory · Wayalabs Prototype",
  description:
    "Gamified multi-agent orchestration prototype by Wayalabs — factories, agents, quests, XP.",
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
