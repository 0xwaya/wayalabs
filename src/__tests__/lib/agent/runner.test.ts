import { describe, expect, it, vi } from "vitest";
import { createRegistry } from "@/lib/agent/registry";
import { runAgent } from "@/lib/agent/runner";
import type { AgentRun, Skill, SkillResult } from "@/lib/agent/types";

function skill(
  name: string,
  risk: Skill["risk"],
  data: Record<string, unknown> | SkillResult[] = {},
): Skill & { run: ReturnType<typeof vi.fn> } {
  const queue = Array.isArray(data) ? [...data] : null;
  const run = vi.fn(async (): Promise<SkillResult> => {
    if (queue) return queue.shift() ?? { ok: false, error: "empty" };
    return { ok: true, summary: `${name} done`, data: data as Record<string, unknown> };
  });
  return { name, description: name, risk, run };
}

const noSleep = async () => {};

function asRun(result: Awaited<ReturnType<typeof runAgent>>): AgentRun {
  if ("ok" in result) throw new Error(result.error);
  return result;
}

describe("runAgent", () => {
  it("rejects unknown goals", async () => {
    const result = await runAgent({ goal: "nope", env: {} });
    expect(result).toMatchObject({ ok: false, status: 400 });
  });

  it("runs planner decisions in order until finish", async () => {
    const a = skill("crm.snapshot", "read", { openLeads: 0, openCandidates: 0 });
    const run = asRun(
      await runAgent({
        goal: "snapshot",
        env: {},
        registry: createRegistry([a]),
        sleep: noSleep,
      }),
    );
    expect(a.run).toHaveBeenCalledTimes(1);
    expect(run.status).toBe("completed");
    expect(run.steps.map((s) => s.skill)).toEqual(["crm.snapshot"]);
  });

  it("skips write skills on a dry run but still runs reads", async () => {
    const read = skill("crm.snapshot", "read", { openLeads: 1, openCandidates: 0 });
    const source = skill("lead.source", "write", { inserted: 0 });
    const digest = skill("lead.digest", "write");
    const health = skill("site.health", "read", { failing: [] });
    const run = asRun(
      await runAgent({
        goal: "weekday-ops",
        env: {},
        dryRun: true,
        registry: createRegistry([read, health, source, digest]),
        sleep: noSleep,
      }),
    );
    expect(source.run).not.toHaveBeenCalled();
    expect(digest.run).not.toHaveBeenCalled();
    expect(read.run).toHaveBeenCalled();
    expect(run.dryRun).toBe(true);
    expect(run.steps.filter((s) => s.status === "skipped")).toHaveLength(2);
    expect(run.status).toBe("completed");
  });

  it("retries retryable failures once, then succeeds", async () => {
    const flaky = skill("crm.snapshot", "read", [
      { ok: false, error: "blip", retryable: true },
      { ok: true, summary: "ok", data: {} },
    ]);
    const run = asRun(
      await runAgent({
        goal: "snapshot",
        env: {},
        registry: createRegistry([flaky]),
        sleep: noSleep,
      }),
    );
    expect(flaky.run).toHaveBeenCalledTimes(2);
    expect(run.steps[0]).toMatchObject({ status: "ok", attempts: 2 });
  });

  it("does not retry non-retryable failures and marks the run failed", async () => {
    const broken = skill("crm.snapshot", "read", [
      { ok: false, error: "CRM is not configured.", retryable: false },
    ]);
    const run = asRun(
      await runAgent({
        goal: "snapshot",
        env: {},
        registry: createRegistry([broken]),
        sleep: noSleep,
      }),
    );
    expect(broken.run).toHaveBeenCalledTimes(1);
    expect(run.status).toBe("failed");
    expect(run.steps[0].error).toContain("not configured");
  });

  it("captures thrown errors as failed steps", async () => {
    const boom: Skill = {
      name: "crm.snapshot",
      description: "",
      risk: "read",
      run: async () => {
        throw new Error("kaboom");
      },
    };
    const run = asRun(
      await runAgent({
        goal: "snapshot",
        env: {},
        registry: createRegistry([boom]),
        sleep: noSleep,
      }),
    );
    expect(run.steps[0]).toMatchObject({ status: "error", error: "kaboom" });
  });

  it("records an unregistered skill as an error and keeps going", async () => {
    const run = asRun(
      await runAgent({
        goal: "snapshot",
        env: {},
        registry: createRegistry([]),
        sleep: noSleep,
      }),
    );
    expect(run.steps[0]).toMatchObject({ status: "error" });
    expect(run.status).toBe("failed");
  });

  it("stops when the step budget is exhausted", async () => {
    const loop = skill("crm.snapshot", "read");
    const run = asRun(
      await runAgent({
        goal: "custom",
        env: {},
        registry: createRegistry([loop]),
        planner: () => ({ type: "run", skill: "crm.snapshot", reason: "again" }),
        maxSteps: 3,
        sleep: noSleep,
      }),
    );
    expect(loop.run).toHaveBeenCalledTimes(3);
    expect(run.status).toBe("budget_exhausted");
  });

  it("stops when the deadline passes", async () => {
    let t = 0;
    const loop = skill("crm.snapshot", "read");
    const run = asRun(
      await runAgent({
        goal: "custom",
        env: {},
        registry: createRegistry([loop]),
        planner: () => ({ type: "run", skill: "crm.snapshot", reason: "again" }),
        now: () => new Date((t += 1000)),
        deadlineMs: 3500,
        sleep: noSleep,
      }),
    );
    expect(run.status).toBe("budget_exhausted");
    expect(run.summary).toContain("Time budget");
  });
});
