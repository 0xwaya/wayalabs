export const services = [
  {
    id: "chatbots",
    title: "AI Chatbots",
    slug: "chatbots",
    tagline: "Conversational system research",
    description:
      "Research and development for conversational interfaces using approved source material, project-specific evaluation, and defined human escalation.",
    icon: "MessageSquare",
    designConsiderations: [
      "Approved knowledge sources",
      "Human escalation path",
      "Representative evaluation questions",
      "Data retention and access scope",
    ],
  },
  {
    id: "agents",
    title: "AI Agents",
    slug: "agents",
    tagline: "Bounded agent orchestration R&D",
    description:
      "Research into scoped multi-step workflows with explicit routing, limited tool permissions, durable state, and human review boundaries.",
    icon: "Cpu",
    designConsiderations: [
      "Role-aware graph routing",
      "Tool authorization boundaries",
      "Durable job lifecycle",
      "Human approval for consequential actions",
    ],
  },
  {
    id: "integrations",
    title: "AI Integrations",
    slug: "integrations",
    tagline: "Integration architecture research",
    description:
      "Explore provider and application integrations with project-specific data flow, identity, failure handling, and evaluation requirements.",
    icon: "Plug",
    designConsiderations: [
      "Least-privilege credentials",
      "Data flow and retention",
      "Provider timeouts and metering",
      "Observability and failure handling",
    ],
  },
] as const;

export type Service = (typeof services)[number];
