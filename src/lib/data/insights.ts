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
