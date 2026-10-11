import { ArrowRight, ChevronRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center grid-bg overflow-hidden">
      {/* Ambient glow orbs */}
      <div
        aria-hidden
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background:
            "radial-gradient(circle, #4f8ef7 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{
          background:
            "radial-gradient(circle, #9b6dff 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--muted)] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse" />
          State-of-the-art orchestration R&D
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-4xl">
          CEO Executive{" "}
          <span className="gradient-text">Orchestrator</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl mb-10 leading-relaxed">
          Currently under research and development. The CEO Executive Orchestrator
          prototype uses Python, Flask, Socket.IO, and LangGraph to explore executive
          routing, durable jobs, and approval-gated artifacts. This is not a live
          service or production deployment.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <ButtonLink href="/lab/ceo-agent" variant="primary" size="md">
            Explore CEO Orchestrator R&D
            <ArrowRight size={16} />
          </ButtonLink>
          <ButtonLink href="/case-studies" variant="secondary" size="md">
            Project Notes
            <ChevronRight size={16} />
          </ButtonLink>
        </div>

        {/* Social proof strip */}
        <div className="mt-16 flex flex-wrap items-center gap-8">
          <span className="text-xs text-[var(--muted)] uppercase tracking-widest">
            Selected projects
          </span>
          {[
            "Urban Stone Portal",
            "Queen City Soundboard",
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
