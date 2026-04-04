const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We map your current workflows, identify the highest-leverage AI opportunity, and define measurable success criteria before writing a line of code.",
    duration: "Week 1",
    accent: "#4f8ef7",
  },
  {
    number: "02",
    title: "Prototype",
    description:
      "A working proof-of-concept — not slides. You see the AI behaving on your real data, with feedback loops from your team built into the sprint.",
    duration: "Weeks 2–3",
    accent: "#9b6dff",
  },
  {
    number: "03",
    title: "Deploy",
    description:
      "Production-grade build with observability, guardrails, and integration testing. Every system launches with monitoring and a clear escalation path.",
    duration: "Weeks 4–5",
    accent: "#22d3ee",
  },
  {
    number: "04",
    title: "Optimise",
    description:
      "Post-launch, we run evaluation cycles — reviewing conversation logs, agent traces, and conversion data — to continuously improve output quality.",
    duration: "Ongoing",
    accent: "#4f8ef7",
  },
];

export default function ProcessFramework() {
  return (
    <section className="py-24 px-6 bg-[var(--card)] grid-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
            Delivery Framework
          </p>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            From idea to production in weeks, not months
          </h2>
          <p className="text-[var(--muted)] max-w-xl mx-auto">
            A structured process that starts with outcomes, moves fast, and stays
            accountable at every stage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ number, title, description, duration, accent }, i) => (
            <div key={number} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  aria-hidden
                  className="hidden lg:block absolute top-6 left-[calc(100%+12px)] w-6 border-t border-dashed border-[var(--border)]"
                />
              )}

              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] h-full flex flex-col">
                {/* Step number */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="text-3xl font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${accent}, ${accent}60)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {number}
                  </span>
                  <span className="text-xs border border-[var(--border)] rounded-full px-2 py-0.5 text-[var(--muted)]">
                    {duration}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed flex-1">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
