import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/seo";
import Link from "next/link";
import { CAL_BOOKING_URL } from "@/lib/booking";
import { NewCustomerNote } from "@/components/offers/NewCustomerNote";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, FileDown } from "lucide-react";
import { categoryColors, insightPosts } from "@/lib/data/insights";
import { InsightMarkdown } from "@/components/insights/InsightMarkdown";
import { isSafeSitePath } from "@/lib/safe-url";

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
    alternates: { canonical: `/insights/${slug}` },
    openGraph: pageOpenGraph(`/insights/${slug}`),
  };
}

export default async function InsightDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = insightPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const accent = categoryColors[post.category] ?? post.accent;
  const pdfHref = post.pdfUrl && isSafeSitePath(post.pdfUrl) ? post.pdfUrl : undefined;

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

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 break-words text-balance">{post.title}</h1>
          <p className="text-lg text-[var(--muted)] leading-relaxed mb-6">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
            <span>{post.date}</span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {post.readTime}
            </span>
            {pdfHref ? (
              <a
                href={pdfHref}
                className="inline-flex items-center gap-1.5 text-[var(--foreground)] hover:opacity-80"
              >
                <FileDown size={12} /> Download the PDF
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <article className="max-w-4xl mx-auto min-w-0 space-y-12 overflow-x-hidden">
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

          {post.body ? (
            <div className="pt-4 border-t border-[var(--border)]">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-6">
                Full brief
              </h2>
              {pdfHref ? (
                <p className="text-sm text-[var(--muted)] mb-8">
                  A typographic PDF accompanies this brief, including charts, tables, and sources.{" "}
                  <a href={pdfHref} className="underline underline-offset-2 decoration-[var(--border)] hover:text-[var(--foreground)]">
                    Download the typographic PDF
                  </a>
                  .
                </p>
              ) : null}
              <InsightMarkdown content={post.body} />
            </div>
          ) : null}
        </article>
      </section>

      <section className="py-20 px-6 border-t border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Want this implemented in your stack?</h2>
          <p className="text-[var(--muted)] mb-8">
            We can discuss a scoped project and its research, implementation, and evaluation needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={CAL_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
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