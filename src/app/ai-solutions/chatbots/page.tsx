import type { Metadata } from "next";
import Link from "next/link";
import { CAL_BOOKING_URL } from "@/lib/booking";
import { NewCustomerNote } from "@/components/offers/NewCustomerNote";
import { discoveryCreditSentence } from "@/lib/data/offers";
import { MessageSquare, CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Chatbots",
  description:
    `Custom chatbots are live, grounded in approved sources, with a human handoff. ${discoveryCreditSentence}`,
  alternates: { canonical: "/ai-solutions/chatbots" },
  openGraph: { url: "/ai-solutions/chatbots" },
};

const capabilities = [
  "Approved knowledge sources",
  "Human escalation boundaries",
  "Representative evaluation questions",
  "Data access and retention scope",
  "Failure and fallback behavior",
  "Deployment-specific operational review",
];

const useCases = [
  {
    title: "Customer Support AI",
    description:
      "Answers from the sources the business approves, then hands the conversation to a person when the question is outside that scope.",
    industry: "E-commerce · SaaS · Local Services",
  },
  {
    title: "Sales Assistant AI",
    description:
      "Collects the questions the business chooses, then sends that lead to email and a private record.",
    industry: "B2B SaaS · Professional Services · Home Services",
  },
  {
    title: "Onboarding Assistant",
    description:
      "Walks a user through the setup material the business approves, and escalates when the answer is not in that material.",
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
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#d7dbe318]">
              <MessageSquare size={22} className="text-[#d7dbe3]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              Conversational AI · Live
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-3xl">
            A chatbot custom built around{" "}
            <span className="gradient-text">sources and a handoff</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed mb-10">
            On-site chat is live for a client and still being improved. A new chatbot
            is custom built for the business. The client business is not for sale.
            No support rate or response time is claimed.
          </p>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
            What a custom chatbot includes
          </p>
          <h2 className="text-3xl font-bold mb-12">Workflows built for the business</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map(({ title, description, industry }) => (
              <div key={title} className="p-7 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-5">{description}</p>
                <span className="text-xs text-[#d7dbe3] border border-[#d7dbe330] rounded-full px-3 py-1">
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
                Design considerations
              </p>
              <h2 className="text-3xl font-bold mb-6">Scope before integration</h2>
              <p className="text-[var(--muted)] leading-relaxed">
                Each chatbot is scoped to the business: the sources it may use, when a
                person takes over, and what happens if the model call fails.
              </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {capabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
                  <CheckCircle size={15} className="text-[#d7dbe3] mt-0.5 flex-shrink-0" />
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
              <h2 className="text-3xl font-bold mb-4">Scope a chatbot for the business</h2>
          <p className="text-[var(--muted)] mb-8">
            Bring the sources it should use and the point where a person takes over.
            The build is custom. The live client business is not for sale.
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
              href="/case-studies"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--card)] transition-colors"
            >
              See Case Studies
            </Link>
          </div>
          <NewCustomerNote centered />
        </div>
      </section>
    </div>
  );
}
