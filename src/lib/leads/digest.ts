import {
  listOpenLeads,
  listOpenSourcedCandidates,
  type CrmEnv,
} from "@/lib/leads/crm";
import {
  contactDeliveryConfig,
  isMailbox,
  type MailEnv,
} from "@/lib/contact-delivery";
import type { LeadRecord, SourcedCandidateRecord } from "@/lib/leads/types";

export type DigestEnv = CrmEnv & MailEnv;

export type DigestResult =
  | {
      ok: true;
      openCount: number;
      sourcedCount: number;
      emailed: boolean;
    }
  | { ok: false; status: number; error: string };

function renderDigest(
  leads: LeadRecord[],
  sourced: SourcedCandidateRecord[],
): { subject: string; text: string } {
  const lines = [
    `Open inbound leads: ${leads.length}`,
    `Open sourced candidates: ${sourced.length}`,
    "This digest goes to the operator only. It does not email leads or candidates.",
    "",
  ];

  if (leads.length > 0) {
    lines.push("Inbound:");
    for (const lead of leads) {
      const name = lead.contact?.name ?? "—";
      const email = lead.contact?.email ?? "—";
      const company = lead.contact?.company?.length ? lead.contact.company : "—";
      lines.push(
        `- ${name} <${email}> · ${company} · intent=${lead.intent} · ${lead.created_at}`,
      );
    }
    lines.push("");
  } else {
    lines.push("No open inbound leads.", "");
  }

  if (sourced.length > 0) {
    lines.push("Sourced (review only — do not assume consent to contact):");
    for (const c of sourced) {
      lines.push(
        `- [${c.source}] ${c.company_name} · ${c.city}, ${c.state} · ${c.signal_summary}`,
      );
      if (c.source_url) lines.push(`  ${c.source_url}`);
    }
  } else {
    lines.push("No open sourced candidates.");
  }

  const total = leads.length + sourced.length;
  return {
    subject: `Wayalabs lead digest: ${total} open`,
    text: lines.join("\n"),
  };
}

/**
 * Weekday operator digest for inbound leads + sourced candidates.
 * Does not contact people or companies.
 */
export async function runLeadDigest(
  env: DigestEnv = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<DigestResult> {
  const listed = await listOpenLeads(env);
  if (!listed.ok) {
    const notConfigured = listed.error.includes("not configured");
    return {
      ok: false,
      status: notConfigured ? 503 : 502,
      error: listed.error,
    };
  }

  const sourced = await listOpenSourcedCandidates(env);
  if (!sourced.ok) {
    return { ok: false, status: 502, error: sourced.error };
  }

  const { apiKey, from, to, configured } = contactDeliveryConfig(env);
  if (!configured || !isMailbox(to)) {
    return {
      ok: false,
      status: 503,
      error: "Digest mail is not configured.",
    };
  }

  const openCount = listed.leads.length;
  const sourcedCount = sourced.candidates.length;

  if (openCount === 0 && sourcedCount === 0) {
    return { ok: true, openCount: 0, sourcedCount: 0, emailed: false };
  }

  const { subject, text } = renderDigest(listed.leads, sourced.candidates);
  let response: Response;
  try {
    response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    return { ok: false, status: 502, error: "Unable to send digest email." };
  }

  if (!response.ok) {
    return { ok: false, status: 502, error: "Unable to send digest email." };
  }

  return { ok: true, openCount, sourcedCount, emailed: true };
}

export { renderDigest };
