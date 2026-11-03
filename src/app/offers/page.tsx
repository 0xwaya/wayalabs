import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CAL_BOOKING_URL } from "@/lib/booking";
import {
  DISCOVERY_CREDIT_DAYS,
  discoveryOffer,
  formatUsd,
  formatUsdRange,
  leadSystemOffer,
  offerRules,
  offersPageDescription,
  platformOffer,
} from "@/lib/data/offers";

const discoveryPrice = formatUsd(discoveryOffer.priceUsd);
const platformPrice = formatUsdRange(platformOffer.priceFromUsd, platformOffer.priceToUsd);
const leadPrice = formatUsdRange(leadSystemOffer.priceFromUsd, leadSystemOffer.priceToUsd);

export const metadata: Metadata = {
  title: "Discovery, platform builds, and lead systems",
  description: offersPageDescription,
  alternates: { canonical: "/offers" },
  openGraph: { url: "/offers" },
};

const seller = {
  "@type": "Organization",
  name: "WayaLabs",
  url: "https://wayalabs.com",
};

const offerJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "WayaLabs engagements",
  url: "https://wayalabs.com/offers",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Offer",
        name: discoveryOffer.name,
        url: "https://wayalabs.com/offers",
        description: discoveryOffer.summary,
        price: String(discoveryOffer.priceUsd),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        seller,
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "AggregateOffer",
        name: platformOffer.name,
        url: "https://wayalabs.com/offers",
        description: platformOffer.summary,
        lowPrice: String(platformOffer.priceFromUsd),
        highPrice: String(platformOffer.priceToUsd),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        seller,
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "AggregateOffer",
        name: leadSystemOffer.name,
        url: "https://wayalabs.com/offers",
        description: leadSystemOffer.summary,
        lowPrice: String(leadSystemOffer.priceFromUsd),
        highPrice: String(leadSystemOffer.priceToUsd),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        seller,
      },
    },
  ],
};

const publishedOffers = [
  {
    ...discoveryOffer,
    price: discoveryPrice,
    priceNote: discoveryOffer.duration,
  },
  {
    ...platformOffer,
    price: platformPrice,
    priceNote: "Fixed for the agreed scope",
  },
  {
    ...leadSystemOffer,
    price: leadPrice,
    priceNote: "Fixed for the agreed scope",
  },
];

export default function OffersPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 px-6 grid-bg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
            Engagements
          </p>
          <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-3xl">
            A stack <span className="gradient-text">custom built for the business</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed">
            A discovery sprint is {discoveryPrice}. A platform build is {platformPrice}. A lead
            system is {leadPrice}. Each one is built for that business. Live client sites show
            the same kind of stack. Those businesses are not for sale. If the build starts within{" "}
            {DISCOVERY_CREDIT_DAYS} days of the discovery payment, that fee is credited in full.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {publishedOffers.map((offer) => (
            <div key={offer.id} className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
                {offer.priceNote}
              </p>
              <h2 className="text-2xl font-bold mb-2">{offer.name}</h2>
              <p className="text-3xl font-bold tracking-tight mb-4">{offer.price}</p>
              <p className="text-[var(--muted)] leading-relaxed mb-6">{offer.summary}</p>
              <ul className="space-y-3">
                {offer.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#d7dbe3] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">How the credit works</h2>
          <ul className="space-y-4">
            {offerRules.map((rule) => (
              <li key={rule} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#d7dbe3] flex-shrink-0" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-[var(--border)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Book the discovery sprint</h2>
          <p className="text-[var(--muted)] mb-8">
            The call confirms the outcome and the systems in scope for that business. The invoice
            is {discoveryPrice}. A platform or lead-system build started within {DISCOVERY_CREDIT_DAYS}{" "}
            days of that payment credits the fee in full. The credit is not refused.
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
