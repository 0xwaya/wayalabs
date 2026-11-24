import { NextResponse } from "next/server";
import { runLeadDigest } from "@/lib/leads/digest";

export const runtime = "nodejs";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim() ?? "";
  if (secret.length < 16) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

/** Weekday operator digest. Does not email leads. Protected by CRON_SECRET. */
export async function GET(request: Request) {
  if (!authorized(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await runLeadDigest();
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({
    ok: true,
    openCount: result.openCount,
    emailed: result.emailed,
  });
}
