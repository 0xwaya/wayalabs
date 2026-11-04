import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/seo";
// Pick the variant: ServicesPriced (A, public prices) or ServicesQuote (B, request a quote).
import ServicesVariant from "@/components/services/ServicesQuote";

export const metadata: Metadata = {
  title: "Small-business packages",
  description: "Websites, AI chat assistants, lead systems, local SEO, and LLM/AI integrations for small businesses, from Wayalabs.",
  alternates: { canonical: "/services" },
  openGraph: pageOpenGraph("/services"),
};

export default function ServicesPage() {
  return <ServicesVariant />;
}
