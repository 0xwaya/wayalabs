import type { Skill } from "@/lib/agent/types";

export const HEALTH_PATHS = ["/", "/contact", "/offers", "/ai-solutions"];

export const siteHealthSkill: Skill = {
  name: "site.health",
  description:
    "Fetch the key public pages and report any that do not return 200.",
  risk: "read",
  async run({ env, fetchImpl }) {
    const base = (env.SITE_URL?.trim() || "https://wayalabs.com").replace(/\/+$/, "");
    const failing: { path: string; status: number | "error" }[] = [];

    await Promise.all(
      HEALTH_PATHS.map(async (path) => {
        try {
          const response = await fetchImpl(`${base}${path}`, {
            method: "GET",
            redirect: "follow",
            signal: AbortSignal.timeout(6_000),
          });
          if (response.status !== 200) {
            failing.push({ path, status: response.status });
          }
        } catch {
          failing.push({ path, status: "error" });
        }
      }),
    );

    failing.sort((a, b) => a.path.localeCompare(b.path));
    const checked = HEALTH_PATHS.length;
    return {
      ok: true,
      summary:
        failing.length === 0
          ? `${checked}/${checked} pages healthy`
          : `${failing.length}/${checked} pages failing`,
      data: { base, checked, failing },
    };
  },
};
