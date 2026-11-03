import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CAL_BOOKING_URL } from "@/lib/booking";
import {
  discoveryOffer,
  discoveryOutcomes,
  discoverySummary,
  formatUsd,
  DISCOVERY_CREDIT_DAYS,
  discoveryRules,
} from "@/lib/data/offers";

const price = formatUsd(discoveryOffer.priceUsd);

export const metadata: Metadata = {
  title: "Discovery sprint",
  description: discoverySummary,
  alternates: { canonical: "/offers" },
  openGraph: { url: "/offers" },
};

const offerJsonLd = {
  "@context": "https://schema.org",
  "@type": "Offer",
  name: "Discovery sprint",
  url: "https://wayalabs.com/offers",
  description: metadata.description,
  price: String(discoveryOffer.priceUsd),
  priceCurrency: "USD",
  availability: "https://schema.org/InStock",
  seller: {
    "@type": "Organization",
    name: "WayaLabs",
    url: "https://wayalabs.com",
  },
};

export default function OffersPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
            Onboarding
          </p>
          <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-3xl">
            One week.{" "}
            <span className="gradient-text">{price}.</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed">
            {discoverySummary}
          </p>
        </div>
      </section>

      <section className="py-20 px-6 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-8">
            What the week is for
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {discoveryOutcomes.map((item) => (
              <div key={item.title} className="p-6 rounded-2xl border border-[var(--border)]">
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
              {discoveryOffer.duration}
            </p>
            <h2 className="text-3xl font-bold mb-2">{discoveryOffer.name}</h2>
            <p className="text-4xl font-bold tracking-tight mb-6">{price}</p>
            <p className="text-[var(--muted)] leading-relaxed">{discoveryOffer.includes}</p>
          </div>

          <div className="p-8 rounded-2xl border border-[var(--border)]">
            <h2 className="text-xl font-semibold mb-6">How it is priced</h2>
            <ul className="space-y-4">
              {discoveryRules.map((rule) => (
                <li key={rule} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#d7dbe3] flex-shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-[var(--border)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Book the discovery sprint</h2>
          <p className="text-[var(--muted)] mb-8">
            One week, a written brief, and a go or no-go. The invoice is {price}. A
            build started within {DISCOVERY_CREDIT_DAYS} days credits that fee.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={CAL_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#f3f4f6] text-[#07080c] hover:bg-[#d7dbe3] font-semibold hover:opacity-90 transition-opacity"
            >
              Book a discovery call <ArrowRight size={16} />
            </Link>
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--card)] transition-colors"
            >
              Read the terms
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
      />
    </div>
  );
}
