import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { CAL_BOOKING_URL } from "@/lib/booking";
import { NewCustomerNote } from "@/components/offers/NewCustomerNote";

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
              Discovery
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
              Scope the work before{" "}
              <span className="gradient-text">anyone builds it</span>
            </h2>
            <p className="text-[var(--muted)] max-w-xl mx-auto mb-10 leading-relaxed">
              Discovery is the onboarding week. You leave with a written brief: the
              outcome, the systems in scope, the data boundary, and a go or no-go.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonLink
                href={CAL_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                variant="primary"
              >
                Book a discovery call
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/case-studies" size="lg" variant="secondary">
                View live work
              </ButtonLink>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs text-[var(--muted)]">
              <span>Written brief</span>
              <span>Named systems</span>
              <span>Go or no-go</span>
            </div>
            <NewCustomerNote centered />
          </div>
        </div>
      </div>
    </section>
  );
}
