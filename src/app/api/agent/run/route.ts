import { NextResponse } from "next/server";
import { DEFAULT_GOAL, playbooks } from "@/lib/agent/planner";
import { runAgent } from "@/lib/agent/runner";

export const runtime = "nodejs";
export const maxDuration = 60;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim() ?? "";
  if (secret.length < 16) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

async function respond(goal: string, dryRun: boolean) {
  const run = await runAgent({ goal, dryRun });
  if ("ok" in run) {
    return NextResponse.json({ error: run.error }, { status: run.status });
  }
  return NextResponse.json(run, { status: run.status === "failed" ? 502 : 200 });
}

/** Cron entry point: runs the default weekday-ops goal. */
export async function GET(request: Request) {
  if (!authorized(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return respond(DEFAULT_GOAL, false);
}

/** Operator entry point: `{ "goal": "digest", "dryRun": true }`. */
export async function POST(request: Request) {
  if (!authorized(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const input = (body && typeof body === "object" ? body : {}) as {
    goal?: unknown;
    dryRun?: unknown;
  };

  const goal = typeof input.goal === "string" ? input.goal : DEFAULT_GOAL;
  if (!Object.hasOwn(playbooks, goal)) {
    return NextResponse.json(
      { error: `Unknown goal: ${goal}`, goals: Object.keys(playbooks) },
      { status: 400 },
    );
  }
  return respond(goal, input.dryRun === true);
}
