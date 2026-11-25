# Autonomous operations agent

Internal. A small plan, act, observe loop that runs the studio's own ops skills
without a person triggering each one. Code in `src/lib/agent/`.

## How it works

1. A **goal** names a playbook (`weekday-ops`, `health`, `snapshot`, `source`, `digest`).
2. The **planner** reads what has happened so far and picks the next skill, or finishes.
3. The **runner** executes that skill, records a step (reason, status, attempts, duration, summary), and loops.

Skill failures do not abort the run. They are recorded and the planner decides
what the failure means (for example, a failed CRM snapshot skips sourcing and the digest but still checks the site).

Budgets stop runaway loops: 8 steps and 50 seconds by default. One retry for failures a skill marks `retryable`.

## Skills

| Skill | Risk | What it does |
|---|---|---|
| `crm.snapshot` | read | Counts open leads and sourced candidates. Counts only, no personal data |
| `site.health` | read | Fetches `/`, `/contact`, `/offers`, `/ai-solutions` on `SITE_URL` |
| `lead.source` | write | Existing sourcer: files SBA and AI-intent candidates for review |
| `lead.digest` | write | Existing digest: emails the operator |
| `ops.alert` | write | Emails the operator when `site.health` finds failing pages |

Every skill that sends mail goes to `CONTACT_TO_EMAIL` only. Nothing contacts leads or candidates.

## `weekday-ops` decisions

- Always observe first: `crm.snapshot`, then `site.health`.
- Failing pages: `ops.alert`.
- `lead.source` only while open candidates are below `AGENT_BACKLOG_LIMIT` (default 40), so unreviewed rows do not pile up.
- `lead.digest` only when something is open or was just sourced.
- CRM snapshot failed: skip sourcing and the digest.

## API

All routes need `Authorization: Bearer $CRON_SECRET`.

```bash
# Default goal (what a cron calls)
curl -H "Authorization: Bearer $CRON_SECRET" https://wayalabs.com/api/agent/run

# Specific goal; dryRun records write skills as skipped instead of running them
curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  -d '{"goal":"weekday-ops","dryRun":true}' https://wayalabs.com/api/agent/run

# Goals and skills
curl -H "Authorization: Bearer $CRON_SECRET" https://wayalabs.com/api/agent/skills
```

The response is the full run trace. A run where every step failed returns 502.

## Cron

`vercel.json` still schedules `/api/leads/source` and `/api/leads/digest`
separately. To let the agent own them, replace both with one schedule on
`/api/agent/run`. Do not run both, or the sourcer and digest fire twice.

## Adding a skill

1. Add a `Skill` in `src/lib/agent/skills/` and register it in `skills/index.ts`.
2. Label it `read` or `write`. Write skills are the ones dry runs skip.
3. Teach a playbook in `planner.ts` when to use it, and add a test in `src/__tests__/lib/agent/`.
