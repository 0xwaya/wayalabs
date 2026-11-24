import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NewCustomerNote } from "@/components/offers/NewCustomerNote";
import { discoveryCreditSentence } from "@/lib/data/offers";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    `How Wayalabs runs discovery, then a lead system or platform build, then operator handoff. ${discoveryCreditSentence}`,
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
      "One week for that business. Outcome, systems in and out, data boundary, and a written go or no-go — before anyone builds.",
    activities: [
      "Name the outcome, who it is for, and what done looks like",
      "Map systems in scope and systems left out",
      "Write the data boundary: what is stored, who can read it, what the operator keeps",
      "Choose lead system or platform (or a clear no-go)",
      "Price inside the published band by complexity only",
      "Confirm discovery credit timing if the answer is go",
    ],
    deliverable: "A written brief and go or no-go. Same template every engagement.",
  },
  {
    number: "02",
    title: "Prototype",
    duration: "Weeks 2–3",
    accent: "#c5cad3",
    description:
      "A working slice on your real intake or content — not slides. Same kit shape; customize knowledge, CRM fields, and the one job.",
    activities: [
      "Stand up the kit path (lead system or platform) on real operator data",
      "Wire intake or forms to email, then the store when in scope",
      "Operator feedback on handoff and edge cases",
      "Approved knowledge only when chat is in scope; escalation path checked",
      "Keep work versioned — no throwaway demos",
      "Confirm the single scheduled job if the brief named one",
    ],
    deliverable: "A runnable prototype the operator can try, with notes that carry into production.",
  },
  {
    number: "03",
    title: "Deploy",
    duration: "Weeks 4–5",
    accent: "#f3f4f6",
    description:
      "Lead system or platform goes live. The operator can run it without Wayalabs in the loop.",
    activities: [
      "Ship the public site, forms, chat, or job named in the brief",
      "Email delivery and CRM match rules verified end to end",
      "Data boundary enforced in the live config",
      "Basic observability for intake and failures",
      "Operator walkthrough of the handoff path",
      "Launch checklist against the discovery brief",
    ],
    deliverable: "A live lead system or platform with a draft operator handoff.",
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
    title: "One ladder only",
    description: "Discovery, then lead system, platform, or a discovery-scoped agentic workflow. No standalone agent-pilot SKU on /offers.",
  },
  {
    title: "Same kit, custom edges",
    description: "Reuse the Urban Stone or Queen City Soundboard shape. Customize knowledge, fields, and the one job — not the whole architecture.",
  },
  {
    title: "Operator can run it",
    description: "Every build ends with a handoff the operator uses without Wayalabs in the loop.",
  },
  {
    title: "Care at close",
    description: "Invite ongoing monitoring and scheduled capacity at handoff. Do not invent a new SKU on the invoice.",
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
            Discovery, build,{" "}
            <span className="gradient-text">handoff</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed">
            Same process as the homepage framework: discovery week, lead system or
            platform kit, live deploy, then operator handoff and care invite.
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
