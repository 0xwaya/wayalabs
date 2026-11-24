import { NextResponse } from "next/server";
import { createFactorySql, factoryMode } from "@/lib/factory/db";
import { listRecentProofs } from "@/lib/factory/ingest";

export const runtime = "nodejs";

export async function GET() {
  const mode = factoryMode();
  const sql = createFactorySql();
  if (!sql) {
    return NextResponse.json({
      mode,
      configured: false,
      proofs: [],
    });
  }

  try {
    const proofs = await listRecentProofs(sql, 12);
    return NextResponse.json({ mode, configured: true, proofs });
  } catch (err) {
    return NextResponse.json(
      {
        mode,
        configured: true,
        proofs: [],
        error: err instanceof Error ? err.message : "Failed to load proofs",
      },
      { status: 500 },
    );
  }
}
