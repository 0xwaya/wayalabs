export type InsightPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  accent: string;
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
    slug: "chatbot-deflection-metrics",
    title: "The only chatbot metrics that actually matter for support teams",
    excerpt:
      "Deflection rate gets all the attention, but the numbers that drive real business decisions are resolution rate, escalation quality, and CSAT delta. Here is how to instrument them from day one.",
    category: "AI Chatbots",
    readTime: "6 min read",
    date: "Mar 28, 2026",
    accent: "#4f8ef7",
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
    title: "RAG vs fine-tuning: how to decide in under 10 minutes",
    excerpt:
      "Most teams reach for fine-tuning when retrieval-augmented generation would be cheaper, faster, and more maintainable. A practical decision framework for choosing the right approach.",
    category: "AI Integrations",
    readTime: "8 min read",
    date: "Mar 14, 2026",
    accent: "#22d3ee",
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
    title: "Why most AI agents fail in production and how to fix the three root causes",
    excerpt:
      "Flaky tool calls, missing context windows, and no human-in-the-loop path are responsible for the majority of agent failures we have seen. Patterns we use to fix all three.",
    category: "AI Agents",
    readTime: "10 min read",
    date: "Feb 27, 2026",
    accent: "#9b6dff",
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
    title: "The minimum viable LLM observability stack for production",
    excerpt:
      "What you need to log, trace, and alert on before you launch any AI feature. A practical starting point that does not require a dedicated ML ops team.",
    category: "Infrastructure",
    readTime: "7 min read",
    date: "Feb 10, 2026",
    accent: "#4f8ef7",
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
    title: "Replacing your contact form with an AI qualifier: a before and after study",
    excerpt:
      "We replaced a static contact form with an intent-capturing AI qualifier on a client site and measured the results over 45 days. The numbers were surprising.",
    category: "AI Chatbots",
    readTime: "5 min read",
    date: "Jan 22, 2026",
    accent: "#4f8ef7",
    sections: {
      context:
        "Static forms collect low-context leads and create heavy follow-up overhead. AI qualification can pre-structure demand and route faster.",
      approach:
        "Replace static fields with a guided AI flow that captures urgency, budget band, integration needs, and desired timeline, then writes a structured summary into CRM.",
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
    accent: "#9b6dff",
    sections: {
      context:
        "Teams often start by selecting models and tools instead of defining business outcomes and constraints.",
      approach:
        "Begin with one high-value workflow, define baseline metrics, and map only the dependencies needed to ship a measurable v1 in 2-3 weeks.",
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
  "AI Chatbots": "#4f8ef7",
  "AI Agents": "#9b6dff",
  "AI Integrations": "#22d3ee",
  Infrastructure: "#4f8ef7",
  Strategy: "#9b6dff",
};