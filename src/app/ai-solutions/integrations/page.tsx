import type { Metadata } from "next";
import Link from "next/link";
import { Plug, CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Integrations",
  description:
    "Connect LLMs to your CRM, knowledge base, and APIs. WayaLabs designs AI integration pipelines with observability, safety layers, and model routing built in.",
};

const capabilities = [
  "LLM integration with CRM and helpdesk",
  "Document intelligence and RAG pipelines",
  "API orchestration and prompt management",
  "Model routing and cost optimisation",
  "Observability, logging, and eval",
  "Safety and moderation layers",
  "Knowledge base sync and indexing",
  "Structured output parsing and validation",
];

const useCases = [
  {
    title: "CRM + AI Intelligence",
    description:
      "Surface AI-generated contact summaries, next-best-action suggestions, and auto-populated fields directly inside your CRM — without rebuilding your sales stack.",
    industry: "Sales · RevOps · Customer Success",
  },
  {
    title: "Document Intelligence",
    description:
      "Build a retrieval-augmented system over your internal docs, contracts, or knowledge base — enabling staff to query against company knowledge in natural language.",
    industry: "Legal · Finance · Operations",
  },
  {
    title: "API + LLM Orchestration",
    description:
      "Connect your existing APIs to LLM reasoning — so the model can look up real data, take actions, and return structured results rather than hallucinated guesses.",
    industry: "SaaS · Platforms · Enterprises",
  },
];

const techStack = [
  "OpenAI, Anthropic, and open-weight models",
  "LangChain / custom orchestration",
  "Vector databases (Pinecone, Weaviate, pgvector)",
  "Structured output with Zod / Pydantic",
  "Prompt versioning and A/B evaluation",
  "Logging, tracing, and eval with LangSmith / custom",
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
              AI Integrations
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-3xl">
            AI that works{" "}
            <span className="gradient-text">inside your existing stack</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed mb-10">
            Connect large language models to your CRM, knowledge base, documents, and
            APIs — with the data pipelines, prompt management, security boundaries,
            and observability to keep everything reliable.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            {[
              { metric: "1 week", label: "To first integration" },
              { metric: "4+", label: "Systems connected on average" },
              { metric: "Full", label: "Observability stack included" },
            ].map(({ metric, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-[#22d3ee]">{metric}</div>
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
          <h2 className="text-3xl font-bold mb-12">Where integrations unlock the most value</h2>
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
                What&apos;s included
              </p>
              <h2 className="text-2xl font-bold mb-6">Full integration delivery</h2>
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
                Technology
              </p>
              <h2 className="text-2xl font-bold mb-6">Stack we work with</h2>
              <ul className="space-y-3">
                {techStack.map((item) => (
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
          <h2 className="text-3xl font-bold mb-4">Already have a stack? Good — we work with it.</h2>
          <p className="text-[var(--muted)] mb-8">
            We scope integrations around what you already have, not what we want to sell.
            Book a call and we&apos;ll map the fastest path to a working AI integration in your environment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
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
