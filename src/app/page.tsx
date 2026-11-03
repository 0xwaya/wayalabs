import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ServicesGrid from "@/components/home/ServicesGrid";
import OutcomeMetrics from "@/components/home/OutcomeMetrics";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import ProcessFramework from "@/components/home/ProcessFramework";
import CTABanner from "@/components/home/CTABanner";

export const metadata: Metadata = {
  description:
    "WayaLabs builds practical web platforms and operator-reviewed automations. New customers receive 40% off the first engagement. Discovery is $2,100, down from $3,500.",
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
