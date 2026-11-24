/**
 * Phase 0 contract freeze — live Factory types.
 * Sandbox engine types stay in `../engine/types`.
 * These shapes are the source of truth for Phase 1+ APIs and migrations.
 */

import type { AgentRole } from "../engine/types";

export type FactoryMode = "sandbox" | "shadow" | "live";

export type WebhookProvider =
  | "stripe"
  | "shopify"
  | "shipstation"
  | "easypost"
  | "slack"
  | "resend"
  | "calendly";

/** Normalized proof kinds after provider-specific mapping. */
export type ProofKind =
  | "payment_captured"
  | "order_paid"
  | "shipment_delivered"
  | "ticket_resolved"
  | "payment_refunded"
  | "dispute_opened"
  | "dispute_won"
  | "connector_health";

export type ProofEvent = {
  id: string;
  provider: WebhookProvider;
  /** Provider delivery id — unique with provider for ingress dedupe. */
  eventId: string;
  kind: ProofKind;
  /**
   * Canonical commerce identity for cross-provider dedupe.
   * Prefer Stripe pi_/ch_, else Shopify order id, else runId:externalId.
   */
  commerceKey: string | null;
  amountCents: number | null;
  currency: string | null;
  runId: string | null;
  bayId: string | null;
  receivedAt: string;
  /** Raw provider payload retained for audit; never sent to the client floor. */
  rawRef: string | null;
};

export type StepJobStatus =
  | "queued"
  | "running"
  | "draft"
  | "waiting_approval"
  | "waiting_proof"
  | "succeeded"
  | "failed"
  | "cancelled";

export type StepJob = {
  runId: string;
  stepId: string;
  bayId: string;
  agentId: string;
  role: AgentRole;
  mode: FactoryMode;
  /** Tool ACL snapshot at enqueue — deny-by-default outside this list. */
  toolsAllowed: string[];
  input: Record<string, unknown>;
  status?: StepJobStatus;
};

export type StepJobResult = {
  status: Exclude<StepJobStatus, "queued" | "running">;
  artifacts?: Record<string, unknown>;
  error?: string;
  /** When set, run waits on a matching ProofEvent before advancing. */
  waitForProof?: ProofKind;
};

export type LedgerEntryKind = "credit" | "reversal" | "fee" | "opex";

export type LedgerEntry = {
  id: string;
  tenantId: string;
  bayId: string | null;
  runId: string | null;
  /** Credits positive; refunds/disputes/opex negative. */
  amountCents: number;
  currency: string;
  entryKind: LedgerEntryKind;
  commerceKey: string | null;
  /** Provider refund/dispute id when entryKind is reversal. */
  refundId: string | null;
  sourceEventId: string | null;
  createdAt: string;
};

export type RunStatus =
  | "pending"
  | "active"
  | "waiting_approval"
  | "waiting_proof"
  | "completed"
  | "failed"
  | "cancelled";

export type FactoryRun = {
  id: string;
  tenantId: string;
  bayId: string;
  /** Funnel template id (e.g. ms-nc-flash). */
  funnelId: string;
  mode: FactoryMode;
  status: RunStatus;
  stepIndex: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateRunRequest = {
  funnelId: string;
  mode?: FactoryMode;
};

export type CreateRunResponse = {
  run: FactoryRun;
};

export type ApproveRunRequest = {
  stepId: string;
  decision: "approve" | "reject";
  note?: string;
};

export type HookIngestResponse = {
  accepted: boolean;
  /** true when this delivery was an exact (provider, eventId) replay. */
  duplicate: boolean;
  /** true when a commerce_key credit already exists (secondary evidence only). */
  evidenceOnly: boolean;
  proofEventId: string | null;
  ledgerEntryId: string | null;
};
