import type { Metadata } from "next";
import { Mail, CalendarDays, MessageSquare } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Book a Strategy Call",
  description:
    "Book a strategy call with WayaLabs or send a message. We respond within one business day. No-commitment discovery call to explore your AI opportunity.",
};

const trustSignals = [
  { icon: CalendarDays, label: "Response within 1 business day" },
  { icon: MessageSquare, label: "No commitment required on the call" },
  { icon: Mail, label: "Clear scope and estimate after discovery" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-24 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
            Get in Touch
          </p>
          <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-2xl">
            Let&apos;s talk about{" "}
            <span className="gradient-text">your AI opportunity</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-xl leading-relaxed">
            Tell us what you want to build or automate. We&apos;ll respond with a clear,
            honest assessment — and a path forward if it&apos;s a good fit.
          </p>
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
                  <div className="w-8 h-8 rounded-lg bg-[#4f8ef718] flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-[#4f8ef7]" />
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
                href="mailto:hello@wayalabs.com"
                className="text-[#4f8ef7] hover:opacity-80 transition-opacity text-sm"
              >
                hello@wayalabs.com
              </a>
            </div>

            <div className="border-t border-[var(--border)]" />

            {/* Calendar embed placeholder */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
                Book directly
              </p>
              <a
                href="https://cal.com/wayalabs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-sm hover:bg-[var(--card)] transition-colors"
              >
                <CalendarDays size={15} />
                Open calendar
              </a>
              <p className="text-xs text-[var(--muted)] mt-2">30-min discovery · no prep required</p>
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
