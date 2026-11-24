import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/seo";
import { Mail, CalendarDays, MessageSquare } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import { CAL_BOOKING_URL } from "@/lib/booking";
import { NewCustomerNote } from "@/components/offers/NewCustomerNote";
import { discoveryCreditSentence } from "@/lib/data/offers";

export const metadata: Metadata = {
  title: "Contact — Book discovery",
  description:
    `Book a discovery call with Wayalabs. ${discoveryCreditSentence}`,
  alternates: { canonical: "/contact" },
  openGraph: pageOpenGraph("/contact"),
};

const trustSignals = [
  { icon: CalendarDays, label: "Response within 1 business day" },
  { icon: MessageSquare, label: "Discovery ends in a written go or no-go" },
  { icon: Mail, label: "Lead system and platform builds after discovery" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-24 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
            Discovery
          </p>
          <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-2xl">
            Start with a{" "}
            <span className="gradient-text">discovery sprint</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-xl leading-relaxed">
            Tell us the outcome you need. We&apos;ll map systems in and out, the data
            boundary, and whether a lead system or platform build is next — including the
            earliest start if concurrent builds are full. Agent pilots are not for sale.
          </p>
          <NewCustomerNote />
        </div>
      </section>

      {/* Main grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left sidebar */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trust signals */}
            <div className="space-y-4">
              {trustSignals.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                  <div className="w-8 h-8 rounded-lg bg-[#d7dbe318] flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-[#d7dbe3]" />
                  </div>
                  {label}
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--border)]" />

            {/* Direct email */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
                Prefer email?
              </p>
              <a
                href="mailto:admin@wayalabs.com"
                className="text-[#d7dbe3] hover:opacity-80 transition-opacity text-sm"
              >
                admin@wayalabs.com
              </a>
            </div>

            <div className="border-t border-[var(--border)]" />

            {/* Calendar embed placeholder */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
                Book directly
              </p>
              <a
                href={CAL_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-sm hover:bg-[var(--card)] transition-colors"
              >
                <CalendarDays size={15} />
                Open calendar
              </a>
              <p className="text-xs text-[var(--muted)] mt-2">
                Book discovery, then see{" "}
                <a href="/offers" className="underline underline-offset-4 hover:text-[var(--foreground)]">
                  lead system and platform offers
                </a>
                .
              </p>
            </div>

          </div>

          {/* Right — form */}
          <div className="lg:col-span-3 p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
