/**
 * DEV PREVIEW — Logo comparison page.
 * Remove this route before final deployment or gate behind auth.
 */

const finalMark = {
  file: "/logos/wayalabs-mark.svg",
  name: "WayaLabs Mark",
  description:
    "Production logo. Geometric feather with premium navy / blue / cyan / violet gradient facets, lightning-bolt spine cutout, glassmorphism edge highlights, neon tip glow, and particle quill dust.",
};

const versions = [
  {
    id: "mark",
    file: "/logos/wayalabs-mark.svg",
    name: "WayaLabs Mark (Production)",
    description: "Final production mark. Wired into Navbar, Footer, and favicon.",
    recommended: true,
  },
  {
    id: "f1",
    file: "/logos/feather-1.svg",
    name: "Feather Flow",
    description: "Single flowing feather mark with gradient mass and strong cut channels.",
    recommended: false,
  },
  {
    id: "f2",
    file: "/logos/feather-2.svg",
    name: "Feather Outline",
    description: "Dark premium contour with accent edge stroke and inner shard.",
    recommended: false,
  },
  {
    id: "f3",
    file: "/logos/feather-3.svg",
    name: "Feather Prism",
    description: "Geometric feather with faceted color panels. Distinctive and campaign-friendly.",
    recommended: false,
  },
  {
    id: "a",
    file: "/logos/macaw-a.svg",
    name: "Origin (Macaw)",
    description: "Bold gradient silhouette. Blue → purple → cyan fill with a radial backglow.",
    recommended: false,
  },
  {
    id: "b",
    file: "/logos/macaw-b.svg",
    name: "Neon (Macaw)",
    description: "Dark-disc background with a glowing gradient outline and sharp crest spikes.",
    recommended: false,
  },
  {
    id: "c",
    file: "/logos/macaw-c.svg",
    name: "Prism (Macaw)",
    description: "Geometric colour-block panels in brand accent hues.",
    recommended: false,
  },
];

const prismColorways = [
  {
    id: "prism-sunset",
    file: "/logos/feather-3-sunset.svg",
    name: "Sunset",
    palette: "#FF8A3D / #FF4D6D / #7C4DFF",
  },
  {
    id: "prism-forest",
    file: "/logos/feather-3-forest.svg",
    name: "Forest",
    palette: "#34D399 / #10B981 / #06B6D4",
  },
  {
    id: "prism-gold",
    file: "/logos/feather-3-gold.svg",
    name: "Gold",
    palette: "#F6C453 / #F59E0B / #D97706",
  },
  {
    id: "prism-ice",
    file: "/logos/feather-3-ice.svg",
    name: "Ice",
    palette: "#D9E6FF / #8FB3FF / #5B7BE3",
  },
];

export const metadata = {
  title: "Logo Preview — WayaLabs Dev",
  robots: { index: false, follow: false },
};

export default function LogosPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted mb-3 block">
            Internal — Dev Preview
          </span>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Logo Mark — <span className="gradient-text">Production Mark Selected</span>
          </h1>
          <p className="text-muted max-w-xl leading-relaxed">
            Final mark chosen and wired into the site. Brand palette: blue{" "}
            <code className="text-[#4f8ef7]">#4f8ef7</code>, purple{" "}
            <code className="text-[#9b6dff]">#9b6dff</code>, cyan{" "}
            <code className="text-[#22d3ee]">#22d3ee</code>.
          </p>
        </div>

        {/* ── FINAL PRODUCTION MARK hero showcase ── */}
        <div className="rounded-2xl border border-[#4f8ef740] bg-card overflow-hidden mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Dark stage — large mark */}
            <div className="bg-[#000000] flex items-center justify-center py-16 px-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={finalMark.file}
                alt="WayaLabs production logo mark"
                width={180}
                height={180}
              />
            </div>

            {/* Details */}
            <div className="p-10 flex flex-col justify-center gap-6">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#4f8ef720] text-[#4f8ef7] border border-[#4f8ef740] mb-4 inline-block">
                  Production Mark
                </span>
                <h2 className="text-2xl font-bold mt-2 mb-2">{finalMark.name}</h2>
                <p className="text-sm text-muted leading-relaxed">{finalMark.description}</p>
              </div>

              {/* Lockups */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">Lockup preview</p>
                <div className="flex items-center gap-2.5 bg-[#06060e] rounded-xl px-4 py-3 border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={finalMark.file} alt="" aria-hidden width={32} height={32} />
                  <span className="font-semibold text-foreground tracking-tight">WayaLabs</span>
                </div>
                <div className="flex items-center gap-2 bg-[#06060e] rounded-xl px-3 py-2.5 border border-border w-fit">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={finalMark.file} alt="" aria-hidden width={22} height={22} />
                  <span className="font-semibold text-foreground tracking-tight text-sm">WayaLabs</span>
                </div>
              </div>

              {/* Scalability ring */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Scalability (64 / 32 / 20 / 16px)</p>
                <div className="flex items-end gap-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={finalMark.file} alt="" width={64} height={64} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={finalMark.file} alt="" width={32} height={32} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={finalMark.file} alt="" width={20} height={20} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={finalMark.file} alt="" width={16} height={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Archive: all mark iterations ── */}
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted mb-6 block">
            Archive — all iterations
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {versions.map((v) => (
              <div
                key={v.id}
                className={`rounded-xl border bg-card overflow-hidden flex flex-col ${
                  v.recommended ? "border-[#4f8ef740]" : "border-border"
                }`}
              >
                <div className="bg-[#06060e] flex items-center justify-center py-6 relative">
                  {v.recommended && (
                    <span className="absolute top-2 right-2 text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-[#4f8ef720] text-[#4f8ef7] border border-[#4f8ef740]">
                      Active
                    </span>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.file} alt={`Logo mark — ${v.name}`} width={72} height={72} />
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold truncate">{v.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prism colorways */}
        <div className="rounded-2xl border border-border bg-card p-8 mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
            F3 Feather Prism Colorways (archive)
          </p>
          <p className="text-sm text-muted mb-6">
            Campaign and social palette explorations.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {prismColorways.map((v) => (
              <div
                key={v.id}
                className="rounded-xl border border-border bg-[#08080f] overflow-hidden"
              >
                <div className="flex items-center justify-center py-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.file} alt={`Feather Prism colorway - ${v.name}`} width={72} height={72} />
                </div>
                <div className="border-t border-border px-3 py-2.5">
                  <p className="text-xs font-semibold mb-0.5">{v.name}</p>
                  <p className="text-[10px] text-muted">{v.palette}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted text-center">
          Internal preview — not linked from the site. Access via <code>/logos</code>. Remove before launch.
        </p>
      </div>
    </div>
  );
}
