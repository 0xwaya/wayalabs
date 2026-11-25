import { listOpenLeads, listOpenSourcedCandidates } from "@/lib/leads/crm";
import type { Skill } from "@/lib/agent/types";

export const crmSnapshotSkill: Skill = {
  name: "crm.snapshot",
  description:
    "Count open inbound leads and unreviewed sourced candidates (capped at 50 each). Counts only, no personal data.",
  risk: "read",
  async run({ env }) {
    const leads = await listOpenLeads(env);
    if (!leads.ok) {
      return { ok: false, error: leads.error, retryable: false };
    }
    const candidates = await listOpenSourcedCandidates(env);
    if (!candidates.ok) {
      return { ok: false, error: candidates.error, retryable: true };
    }
    const openLeads = leads.leads.length;
    const openCandidates = candidates.candidates.length;
    return {
      ok: true,
      summary: `${openLeads} open leads, ${openCandidates} open candidates`,
      data: { openLeads, openCandidates },
    };
  },
};
