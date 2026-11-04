import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import ServicesGrid from "@/components/home/ServicesGrid";
import OutcomeMetrics from "@/components/home/OutcomeMetrics";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import ProcessFramework from "@/components/home/ProcessFramework";
import CTABanner from "@/components/home/CTABanner";
import { discoveryCreditSentence } from "@/lib/data/offers";

export const metadata: Metadata = {
  description:
    `Wayalabs builds a custom web stack and automation for the business. Chatbots are live. Agents and orchestrators stay in research. ${discoveryCreditSentence}`,
  alternates: { canonical: "/" },
  openGraph: pageOpenGraph("https://wayalabs.com"),
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
