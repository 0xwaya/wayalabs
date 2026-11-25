import { runLeadDigest } from "@/lib/leads/digest";
import type { Skill } from "@/lib/agent/types";

export const leadDigestSkill: Skill = {
  name: "lead.digest",
  description:
    "Email the operator a digest of open inbound leads and sourced candidates. Never emails leads or candidates.",
  risk: "write",
  async run({ env, fetchImpl }) {
    const result = await runLeadDigest(env, fetchImpl);
    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
        retryable: result.status === 502,
      };
    }
    return {
      ok: true,
      summary: result.emailed
        ? `Digest sent: ${result.openCount} leads, ${result.sourcedCount} candidates`
        : "Nothing open, no digest sent",
      data: {
        openCount: result.openCount,
        sourcedCount: result.sourcedCount,
        emailed: result.emailed,
      },
    };
  },
};
