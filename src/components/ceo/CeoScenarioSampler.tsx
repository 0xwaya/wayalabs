"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from "lucide-react";

const turns = [
  {
    role: "INTAKE",
    title: "A structured scenario enters the graph",
    text: "The dashboard collects explicit company context, budget, timeline, and objectives. Incomplete inputs are rejected before analysis starts. This walkthrough uses a fictional small-business scenario; it is not a live execution.",
  },
  {
    role: "PROMPT EXPERT → CEO",
    title: "Interpret intent and choose a route",
    text: "A Prompt Expert structures the request. CEO routing produces an objective-linked dispatch plan so only relevant directors and specialists are selected, rather than running every role by default.",
  },
  {
    role: "CTO",
    title: "Review the execution baseline",
    text: "CTO review follows CEO routing. It checks technical scope and assumptions before selected domain agents continue. Additional directors run only when the requested objectives call for them.",
  },
  {
    role: "DIRECTORS + SPECIALISTS",
    title: "Run selected work in sequence",
    text: "Selected LangGraph nodes produce scenario-specific analysis. Durable jobs expose queued, running, completed, failed, or interrupted status; a restart does not silently replay work.",
  },
  {
    role: "REVIEW + ARTIFACTS",
    title: "Return proposals for human review",
    text: "The dashboard stores owner-scoped JSON and Markdown artifacts with hashes. Model output is a proposal, not an executed business action. Exports require a separate approval; generated source is not run on the dashboard host.",
  },
];

const stack: Array<[string, string]> = [
  ["Runtime", "Python · Flask · Socket.IO"],
  ["Orchestration", "LangGraph state graph · executive routing"],
  ["Model access", "Configured provider · verified pricing required"],
  ["Operations", "SQLite durable jobs · single worker process"],
  ["Controls", "Named auth · owner-scoped artifacts · approval gates"],
];

export default function CeoScenarioSampler() {
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const isPlaying = playing && activeStep < turns.length - 1;
  const turn = turns[activeStep];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, turns.length - 1));
    }, 5000);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  function reset() {
    setPlaying(false);
    setActiveStep(0);
  }

  return (
    <div className="min-h-screen">
      <section className="py-12 px-6 border-b border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/case-studies/openclaw-agent"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-7"
          >
            <ArrowLeft size={15} /> OpenClaw project note
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#22d3ee]">
              State-of-the-art orchestration R&D
            </span>
            <span className="text-xs border border-amber-400/40 text-amber-200 px-2.5 py-1 rounded-full">
              Currently under research and development
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold max-w-3xl">
            CEO Executive Orchestrator
          </h1>
          <p className="mt-4 text-[var(--muted)] leading-relaxed max-w-2xl">
            Explore the stack and orchestration flow behind a Python, Flask, and
            LangGraph executive-agent prototype. The walkthrough is an architecture
            explainer, not a live run or production deployment.
          </p>
        </div>
      </section>

      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,0.8fr)] gap-10">
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                  Orchestration walkthrough
                </p>
                <h2 className="text-xl font-semibold mt-1">From structured input to reviewed artifacts</h2>
              </div>
              <span className="font-mono text-sm text-[var(--muted)]" aria-live="polite">
                {String(activeStep + 1).padStart(2, "0")} / {String(turns.length).padStart(2, "0")}
              </span>
            </div>

            <div className="border-y border-[var(--border)] py-8 min-h-64" aria-live="polite">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-semibold text-[#22d3ee] border border-[#22d3ee]/30 px-2.5 py-1 rounded-full">
                  {turn.role}
                </span>
                <h3 className="text-lg font-semibold">{turn.title}</h3>
              </div>
              <p className="text-lg leading-relaxed max-w-2xl">{turn.text}</p>
            </div>

            <div
              className="h-1 bg-[var(--border)] mt-6 mb-5"
              role="progressbar"
              aria-label="Scenario progress"
              aria-valuemin={1}
              aria-valuemax={turns.length}
              aria-valuenow={activeStep + 1}
            >
              <div
                className="h-full bg-[#22d3ee] transition-[width] duration-300 motion-reduce:transition-none"
                style={{ width: `${((activeStep + 1) / turns.length) * 100}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveStep((current) => Math.max(0, current - 1))}
                disabled={activeStep === 0}
                className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-2 text-sm disabled:opacity-40 hover:bg-[var(--card)]"
                aria-label="Previous scenario step"
              >
                <ArrowLeft size={15} /> Previous
              </button>
              {isPlaying ? (
                <button
                  type="button"
                  onClick={() => setPlaying(false)}
                  className="inline-flex items-center gap-2 bg-[#22d3ee] text-[#061018] px-3 py-2 text-sm font-semibold"
                  aria-label="Pause scenario playback"
                >
                  <Pause size={15} /> Pause
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  disabled={reducedMotion || activeStep === turns.length - 1}
                  className="inline-flex items-center gap-2 bg-[#22d3ee] text-[#061018] px-3 py-2 text-sm font-semibold disabled:opacity-40"
                  aria-label="Play scenario playback"
                  title={reducedMotion ? "Automatic playback is off for reduced motion" : undefined}
                >
                  <Play size={15} /> Play
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveStep((current) => Math.min(turns.length - 1, current + 1))}
                disabled={activeStep === turns.length - 1}
                className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-2 text-sm disabled:opacity-40 hover:bg-[var(--card)]"
                aria-label="Next scenario step"
              >
                Next <ArrowRight size={15} />
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--card)]"
                aria-label="Reset scenario playback"
              >
                <RotateCcw size={15} /> Reset
              </button>
            </div>
            {reducedMotion && (
              <p className="mt-3 text-xs text-[var(--muted)]">
                Automatic playback is disabled by your reduced-motion setting. Use the step controls.
              </p>
            )}
          </div>

          <aside className="border-t lg:border-t-0 lg:border-l border-[var(--border)] pt-6 lg:pt-0 lg:pl-8">
            <p className="text-xs uppercase tracking-widest text-[var(--muted)] mb-5">
              Stack and controls
            </p>
            <dl className="divide-y divide-[var(--border)]">
              {stack.map(([label, value]) => (
                <div className="py-3" key={label}>
                  <dt className="text-xs text-[var(--muted)]">{label}</dt>
                  <dd className="mt-1 text-sm">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs text-[var(--muted)] leading-relaxed">
              Prototype capabilities and deployment status can change. Metered calls
              require configured, verified model pricing. Cost values are estimates,
              not provider invoices.
            </p>
            <Link
              href="/case-studies/openclaw-agent"
              className="inline-flex items-center gap-2 mt-7 text-sm text-[#22d3ee] hover:opacity-80"
            >
              About the separate OpenClaw exploration <ArrowRight size={14} />
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}