import type { Skill } from "@/lib/agent/types";

export type SkillRegistry = {
  get(name: string): Skill | undefined;
  list(): Skill[];
};

export function createRegistry(skills: Skill[]): SkillRegistry {
  const byName = new Map<string, Skill>();
  for (const skill of skills) {
    if (byName.has(skill.name)) {
      throw new Error(`Duplicate skill: ${skill.name}`);
    }
    byName.set(skill.name, skill);
  }
  return {
    get: (name) => byName.get(name),
    list: () => [...byName.values()],
  };
}
