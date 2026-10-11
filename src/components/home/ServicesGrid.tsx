import Link from "next/link";
import { MessageSquare, Cpu, Plug, ArrowRight } from "lucide-react";

const services = [
  {
    icon: MessageSquare,
    title: "AI Chatbots",
    description:
      "R&D and project-scoping for conversational experiences grounded in approved knowledge sources and clear human escalation paths.",
    href: "/ai-solutions/chatbots",
    accent: "#4f8ef7",
    focus: ["Approved source material", "Escalation boundaries", "Evaluation questions"],
  },
  {
    icon: Cpu,
    title: "AI Agents",
    description:
      "Research into bounded, multi-step workflows with explicit tool permissions, durable state, and review before consequential actions.",
    href: "/ai-solutions/agents",
    accent: "#9b6dff",
    focus: ["Tool permissions", "Orchestration design", "Human approvals"],
  },
  {
    icon: Plug,
    title: "AI Integrations",
    description:
      "Explore model connections to existing systems with attention to data flow, access scope, and operational requirements.",
    href: "/ai-solutions/integrations",
    accent: "#22d3ee",
    focus: ["Data boundaries", "Identity and access", "Failure handling"],
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
            Areas of AI research and implementation
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            Project scope and deployment status vary. Work begins with architecture,
            data boundaries, and acceptance criteria rather than assumed outcomes.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, description, href, accent, focus }) => (
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

              {/* Design focus */}
              <ul className="space-y-1.5 mb-6">
                {focus.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-[var(--muted)]">
                    <span className="w-1 h-1 rounded-full" style={{ background: accent }} />
                    {item}
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
