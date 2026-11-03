import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ServicesGrid from "@/components/home/ServicesGrid";
import OutcomeMetrics from "@/components/home/OutcomeMetrics";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import ProcessFramework from "@/components/home/ProcessFramework";
import CTABanner from "@/components/home/CTABanner";
import { discoveryCreditSentence } from "@/lib/data/offers";

export const metadata: Metadata = {
  description:
    `WayaLabs builds practical web platforms and operator-reviewed automations. ${discoveryCreditSentence}`,
  alternates: { canonical: "/" },
  openGraph: { url: "https://wayalabs.com" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <OutcomeMetrics />
      <FeaturedProjects />
      <ProcessFramework />
      <CTABanner />
    </>
  );
}
