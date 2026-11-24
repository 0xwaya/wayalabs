import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/seo";
import Link from "next/link";
import { CAL_BOOKING_URL } from "@/lib/booking";
import { NewCustomerNote } from "@/components/offers/NewCustomerNote";
import { discoveryCreditSentence } from "@/lib/data/offers";
import { Cpu, CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Agents — workflows and integrations",
  description:
    `Wayalabs implements agentic workflows and integrates agents such as OpenClaw and Grok when discovery names them. No standalone agent-pilot SKU — those builds start with discovery. ${discoveryCreditSentence}`,
  alternates: { canonical: "/ai-solutions/agents" },
  openGraph: pageOpenGraph("/ai-solutions/agents"),
};

const useCases = [
  {
    title: "Operations workflow",
    description:
      "Summarize approved internal updates or flag exceptions for a person to review. Scoped tools, data access, and acceptance checks are set in discovery.",
    industry: "Operations · Finance · HR",
  },
  {
    title: "Triage and routing",
    description:
      "Classify a limited set of inbound requests and suggest a destination. Routing rules and human escalation are tested before go-live.",
    industry: "Support · Sales Ops · Customer Success",
  },
  {
    title: "Research and synthesis",
    description:
      "Organize approved source material into a draft summary. Source coverage, citations, and accuracy require operator review.",
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
      <section className="py-24 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#c5cad318]">
              <Cpu size={22} className="text-[#c5cad3]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              AI Agents · Scoped builds
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-3xl">
            Agentic workflows,{" "}
            <span className="gradient-text">scoped in discovery</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed mb-10">
            We implement agentic workflows and integrate agents — including OpenClaw,
            Grok, and similar runtimes — when the brief names them. There is no
            standalone agent-pilot package on the public ladder. Those builds start
            with discovery, the same as a lead system or platform.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
            Example directions
          </p>
          <h2 className="text-3xl font-bold mb-5">Workflows we can scope</h2>
          <p className="text-[var(--muted)] max-w-2xl mb-12">
            Starting points for discovery — not fixed product guarantees. Deployment
            status, controls, and measured performance are set per engagement.
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

      <section className="py-16 px-6 bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
                Design considerations
              </p>
              <h2 className="text-3xl font-bold mb-6">Agree on boundaries before automation</h2>
              <p className="text-[var(--muted)] leading-relaxed">
                Studio research (Echo, operator sessions) informs how we gate tools and
                keep a person in the loop. Client work uses those patterns inside a
                named build — not as an unscoped pilot SKU.
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

      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start with discovery</h2>
          <p className="text-[var(--muted)] mb-8">
            If an agentic workflow or agent integration is the right next step, we name
            it in the brief and build it into the engagement — lead system, platform, or
            scoped integration.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={CAL_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#f3f4f6] text-[#07080c] hover:bg-[#d7dbe3] font-semibold hover:opacity-90 transition-opacity"
            >
              Book a discovery call <ArrowRight size={16} />
            </Link>
            <Link
              href="/offers"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--card)] transition-colors"
            >
              See offers
            </Link>
          </div>
          <NewCustomerNote centered />
        </div>
      </section>
    </div>
  );
}
