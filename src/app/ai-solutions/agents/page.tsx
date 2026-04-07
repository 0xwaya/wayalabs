import type { Metadata } from "next";
import Link from "next/link";
import { Cpu, CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Agents",
  description:
    "AI agents for workflow automation, internal operations, and cross-system task orchestration. WayaLabs builds production-grade AI agents that run reliably end-to-end.",
};

const useCases = [
  {
    title: "Operations Automation Agent",
    description:
      "Automate repetitive internal ops — daily standup summaries, status report generation, data reconciliation between systems, and exception alerts.",
    industry: "Operations · Finance · HR",
  },
  {
    title: "Triage and Routing Agent",
    description:
      "Classify inbound support tickets, emails, or leads — then route them to the right person or queue with context already attached. No manual sorting.",
    industry: "Support · Sales Ops · Customer Success",
  },
  {
    title: "Research and Synthesis Agent",
    description:
      "Autonomously gather information from multiple sources, extract key data, and produce structured summaries or action-ready briefings.",
    industry: "Consulting · Legal · Strategy",
  },
];

const architecture = [
  "Modular tool definitions with clear boundaries",
  "Prompt versioning and evaluation pipeline",
  "Multi-LLM routing with fallback logic",
  "Safety layer: role constraints and output moderation",
  "Structured logging and trace replay",
  "CLI interface for human-in-the-loop control",
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#9b6dff18]">
              <Cpu size={22} className="text-[#9b6dff]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              AI Agents
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-3xl">
            Agents that{" "}
            <span className="gradient-text">act, not just answer</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed mb-10">
            Goal-directed AI systems built to operate reliably in production — reading,
            writing, routing, and orchestrating tasks across your tools without constant
            human intervention.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            {[
              { metric: "80%", label: "Manual task reduction" },
              { metric: "10h+", label: "Weekly hours reclaimed" },
              { metric: "99%", label: "Workflow reliability" },
            ].map(({ metric, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-[#9b6dff]">{metric}</div>
                <div className="text-[var(--muted)]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
            Use Cases
          </p>
          <h2 className="text-3xl font-bold mb-12">Where AI agents eliminate the most manual work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map(({ title, description, industry }) => (
              <div key={title} className="p-7 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-5">{description}</p>
                <span className="text-xs text-[#9b6dff] border border-[#9b6dff30] rounded-full px-3 py-1">
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
                How we build
              </p>
              <h2 className="text-3xl font-bold mb-6">Production-first agent architecture</h2>
              <p className="text-[var(--muted)] leading-relaxed">
                We don&apos;t ship fragile demos. Every agent system includes observability,
                human controls, and a safety layer — built from our OpenClaw framework,
                proven in production.
              </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {architecture.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
                  <CheckCircle size={15} className="text-[#9b6dff] mt-0.5 flex-shrink-0" />
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
          <h2 className="text-3xl font-bold mb-4">What would your team do with 10 free hours a week?</h2>
          <p className="text-[var(--muted)] mb-8">
            Tell us your highest-volume repetitive task. We&apos;ll scope an agent that automates it
            end-to-end, with a working prototype in your hands within two weeks.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#9b6dff] text-white font-semibold hover:opacity-90 transition-opacity"
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
