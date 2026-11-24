import Link from "next/link";
import { ClipboardList, MessageSquare, LayoutTemplate, ArrowRight } from "lucide-react";

const offerings = [
  {
    icon: ClipboardList,
    title: "Discovery sprint",
    description:
      "One week. Written brief and a go or no-go. Fee credited in full on a lead system or platform build within 60 days.",
    href: "/offers",
    accent: "#d7dbe3",
    focus: ["Outcome and systems map", "Data boundary", "Named next build"],
  },
  {
    icon: MessageSquare,
    title: "Lead system",
    description:
      "Intake or chat, email, CRM, and one approved job — the Urban Stone pattern, custom for the business.",
    href: "/offers",
    accent: "#c5cad3",
    focus: ["Form or on-site chat", "Private CRM", "One scheduled job"],
  },
  {
    icon: LayoutTemplate,
    title: "Platform build",
    description:
      "Site, forms, email, data store, and operator handoff — the Queen City Soundboard pattern, custom for the business.",
    href: "/offers",
    accent: "#f3f4f6",
    focus: ["Public site and forms", "Operator data store", "Runnable handoff"],
  },
];

export default function ServicesGrid() {
  return (
    <section className="py-24 px-6 bg-[var(--card)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
            What we sell
          </p>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Discovery, then a lead system or platform
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            One commercial ladder. Chatbots ship inside lead systems when the brief
            calls for them. Agents and orchestrators stay in research — not for sale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offerings.map(({ icon: Icon, title, description, href, accent, focus }) => (
            <Link
              key={title}
              href={href}
              className="group relative p-8 rounded-2xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--accent-blue)] transition-all duration-300 hover:glow-blue flex flex-col"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
                style={{ background: `${accent}18` }}
              >
                <Icon size={22} style={{ color: accent }} />
              </div>

              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-6 flex-1">
                {description}
              </p>

              <ul className="space-y-1.5 mb-6">
                {focus.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-[var(--muted)]">
                    <span className="w-1 h-1 rounded-full" style={{ background: accent }} />
                    {item}
                  </li>
                ))}
              </ul>

              <span
                className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                style={{ color: accent }}
              >
                See offers <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
