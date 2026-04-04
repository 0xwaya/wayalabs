import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { categoryColors, insightPosts } from "@/lib/data/insights";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return insightPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = insightPosts.find((item) => item.slug === slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function InsightDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = insightPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const accent = categoryColors[post.category] ?? post.accent;

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8"
          >
            <ArrowLeft size={14} /> All Insights
          </Link>

          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full inline-block mb-4"
            style={{ color: accent, background: `${accent}18` }}
          >
            {post.category}
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{post.title}</h1>
          <p className="text-lg text-[var(--muted)] leading-relaxed mb-6">{post.excerpt}</p>

          <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
            <span>{post.date}</span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {post.readTime}
            </span>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <article className="max-w-4xl mx-auto space-y-12">
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
              Why this matters
            </h2>
            <p className="leading-relaxed">{post.sections.context}</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
              Recommended approach
            </h2>
            <p className="text-[var(--muted)] leading-relaxed">{post.sections.approach}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <h2 className="text-sm font-semibold mb-4">Implementation checklist</h2>
              <ul className="space-y-2.5">
                {post.sections.checklist.map((item) => (
                  <li key={item} className="text-sm text-[var(--muted)] flex items-start gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <h2 className="text-sm font-semibold mb-4">Metrics to track</h2>
              <ul className="space-y-2.5">
                {post.sections.metrics.map((metric) => (
                  <li key={metric} className="text-sm text-[var(--muted)] flex items-start gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                    {metric}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="p-6 rounded-2xl border bg-[var(--background)]"
            style={{ borderColor: `${accent}55` }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-2">
              Key takeaway
            </h2>
            <p className="leading-relaxed">{post.sections.takeaway}</p>
          </div>
        </article>
      </section>

      <section className="py-20 px-6 border-t border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Want this implemented in your stack?</h2>
          <p className="text-[var(--muted)] mb-8">
            We can turn this pattern into a scoped sprint and a production-ready delivery plan.
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