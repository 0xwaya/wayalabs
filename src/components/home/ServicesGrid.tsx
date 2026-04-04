import Link from "next/link";
import { MessageSquare, Cpu, Plug, ArrowRight } from "lucide-react";

const services = [
  {
    icon: MessageSquare,
    title: "AI Chatbots",
    description:
      "Conversational AI for support, sales, and onboarding — tuned to your knowledge base and deployed on your channels.",
    href: "/ai-solutions/chatbots",
    accent: "#4f8ef7",
    outcomes: ["70% ticket deflection", "3× lead capture", "<2s response"],
  },
  {
    icon: Cpu,
    title: "AI Agents",
    description:
      "Goal-directed systems that read, write, route, and operate across your tools — replacing repetitive manual work reliably.",
    href: "/ai-solutions/agents",
    accent: "#9b6dff",
    outcomes: ["80% task reduction", "10h+ saved weekly", "99% reliability"],
  },
  {
    icon: Plug,
    title: "AI Integrations",
    description:
      "Connect LLMs to your CRM, docs, and APIs with the right data pipelines, security boundaries, and observability.",
    href: "/ai-solutions/integrations",
    accent: "#22d3ee",
    outcomes: ["Live in 1 week", "4+ systems connected", "Full observability"],
  },
];

export default function ServicesGrid() {
  return (
    <section className="py-24 px-6 bg-[var(--card)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
            Services
          </p>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Three ways AI creates leverage
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            Every engagement starts with a clear outcome. We match the right AI
            system to the problem — then build it to production quality.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, description, href, accent, outcomes }) => (
            <Link
              key={href}
              href={href}
              className="group relative p-8 rounded-2xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--accent-blue)] transition-all duration-300 hover:glow-blue flex flex-col"
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
                style={{ background: `${accent}18` }}
              >
                <Icon size={22} style={{ color: accent }} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-6 flex-1">
                {description}
              </p>

              {/* Outcomes */}
              <ul className="space-y-1.5 mb-6">
                {outcomes.map((o) => (
                  <li key={o} className="flex items-center gap-2 text-xs text-[var(--muted)]">
                    <span className="w-1 h-1 rounded-full" style={{ background: accent }} />
                    {o}
                  </li>
                ))}
              </ul>

              {/* CTA row */}
              <span
                className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                style={{ color: accent }}
              >
                Learn more <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
