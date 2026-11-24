import { listOpenLeads, type CrmEnv } from "@/lib/leads/crm";
import {
  contactDeliveryConfig,
  isMailbox,
  type MailEnv,
} from "@/lib/contact-delivery";
import type { LeadRecord } from "@/lib/leads/types";

export type DigestEnv = CrmEnv & MailEnv;

export type DigestResult =
  | { ok: true; openCount: number; emailed: boolean }
  | { ok: false; status: number; error: string };

function renderDigest(leads: LeadRecord[]): { subject: string; text: string } {
  const lines = [
    `Open Wayalabs leads: ${leads.length}`,
    "This digest goes to the operator only. It does not email the leads.",
    "",
  ];

  for (const lead of leads) {
    const name = lead.contact?.name ?? "—";
    const email = lead.contact?.email ?? "—";
    const company = lead.contact?.company?.length ? lead.contact.company : "—";
    lines.push(
      `- ${name} <${email}> · ${company} · intent=${lead.intent} · ${lead.created_at}`,
    );
  }

  if (leads.length === 0) {
    lines.push("No open (status=new) leads.");
  }

  return {
    subject: `Wayalabs lead digest: ${leads.length} open`,
    text: lines.join("\n"),
  };
}

/**
 * One approved scheduled job: email the operator a list of open leads.
 * Does not contact people who submitted the form.
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

  const { apiKey, from, to, configured } = contactDeliveryConfig(env);
  if (!configured || !isMailbox(to)) {
    return {
      ok: false,
      status: 503,
      error: "Digest mail is not configured.",
    };
  }

  // Quiet success when the queue is empty — still a successful job run.
  if (listed.leads.length === 0) {
    return { ok: true, openCount: 0, emailed: false };
  }

  const { subject, text } = renderDigest(listed.leads);
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

  return { ok: true, openCount: listed.leads.length, emailed: true };
}

export { renderDigest };
