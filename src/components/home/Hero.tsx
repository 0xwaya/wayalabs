import { ArrowRight, ChevronRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center grid-bg overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 py-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/wayalabs-mark.png"
          alt=""
          width={1130}
          height={714}
          className="mb-10 h-auto w-full max-w-xl"
        />
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--muted)] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f3f4f6] animate-pulse" />
          AI Solutions Studio
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-4xl">
          WayaLabs{" "}
          <span className="gradient-text">AI Solutions Studio</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl mb-10 leading-relaxed">
          WayaLabs researches and develops AI systems. A focused studio exploring
          AI architecture, implementation, and evaluation — and building practical
          web platforms and automations for real businesses.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <ButtonLink href="/case-studies" variant="primary" size="md">
            View Case Studies
            <ArrowRight size={16} />
          </ButtonLink>
          <ButtonLink href="/lab/ceo-agent" variant="secondary" size="md">
            CEO Orchestrator R&D
            <ChevronRight size={16} />
          </ButtonLink>
        </div>

        {/* Social proof strip */}
        <div className="mt-16 flex flex-wrap items-center gap-8">
          <span className="text-xs text-[var(--muted)] uppercase tracking-widest">
            Selected projects
          </span>
          {[
            "Urban Stone Collective",
            "Queen City Soundboard",
            "Grok operator environments",
            "OpenClaw Workflow Exploration",
          ].map((name) => (
            <span
              key={name}
              className="text-xs text-[var(--muted)] border border-[var(--border)] rounded-full px-3 py-1"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
