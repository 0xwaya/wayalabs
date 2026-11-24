import { NextResponse } from "next/server";
import { runLeadSourceJob } from "@/lib/leads/source-job";

export const runtime = "nodejs";
export const maxDuration = 60;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim() ?? "";
  if (secret.length < 16) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

/**
 * Weekday outbound sourcer (SBA FOIA + AI/automation intent news).
 * Files candidates for the operator. Does not contact companies.
 */
export async function GET(request: Request) {
  if (!authorized(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await runLeadSourceJob();
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({
    ok: true,
    sbaFetched: result.sbaFetched,
    aiFetched: result.aiFetched,
    inserted: result.inserted,
    emailed: result.emailed,
  });
}
