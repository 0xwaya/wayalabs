export const services = [
  {
    id: "chatbots",
    title: "AI Chatbots",
    slug: "chatbots",
    tagline: "Convert visitors, deflect tickets, qualify leads — automatically.",
    description:
      "Custom conversational AI that lives on your website, product, or messaging channels. Handles support, sales, and onboarding at scale — with your tone, your knowledge, and measurable outcomes.",
    icon: "MessageSquare",
    capabilities: [
      "Customer support deflection & resolution",
      "Lead qualification and capture",
      "Onboarding assistant and document Q&A",
      "Multilingual support out of the box",
      "Escalation routing to human agents",
      "Analytics and conversation insights",
    ],
    outcomes: [
      { metric: "70%", label: "Ticket deflection rate" },
      { metric: "3×", label: "Lead capture lift" },
      { metric: "<2s", label: "Average response time" },
    ],
  },
  {
    id: "agents",
    title: "AI Agents",
    slug: "agents",
    tagline: "Automate the repeatable work your team shouldn't be doing.",
    description:
      "Goal-directed AI systems that take action — reading, writing, routing, and operating across your tools. From ops workflows to internal triage, we build agents that run reliably in production.",
    icon: "Cpu",
    capabilities: [
      "Internal workflow automation",
      "Multi-step research and synthesis",
      "CRM and ticket triage and routing",
      "Report generation and distribution",
      "Cross-system data orchestration",
      "Monitoring and alerting agents",
    ],
    outcomes: [
      { metric: "80%", label: "Manual task reduction" },
      { metric: "10h+", label: "Weekly hours reclaimed" },
      { metric: "99%", label: "Workflow reliability" },
    ],
  },
  {
    id: "integrations",
    title: "AI Integrations",
    slug: "integrations",
    tagline: "Add intelligence to the tools and platforms you already use.",
    description:
      "Connect LLMs to your CRM, knowledge base, docs, and APIs. We design the data pipelines, security boundaries, and model routing logic that makes AI reliable inside your existing stack.",
    icon: "Plug",
    capabilities: [
      "LLM integration with CRM and helpdesk",
      "Document intelligence and RAG pipelines",
      "API orchestration and prompt management",
      "Model routing and cost optimization",
      "Observability, logging, and eval",
      "Safety and moderation layers",
    ],
    outcomes: [
      { metric: "1 week", label: "To first integration" },
      { metric: "4+", label: "Systems connected on average" },
      { metric: "Full", label: "Observability stack included" },
    ],
  },
] as const;

export type Service = (typeof services)[number];
