import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

const projects = [
  {
    id: "urban-stone",
    title: "Urban Stone Collective",
    subtitle: "Countertop Fabrication — Website & Lead System",
    category: "AI-Enhanced Web Platform",
    description:
      "Website and lead system for a granite, quartz, and quartzite countertop fabricator serving greater Cincinnati and Northern Kentucky. Quote requests and the Onyx chat route to the sales inbox. A lead-sourcer checks extra sources only when they are switched on.",
    tags: ["Lead Capture", "Lead sourcer", "Contractor Portal"],
    stack: ["Next.js", "Supabase", "Resend"],
    href: "/case-studies/urban-stone",
    externalUrl: "https://urbanstone.co",
    accentColor: "#d7dbe3",
  },
  {
    id: "queen-city-soundboard",
    title: "Queen City Soundboard",
    subtitle: "Cincinnati & NKY Live Events Guide",
    category: "AI-Enhanced Web Platform",
    description:
      "A guide to live music, comedy, and cultural events across Cincinnati and Northern Kentucky. Local calendar, official ticket links, city pages, and event submissions held for review. Social images are hosted by the site. Posting them is not automated yet.",
    tags: ["Event Calendar", "Structured Data", "Local SEO"],
    stack: ["Next.js 16", "Supabase", "Vercel"],
    href: "/case-studies/queen-city-soundboard",
    externalUrl: "https://queencitysoundboard.com",
    accentColor: "#c5cad3",
  },
  {
    id: "openclaw-agent",
    title: "OpenClaw Workflow Exploration",
    subtitle: "Internal agent orchestration R&D",
    category: "AI Agent",
    description:
      "Internal research into operator-directed repository review, documentation, and cross-repository coordination. This is separate from the CEO Executive Orchestrator and is not a client deployment.",
    tags: ["Research and development", "Human review", "Workflow design"],
    stack: ["OpenClaw", "Tool boundaries", "Operator-led"],
    href: "/case-studies/openclaw-agent",
    externalUrl: null,
    accentColor: "#f3f4f6",
  },
  {
    id: "grok-operators",
    title: "Grok operator environments",
    subtitle: "Isolated checkouts, review before any push",
    category: "AI Agent",
    description:
      "Grok sessions work inside one checkout per project, and a Python virtual environment when the runtime needs one. They draft changes for the live sites and the other agents, then stop for approval. Scheduled work stays native to each project.",
    tags: ["Human review", "Isolated environments", "Native workflows"],
    stack: ["Grok", "Python venv", "Per-project checkout"],
    href: "/case-studies/grok-operators",
    externalUrl: null,
    accentColor: "#d7dbe3",
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
              Selected project work
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-[#d7dbe3] hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            All case studies <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    {externalUrl && (
                      <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                        aria-label="Visit project"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
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
