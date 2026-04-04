import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, CheckCircle, ArrowRight } from "lucide-react";
import { caseStudies } from "@/lib/data/case-studies";
import { categoryColors } from "@/lib/data/categories";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.id === slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.summary,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.id === slug);
  if (!study) notFound();

  const accent = categoryColors[study.category] ?? "#4f8ef7";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8"
          >
            <ArrowLeft size={14} /> All Case Studies
          </Link>

          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full mb-5 inline-block"
            style={{ color: accent, background: `${accent}18` }}
          >
            {study.category}
          </span>

          <h1 className="text-5xl font-bold tracking-tight mb-4">{study.title}</h1>
          <p className="text-xl text-[var(--muted)] mb-8 leading-relaxed">{study.summary}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--muted)]">
            <span>
              <span className="font-medium text-[var(--foreground)]">Client: </span>
              {study.client}
            </span>
            <span>
              <span className="font-medium text-[var(--foreground)]">Timeline: </span>
              {study.timeline}
            </span>
            {study.url && (
              <a
                href={`https://${study.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                style={{ color: accent }}
              >
                {study.url} <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-16">

          {/* Problem */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
              The Problem
            </h2>
            <p className="text-lg leading-relaxed">{study.problem}</p>
          </div>

          {/* Approach */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
              Our Approach
            </h2>
            <p className="text-lg leading-relaxed text-[var(--muted)]">{study.approach}</p>
          </div>

          {/* Architecture */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-6">
              Architecture Snapshot
            </h2>
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <div
                className="h-0.5 rounded-full mb-6"
                style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
              />
              <ul className="space-y-3">
                {study.architecture.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span
                      className="font-mono text-xs mt-0.5 flex-shrink-0 w-5 text-right"
                      style={{ color: accent }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[var(--muted)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Impact */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-6">
              Measured Impact
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {study.impact.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]"
                >
                  <CheckCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: accent }} />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next iteration */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--background)]"
            style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
              Next Iteration Roadmap
            </h2>
            <p className="text-[var(--muted)] leading-relaxed">{study.nextIteration}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-[var(--border)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Build something similar?</h2>
          <p className="text-[var(--muted)] mb-8">
            Book a discovery call and we&apos;ll scope what this pattern would look like for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#9b6dff] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Book a Strategy Call <ArrowRight size={16} />
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--card)] transition-colors"
            >
              ← All Case Studies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
