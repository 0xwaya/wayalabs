export const services = [
  {
    id: "chatbots",
    title: "AI Chatbots",
    slug: "chatbots",
    tagline: "Live conversational systems",
    description:
      "A custom chatbot for the business, grounded in approved source material, with a human handoff. A client deployment is live and still being improved.",
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
    tagline: "Agents and orchestrators in research",
    description:
      "Research into scoped agents and orchestrators, with explicit routing, limited tool permissions, durable state, and human review. Not for sale.",
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
