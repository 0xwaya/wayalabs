# Agent kit

Internal. Productized shape for agentic workflow work. It is scoped in discovery and built **inside** a lead system, platform, or integration build. It is not a standalone SKU and is not on `/offers`. See `agents-messaging.md` and `offer-kit.md`.

Reference build: the Wayalabs ops agent. Code in `src/lib/agent/`, walkthrough in `autonomous-agent.md`. This is studio tooling, not a client brand.

## Fixed shape

1. **Skill registry** — each skill is one named, bounded action with a `read` or `write` label. The agent can do nothing that is not a registered skill.
2. **Planner** — fixed rules playbooks by default. A model planner is optional and only chooses among registered skills, one step at a time. If the model fails or replies badly, the rules take over for that step.
3. **Runner** — step and time budgets, one retry for retryable failures, dry run that skips every write skill, and a per-step trace (reason, status, summary).
4. **Guardrails** — mail goes to the operator only. The agent does not contact anyone who did not opt in unless the brief says so. Anything public or outbound is a draft the operator approves. Keys stay server-side.
5. **Trigger and audit** — an authenticated endpoint (and a cron if the brief names one). Every run returns its trace.

Customize skills, playbooks, objective, and model. Do not rebuild the loop, the guardrails, or the trace per client.

## Discovery inputs required

- Outcome the agent owns, and who reads its output
- Systems it may **read**, and systems it may **write to**. Default is read-only until named
- Actions that need a person's approval before they happen
- Contact boundary: who, if anyone, the agent may message, and on what consent
- Data boundary: what the model sees (counts and summaries by default, not raw personal data), what is stored, retention
- Model and provider, who holds the key, and a monthly spend ceiling
- Budgets per run: steps and seconds
- Schedule, and what should happen when a run fails or the model is down
- Human escalation path

## Skill pattern for content (social, email, listings)

Content skills write **drafts**. They do not publish.

- The skill produces N variants in the brand voice from approved source material only.
- Drafts go to the operator (email or the data store) for approval.
- A separate publish skill exists only if the brief names the channel, the credential is in place, and an approval step gates it. Default is no publish skill.
- The studio ops agent does not have a content skill yet. This is the shape to build it in.

## Model guidance

Pick per brief. Use a small, cheap model for planning (short prompts, structured JSON, a few calls per run) and a stronger writing model for content. Route through one gateway or provider so the model is a config value, not code. Check current prices at scoping time; they move.

## Delivery checklist

- [ ] Skills listed with `read` / `write` labels and the system each one touches
- [ ] Playbook written down: what the agent decides, and what it never decides
- [ ] Dry run demonstrated to the operator: trace shows every write skill skipped
- [ ] Budgets and spend ceiling set
- [ ] Operator-only mail confirmed; no skill contacts a non-opted-in person
- [ ] Model failure tested: run completes on the rules fallback
- [ ] Endpoint is authenticated; secret documented for the operator
- [ ] Operator can read a trace and re-run a goal without Wayalabs in the loop
- [ ] Close with Watch invitation (see `close-checklist.md`)

## Pricing

Priced inside the build it ships with. Add scope by the number of skills and by write-skill risk, inside that build's band. Do not quote a standalone agent price or invent a new product line. An agent engagement counts against the concurrent-build cap (`capacity.md`).
