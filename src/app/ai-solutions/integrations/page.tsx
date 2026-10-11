import type { Metadata } from "next";
import Link from "next/link";
import { CAL_BOOKING_URL } from "@/lib/booking";
import { Plug, CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Integrations",
  description:
    "Research and development for AI integrations, with project-specific scope, access boundaries, and deployment status stated explicitly.",
};

const capabilities = [
  "Existing API and identity boundaries",
  "Data flow and retention requirements",
  "Provider timeouts and usage metering",
  "Structured output validation",
  "Evaluation and failure handling",
  "Operational monitoring requirements",
];

const useCases = [
  {
    title: "CRM + AI Intelligence",
    description:
      "An integration study could assess whether approved CRM data supports draft summaries or suggestions, with permissions and human review defined first.",
    industry: "Sales · RevOps · Customer Success",
  },
  {
    title: "Document Intelligence",
    description:
      "A retrieval prototype could test a bounded, approved document set. Access control, citation behavior, and retention need project-specific validation.",
    industry: "Legal · Finance · Operations",
  },
  {
    title: "API + LLM Orchestration",
    description:
      "An orchestration prototype could call explicitly permitted APIs and validate structured responses. It does not guarantee factual correctness or safe external actions.",
    industry: "SaaS · Platforms · Enterprises",
  },
];

const architectureAreas = [
  "Python · Flask · Socket.IO · LangGraph (CEO R&D prototype)",
  "Next.js · React · TypeScript · Tailwind CSS (WayaLabs site)",
  "Provider selection and pricing verified per deployment",
  "Identity, retention, and egress boundaries defined per project",
  "Acceptance checks and operational monitoring agreed before release",
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#22d3ee18]">
              <Plug size={22} className="text-[#22d3ee]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              Integrations · R&D
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-3xl">
            Integration architecture, scoped to{" "}
            <span className="gradient-text">your existing systems</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed mb-10">
            Currently under research and development. Prototype capabilities, stack
            choices, and deployment status depend on each system and its access
            constraints; no integration or reliability result is implied here.
          </p>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
            R&D Directions
          </p>
          <h2 className="text-3xl font-bold mb-12">Integration patterns to evaluate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map(({ title, description, industry }) => (
              <div key={title} className="p-7 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-5">{description}</p>
                <span className="text-xs text-[#22d3ee] border border-[#22d3ee30] rounded-full px-3 py-1">
                  {industry}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities & tech */}
      <section className="py-16 px-6 bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
                Design considerations
              </p>
              <h2 className="text-2xl font-bold mb-6">Boundaries before connectivity</h2>
              <ul className="space-y-3">
                {capabilities.map((cap) => (
                  <li key={cap} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
                    <CheckCircle size={15} className="text-[#22d3ee] mt-0.5 flex-shrink-0" />
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
                Technology in current work
              </p>
              <h2 className="text-2xl font-bold mb-6">Separate stacks, separate projects</h2>
              <ul className="space-y-3">
                {architectureAreas.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start with system boundaries</h2>
          <p className="text-[var(--muted)] mb-8">
            Share the systems involved and the access they require. We can discuss a
            research scope, integration risks, and how to test a candidate safely.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={CAL_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#9b6dff] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Book a Call <ArrowRight size={16} />
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--card)] transition-colors"
            >
              See Case Studies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
