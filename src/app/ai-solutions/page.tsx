import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Cpu, Plug, Globe, BarChart3, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Solutions",
  description:
    "AI chatbots, AI agents, and AI integrations built for measurable business outcomes. WayaLabs delivers production-grade AI systems from prototype to deployed.",
};

const primaryServices = [
  {
    icon: MessageSquare,
    title: "AI Chatbots",
    slug: "chatbots",
    tagline: "Support, sales, and onboarding — automated.",
    description:
      "Conversational AI deployed on your website, product, or messaging channels. Handles common questions, qualifies leads, and routes complex issues — with your brand voice and your knowledge base.",
    accent: "#4f8ef7",
    outcomes: ["70% ticket deflection", "3× lead capture", "<2s response time"],
  },
  {
    icon: Cpu,
    title: "AI Agents",
    slug: "agents",
    tagline: "Autonomous workflows for internal operations.",
    description:
      "Goal-directed agents that take real action across your tools — reading emails, updating CRMs, generating reports, routing tickets, and escalating exceptions without human input.",
    accent: "#9b6dff",
    outcomes: ["80% manual task reduction", "10h+ reclaimed weekly", "99% reliability"],
  },
  {
    icon: Plug,
    title: "AI Integrations",
    slug: "integrations",
    tagline: "Intelligence inside the tools you already use.",
    description:
      "LLM connections into your CRM, helpdesk, knowledge base, and APIs — with the data pipelines, security boundaries, and prompt management infrastructure to keep it reliable.",
    accent: "#22d3ee",
    outcomes: ["Live in 1 week", "4+ systems connected avg.", "Full observability stack"],
  },
];

const additionalServices = [
  {
    icon: Globe,
    title: "AI-Enhanced Web Platforms",
    description:
      "Full-stack web builds with personalization, intelligent search, and automated content workflows built in from day one.",
  },
  {
    icon: BarChart3,
    title: "Optimization Retainers",
    description:
      "Ongoing model evaluation, prompt improvement, behavior monitoring, and capacity planning as your AI systems grow and evolve.",
  },
];

export default function AISolutionsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-24 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
            Services
          </p>
          <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-3xl">
            AI solutions built for{" "}
            <span className="gradient-text">real business outcomes</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed">
            We design, build, and deploy AI systems that reduce manual work, improve
            customer experience, and create measurable ROI. Every engagement starts
            with your specific outcome — not a technology preference.
          </p>
        </div>
      </section>

      {/* Primary services */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            {primaryServices.map(({ icon: Icon, title, slug, tagline, description, accent, outcomes }) => (
              <div
                key={slug}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)]"
              >
                {/* Left */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: `${accent}18` }}
                    >
                      <Icon size={24} style={{ color: accent }} />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{title}</h2>
                    <p className="text-sm font-medium mb-4" style={{ color: accent }}>
                      {tagline}
                    </p>
                    <p className="text-[var(--muted)] leading-relaxed">{description}</p>
                  </div>
                  <Link
                    href={`/ai-solutions/${slug}`}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
                    style={{ color: accent }}
                  >
                    Learn more about {title} <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Right — outcomes */}
                <div className="flex flex-col justify-center gap-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-2">
                    Typical outcomes
                  </p>
                  {outcomes.map((o) => (
                    <div
                      key={o}
                      className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]"
                    >
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                      <span className="text-sm">{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional services */}
      <section className="py-16 px-6 bg-[var(--card)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-8">
            Also available
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionalServices.map(({ icon: Icon, title, description }) => (
              <div key={title} className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--background)]">
                <Icon size={20} className="text-[var(--muted)] mb-4" />
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Not sure which service fits?</h2>
          <p className="text-[var(--muted)] mb-8">
            Book a 30-minute discovery call. We&apos;ll map your current pain points to the
            right AI solution and give you a clear scope before any commitment.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#9b6dff] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Book a Free Discovery Call <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
