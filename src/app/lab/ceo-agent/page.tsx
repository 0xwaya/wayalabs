import type { Metadata } from "next";
import CeoScenarioSampler from "@/components/ceo/CeoScenarioSampler";

export const metadata: Metadata = {
  title: "CEO Executive Orchestrator Sample",
  description:
    "A static illustrative scenario showing how a CEO executive orchestrator could structure a planning discussion. Not a live model result.",
};

export default function CeoAgentSamplePage() {
  return <CeoScenarioSampler />;
}