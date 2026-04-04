import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for WayaLabs, including what data we collect and how we process it.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
          Legal
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        <div className="space-y-8 text-sm leading-relaxed text-[var(--muted)]">
          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">Information we collect</h2>
            <p>
              We collect information you provide through contact forms, email, and scheduling
              links, including your name, email, company details, and project requirements.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">How we use data</h2>
            <p>
              We use submitted data to respond to inquiries, scope projects, communicate about
              services, and improve our website and service delivery.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">Data sharing</h2>
            <p>
              We do not sell personal information. Data may be processed by trusted service
              providers used to run our website, communications, and analytics.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">Retention and rights</h2>
            <p>
              We retain inquiry data only as long as needed for business and legal purposes.
              You may request access, correction, or deletion by contacting
              admin@wayalabs.com.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">Contact</h2>
            <p>
              Questions about this policy can be sent to admin@wayalabs.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}