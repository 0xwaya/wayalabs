import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function CTABanner() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-[var(--border)]">
          {/* Background gradient */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(215,219,227,0.12) 0%, rgba(215,219,227,0.1) 50%, rgba(243,244,246,0.08) 100%)",
            }}
          />
          {/* Grid overlay */}
          <div
            aria-hidden
            className="absolute inset-0 grid-bg opacity-50"
          />

          {/* Content */}
          <div className="relative px-8 py-16 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
              CEO Executive Orchestrator · R&D
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
              Explore agent{" "}
              <span className="gradient-text">orchestration research</span>
            </h2>
            <p className="text-[var(--muted)] max-w-xl mx-auto mb-10 leading-relaxed">
              Currently under research and development. The prototype explores
              Python, Flask, Socket.IO, and LangGraph orchestration; it is not a
              live service or production deployment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonLink href="/lab/ceo-agent" size="lg" variant="primary">
                View R&D walkthrough
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/case-studies" size="lg" variant="secondary">
                Project notes
              </ButtonLink>
            </div>

            {/* Trust signals */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs text-[var(--muted)]">
              <span>Human review</span>
              <span>Scoped tool access</span>
              <span>Approval-gated artifacts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
