import Link from "next/link";

const proofs = [
  {
    value: "Lead system",
    label: "Urban Stone Collective",
    sub: "Quotes, chat, CRM, permit job",
    href: "/case-studies/urban-stone",
  },
  {
    value: "Platform",
    label: "Queen City Soundboard",
    sub: "Site, forms, store, handoff",
    href: "/case-studies/queen-city-soundboard",
  },
  {
    value: "Trade / local",
    label: "Primary ICP",
    sub: "Service businesses with a sales inbox",
    href: "/offers",
  },
  {
    value: "Listings",
    label: "Secondary ICP",
    sub: "Local calendars and operator review",
    href: "/offers",
  },
];

export default function OutcomeMetrics() {
  return (
    <section className="py-24 px-6 grid-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
            Who we build for
          </p>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Same shapes. Your business on top.
          </h2>
          <p className="text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
            Flagship work is a lead system for local trade, or a platform for local
            listings. Agentic workflows are scoped in discovery when they fit.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {proofs.map(({ value, label, sub, href }) => (
            <Link
              key={label}
              href={href}
              className="relative p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[#d7dbe360] transition-colors"
            >
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-[#d7dbe3]"
              />
              <div className="text-2xl font-bold mb-2 tracking-tight">{value}</div>
              <div className="text-sm font-medium text-[var(--foreground)] mb-1">{label}</div>
              <div className="text-xs text-[var(--muted)]">{sub}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
