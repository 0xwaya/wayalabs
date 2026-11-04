import SectionWrapper from "@/components/ui/SectionWrapper";
import { CAL_BOOKING_URL } from "@/lib/booking";
import { packages } from "./packages";

/** Variant B: packages without prices; "Request a quote" CTAs. */
export default function ServicesQuote() {
  return (
    <SectionWrapper>
      <h1 className="text-4xl font-semibold mb-4">Packages for small businesses</h1>
      <p className="text-[var(--muted)] mb-10 max-w-2xl">
        Fixed scope, clear timelines, and a written quote before any work starts. You own your domain and content.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((p) => (
          <article key={p.name} className={`flex flex-col rounded-2xl border p-6 ${p.featured ? "border-[#d7dbe3]" : "border-[var(--border)]"}`}>
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-sm text-[var(--muted)] mt-1">Typical delivery: {p.time}</p>
            <ul className="mt-4 mb-6 space-y-1 text-sm list-disc pl-5 flex-1">
              {p.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
            <a href={`/contact?package=${encodeURIComponent(p.name)}`} className="rounded-xl px-4 py-2 text-center border border-[var(--border)] hover:border-[#d7dbe3]" aria-label={`Request a quote for ${p.name}`}>Request a quote</a>
          </article>
        ))}
      </div>
      <a href={CAL_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-10 rounded-xl px-5 py-3 bg-[var(--foreground)] text-[var(--background)]">Or book a 20-minute call</a>
    </SectionWrapper>
  );
}
