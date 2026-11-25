import { createRegistry } from "@/lib/agent/registry";
import { crmSnapshotSkill } from "@/lib/agent/skills/crm-snapshot";
import { leadDigestSkill } from "@/lib/agent/skills/lead-digest";
import { leadSourceSkill } from "@/lib/agent/skills/lead-source";
import { opsAlertSkill } from "@/lib/agent/skills/ops-alert";
import { siteHealthSkill } from "@/lib/agent/skills/site-health";

export const defaultSkills = [
  crmSnapshotSkill,
  siteHealthSkill,
  leadSourceSkill,
  leadDigestSkill,
  opsAlertSkill,
];

export function createDefaultRegistry() {
  return createRegistry(defaultSkills);
}
