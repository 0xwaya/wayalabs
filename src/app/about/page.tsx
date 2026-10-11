import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "About WayaLabs",
  description:
    "WayaLabs explores AI systems through architecture, orchestration, and project-specific research and development.",
};

const values = [
  {
    title: "Outcomes over features",
    description:
      "We measure success by what changed in your business — not by lines of code or model version numbers.",
  },
  {
    title: "Reliability over novelty",
    description:
      "Reliability is evaluated against project-specific acceptance criteria, failure modes, and operational boundaries.",
  },
  {
    title: "Speed without shortcuts",
    description:
      "Iterate in reviewable steps without skipping architecture, safety, or testing.",
  },
  {
    title: "Strategy then execution",
    description:
      "Every engagement begins with a clear outcome. We won't start building until we agree on what success looks like.",
  },
];

const work = [
  {
    name: "Urban Stone / Amazon Granite Portal",
    type: "AI-Enhanced Web Platform",
    url: "urbanstone.co",
    accent: "#4f8ef7",
  },
  {
    name: "Queen City Soundboard",
    type: "AI-Enhanced Web Platform",
    url: "queencitysoundboard.com",
    accent: "#9b6dff",
  },
  {
    name: "OpenClaw Workflow Exploration",
    type: "Internal R&D · separate from CEO Orchestrator",
    url: "",
    accent: "#22d3ee",
  },
];

const stack = [
  "WayaLabs site: Next.js 16 · React 19 · TypeScript · Tailwind CSS 4",
  "CEO Orchestrator R&D: Python · Flask · Socket.IO · LangGraph",
  "CEO job state: SQLite durable queue · single worker process",
  "CEO model calls: configured provider · verified pricing · usage reservations",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-24 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
              About
            </p>
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              AI systems, explored through{" "}
              <span className="gradient-text">architecture and orchestration.</span>
            </h1>
            <p className="text-lg text-[var(--muted)] leading-relaxed">
              WayaLabs researches and develops AI systems. Some concepts are
              currently under research and development; deployment status and
              measured outcomes are stated per project.
            </p>
          </div>

          {/* What we are */}
          <div className="space-y-4">
            {[
              { label: "What we are", value: "A focused studio exploring AI architecture, implementation, and evaluation." },
              { label: "What we explore", value: "AI application architecture, agent orchestration, and scoped workflow prototypes." },
              { label: "How we scope", value: "Start with system boundaries, data access, failure handling, and testable acceptance criteria." },
              { label: "What is not implied", value: "A prototype or architecture study does not by itself mean production deployment, measured impact, or autonomous operation." },
            ].map(({ label, value }) => (
              <div key={label} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
                <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
              Our Values
            </p>
            <h2 className="text-3xl font-bold">What drives every engagement</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(({ title, description }) => (
              <div
                key={title}
                className="p-7 rounded-2xl border border-[var(--border)] bg-[var(--card)] relative overflow-hidden"
              >
                <div
                  aria-hidden
                  className="absolute top-0 left-0 w-12 h-0.5"
                  style={{ background: "linear-gradient(90deg, #4f8ef7, transparent)" }}
                />
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="py-20 px-6 bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-2">
                Selected Work
              </p>
              <h2 className="text-2xl font-bold">Projects and explorations</h2>
            </div>
            <Link href="/case-studies" className="text-sm text-[#4f8ef7] hover:opacity-80 transition-opacity">
              Full case studies →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {work.map(({ name, type, url, accent }) => (
              <div
                key={name}
                className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background)] flex flex-col gap-3"
              >
                <div>
                  <p className="font-medium mb-0.5">{name}</p>
                  <p className="text-xs text-[var(--muted)]">{type}</p>
                </div>
                {url && (
                  <a
                    href={`https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity mt-auto"
                    style={{ color: accent }}
                  >
                    {url} <ExternalLink size={10} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-2">
              Technology
            </p>
            <h2 className="text-2xl font-bold">Technology in current work</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {stack.map((item) => (
              <span
                key={item}
                className="text-sm border border-[var(--border)] rounded-full px-4 py-1.5 text-[var(--muted)] bg-[var(--card)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Work with us</h2>
          <p className="text-[var(--muted)] mb-8">
            We take on a limited number of projects at a time to maintain quality.
            If what you&apos;ve seen here resonates — let&apos;s talk.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#9b6dff] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Get in Touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
