export type Inquiry = {
  name: string;
  email: string;
  company: string;
  message: string;
  intent: string;
};

export type DeliveryResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

const FALLBACK =
  "Unable to deliver the inquiry. Email admin@wayalabs.com.";

const MAILBOX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEND_TIMEOUT_MS = 8_000;

export function isMailbox(value: string): boolean {
  return MAILBOX.test(value);
}

/** Plain address, or a single `Display Name <mailbox>` with no header breaks. */
export function isFromAddress(value: string): boolean {
  if (value.includes("\n") || value.includes("\r")) return false;
  if (isMailbox(value)) return true;
  const match = /^[^<>\r\n]{1,80}<([^<>\s]+)>$/.exec(value);
  return match !== null && isMailbox(match[1] ?? "");
}

export function renderInquiry(inquiry: Inquiry): { subject: string; text: string } {
  const company = inquiry.company.length > 0 ? inquiry.company : "—";
  const subjectName = inquiry.name.replace(/[\r\n]+/g, " ").slice(0, 100);
  const subjectIntent = inquiry.intent.replace(/[\r\n]+/g, " ").slice(0, 40);
  return {
    subject: `WayaLabs inquiry (${subjectIntent}): ${subjectName}`,
    text: [
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Company: ${company}`,
      `Intent: ${inquiry.intent}`,
      "",
      inquiry.message,
    ].join("\n"),
  };
}

export function contactDeliveryConfig(env: NodeJS.ProcessEnv = process.env) {
  const apiKey = env.RESEND_API_KEY?.trim() ?? "";
  const from = env.CONTACT_FROM_EMAIL?.trim() ?? "";
  const to = env.CONTACT_TO_EMAIL?.trim() || "admin@wayalabs.com";
  return {
    apiKey,
    from,
    to,
    configured: apiKey.length > 0 && isFromAddress(from) && isMailbox(to),
  };
}

export async function deliverInquiry(
  inquiry: Inquiry,
  env: NodeJS.ProcessEnv = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<DeliveryResult> {
  if (!isMailbox(inquiry.email)) {
    return { ok: false, status: 400, error: "Please enter a valid email address." };
  }

  const { apiKey, from, to, configured } = contactDeliveryConfig(env);
  if (!configured) {
    return {
      ok: false,
      status: 503,
      error: "Inquiry delivery is not configured. Email admin@wayalabs.com.",
    };
  }

  const { subject, text } = renderInquiry(inquiry);
  let response: Response;
  try {
    response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: inquiry.email,
        subject,
        text,
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
  } catch {
    return { ok: false, status: 502, error: FALLBACK };
  }

  if (!response.ok) {
    return { ok: false, status: 502, error: FALLBACK };
  }

  return { ok: true };
}
