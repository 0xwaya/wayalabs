import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Chatbots",
  description:
    "Custom AI chatbots for customer support, lead qualification, and onboarding. WayaLabs builds conversational AI that deflects tickets, captures leads, and operates 24/7.",
};

const capabilities = [
  "Customer support deflection and resolution",
  "Lead qualification and capture",
  "Onboarding assistant and document Q&A",
  "Multilingual support",
  "Human escalation routing",
  "Analytics and conversation insights",
  "Multi-channel deployment (web, Slack, WhatsApp)",
  "Knowledge base sync and automatic retraining",
];

const useCases = [
  {
    title: "Customer Support AI",
    description:
      "Handle tier-1 support questions automatically — order status, returns, FAQs, and account issues — with seamless handoff to human agents for complex cases.",
    industry: "E-commerce · SaaS · Local Services",
  },
  {
    title: "Sales Assistant AI",
    description:
      "Qualify inbound website leads 24/7, answer product questions, schedule demos, and route high-intent prospects to your sales team before they bounce.",
    industry: "B2B SaaS · Professional Services · Home Services",
  },
  {
    title: "Onboarding Assistant",
    description:
      "Guide new users through setup, answer 'how do I…' questions, surface relevant documentation, and reduce time-to-value without increasing support headcount.",
    industry: "SaaS · Platforms · Marketplaces",
  },
];

export default function ChatbotsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#4f8ef718]">
              <MessageSquare size={22} className="text-[#4f8ef7]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              AI Chatbots
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-3xl">
            Conversations that{" "}
            <span className="gradient-text">convert, support, and scale</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed mb-10">
            Custom conversational AI for your website, product, and messaging channels.
            Built on your knowledge base, tuned to your tone, and measured by outcomes
            — not just engagement.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            {[
              { metric: "70%", label: "Average ticket deflection" },
              { metric: "3×", label: "Lead capture lift" },
              { metric: "<2s", label: "Response time" },
            ].map(({ metric, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-[#4f8ef7]">{metric}</div>
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
          <h2 className="text-3xl font-bold mb-12">Where AI chatbots create the most leverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map(({ title, description, industry }) => (
              <div key={title} className="p-7 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-5">{description}</p>
                <span className="text-xs text-[#4f8ef7] border border-[#4f8ef730] rounded-full px-3 py-1">
                  {industry}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 px-6 bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
                What&apos;s included
              </p>
              <h2 className="text-3xl font-bold mb-6">Full-stack chatbot delivery</h2>
              <p className="text-[var(--muted)] leading-relaxed">
                Every chatbot we build comes with knowledge base integration, analytics,
                human handoff logic, and a safety layer — not just a model sitting on your site.
              </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {capabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
                  <CheckCircle size={15} className="text-[#4f8ef7] mt-0.5 flex-shrink-0" />
                  {cap}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to deflect your first 1,000 tickets?</h2>
          <p className="text-[var(--muted)] mb-8">
            Book a discovery call and we&apos;ll scope a pilot chatbot for your highest-volume
            support category — live within two weeks.
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
