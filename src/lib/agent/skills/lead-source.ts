import { runLeadSourceJob } from "@/lib/leads/source-job";
import type { Skill } from "@/lib/agent/types";

export const leadSourceSkill: Skill = {
  name: "lead.source",
  description:
    "Pull public SBA and AI-intent signals into the CRM as candidates for operator review. Never contacts companies.",
  risk: "write",
  async run({ env, fetchImpl }) {
    const result = await runLeadSourceJob(env, fetchImpl);
    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
        retryable: result.status === 502,
      };
    }
    return {
      ok: true,
      summary: `${result.inserted} new candidates (SBA ${result.sbaFetched}, AI ${result.aiFetched})`,
      data: {
        inserted: result.inserted,
        sbaFetched: result.sbaFetched,
        aiFetched: result.aiFetched,
        emailed: result.emailed,
      },
    };
  },
};
