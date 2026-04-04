import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { caseStudies } from "@/lib/data/case-studies";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Production AI and web platform work from WayaLabs — Urban Stone portal, Queen City Soundboard, and the OpenClaw agentic automation system.",
};

const categoryColors: Record<string, string> = {
  "AI-Enhanced Web Platform": "#4f8ef7",
  "AI Agent": "#9b6dff",
};

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-24 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
            Case Studies
          </p>
          <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-2xl">
            Shipped work,{" "}
            <span className="gradient-text">measured results</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-xl leading-relaxed">
            Three flagship projects that demonstrate how we scope, build, and
            deliver AI-powered systems from discovery to production.
          </p>
        </div>
      </section>

      {/* Case study list */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8">
          {caseStudies.map((study) => {
            const accent = categoryColors[study.category] ?? "#4f8ef7";
            return (
              <article
                key={study.id}
                className="grid grid-cols-1 lg:grid-cols-3 gap-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
              >
                {/* Left accent + meta */}
                <div
                  className="p-8 flex flex-col justify-between border-r border-[var(--border)]"
                  style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
                >
                  <div>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full mb-4 inline-block"
                      style={{ color: accent, background: `${accent}18` }}
                    >
                      {study.category}
                    </span>
                    <h2 className="text-2xl font-bold mb-1">{study.title}</h2>
                    <p className="text-sm text-[var(--muted)] mb-6">{study.client}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-[var(--muted)]">
                      <span className="font-medium text-[var(--foreground)]">Timeline: </span>
                      {study.timeline}
                    </div>
                    {study.url && (
                      <a
                        href={`https://${study.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity"
                        style={{ color: accent }}
                      >
                        {study.url} <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Middle — summary + impact */}
                <div className="lg:col-span-2 p-8 flex flex-col justify-between">
                  <p className="text-[var(--muted)] leading-relaxed mb-6">{study.summary}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {study.impact.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2 text-sm text-[var(--muted)] p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: accent }} />
                        {item}
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/case-studies/${study.id}`}
                    className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all w-fit"
                    style={{ color: accent }}
                  >
                    Read full case study <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-[var(--border)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Want to be the next case study?</h2>
          <p className="text-[var(--muted)] mb-8">
            Book a discovery call and let&apos;s map out what AI can do for your business.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#9b6dff] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Book a Strategy Call <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
