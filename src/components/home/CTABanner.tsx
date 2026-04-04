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
                "linear-gradient(135deg, rgba(79,142,247,0.12) 0%, rgba(155,109,255,0.1) 50%, rgba(34,211,238,0.08) 100%)",
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
              Let&apos;s work together
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
              Ready to build AI that{" "}
              <span className="gradient-text">actually works</span>?
            </h2>
            <p className="text-[var(--muted)] max-w-xl mx-auto mb-10 leading-relaxed">
              Tell us what you want to automate, improve, or build. We&apos;ll
              respond within one business day with a clear path forward.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonLink href="/contact" size="lg" variant="primary">
                Book a Strategy Call
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/ai-solutions" size="lg" variant="secondary">
                Explore Services
              </ButtonLink>
            </div>

            {/* Trust signals */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs text-[var(--muted)]">
              <span>✓ Response within 1 business day</span>
              <span>✓ No-commitment discovery call</span>
              <span>✓ Working prototype in week 2</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
