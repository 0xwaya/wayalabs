import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { insightPosts, categoryColors } from "@/lib/data/insights";

export const metadata: Metadata = {
  title: "AI Insights",
  description:
    "Practical guides, case breakdowns, and technical deep-dives on building production AI systems. From WayaLabs — an AI solutions studio.",
};

export default function InsightsPage() {
  const [featured, ...rest] = insightPosts;
  const accent = categoryColors[featured.category] ?? "#4f8ef7";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-24 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
            Insights
          </p>
          <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-2xl">
            Practical AI,{" "}
            <span className="gradient-text">zero fluff</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-xl leading-relaxed">
            Technical guides, case breakdowns, and production patterns from building
            real AI systems. Written for engineers and operators, not audiences.
          </p>
        </div>
      </section>

      {/* Featured post */}
      <section className="py-16 px-6 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-6">
            Latest
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <div className="lg:col-span-3 flex flex-col justify-between">
              <div>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full inline-block mb-4"
                  style={{ color: accent, background: `${accent}18` }}
                >
                  {featured.category}
                </span>
                <h2 className="text-3xl font-bold mb-4 leading-tight">{featured.title}</h2>
                <p className="text-[var(--muted)] leading-relaxed">{featured.excerpt}</p>
              </div>
              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                  <span>{featured.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {featured.readTime}
                  </span>
                </div>
                <Link
                  href={`/insights/${featured.slug}`}
                  className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                  style={{ color: accent }}
                >
                  Read article <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            {/* Right placeholder visual */}
            <div
              className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--background)] min-h-40 flex items-center justify-center"
              aria-hidden
            >
              <div className="text-center p-6">
                <div className="text-5xl font-bold gradient-text mb-2">{featured.readTime.split(" ")[0]}</div>
                <div className="text-xs text-[var(--muted)]">min read</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Post grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => {
              const color = categoryColors[post.category] ?? "#4f8ef7";
              return (
                <article
                  key={post.slug}
                  className="group p-7 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col hover:border-opacity-60 transition-colors"
                >
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full inline-block mb-4 w-fit"
                    style={{ color, background: `${color}18` }}
                  >
                    {post.category}
                  </span>
                  <h2 className="text-lg font-semibold mb-3 leading-snug flex-1">{post.title}</h2>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                      <span>{post.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {post.readTime}
                      </span>
                    </div>
                    <Link
                      href={`/insights/${post.slug}`}
                      className="text-xs font-medium flex items-center gap-0.5 group-hover:gap-1.5 transition-all"
                      style={{ color }}
                    >
                      Read <ArrowRight size={12} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-20 px-6 border-t border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Get new posts in your inbox</h2>
          <p className="text-[var(--muted)] text-sm mb-6">
            Practical AI content, published when there&apos;s something worth saying — typically 2–3 posts a month.
          </p>
          <form className="flex gap-3">
            <input
              type="email"
              required
              placeholder="you@company.com"
              className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:border-[#4f8ef7] transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#9b6dff] text-white text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
