import { describe, expect, it, vi } from "vitest";
import { createLlmPlanner, parseDecision } from "@/lib/agent/llm-planner";
import { createRegistry } from "@/lib/agent/registry";
import { runAgent } from "@/lib/agent/runner";
import type { AgentRun, AgentState, Skill } from "@/lib/agent/types";

function fake(name: string, risk: Skill["risk"], data = {}): Skill & { run: ReturnType<typeof vi.fn> } {
  const run = vi.fn(async () => ({ ok: true as const, summary: `${name} done`, data }));
  return { name, description: name, risk, run };
}

function modelReplies(...replies: unknown[]) {
  const queue = [...replies];
  return vi.fn(async () => {
    const next = queue.shift();
    if (next instanceof Error) throw next;
    if (typeof next === "number") return new Response("", { status: next });
    return new Response(
      JSON.stringify({ choices: [{ message: { content: typeof next === "string" ? next : JSON.stringify(next) } }] }),
      { status: 200 },
    );
  });
}

const env = { XAI_API_KEY: "xai-test" };

function skills() {
  return [
    fake("crm.snapshot", "read", { openLeads: 1, openCandidates: 2 }),
    fake("site.health", "read", { failing: [] }),
    fake("lead.source", "write", { inserted: 0 }),
    fake("lead.digest", "write"),
    fake("ops.alert", "write"),
  ];
}

async function auto(fetchImpl: ReturnType<typeof vi.fn>, extra: Partial<Parameters<typeof runAgent>[0]> = {}) {
  const list = skills();
  const result = await runAgent({
    goal: "auto",
    env,
    fetchImpl: fetchImpl as unknown as typeof fetch,
    registry: createRegistry(list),
    sleep: async () => {},
    ...extra,
  });
  if ("ok" in result) throw new Error(result.error);
  return { run: result as AgentRun, list };
}

describe("parseDecision", () => {
  const registry = createRegistry(skills());
  const state: AgentState = { goal: "auto", env: {}, steps: [] };

  it("accepts a registered skill and a finish", () => {
    expect(parseDecision('{"action":"run","skill":"site.health","reason":"x"}', state, registry)).toMatchObject({ ok: true });
    expect(parseDecision('{"action":"finish","summary":"done"}', state, registry)).toMatchObject({
      ok: true,
      decision: { type: "finish", summary: "done" },
    });
  });

  it("rejects non-JSON, unknown skills, and repeats", () => {
    expect(parseDecision("hello", state, registry)).toMatchObject({ ok: false });
    expect(parseDecision('{"action":"run","skill":"email.leads"}', state, registry)).toMatchObject({ ok: false });
    const ran: AgentState = {
      ...state,
      steps: [{ skill: "site.health", reason: "", risk: "read", status: "ok", attempts: 1, durationMs: 0, summary: "" }],
    };
    expect(parseDecision('{"action":"run","skill":"site.health"}', ran, registry)).toMatchObject({ ok: false });
  });
});

describe("goal auto", () => {
  it("lets the model choose the skills and order", async () => {
    const fetchImpl = modelReplies(
      { action: "run", skill: "site.health", reason: "check first" },
      { action: "run", skill: "crm.snapshot", reason: "then backlog" },
      { action: "finish", summary: "all good" },
    );
    const { run, list } = await auto(fetchImpl);
    expect(run.planner).toBe("llm");
    expect(run.steps.map((s) => s.skill)).toEqual(["site.health", "crm.snapshot"]);
    expect(run.steps[0].reason).toBe("check first");
    expect(run.summary).toBe("all good");
    expect(list[2].run).not.toHaveBeenCalled();
  });

  it("sends the objective and prior results to the model", async () => {
    const fetchImpl = modelReplies(
      { action: "run", skill: "crm.snapshot", reason: "r" },
      { action: "finish", summary: "ok" },
    );
    await auto(fetchImpl, { objective: "Only look, do not change anything." });
    const calls = fetchImpl.mock.calls as unknown as [string, RequestInit][];
    expect(calls[0][0]).toBe("https://api.x.ai/v1/chat/completions");
    const first = JSON.parse(calls[0][1].body as string);
    expect(first.messages[1].content).toContain("Only look, do not change anything.");
    const second = JSON.parse(calls[1][1].body as string);
    expect(second.messages[1].content).toContain("crm.snapshot -> ok");
  });

  it("falls back to the rules when the model errors or replies badly", async () => {
    const fetchImpl = modelReplies(500, "not json", new Error("net"));
    const { run } = await auto(fetchImpl);
    expect(run.steps[0].skill).toBe("crm.snapshot");
    expect(run.steps[0].reason).toContain("rules fallback");
  });

  it("falls back to rules entirely without an API key", async () => {
    const fetchImpl = vi.fn();
    const { run } = await auto(fetchImpl, { env: {} });
    expect(run.planner).toBe("rules");
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(run.steps[0].skill).toBe("crm.snapshot");
  });

  it("still skips write skills on a dry run", async () => {
    const fetchImpl = modelReplies(
      { action: "run", skill: "lead.digest", reason: "send it" },
      { action: "finish", summary: "ok" },
    );
    const { run, list } = await auto(fetchImpl, { dryRun: true });
    expect(list[3].run).not.toHaveBeenCalled();
    expect(run.steps[0].status).toBe("skipped");
  });

  it("honors AGENT_LLM_BASE_URL and AGENT_MODEL", async () => {
    const fetchImpl = modelReplies({ action: "finish", summary: "ok" });
    const planner = createLlmPlanner({
      registry: createRegistry(skills()),
      env: { ...env, AGENT_LLM_BASE_URL: "https://gw.test/v1/", AGENT_MODEL: "grok-x" },
      fetchImpl: fetchImpl as unknown as typeof fetch,
      fallback: () => ({ type: "finish", summary: "fb" }),
    });
    await planner({ goal: "auto", env: {}, steps: [] });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://gw.test/v1/chat/completions");
    expect(JSON.parse(init.body as string).model).toBe("grok-x");
  });
});
