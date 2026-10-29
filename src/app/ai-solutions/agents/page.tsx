import type { Metadata } from "next";
import Link from "next/link";
import { CAL_BOOKING_URL } from "@/lib/booking";
import { Cpu, CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Agents",
  description:
    "Planning and implementation of carefully scoped AI agents for workflow automation and internal operations.",
  alternates: { canonical: "/ai-solutions/agents" },
};

const useCases = [
  {
    title: "Operations Automation Agent",
    description:
      "An R&D opportunity: summarize approved internal updates or flag exceptions for a person to review. Data access and accuracy need validation for each project.",
    industry: "Operations · Finance · HR",
  },
  {
    title: "Triage and Routing Agent",
    description:
      "A possible workflow: classify a limited set of inbound requests and suggest a destination. Routing rules and human escalation should be tested before use.",
    industry: "Support · Sales Ops · Customer Success",
  },
  {
    title: "Research and Synthesis Agent",
    description:
      "A research prototype could organize approved source material into a draft summary. Source coverage, citations, and factual accuracy require review.",
    industry: "Consulting · Legal · Strategy",
  },
];

const designConsiderations = [
  "Define one bounded workflow and its owner",
  "Set least-privilege tool access",
  "Agree on acceptance checks before launch",
  "Keep human review for consequential actions",
  "Set explicit data retention and logging rules",
  "Measure outcomes before making performance claims",
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#c5cad318]">
              <Cpu size={22} className="text-[#c5cad3]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              AI Agents
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-3xl">
              AI agents for{" "}
              <span className="gradient-text">bounded workflows</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed mb-10">
            Start with a clearly defined task, approved tools, and a human review path.
            Deployment scope and performance targets are agreed and verified per project.
          </p>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
            R&D Directions
          </p>
          <h2 className="text-3xl font-bold mb-5">Workflow concepts under research</h2>
          <p className="text-[var(--muted)] max-w-2xl mb-12">
            These are discussion starting points, not available product guarantees.
            Deployment status, controls, and measured performance are established
            and reported separately for each project.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map(({ title, description, industry }) => (
              <div key={title} className="p-7 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-5">{description}</p>
                <span className="text-xs text-[#c5cad3] border border-[#c5cad330] rounded-full px-3 py-1">
                  {industry}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-16 px-6 bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
                Design considerations
              </p>
              <h2 className="text-3xl font-bold mb-6">Agree on boundaries before automation</h2>
              <p className="text-[var(--muted)] leading-relaxed">
                These are project design questions, not claims that every listed control
                is already deployed. A proposed system should be tested against its
                acceptance criteria before its results are described as production outcomes.
              </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {designConsiderations.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
                  <CheckCircle size={15} className="text-[#c5cad3] mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start with one bounded workflow</h2>
          <p className="text-[var(--muted)] mb-8">
            Describe a repetitive task and the tools it touches. We&apos;ll assess its scope,
            data boundaries, and a practical way to verify whether automation helps.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={CAL_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#f3f4f6] text-[#07080c] hover:bg-[#d7dbe3] font-semibold hover:opacity-90 transition-opacity"
            >
              Book a Call <ArrowRight size={16} />
            </Link>
            <Link
              href="/case-studies/openclaw-agent"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--card)] transition-colors"
            >
              See Agent Case Study
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
