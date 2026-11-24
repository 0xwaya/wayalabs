"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PublicState } from "@/lib/engine/orchestrator";
import type { Agent, Factory, Mission } from "@/lib/engine/types";

async function postAction(body: Record<string, string>) {
  const res = await fetch("/api/factory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("action failed");
  return (await res.json()) as PublicState;
}

export default function Dashboard({ initial }: { initial: PublicState }) {
  const [state, setState] = useState(initial);
  const [auto, setAuto] = useState(true);
  const [busy, setBusy] = useState(false);

  const selected = useMemo(
    () => state.factories.find((f) => f.id === state.selectedFactoryId),
    [state.factories, state.selectedFactoryId],
  );

  const agents = state.agents.filter((a) => a.factoryId === state.selectedFactoryId);
  const missions = state.missions.filter((m) => m.factoryId === state.selectedFactoryId);

  const run = useCallback(async (body: Record<string, string>) => {
    setBusy(true);
    try {
      const next = await postAction(body);
      setState(next);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => {
      void run({ action: "tick" });
    }, 1600);
    return () => window.clearInterval(id);
  }, [auto, run]);

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs tracking-[0.35em] text-[var(--cyan)] uppercase">
            Wayalabs · Product Prototype
          </p>
          <h1 className="font-[family-name:var(--font-orbitron)] brand-flicker neon-text mt-1 text-3xl text-[var(--lime)] md:text-5xl">
            AI FACTORY
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--muted)] md:text-base">
            Gamified multi-agent orchestration. Mock agents run quests across
            independent business factories — swap them for real models later.
          </p>
        </div>
        <div className="panel flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
          <Stat label="CMD LVL" value={String(state.commandLevel)} accent="var(--magenta)" />
          <Stat label="GLOBAL XP" value={String(state.globalXp)} accent="var(--cyan)" />
          <Stat label="TICK" value={String(state.tick)} accent="var(--lime)" />
          <button
            type="button"
            className="border border-[var(--line)] px-3 py-1.5 text-[var(--cyan)] hover:bg-white/5"
            onClick={() => setAuto((v) => !v)}
          >
            AUTO {auto ? "ON" : "OFF"}
          </button>
          <button
            type="button"
            disabled={busy}
            className="border border-[var(--line)] px-3 py-1.5 text-[var(--amber)] hover:bg-white/5 disabled:opacity-40"
            onClick={() => void run({ action: "tick" })}
          >
            TICK
          </button>
          <button
            type="button"
            disabled={busy}
            className="border border-[var(--magenta)]/40 px-3 py-1.5 text-[var(--magenta)] hover:bg-white/5 disabled:opacity-40"
            onClick={() => void run({ action: "reset" })}
          >
            RESET
          </button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        {state.factories.map((factory) => (
          <FactoryCard
            key={factory.id}
            factory={factory}
            active={factory.id === state.selectedFactoryId}
            onSelect={() =>
              void run({ action: "selectFactory", factoryId: factory.id })
            }
          />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-4">
          <div className={`panel p-4 ${selected ? "live" : ""}`}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-[family-name:var(--font-orbitron)] text-lg tracking-wide text-[var(--cyan)]">
                Agent Grid · {selected?.name ?? "—"}
              </h2>
              <span className="text-xs text-[var(--muted)]">
                {agents.filter((a) => a.status === "working").length} working
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} color={selected?.color} />
              ))}
            </div>
          </div>

          <div className="panel p-4">
            <h2 className="font-[family-name:var(--font-orbitron)] mb-3 text-lg tracking-wide text-[var(--lime)]">
              Quest Board
            </h2>
            <div className="flex flex-col gap-3">
              {missions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  busy={busy}
                  onStart={() =>
                    void run({ action: "startMission", missionId: mission.id })
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
              <div
                key={log.id}
                className="border-l-2 border-[var(--line)] pl-3 text-[var(--muted)]"
              >
                <span className="mr-2 text-[10px] tracking-wider text-[var(--cyan)] uppercase">
                  {log.kind}
                </span>
                <span className="text-[var(--fg)]/90">{log.message}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">
            Loop: start a quest → tick advances agents → XP levels the factory →
            unlock tools. Signal Hub opens at command level 3.
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
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="min-w-[4.5rem]">
      <div className="text-[10px] tracking-[0.2em] text-[var(--muted)]">{label}</div>
      <div className="font-[family-name:var(--font-orbitron)] text-xl" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}

function FactoryCard({
  factory,
  active,
  onSelect,
}: {
  factory: Factory;
  active: boolean;
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
      } ${factory.unlocked ? "hover:bg-white/5" : "opacity-45"} p-4`}
      style={{ borderColor: active ? factory.color : undefined }}
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
        </span>
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">{factory.tagline}</p>
      {factory.unlocked ? (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[10px] text-[var(--muted)]">
            <span>XP {factory.xp}/{factory.xpToNext}</span>
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

function AgentCard({ agent, color }: { agent: Agent; color?: string }) {
  return (
    <div className="border border-[var(--line)] bg-black/25 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-[family-name:var(--font-orbitron)] text-sm" style={{ color }}>
            {agent.name}
          </div>
          <div className="text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
            {agent.role}
          </div>
        </div>
        <StatusPill status={agent.status} />
      </div>
      <p className="mt-2 min-h-[2.5rem] text-xs text-[var(--muted)]">
        {agent.status === "locked"
          ? `Unlocks at factory level ${agent.unlockLevel}`
          : agent.lastTask ?? "Standing by for orchestrator route"}
      </p>
      <div className="bar mt-2">
        <span style={{ width: `${agent.progress}%` }} />
      </div>
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
  onStart,
  busy,
}: {
  mission: Mission;
  onStart: () => void;
  busy: boolean;
}) {
  const canStart = mission.status === "available";
  return (
    <div className="border border-[var(--line)] bg-black/20 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="font-[family-name:var(--font-orbitron)] text-sm text-[var(--fg)]">
            {mission.title}
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">{mission.brief}</p>
          <p className="mt-2 text-[10px] tracking-wider text-[var(--cyan)] uppercase">
            Roles · {mission.requiredRoles.join(" · ")} · +{mission.xpReward} XP
          </p>
        </div>
        {canStart ? (
          <button
            type="button"
            disabled={busy}
            onClick={onStart}
            className="border border-[var(--lime)]/50 px-3 py-1.5 text-xs tracking-wider text-[var(--lime)] uppercase hover:bg-[var(--lime)]/10 disabled:opacity-40"
          >
            Launch
          </button>
        ) : (
          <span className="text-[10px] tracking-wider text-[var(--amber)] uppercase">
            {mission.status}
          </span>
        )}
      </div>
      {(mission.status === "active" || mission.status === "completed") && (
        <div className="mt-3">
          <div className="bar">
            <span style={{ width: `${mission.progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
