import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NewCustomerNote } from "@/components/offers/NewCustomerNote";
import { discoveryCreditSentence } from "@/lib/data/offers";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    `How Wayalabs scopes, builds, and delivers AI systems, from discovery to post-launch work. ${discoveryCreditSentence}`,
  alternates: { canonical: "/process" },
  openGraph: pageOpenGraph("/process"),
};

const phases = [
  {
    number: "01",
    title: "Discover",
    duration: "Week 1",
    accent: "#d7dbe3",
    description:
      "We start by understanding your business deeply — not by pitching technology. Discovery is a structured working session, not a slide deck.",
    activities: [
      "Stakeholder alignment on the single most valuable outcome",
      "Workflow mapping and pain point prioritisation",
      "System inventory — what you have, what connects, what's missing",
      "Define measurable success criteria (KPIs, benchmarks, baselines)",
      "ICP and use-case scoping for AI feature prioritisation",
      "Identify data sources, access patterns, and compliance constraints",
    ],
    deliverable: "A scoped brief with clear outcome, architecture sketch, and timeline estimate.",
  },
  {
    number: "02",
    title: "Prototype",
    duration: "Weeks 2–3",
    accent: "#c5cad3",
    description:
      "A working system on your real data — not a demo. Prototype sprints are tight, feedback-driven, and designed to surface what matters early.",
    activities: [
      "Working proof-of-concept on your actual knowledge base or workflow",
      "Daily async progress updates with async feedback loops",
      "Iteration sessions with your team to tune behavior and edge cases",
      "Initial safety layer and output validation",
      "Prompt versioning from the first run — no throwaway work",
      "Benchmark run against defined success criteria",
    ],
    deliverable: "A deployed prototype your team can interact with, evaluate, and provide structured feedback on.",
  },
  {
    number: "03",
    title: "Deploy",
    duration: "Weeks 4–5",
    accent: "#f3f4f6",
    description:
      "Production-grade engineering. Every deployment includes observability, guardrails, integration tests, and a clear escalation path.",
    activities: [
      "Production-hardened codebase with CI/CD pipeline",
      "Full observability stack — logging, tracing, and alerting",
      "Safety layer: moderation, role constraints, input sanitisation",
      "Integration testing across all connected systems",
      "Staging environment with load testing",
      "Launch runbook with rollback procedure",
    ],
    deliverable: "A live system with monitoring, documented handoff, and on-call support through go-live.",
  },
  {
    number: "04",
    title: "Handoff & care",
    duration: "Ongoing",
    accent: "#d7dbe3",
    description:
      "Every build closes with an operator handoff. We invite ongoing monitoring and scheduled build capacity at that moment — so the system does not sit unattended after launch.",
    activities: [
      "Operator handoff: how to run the system without Wayalabs in the loop",
      "Data boundary restated for the operator",
      "Invitation to ongoing monitoring and small fixes",
      "Optional scheduled build capacity for feature work",
      "Conversation or intake log review when chat or forms are in scope",
      "No new SKUs invented at close — use the published ladder only",
    ],
    deliverable: "Handoff note plus a clear invite for post-launch care. Recurring pricing is confirmed at close, not on the public offers page.",
  },
];

const principles = [
  {
    title: "Outcomes before technology",
    description: "We choose the tool after we understand the problem — not before. If AI isn't the right lever, we'll say so.",
  },
  {
    title: "No throwaway prototypes",
    description: "Everything built in week 2 is versioned and carries forward into production. We don't start over.",
  },
  {
    title: "Observability from day one",
    description: "Every system ships with logging, tracing, and alerting. You always know what the AI is doing.",
  },
  {
    title: "Safety is not optional",
    description: "Input sanitisation, output moderation, and role constraints are included in every build — not an afterthought.",
  },
];

export default function ProcessPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-24 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
            How We Work
          </p>
          <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-3xl">
            Prototype to production in{" "}
            <span className="gradient-text">weeks, not quarters</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed">
            A four-phase framework designed for fast, reliable AI delivery — with
            clear ownership, measurable checkpoints, and no surprises.
          </p>
        </div>
      </section>

      {/* Phases */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-6">
            {phases.map(({ number, title, duration, accent, description, activities, deliverable }) => (
              <div
                key={number}
                className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
              >
                {/* Left — phase metadata */}
                <div
                  className="lg:col-span-3 p-8 flex flex-col justify-between border-r border-[var(--border)]"
                  style={{ borderTopColor: accent, borderTopWidth: 3 }}
                >
                  <div>
                    <div
                      className="text-5xl font-bold mb-3"
                      style={{
                        background: `linear-gradient(135deg, ${accent}, ${accent}50)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {number}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{title}</h2>
                    <span className="text-xs border border-[var(--border)] rounded-full px-2.5 py-1 text-[var(--muted)]">
                      {duration}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mt-6 hidden lg:block">
                    {description}
                  </p>
                </div>

                {/* Right — activities + deliverable */}
                <div className="lg:col-span-9 p-8">
                  <p className="text-[var(--muted)] leading-relaxed mb-8 lg:hidden">{description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {activities.map((activity, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 text-sm p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
                      >
                        <span
                          className="font-mono text-xs mt-0.5 flex-shrink-0"
                          style={{ color: accent }}
                        >
                          ↳
                        </span>
                        <span className="text-[var(--muted)]">{activity}</span>
                      </div>
                    ))}
                  </div>

                  <div
                    className="p-4 rounded-xl border text-sm"
                    style={{ borderColor: `${accent}40`, background: `${accent}08` }}
                  >
                    <span className="font-semibold mr-2" style={{ color: accent }}>
                      Deliverable:
                    </span>
                    <span className="text-[var(--muted)]">{deliverable}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 px-6 bg-[var(--card)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
              Guiding Principles
            </p>
            <h2 className="text-3xl font-bold">How we think about every engagement</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map(({ title, description }) => (
              <div key={title} className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--background)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d7dbe3] mb-4" />
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start with a discovery call</h2>
          <p className="text-[var(--muted)] mb-8">
            30 minutes. No pitch deck. A structured conversation about the outcome, systems
            in scope, and whether a lead system or platform build is next.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
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
