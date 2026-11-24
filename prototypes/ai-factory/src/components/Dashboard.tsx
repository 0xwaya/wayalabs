"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  createSession,
  getFunnelBlockers,
  type FactorySession,
  type PublicState,
} from "@/lib/engine/orchestrator";
import {
  clearPersistedState,
  loadPersistedState,
  savePersistedState,
} from "@/lib/engine/persist";
import { formatUsd } from "@/lib/engine/money";
import type { Agent, Factory, LogEvent, Mission } from "@/lib/engine/types";

type Flash = { id: number; text: string; kind: "level" | "bonus" | "mission" | "income" };

export default function Dashboard({ initial }: { initial: PublicState }) {
  const sessionRef = useRef<FactorySession | null>(null);
  if (!sessionRef.current) {
    sessionRef.current = createSession(initial);
  }

  const [state, setState] = useState<PublicState>(initial);
  const [auto, setAuto] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [flash, setFlash] = useState<Flash | null>(null);
  const [, startTransition] = useTransition();
  const prevRef = useRef({
    commandLevel: initial.commandLevel,
    questsCompleted: initial.questsCompleted ?? 0,
    streak: initial.streak ?? 0,
    lifetimeRevenue: initial.lifetimeRevenue ?? 0,
    nextIncomeGoal: initial.nextIncomeGoal ?? 1000,
  });

  const apply = useCallback((next: PublicState) => {
    const prev = prevRef.current;
    if (next.lifetimeRevenue >= prev.nextIncomeGoal && prev.lifetimeRevenue < prev.nextIncomeGoal) {
      setFlash({
        id: Date.now(),
        kind: "income",
        text: `Income goal hit · ${formatUsd(prev.nextIncomeGoal)} lifetime`,
      });
    } else if (next.commandLevel > prev.commandLevel) {
      setFlash({
        id: Date.now(),
        kind: "level",
        text: `Command level ${next.commandLevel}`,
      });
    } else if ((next.streak ?? 0) > 0 && (next.streak ?? 0) % 3 === 0 && next.streak !== prev.streak) {
      setFlash({
        id: Date.now(),
        kind: "bonus",
        text: `Streak x${next.streak} income surge`,
      });
    } else if ((next.questsCompleted ?? 0) > prev.questsCompleted) {
      const gained = next.lifetimeRevenue - prev.lifetimeRevenue;
      setFlash({
        id: Date.now(),
        kind: "mission",
        text: `Revenue booked · ${formatUsd(gained)}`,
      });
    }
    prevRef.current = {
      commandLevel: next.commandLevel,
      questsCompleted: next.questsCompleted ?? 0,
      streak: next.streak ?? 0,
      lifetimeRevenue: next.lifetimeRevenue ?? 0,
      nextIncomeGoal: next.nextIncomeGoal,
    };
    setState(next);
    savePersistedState(next);
  }, []);

  useEffect(() => {
    const saved = loadPersistedState();
    if (saved) {
      const next = sessionRef.current!.hydrate(saved);
      prevRef.current = {
        commandLevel: next.commandLevel,
        questsCompleted: next.questsCompleted ?? 0,
        streak: next.streak ?? 0,
        lifetimeRevenue: next.lifetimeRevenue ?? 0,
        nextIncomeGoal: next.nextIncomeGoal,
      };
      setState(next);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!flash) return;
    const id = window.setTimeout(() => setFlash(null), 2200);
    return () => window.clearTimeout(id);
  }, [flash]);

  const selected = useMemo(
    () => state.factories.find((f) => f.id === state.selectedFactoryId),
    [state.factories, state.selectedFactoryId],
  );

  const agents = state.agents.filter((a) => a.factoryId === state.selectedFactoryId);
  const missions = state.missions.filter((m) => m.factoryId === state.selectedFactoryId);
  const activeCount = state.missions.filter((m) => m.status === "active").length;
  const tickMs = activeCount > 0 ? 900 : 1500;

  useEffect(() => {
    if (!auto || !hydrated) return;
    const id = window.setInterval(() => {
      startTransition(() => {
        apply(sessionRef.current!.tick());
      });
    }, tickMs);
    return () => window.clearInterval(id);
  }, [auto, apply, hydrated, tickMs]);

  useEffect(() => {
    if (!hydrated) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === "t") {
        e.preventDefault();
        apply(sessionRef.current!.tick());
      } else if (key === "a") {
        e.preventDefault();
        setAuto((v) => !v);
      } else if (key === "r" && e.shiftKey) {
        e.preventDefault();
        clearPersistedState();
        apply(sessionRef.current!.reset());
      } else if (key === "1" || key === "2" || key === "3") {
        const factory = state.factories[Number(key) - 1];
        if (factory?.unlocked) {
          e.preventDefault();
          apply(sessionRef.current!.selectFactory(factory.id));
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [apply, hydrated, state.factories]);

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      {flash ? (
        <div
          className={`flash-banner panel px-4 py-2 text-center text-sm tracking-wider uppercase ${
            flash.kind === "bonus" || flash.kind === "income"
              ? "text-[var(--amber)]"
              : flash.kind === "level"
                ? "text-[var(--magenta)]"
                : "text-[var(--lime)]"
          }`}
          role="status"
        >
          {flash.text}
        </div>
      ) : null}

      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs tracking-[0.35em] text-[var(--cyan)] uppercase">
            Wayalabs · Product Prototype
          </p>
          <h1 className="font-[family-name:var(--font-orbitron)] brand-flicker neon-text mt-1 text-3xl text-[var(--lime)] md:text-5xl">
            AI FACTORY
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--muted)] md:text-base">
            Build{" "}
            <span className="text-[var(--lime)]">factories of agent teams</span>{" "}
            that run{" "}
            <span className="text-[var(--cyan)]">real-world tasks</span> through{" "}
            <span className="text-[var(--amber)]">income funnels</span>. Mock
            USD now — swap crews for live models + real payouts later.
          </p>
          <div className="mt-3 max-w-md">
            <div className="mb-1 flex justify-between text-[10px] tracking-wider text-[var(--muted)] uppercase">
              <span>Lifetime → {formatUsd(state.nextIncomeGoal)}</span>
              <span>
                {Math.min(
                  100,
                  Math.round((state.lifetimeRevenue / state.nextIncomeGoal) * 100),
                )}
                %
              </span>
            </div>
            <div className="bar">
              <span
                style={{
                  width: `${Math.min(100, Math.round((state.lifetimeRevenue / state.nextIncomeGoal) * 100))}%`,
                  background: "linear-gradient(90deg, var(--amber), var(--lime))",
                }}
              />
            </div>
          </div>
        </div>
        <div className="panel flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
          <Stat
            label="CASH"
            value={formatUsd(state.cash)}
            accent="var(--amber)"
            emphasize
          />
          <Stat
            label="LIFETIME"
            value={formatUsd(state.lifetimeRevenue)}
            accent="var(--lime)"
            emphasize
          />
          <Stat label="CMD LVL" value={String(state.commandLevel)} accent="var(--magenta)" />
          <Stat label="STREAK" value={String(state.streak ?? 0)} accent="var(--cyan)" />
          <Stat label="TICK" value={String(state.tick)} accent="var(--muted)" />
          <button
            type="button"
            className={`border px-3 py-1.5 hover:bg-white/5 ${
              auto
                ? "border-[var(--cyan)] text-[var(--cyan)]"
                : "border-[var(--line)] text-[var(--muted)]"
            }`}
            onClick={() => setAuto((v) => !v)}
            title="Toggle auto-tick (A)"
          >
            AUTO {auto ? "ON" : "OFF"}
          </button>
          <button
            type="button"
            className="border border-[var(--line)] px-3 py-1.5 text-[var(--amber)] hover:bg-white/5"
            onClick={() => apply(sessionRef.current!.tick())}
            title="Manual tick (T)"
          >
            TICK
          </button>
          <button
            type="button"
            className="border border-[var(--magenta)]/40 px-3 py-1.5 text-[var(--magenta)] hover:bg-white/5"
            onClick={() => {
              clearPersistedState();
              apply(sessionRef.current!.reset());
            }}
            title="Reset run (Shift+R)"
          >
            RESET
          </button>
        </div>
      </header>

      <section className="panel flex flex-wrap items-stretch gap-2 px-3 py-2">
        {state.factories.map((factory) => (
          <button
            key={`bay-${factory.id}`}
            type="button"
            disabled={!factory.unlocked}
            onClick={() =>
              factory.unlocked && apply(sessionRef.current!.selectFactory(factory.id))
            }
            className={`min-w-[6.5rem] flex-1 border px-3 py-2 text-left transition ${
              factory.id === state.selectedFactoryId
                ? "border-current bg-white/5"
                : "border-[var(--line)] hover:bg-white/5"
            } ${factory.unlocked ? "" : "opacity-40"}`}
            style={{ color: factory.color }}
          >
            <div className="text-[10px] tracking-[0.25em] text-[var(--muted)]">
              {factory.bayLabel}
              {!factory.unlocked ? " · LOCK" : ""}
            </div>
            <div className="font-[family-name:var(--font-orbitron)] text-lg neon-text">
              {formatUsd(factory.revenue)}
            </div>
            <div className="text-[10px] text-[var(--muted)]">
              {state.agents.filter(
                (a) => a.factoryId === factory.id && a.status === "working",
              ).length}{" "}
              live · L{factory.level}
            </div>
          </button>
        ))}
        <div className="min-w-[6.5rem] flex-1 border border-[var(--line)] px-3 py-2">
          <div className="text-[10px] tracking-[0.25em] text-[var(--muted)]">CREWS</div>
          <div className="font-[family-name:var(--font-orbitron)] text-lg text-[var(--cyan)]">
            {state.agents.filter((a) => a.status !== "locked").length}
            <span className="text-sm text-[var(--muted)]">
              /{state.agents.length}
            </span>
          </div>
          <div className="text-[10px] text-[var(--muted)]">
            {activeCount} funnel{activeCount === 1 ? "" : "s"} live
          </div>
        </div>
      </section>

      {activeCount > 0 ? (
        <div className="flex flex-wrap gap-2 text-[10px] tracking-wider uppercase text-[var(--muted)]">
          <span className="text-[var(--lime)]">
            {activeCount} active funnel{activeCount > 1 ? "s" : ""}
          </span>
          {state.missions
            .filter((m) => m.status === "active")
            .map((m) => {
              const fx = state.factories.find((f) => f.id === m.factoryId);
              return (
                <button
                  key={m.id}
                  type="button"
                  className="border border-[var(--line)] px-2 py-1 hover:bg-white/5"
                  style={{ borderColor: fx?.color }}
                  onClick={() => apply(sessionRef.current!.selectFactory(m.factoryId))}
                >
                  {fx?.bayLabel}: {m.title} · {m.progress}% · {formatUsd(m.revenueReward)}
                </button>
              );
            })}
        </div>
      ) : null}

      <section className="grid gap-3 md:grid-cols-3">
        {state.factories.map((factory, index) => (
          <FactoryCard
            key={factory.id}
            factory={factory}
            active={factory.id === state.selectedFactoryId}
            working={state.agents.some(
              (a) => a.factoryId === factory.id && a.status === "working",
            )}
            crewOnline={
              state.agents.filter(
                (a) => a.factoryId === factory.id && a.status !== "locked",
              ).length
            }
            hotkey={String(index + 1)}
            onSelect={() => apply(sessionRef.current!.selectFactory(factory.id))}
          />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-4">
          <div className={`panel p-4 ${selected ? "live" : ""}`}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-[family-name:var(--font-orbitron)] text-lg tracking-wide text-[var(--cyan)]">
                Room Crew · {selected?.name ?? "—"}
              </h2>
              <span className="text-xs text-[var(--muted)]">
                {agents.filter((a) => a.status === "working").length} live · bay{" "}
                {formatUsd(selected?.revenue ?? 0)}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  color={selected?.color}
                  factoryLevel={selected?.level}
                />
              ))}
            </div>
          </div>

          <div className="panel p-4">
            <h2 className="font-[family-name:var(--font-orbitron)] mb-3 text-lg tracking-wide text-[var(--lime)]">
              Income Funnels
            </h2>
            <div className="flex flex-col gap-3">
              {missions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  blockers={getFunnelBlockers(state, mission.id)}
                  factoryLevel={selected?.level ?? 1}
                  onStart={() =>
                    apply(sessionRef.current!.startMission(mission.id))
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <aside className="panel flex max-h-[42rem] flex-col p-4">
          <h2 className="font-[family-name:var(--font-orbitron)] mb-3 text-lg tracking-wide text-[var(--magenta)]">
            Orchestrator Log
          </h2>
          <div className="flex-1 space-y-2 overflow-y-auto pr-1 text-sm">
            {state.logs.map((log) => (
              <LogRow key={log.id} log={log} />
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">
            Keys: T tick · A auto · 1–3 factory · Shift+R reset. Working agents
            burn opex — keep cash flowing. Signal Hub unlocks at ~$1,600
            lifetime (command 3).
          </p>
        </aside>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  emphasize,
}: {
  label: string;
  value: string;
  accent: string;
  emphasize?: boolean;
}) {
  return (
    <div className={emphasize ? "min-w-[5.5rem]" : "min-w-[3.75rem]"}>
      <div className="text-[10px] tracking-[0.2em] text-[var(--muted)]">{label}</div>
      <div
        className={`font-[family-name:var(--font-orbitron)] ${emphasize ? "text-2xl neon-text" : "text-xl"}`}
        style={{ color: accent }}
      >
        {value}
      </div>
    </div>
  );
}

function FactoryCard({
  factory,
  active,
  working,
  crewOnline,
  hotkey,
  onSelect,
}: {
  factory: Factory;
  active: boolean;
  working: boolean;
  crewOnline: number;
  hotkey: string;
  onSelect: () => void;
}) {
  const pct = Math.round((factory.xp / factory.xpToNext) * 100);
  return (
    <button
      type="button"
      disabled={!factory.unlocked}
      onClick={onSelect}
      className={`panel text-left transition ${
        active ? "live" : ""
      } ${working ? "agent-pulse" : ""} ${factory.unlocked ? "hover:bg-white/5" : "opacity-45"} p-4`}
      style={{ borderColor: active || working ? factory.color : undefined }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="font-[family-name:var(--font-orbitron)] text-sm tracking-wider"
          style={{ color: factory.color }}
        >
          {factory.name}
        </span>
        <span className="text-[10px] tracking-widest text-[var(--muted)] uppercase">
          {factory.unlocked ? `LVL ${factory.level}` : `LOCK @ CMD ${factory.unlockLevel}`}
          <span className="ml-2 opacity-50">[{hotkey}]</span>
        </span>
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">{factory.tagline}</p>
      <p className="mt-1 text-[11px]" style={{ color: factory.color }}>
        {formatUsd(factory.revenue)} booked · {crewOnline} agents online
      </p>
      {factory.unlocked ? (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[10px] text-[var(--muted)]">
            <span>
              XP {factory.xp}/{factory.xpToNext}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="bar">
            <span style={{ width: `${pct}%`, background: factory.color }} />
          </div>
        </div>
      ) : null}
    </button>
  );
}

function AgentCard({
  agent,
  color,
  factoryLevel,
}: {
  agent: Agent;
  color?: string;
  factoryLevel?: number;
}) {
  return (
    <div
      className={`border border-[var(--line)] bg-black/25 p-3 ${
        agent.status === "working" ? "agent-pulse" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-[family-name:var(--font-orbitron)] text-sm" style={{ color }}>
            {agent.name}
          </div>
          <div className="text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
            {agent.role} · L{agent.level}
          </div>
        </div>
        <StatusPill status={agent.status} />
      </div>
      <p className="mt-2 min-h-[2.5rem] text-xs text-[var(--muted)]">
        {agent.status === "locked"
          ? `Locked — bay must reach L${agent.unlockLevel} (now L${factoryLevel ?? 1})`
          : (agent.lastTask ?? "Standing by for orchestrator route")}
      </p>
      {agent.status !== "locked" ? (
        <div className="bar mt-2">
          <span style={{ width: `${agent.progress}%` }} />
        </div>
      ) : null}
    </div>
  );
}

function StatusPill({ status }: { status: Agent["status"] }) {
  const map: Record<Agent["status"], string> = {
    idle: "text-[var(--muted)] border-[var(--muted)]/40",
    queued: "text-[var(--amber)] border-[var(--amber)]/40",
    working: "text-[var(--lime)] border-[var(--lime)]/50",
    done: "text-[var(--cyan)] border-[var(--cyan)]/40",
    error: "text-red-400 border-red-400/40",
    locked: "text-[var(--magenta)] border-[var(--magenta)]/40",
  };
  return (
    <span className={`border px-1.5 py-0.5 text-[10px] tracking-wider uppercase ${map[status]}`}>
      {status}
    </span>
  );
}

function MissionCard({
  mission,
  blockers,
  factoryLevel,
  onStart,
}: {
  mission: Mission;
  blockers: ReturnType<typeof getFunnelBlockers>;
  factoryLevel: number;
  onStart: () => void;
}) {
  const isActive = mission.status === "active";
  const lockedRoles = blockers.filter((b) => b.code === "locked_role");
  const ready = !isActive && blockers.length === 0;
  const lockHint =
    lockedRoles[0]?.message ??
    blockers.find((b) => b.code === "active" || b.code === "cash")?.message;

  return (
    <div
      className={`border bg-black/20 p-3 ${
        isActive ? "live border-[var(--lime)]/40" : "border-[var(--line)]"
      } ${!ready && !isActive ? "opacity-70" : ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="font-[family-name:var(--font-orbitron)] text-sm text-[var(--fg)]">
            {mission.title}
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">{mission.brief}</p>
          <p className="mt-2 text-[10px] tracking-wider text-[var(--amber)] uppercase">
            Payout · {formatUsd(mission.revenueReward)} · +{mission.xpReward} XP ·{" "}
            {mission.requiredRoles.join(" · ")}
          </p>
          {!ready && !isActive && lockHint ? (
            <p className="mt-2 text-[11px] text-[var(--magenta)]">{lockHint}</p>
          ) : null}
        </div>
        {isActive ? (
          <span className="text-[10px] tracking-wider text-[var(--lime)] uppercase">
            running · {mission.progress}%
          </span>
        ) : ready ? (
          <button
            type="button"
            onClick={onStart}
            className="shrink-0 border border-[var(--lime)]/50 px-3 py-1.5 text-xs tracking-wider text-[var(--lime)] uppercase hover:bg-[var(--lime)]/10"
          >
            Launch
          </button>
        ) : (
          <span className="shrink-0 border border-[var(--magenta)]/40 px-2 py-1 text-[10px] tracking-wider text-[var(--magenta)] uppercase">
            {lockedRoles.length > 0 ? `lock · bay L${factoryLevel}` : "blocked"}
          </span>
        )}
      </div>
      {isActive ? (
        <>
          <ol className="mt-3 space-y-1">
            {mission.steps.map((step, index) => {
              const done = mission.stepIndex > index;
              const current = mission.stepIndex === index;
              return (
                <li
                  key={step}
                  className={`text-[11px] ${
                    done
                      ? "text-[var(--lime)]/80"
                      : current
                        ? "text-[var(--cyan)]"
                        : "text-[var(--muted)]/70"
                  }`}
                >
                  <span className="mr-2 font-[family-name:var(--font-orbitron)] text-[10px]">
                    {done ? "◆" : current ? "▸" : "◇"}
                  </span>
                  {step}
                </li>
              );
            })}
          </ol>
          <div className="mt-3">
            <div className="bar">
              <span style={{ width: `${mission.progress}%` }} />
            </div>
          </div>
        </>
      ) : (
        <p className="mt-2 text-[10px] tracking-wider text-[var(--muted)] uppercase">
          {mission.steps.length} steps
        </p>
      )}
    </div>
  );
}

function LogRow({ log }: { log: LogEvent }) {
  const kindColor: Record<LogEvent["kind"], string> = {
    system: "text-[var(--muted)]",
    route: "text-[var(--cyan)]",
    agent: "text-[var(--lime)]",
    mission: "text-[var(--amber)]",
    level: "text-[var(--magenta)]",
    bonus: "text-[var(--amber)]",
  };
  return (
    <div className="border-l-2 border-[var(--line)] pl-3 text-[var(--muted)] log-in">
      <span className={`mr-2 text-[10px] tracking-wider uppercase ${kindColor[log.kind]}`}>
        {log.kind}
      </span>
      <span className="text-[var(--fg)]/90">{log.message}</span>
    </div>
  );
}
