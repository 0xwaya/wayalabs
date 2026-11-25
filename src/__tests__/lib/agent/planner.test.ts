import { describe, expect, it, vi } from "vitest";
import { createRegistry } from "@/lib/agent/registry";
import { runAgent } from "@/lib/agent/runner";
import type { AgentRun, Skill } from "@/lib/agent/types";

function fake(
  name: string,
  risk: Skill["risk"],
  data: Record<string, unknown> = {},
  ok = true,
): Skill & { run: ReturnType<typeof vi.fn> } {
  const run = vi.fn(async () =>
    ok
      ? { ok: true as const, summary: `${name} done`, data }
      : { ok: false as const, error: `${name} failed`, retryable: false },
  );
  return { name, description: name, risk, run };
}

async function ops(skills: Skill[], env = {}): Promise<AgentRun> {
  const result = await runAgent({
    goal: "weekday-ops",
    env,
    registry: createRegistry(skills),
    sleep: async () => {},
  });
  if ("ok" in result) throw new Error(result.error);
  return result;
}

const names = (run: AgentRun) => run.steps.map((s) => s.skill);

describe("weekday-ops playbook", () => {
  it("sources, then digests, when the backlog is small and there is work", async () => {
    const run = await ops([
      fake("crm.snapshot", "read", { openLeads: 2, openCandidates: 5 }),
      fake("site.health", "read", { failing: [] }),
      fake("lead.source", "write", { inserted: 3 }),
      fake("lead.digest", "write"),
      fake("ops.alert", "write"),
    ]);
    expect(names(run)).toEqual([
      "crm.snapshot",
      "site.health",
      "lead.source",
      "lead.digest",
    ]);
    expect(run.status).toBe("completed");
  });

  it("holds off sourcing when the review backlog is at the limit", async () => {
    const run = await ops(
      [
        fake("crm.snapshot", "read", { openLeads: 0, openCandidates: 40 }),
        fake("site.health", "read", { failing: [] }),
        fake("lead.source", "write"),
        fake("lead.digest", "write"),
      ],
      {},
    );
    expect(names(run)).toEqual(["crm.snapshot", "site.health", "lead.digest"]);
  });

  it("honors AGENT_BACKLOG_LIMIT", async () => {
    const run = await ops(
      [
        fake("crm.snapshot", "read", { openLeads: 0, openCandidates: 3 }),
        fake("site.health", "read", { failing: [] }),
        fake("lead.source", "write", { inserted: 0 }),
        fake("lead.digest", "write"),
      ],
      { AGENT_BACKLOG_LIMIT: "3" },
    );
    expect(names(run)).not.toContain("lead.source");
  });

  it("alerts the operator when pages are failing", async () => {
    const run = await ops([
      fake("crm.snapshot", "read", { openLeads: 0, openCandidates: 0 }),
      fake("site.health", "read", { failing: [{ path: "/", status: 500 }] }),
      fake("lead.source", "write", { inserted: 0 }),
      fake("lead.digest", "write"),
      fake("ops.alert", "write"),
    ]);
    expect(names(run)).toContain("ops.alert");
    expect(names(run).indexOf("ops.alert")).toBeLessThan(
      names(run).indexOf("lead.source"),
    );
  });

  it("skips sourcing and digest when the CRM snapshot fails, but still checks health", async () => {
    const source = fake("lead.source", "write");
    const run = await ops([
      fake("crm.snapshot", "read", {}, false),
      fake("site.health", "read", { failing: [] }),
      source,
      fake("lead.digest", "write"),
    ]);
    expect(source.run).not.toHaveBeenCalled();
    expect(names(run)).toEqual(["crm.snapshot", "site.health"]);
    expect(run.status).toBe("partial");
  });

  it("sends no digest when nothing is open and nothing was sourced", async () => {
    const run = await ops([
      fake("crm.snapshot", "read", { openLeads: 0, openCandidates: 0 }),
      fake("site.health", "read", { failing: [] }),
      fake("lead.source", "write", { inserted: 0 }),
      fake("lead.digest", "write"),
    ]);
    expect(names(run)).not.toContain("lead.digest");
  });
});
