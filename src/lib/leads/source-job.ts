import {
  contactDeliveryConfig,
  isMailbox,
  type MailEnv,
} from "@/lib/contact-delivery";
import {
  crmConfig,
  fileSourcedCandidate,
  type CrmEnv,
} from "@/lib/leads/crm";
import { fetchAiIntentCandidates } from "@/lib/leads/sourcers/ai-intent";
import { fetchSbaTradeCandidates } from "@/lib/leads/sourcers/sba";
import type { SourcedCandidateIntake } from "@/lib/leads/types";

export type SourceJobEnv = CrmEnv & MailEnv & {
  LEAD_SOURCE_SBA?: string;
  LEAD_SOURCE_AI_INTENT?: string;
};

export type SourceJobResult =
  | {
      ok: true;
      sbaFetched: number;
      aiFetched: number;
      inserted: number;
      emailed: boolean;
    }
  | { ok: false; status: number; error: string };

function enabled(flag: string | undefined, defaultOn: boolean): boolean {
  if (flag === undefined || flag.trim() === "") return defaultOn;
  const v = flag.trim().toLowerCase();
  return v !== "0" && v !== "false" && v !== "off";
}

async function fileAll(
  candidates: SourcedCandidateIntake[],
  env: SourceJobEnv,
): Promise<{ inserted: number; errors: number; skippedNotConfigured: boolean }> {
  let inserted = 0;
  let errors = 0;
  let skippedNotConfigured = false;
  for (const candidate of candidates) {
    const result = await fileSourcedCandidate(candidate, env);
    if (result.ok && result.inserted) inserted += 1;
    if (!result.ok && result.skipped) skippedNotConfigured = true;
    if (!result.ok && !result.skipped) errors += 1;
  }
  return { inserted, errors, skippedNotConfigured };
}

function renderSourceReport(input: {
  sba: SourcedCandidateIntake[];
  ai: SourcedCandidateIntake[];
  inserted: number;
}): { subject: string; text: string } {
  const lines = [
    "Wayalabs outbound lead sourcer",
    "Candidates are filed for operator review. This job does not contact them.",
    "",
    `New inserts this run: ${input.inserted}`,
    `SBA trade/service matches fetched: ${input.sba.length}`,
    `AI/automation intent headlines fetched: ${input.ai.length}`,
    "",
  ];

  if (input.sba.length > 0) {
    lines.push("SBA (sample):");
    for (const c of input.sba.slice(0, 15)) {
      lines.push(
        `- ${c.companyName} · ${c.city}, ${c.state} · ${c.signalSummary}`,
      );
    }
    lines.push("");
  }

  if (input.ai.length > 0) {
    lines.push("AI / automation intent (sample):");
    for (const c of input.ai.slice(0, 15)) {
      lines.push(`- ${c.companyName} · ${c.signalSummary}`);
      if (c.sourceUrl) lines.push(`  ${c.sourceUrl}`);
    }
  }

  return {
    subject: `Wayalabs sourcer: ${input.inserted} new candidates`,
    text: lines.join("\n"),
  };
}

/**
 * Approved outbound job: pull public SBA + AI-intent signals, file candidates,
 * email the operator. Never emails the companies.
 */
export async function runLeadSourceJob(
  env: SourceJobEnv = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<SourceJobResult> {
  const runSba = enabled(env.LEAD_SOURCE_SBA, true);
  const runAi = enabled(env.LEAD_SOURCE_AI_INTENT, true);

  if ((runSba || runAi) && !crmConfig(env).configured) {
    return {
      ok: false,
      status: 503,
      error: "CRM is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  // Run channels in parallel so SBA + RSS stay inside the route maxDuration.
  const [sbaResult, aiResult] = await Promise.allSettled([
    runSba
      ? fetchSbaTradeCandidates({ fetchImpl })
      : Promise.resolve([] as SourcedCandidateIntake[]),
    runAi
      ? fetchAiIntentCandidates({ fetchImpl })
      : Promise.resolve([] as SourcedCandidateIntake[]),
  ]);

  if (runSba && sbaResult.status === "rejected") {
    const reason = sbaResult.reason;
    return {
      ok: false,
      status: 502,
      error: reason instanceof Error ? reason.message : "SBA sourcer failed",
    };
  }

  if (runAi && aiResult.status === "rejected") {
    const reason = aiResult.reason;
    return {
      ok: false,
      status: 502,
      error: reason instanceof Error ? reason.message : "AI intent sourcer failed",
    };
  }

  const sba = sbaResult.status === "fulfilled" ? sbaResult.value : [];
  const ai = aiResult.status === "fulfilled" ? aiResult.value : [];

  const filed = await fileAll([...sba, ...ai], env);
  if (filed.skippedNotConfigured) {
    return {
      ok: false,
      status: 503,
      error: "CRM is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }
  if (filed.errors > 0 && filed.inserted === 0 && (sba.length > 0 || ai.length > 0)) {
    return {
      ok: false,
      status: 503,
      error: "CRM filing failed for sourced candidates.",
    };
  }

  const { apiKey, from, to, configured } = contactDeliveryConfig(env);
  let emailed = false;
  if (configured && isMailbox(to) && (sba.length > 0 || ai.length > 0)) {
    const { subject, text } = renderSourceReport({
      sba,
      ai,
      inserted: filed.inserted,
    });
    try {
      const response = await fetchImpl("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to: [to], subject, text }),
        signal: AbortSignal.timeout(8_000),
      });
      emailed = response.ok;
    } catch {
      emailed = false;
    }
  }

  return {
    ok: true,
    sbaFetched: sba.length,
    aiFetched: ai.length,
    inserted: filed.inserted,
    emailed,
  };
}
