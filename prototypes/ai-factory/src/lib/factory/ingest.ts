import { createSqlAliasStore } from "./aliases";
import {
  linkCommerceAliases,
  type CommerceKeyHints,
} from "./commerce-key";
import type { FactorySql } from "./db";
import type { HookIngestResponse, ProofKind, WebhookProvider } from "./types-live";

export type IngestProofInput = {
  provider: WebhookProvider;
  eventId: string;
  kind: ProofKind;
  hints: CommerceKeyHints;
  amountCents: number | null;
  currency: string | null;
  runId: string | null;
  bayId: string | null;
  raw: unknown;
};

/**
 * Persist webhook + alias link. Phase 1 does **not** book ledger credits.
 */
export async function ingestProofEvent(
  sql: FactorySql,
  input: IngestProofInput,
): Promise<HookIngestResponse> {
  const existing = await sql`
    SELECT id FROM factory_webhook_events
    WHERE provider = ${input.provider} AND event_id = ${input.eventId}
    LIMIT 1
  `;
  if (existing[0]?.id) {
    return {
      accepted: true,
      duplicate: true,
      evidenceOnly: true,
      proofEventId: String(existing[0].id),
      ledgerEntryId: null,
    };
  }

  const store = createSqlAliasStore(sql);
  const commerceKey = await linkCommerceAliases(input.hints, store, store);

  const inserted = await sql`
    INSERT INTO factory_webhook_events (
      provider, event_id, kind, commerce_key, amount_cents, currency,
      run_id, bay_id, raw
    ) VALUES (
      ${input.provider},
      ${input.eventId},
      ${input.kind},
      ${commerceKey},
      ${input.amountCents},
      ${input.currency},
      ${input.runId},
      ${input.bayId},
      ${JSON.stringify(input.raw)}::jsonb
    )
    RETURNING id
  `;

  const proofEventId =
    typeof inserted[0]?.id === "string" ? inserted[0].id : null;

  return {
    accepted: true,
    duplicate: false,
    // Phase 1: never book — always evidence until Phase 3.
    evidenceOnly: true,
    proofEventId,
    ledgerEntryId: null,
  };
}

export async function listRecentProofs(sql: FactorySql, limit = 12) {
  const rows = await sql`
    SELECT
      id, provider, event_id, kind, commerce_key, amount_cents, currency,
      run_id, bay_id, received_at
    FROM factory_webhook_events
    ORDER BY received_at DESC
    LIMIT ${limit}
  `;
  return rows.map((row) => ({
    id: String(row.id),
    provider: String(row.provider),
    eventId: String(row.event_id),
    kind: String(row.kind),
    commerceKey: row.commerce_key == null ? null : String(row.commerce_key),
    amountCents:
      typeof row.amount_cents === "number" ? row.amount_cents : null,
    currency: row.currency == null ? null : String(row.currency),
    runId: row.run_id == null ? null : String(row.run_id),
    bayId: row.bay_id == null ? null : String(row.bay_id),
    receivedAt:
      row.received_at instanceof Date
        ? row.received_at.toISOString()
        : String(row.received_at),
  }));
}
