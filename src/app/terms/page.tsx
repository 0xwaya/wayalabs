import type { Metadata } from "next";
import { DISCOVERY_CREDIT_DAYS, discoveryOffer, formatUsd } from "@/lib/data/offers";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for WayaLabs engagements, including the discovery sprint and the 60-day discovery credit.",
  alternates: { canonical: "/terms" },
  openGraph: { url: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
          Legal
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
        <div className="space-y-8 text-sm leading-relaxed text-[var(--muted)]">
          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">Use of this website</h2>
            <p>
              Content is provided for informational purposes and may be updated at any time.
              You agree to use this website lawfully and not attempt to disrupt service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">Project engagements</h2>
            <p>
              All client services are governed by signed agreements that define scope, timelines,
              deliverables, and payment terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">Discovery credit</h2>
            <p>
              Discovery is {formatUsd(discoveryOffer.priceUsd)}. If a platform or lead-system
              build starts within {DISCOVERY_CREDIT_DAYS} days, the discovery amount paid is
              credited on that invoice. The credit applies once. WayaLabs may refuse the credit
              when the organization, or a predecessor, has already paid for that discovery.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">Intellectual property</h2>
            <p>
              Unless otherwise defined in a signed agreement, all website content is owned by
              WayaLabs. Reproduction or redistribution requires prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">Limitation of liability</h2>
            <p>
              WayaLabs is not liable for indirect or consequential damages resulting from use of
              this website. Service liabilities are limited by applicable contract terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">Contact</h2>
            <p>
              Questions about these terms can be sent to admin@wayalabs.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}