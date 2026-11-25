import { sendOperatorMail } from "@/lib/agent/mail";
import type { Skill } from "@/lib/agent/types";

export const opsAlertSkill: Skill = {
  name: "ops.alert",
  description:
    "Email the operator that the site health check found failing pages.",
  risk: "write",
  async run({ env, fetchImpl, now }) {
    const mail = await sendOperatorMail(env, fetchImpl, {
      subject: "Wayalabs agent: site health check failing",
      text: [
        "The autonomous agent found failing public pages.",
        `Checked at ${now().toISOString()}.`,
        "See the agent run trace (POST /api/agent/run) for the failing paths.",
      ].join("\n"),
    });
    if (!mail.ok) {
      return { ok: false, error: mail.error, retryable: mail.retryable };
    }
    return { ok: true, summary: "Operator alerted", data: { emailed: true } };
  },
};
