import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

const projects = [
  {
    id: "urban-stone",
    title: "Urban Stone",
    subtitle: "Amazon Granite Rebrand Portal",
    category: "AI-Enhanced Web Platform",
    description:
      "Full brand and commerce portal repositioning a commodity granite product through premium UX, structured content, and AI-assisted FAQ — reducing inbound support while establishing SEO presence.",
    tags: ["AI FAQ", "Structured Data", "Dealer Portal"],
    stack: ["Full Stack", "REST API", "Webhooks", "Next.js"],
    href: "/case-studies/urban-stone",
    externalUrl: "https://urbanstone.co",
    accentColor: "#4f8ef7",
  },
  {
    id: "queen-city-soundboard",
    title: "Queen City Soundboard",
    subtitle: "Local Music Discovery Platform",
    category: "AI-Enhanced Web Platform",
    description:
      "Searchable directory connecting artists, studios, and promoters in Charlotte with AI-assisted matching logic, structured profiles, and a booking inquiry flow optimised for local SEO.",
    tags: ["Semantic Search", "Local SEO", "Booking Flow"],
    stack: ["Full Stack", "REST API", "LangGraph", "Webhooks"],
    href: "/case-studies/queen-city-soundboard",
    externalUrl: "https://queencitysoundboard.com",
    accentColor: "#9b6dff",
  },
  {
    id: "openclaw-agent",
    title: "OpenClaw Agent System",
    subtitle: "Agentic Workflow Automation",
    category: "AI Agent",
    description:
      "Internal agentic system automating dev lifecycle tasks — PR review, doc generation, and cross-repo orchestration. Built with modular tools, prompt versioning, and full observability. Now the foundation for client deployments.",
    tags: ["LLM Orchestration", "Multi-model", "Observability"],
    stack: ["LangGraph", "Full Stack", "REST API", "Webhooks"],
    href: "/case-studies/openclaw-agent",
    externalUrl: "https://github.com/0xwaya",
    accentColor: "#22d3ee",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="py-24 px-6 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
              Case Studies
            </p>
            <h2 className="text-4xl font-bold tracking-tight">
              Shipped work, measurable results
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-[#4f8ef7] hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            All case studies <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map(
            ({ id, title, subtitle, category, description, tags, stack, href, externalUrl, accentColor }) => (
              <article
                key={id}
                className="group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-opacity-60 transition-all duration-300"
                style={{ "--accent": accentColor } as React.CSSProperties}
              >
                {/* Top accent bar */}
                <div
                  className="h-0.5"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                  }}
                />

                {/* Card body */}
                <div className="p-8 flex flex-col flex-1">
                  {/* Category badge */}
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full w-fit mb-5"
                    style={{
                      color: accentColor,
                      background: `${accentColor}18`,
                    }}
                  >
                    {category}
                  </span>

                  <h3 className="text-xl font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-[var(--muted)] mb-4">{subtitle}</p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed flex-1 mb-6">
                    {description}
                  </p>

                  {/* Tags */}
                  {/* Stack badges — accent-coloured tech pills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-medium rounded-full px-2.5 py-0.5"
                        style={{
                          color: accentColor,
                          background: `${accentColor}1a`,
                          border: `1px solid ${accentColor}38`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {/* Feature / concept tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs border border-[var(--border)] rounded-full px-2.5 py-0.5 text-[var(--muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={href}
                      className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                      style={{ color: accentColor }}
                    >
                      Read case study <ArrowRight size={14} />
                    </Link>
                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                      aria-label="Visit project"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}
