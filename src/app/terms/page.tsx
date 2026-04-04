import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for WayaLabs engagements and website usage.",
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
              Questions about these terms can be sent to hello@wayalabs.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}