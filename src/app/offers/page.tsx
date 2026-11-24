import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/seo";
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
  title: "Discovery, lead systems, and platform builds",
  description: offersPageDescription,
  alternates: { canonical: "/offers" },
  openGraph: pageOpenGraph("/offers"),
};

const seller = {
  "@type": "Organization",
  name: "Wayalabs",
  url: "https://wayalabs.com",
};

const offerJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Wayalabs engagements",
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
    {
      "@type": "ListItem",
      position: 3,
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
  ],
};

/** Public order: Discovery → Lead system (flagship) → Platform. */
const publishedOffers = [
  {
    ...discoveryOffer,
    price: discoveryPrice,
    priceNote: discoveryOffer.duration,
  },
  {
    ...leadSystemOffer,
    price: leadPrice,
    priceNote: "Fixed for the agreed scope",
    proof: { href: "/case-studies/urban-stone", label: "Urban Stone pattern" },
  },
  {
    ...platformOffer,
    price: platformPrice,
    priceNote: "Fixed for the agreed scope",
    proof: { href: "/case-studies/queen-city-soundboard", label: "Queen City Soundboard pattern" },
  },
];

const icpRows = [
  {
    title: "Local trade and service",
    body: "Quotes, permits, sales inbox. Discovery → lead system.",
    href: "/case-studies/urban-stone",
  },
  {
    title: "Local listings and calendars",
    body: "Submissions, operator review, public site. Discovery → platform.",
    href: "/case-studies/queen-city-soundboard",
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
            One ladder.{" "}
            <span className="gradient-text">Custom for the business.</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed">
            Discovery is {discoveryPrice}. A lead system is {leadPrice}. A platform build is{" "}
            {platformPrice}. Same kit shape each time; your knowledge, CRM fields, and one job
            on top. If a build starts within {DISCOVERY_CREDIT_DAYS} days of the discovery
            payment, that fee is credited in full.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Who this is for</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {icpRows.map((row) => (
              <Link
                key={row.title}
                href={row.href}
                className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[#d7dbe360] transition-colors"
              >
                <h3 className="text-lg font-semibold mb-2">{row.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{row.body}</p>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-sm text-[var(--muted)]">
            Agentic workflows and agent integrations (OpenClaw, Grok, and similar) are
            scoped in discovery into the named build. There is no standalone agent-pilot
            package on this page.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {publishedOffers.map((offer) => (
            <div key={offer.id} className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
                {offer.priceNote}
              </p>
              <h2 className="text-2xl font-bold mb-2">{offer.name}</h2>
              <p className="text-3xl font-bold tracking-tight mb-4">{offer.price}</p>
              <p className="text-[var(--muted)] leading-relaxed mb-6">{offer.summary}</p>
              <ul className="space-y-3 flex-1">
                {offer.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#d7dbe3] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              {"proof" in offer && offer.proof ? (
                <Link
                  href={offer.proof.href}
                  className="mt-6 text-sm font-medium text-[#d7dbe3] hover:opacity-80 transition-opacity inline-flex items-center gap-1"
                >
                  {offer.proof.label} <ArrowRight size={14} />
                </Link>
              ) : null}
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
          <p className="mt-8 text-sm text-[var(--muted)] leading-relaxed">
            After launch, every build closes with an operator handoff and an invite for
            ongoing monitoring or scheduled build capacity. Those recurring options are
            confirmed at close — they are not listed as public SKUs here.
          </p>
          <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">
            Concurrent builds are capped so each handoff stays clean. Start dates are
            confirmed on the discovery call. We do not invent a standalone agent-pilot
            SKU to fill a slot.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-[var(--border)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Book the discovery sprint</h2>
          <p className="text-[var(--muted)] mb-8">
            The call confirms the outcome, the systems in scope, and the earliest build start
            if a slot is open. The invoice is {discoveryPrice}. A platform or lead-system build
            started within {DISCOVERY_CREDIT_DAYS} days of that payment credits the fee in full.
            The credit is not refused.
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
