const architecture = [
  {
    value: "Python",
    label: "CEO orchestrator runtime",
    sub: "Current R&D implementation",
    accent: "#4f8ef7",
  },
  {
    value: "Flask + Socket.IO",
    label: "Dashboard and chat transport",
    sub: "Local executive-agent prototype",
    accent: "#9b6dff",
  },
  {
    value: "LangGraph",
    label: "Stateful agent orchestration",
    sub: "CEO routing with selected roles",
    accent: "#22d3ee",
  },
  {
    value: "Durable jobs",
    label: "Single-process worker model",
    sub: "Persisted status; interrupted work is not replayed",
    accent: "#22d3ee",
  },
];

export default function OutcomeMetrics() {
  return (
    <section className="py-24 px-6 grid-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
            CEO Orchestrator · R&D
          </p>
          <h2 className="text-4xl font-bold tracking-tight">
            Stack and orchestration
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {architecture.map(({ value, label, sub, accent }) => (
            <div
              key={label}
              className="relative p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
            >
              {/* Glow top accent */}
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
              />
              <div
                className="text-4xl font-bold mb-2 gradient-text"
                style={{
                  background: `linear-gradient(135deg, ${accent}, #ffffff90)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {value}
              </div>
              <div className="text-sm font-medium text-[var(--foreground)] mb-1">{label}</div>
              <div className="text-xs text-[var(--muted)]">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
