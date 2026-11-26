import { aiPoliciesUsChina2026Body } from "@/content/insights/ai-policies-us-china-2026";

export type InsightPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  accent: string;
  /** Optional root-relative public path, e.g. /research/....pdf. Must pass isSafeSitePath. */
  pdfUrl?: string;
  /** Optional markdown body, rendered only on the slug page via InsightMarkdown (no raw HTML). */
  body?: string;
  sections: {
    context: string;
    approach: string;
    checklist: string[];
    metrics: string[];
    takeaway: string;
  };
};

export const insightPosts: InsightPost[] = [
  {
    slug: "ai-policies-us-china-2026",
    title: "The US–China AI Race: models, compute, chips, and practical guardrails (November 2026)",
    excerpt:
      "A sourced November 2026 scoreboard of the US–China AI race — frontier models, compute and chips, open weights, in-force law, and an illustrative Wayalabs guardrail architecture. A 14-page PDF accompanies this post.",
    category: "Strategy",
    readTime: "18 min read",
    date: "Nov 26, 2026",
    accent: "#c5cad3",
    pdfUrl: "/research/ai-race-nov2026/wayalabs-ai-race-nov2026.pdf",
    body: aiPoliciesUsChina2026Body,
    sections: {
      context:
        "As of 26 November 2026, every model in the top ten of the Artificial Analysis Intelligence Index (v5.0.2) is from a US lab. Anthropic’s Claude Fable 5.2 leads at 64.8. The highest-scoring generally available Chinese system on the same board is Moonshot’s Kimi K3.1 Pro, at 47, and it is open-weight. Epoch AI estimates the US received 72% of 27.4 million H100-equivalent arrivals from 2022 through June 2026, against 10% for China. California’s SB 53 and SB 243, Texas TRAIGA, EU GPAI duties, China’s labeling rules, and Korea’s AI Basic Act are already in force. The mid-November BIS interim final rule formally rescinded the never-enforced AI Diffusion Rule and added a remote-access license above 12 million TPP. BAAJA has passed the Senate but is not law; the SAFE AI Act is an outline only.",
      approach:
        "Wayalabs treats guardrails as architectural and operational requirements, not as a post-hoc overlay. The practices below are illustrative and unaudited — they describe how we design our own systems, and they are not a certification or a substitute for legal advice. We start with system boundaries, data access limits, failure modes, and testable acceptance criteria. Chatbots use only approved source material, with explicit escalation and a human handoff. Agents get tool permissions, durable state, and a person in the loop before any consequential action. There is no unattended posting, purchasing, or deployment. Hard-stop refusals (biological weapons, offensive cyber, CSAM, and prohibited weapons assistance) are never retried on a less-guarded fallback model. This architecture is written to be compatible with California SB 53 and SB 243, Texas TRAIGA, the EU GPAI provider duties that have applied since 2 August 2025, and the New York RAISE Act when it takes effect on 1 January 2027. Voluntary industry pledges, including the White House Accord on Super Intelligence, are signals, not a safe harbor.",
      checklist: [
        "Document data boundaries, failure modes, and testable acceptance criteria at the start of every project",
        "Use a closed US or EU-region frontier API as the default path when the task is hard and data residency allows it",
        "Keep an open-weight fallback in your VPC; read the license, including any MaaS gate, before you serve anyone else’s users",
        "Never retry a hard-stop refusal on a less-guarded fallback model",
        "Require human approval for send, pay, deploy, and delete — no unattended posting, purchasing, or deployment",
        "Keep a hash-chained, append-only audit log and a must-refuse / must-answer eval gate in CI",
        "Track in-force law and pending law in two different columns (SB 53 is in force; BAAJA and the SAFE AI Act are not)",
        "Treat 879,868 H200-class approvals as of 11 May 2026 as an approvals figure, not shipments",
      ],
      metrics: [
        "Boundary and hard-stop compliance rate on a must-refuse / must-answer set",
        "Human-review latency and precision for ask-gated tools",
        "Incident detection and reporting time (SB 53 / NY RAISE)",
        "Evaluation coverage against acceptance criteria",
        "Escalation quality and handoff success",
        "License and residency checks before an open-weight fallback is served",
      ],
      takeaway:
        "The United States still holds the frontier models and the verified compute. Chinese labs hold the most capable open weights and a fast-moving efficiency stack. Policy is not “unregulated”: it is a set of already-binding state, EU, Chinese, and Korean rules, plus a November wave of federal activity that is easy to over-read. Build for the rules that are in force, keep an eval harness that will survive the next index reset, and do not unattended-post your way into the next case caption.",
    },
  },
  {
    slug: "chatbot-deflection-metrics",
    title: "Evaluating chatbot quality beyond deflection",
    excerpt:
      "A practical framework for evaluating resolution quality, escalation behavior, and user feedback in a scoped chatbot prototype.",
    category: "AI Chatbots",
    readTime: "6 min read",
    date: "Mar 28, 2026",
    accent: "#d7dbe3",
    sections: {
      context:
        "Teams often optimize for deflection in isolation, then discover that unresolved edge cases and poor handoff quality quietly damage customer trust. High deflection is only useful when it preserves experience quality.",
      approach:
        "Define success as resolved outcomes, not avoided tickets. Instrument assistant responses by intent, confidence, and final state, then tie those signals to downstream support outcomes.",
      checklist: [
        "Track resolution rate per top 10 intents",
        "Measure escalation quality with transcript scoring",
        "Compare CSAT for AI-assisted vs. human-only flows",
        "Tag failure modes weekly and patch prompts/tools",
      ],
      metrics: [
        "Resolution rate by intent",
        "Escalation quality score",
        "CSAT delta",
        "Repeat contact within 7 days",
      ],
      takeaway:
        "Deflection is a vanity metric unless it is paired with resolution quality and customer sentiment."
    },
  },
  {
    slug: "rag-vs-finetuning",
    title: "RAG vs fine-tuning: choosing an approach for a prototype",
    excerpt:
      "A decision framework for comparing retrieval-augmented generation and fine-tuning against data freshness, traceability, and behavior requirements.",
    category: "AI Integrations",
    readTime: "8 min read",
    date: "Mar 14, 2026",
    accent: "#f3f4f6",
    sections: {
      context:
        "RAG and fine-tuning solve different problems. RAG helps with changing knowledge and traceability, while fine-tuning helps with stable behavior and specialized style.",
      approach:
        "Start with a decision tree: if facts change weekly or need citations, use RAG first. If behavior is stable and you need deterministic formatting, evaluate fine-tuning after RAG baseline performance.",
      checklist: [
        "Estimate data freshness requirements",
        "Test citation reliability with RAG",
        "Validate output structure using schema constraints",
        "Only fine-tune if baseline fails target KPIs",
      ],
      metrics: [
        "Hallucination rate",
        "Citation hit rate",
        "Cost per successful task",
        "Latency at p95",
      ],
      takeaway:
        "RAG is the default starting point for most business apps; fine-tuning is an optimization step, not a first step."
    },
  },
  {
    slug: "ai-agent-reliability",
    title: "Engineering reliability into agent workflows",
    excerpt:
      "Tool contracts, state handling, and human review are architecture concerns to address when researching and prototyping agent workflows.",
    category: "AI Agents",
    readTime: "10 min read",
    date: "Feb 27, 2026",
    accent: "#c5cad3",
    sections: {
      context:
        "Most agent failures are systems failures, not model failures. Reliability depends on tool contracts, state handling, and escalation controls.",
      approach:
        "Harden tool interfaces with strict schemas, shorten working context to only task-relevant memory, and route uncertain states to human review with a clear audit trail.",
      checklist: [
        "Add schema validation for all tool I/O",
        "Log each reasoning-action step with trace IDs",
        "Set confidence thresholds for human handoff",
        "Replay failure traces weekly",
      ],
      metrics: [
        "Task success rate",
        "Tool call error rate",
        "Human handoff precision",
        "Mean time to recover",
      ],
      takeaway:
        "Reliable agents come from engineering discipline around orchestration, not just better prompts."
    },
  },
  {
    slug: "llm-observability-stack",
    title: "Observability questions for an LLM prototype",
    excerpt:
      "A starting checklist for request tracing, usage measurement, validation failures, and provider errors during controlled AI development.",
    category: "Infrastructure",
    readTime: "7 min read",
    date: "Feb 10, 2026",
    accent: "#d7dbe3",
    sections: {
      context:
        "Without observability, teams learn about quality regressions from customers first. That is too late.",
      approach:
        "Capture request IDs, prompt versions, model/provider, token usage, latency, and outcome labels. Add alerting on anomalies before launch traffic ramps.",
      checklist: [
        "Trace each user request end-to-end",
        "Version prompts and route config",
        "Record structured outputs and validation failures",
        "Set alert thresholds for cost, latency, and error spikes",
      ],
      metrics: [
        "p95 latency",
        "Cost per request",
        "Validation failure rate",
        "Provider/model error rate",
      ],
      takeaway:
        "Observability is the control surface that keeps AI features stable as usage and complexity grow."
    },
  },
  {
    slug: "contact-form-to-ai-qualifier",
    title: "Designing an AI lead-qualification experiment",
    excerpt:
      "A project-scoping framework for testing structured lead intake without assuming conversion gains or autonomous CRM updates.",
    category: "AI Chatbots",
    readTime: "5 min read",
    date: "Jan 22, 2026",
    accent: "#d7dbe3",
    sections: {
      context:
        "A proposed AI qualification flow should be compared with the current form using agreed measures and explicit consent, data, and routing boundaries.",
      approach:
        "Prototype a guided intake flow against a synthetic or approved test dataset first. Keep CRM writes disabled until permissions, review, and acceptance checks are approved.",
      checklist: [
        "Define qualification fields before launch",
        "Map AI capture to CRM schema",
        "Include clear privacy and consent copy",
        "Audit lead quality monthly",
      ],
      metrics: [
        "Lead-to-call conversion",
        "Average follow-up time",
        "Qualified lead ratio",
        "Pipeline velocity",
      ],
      takeaway:
        "Qualification quality beats form submission volume when your goal is pipeline growth."
    },
  },
  {
    slug: "scoping-ai-engagement",
    title: "How to scope an AI engagement without over-engineering the first sprint",
    excerpt:
      "The biggest failure mode in AI projects is not technical, it is discovering in week 6 that you built the wrong thing. A scoping process that prevents it.",
    category: "Strategy",
    readTime: "9 min read",
    date: "Jan 8, 2026",
    accent: "#c5cad3",
    sections: {
      context:
        "Teams often start by selecting models and tools instead of defining business outcomes and constraints.",
      approach:
        "Begin with one bounded workflow, define acceptance checks, and map only the dependencies needed for a reviewable first iteration.",
      checklist: [
        "Write one-sentence business outcome",
        "Capture baseline KPI and target delta",
        "Identify system dependencies and owners",
        "Set acceptance criteria before coding",
      ],
      metrics: [
        "Time to first production value",
        "Scope change rate",
        "KPI lift against baseline",
        "Stakeholder confidence score",
      ],
      takeaway:
        "Great AI delivery starts with clear outcomes and bounded scope, not maximal architecture on day one."
    },
  },
];

export const categoryColors: Record<string, string> = {
  "AI Chatbots": "#d7dbe3",
  "AI Agents": "#c5cad3",
  "AI Integrations": "#f3f4f6",
  Infrastructure: "#d7dbe3",
  Strategy: "#c5cad3",
};
