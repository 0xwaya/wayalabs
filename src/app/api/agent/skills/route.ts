import { NextResponse } from "next/server";
import { playbooks } from "@/lib/agent/planner";
import { createDefaultRegistry } from "@/lib/agent/skills";

export const runtime = "nodejs";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim() ?? "";
  if (secret.length < 16) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return NextResponse.json({
    goals: Object.keys(playbooks),
    skills: createDefaultRegistry()
      .list()
      .map(({ name, description, risk }) => ({ name, description, risk })),
  });
}
