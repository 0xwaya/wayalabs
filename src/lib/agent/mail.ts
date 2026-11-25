import { contactDeliveryConfig, isMailbox } from "@/lib/contact-delivery";
import type { AgentEnv } from "@/lib/agent/types";

export type OperatorMailResult =
  | { ok: true }
  | { ok: false; error: string; retryable: boolean };

/** Operator-only mail through Resend. Never addressed to leads or candidates. */
export async function sendOperatorMail(
  env: AgentEnv,
  fetchImpl: typeof fetch,
  message: { subject: string; text: string },
): Promise<OperatorMailResult> {
  const { apiKey, from, to, configured } = contactDeliveryConfig(env);
  if (!configured || !isMailbox(to)) {
    return { ok: false, error: "Operator mail is not configured.", retryable: false };
  }
  try {
    const response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], ...message }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
      return {
        ok: false,
        error: `Operator mail failed (${response.status}).`,
        retryable: response.status >= 500,
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Unable to send operator mail.", retryable: true };
  }
}
