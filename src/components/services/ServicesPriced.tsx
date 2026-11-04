import SectionWrapper from "@/components/ui/SectionWrapper";
import { CAL_BOOKING_URL } from "@/lib/booking";
import { packages } from "./packages";

/** Variant A: public prices. */
export default function ServicesPriced() {
  return (
    <SectionWrapper>
      <h1 className="text-4xl font-semibold mb-4">Packages for small businesses</h1>
      <p className="text-[var(--muted)] mb-10 max-w-2xl">
        Fixed scope, fixed price. 50% deposit, 50% at launch. Monthly plans are month-to-month after any minimum. You own your domain and content.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((p) => (
          <article key={p.name} className={`rounded-2xl border p-6 ${p.featured ? "border-[#d7dbe3]" : "border-[var(--border)]"}`}>
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="mt-2 text-2xl">{p.setup}</p>
            <p className="text-sm text-[var(--muted)]">{p.monthly} · {p.time}</p>
            <ul className="mt-4 space-y-1 text-sm list-disc pl-5">
              {p.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-10 text-sm text-[var(--muted)]">Larger custom builds start with Discovery — see <a className="underline" href="/offers">Offers</a>.</p>
      <a href={CAL_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 rounded-xl px-5 py-3 bg-[var(--foreground)] text-[var(--background)]">Book a 20-minute call</a>
    </SectionWrapper>
  );
}
