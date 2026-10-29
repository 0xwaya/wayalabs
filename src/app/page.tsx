import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ServicesGrid from "@/components/home/ServicesGrid";
import OutcomeMetrics from "@/components/home/OutcomeMetrics";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import ProcessFramework from "@/components/home/ProcessFramework";
import CTABanner from "@/components/home/CTABanner";

export const metadata: Metadata = {
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
