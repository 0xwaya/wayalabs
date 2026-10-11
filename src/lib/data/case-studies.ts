export const caseStudies = [
  {
    id: "urban-stone",
    title: "Urban Stone / Amazon Granite Rebrand Portal",
    client: "Urban Stone",
    url: "urbanstone.co",
    category: "AI-Enhanced Web Platform",
    tags: ["Rebrand", "Web Platform", "Product Portal"],
    summary:
      "Built a full brand and commerce portal for Urban Stone's Amazon Granite product line — positioning a commoditised home-improvement product through premium UX, structured content, and automated dealer tooling.",
    problem:
      "Urban Stone had premium-grade granite products being sold in a race-to-the-bottom Amazon context. They needed a brand home that established quality, educated buyers, and gave dealers a place to send traffic beyond the marketplace.",
    approach:
      "We designed and built a full brand portal — product catalogue with structured data, dealer resource hub, and AI-assisted FAQ surfaces that reduce inbound support volume.",
    architecture: [
      "Next.js App Router with ISR for product pages",
      "Structured product schema (Schema.org Product + ItemList)",
      "AI-powered Q&A layer on product specifications",
      "Dealer portal with gated resource downloads",
      "CDN-optimised image delivery for high-res stone textures",
    ],
    timeline: "6 weeks from discovery to launch",
    impactHeading: "Project Outcomes",
    demoUrl: undefined,
    impact: [
      "Dealer referral traffic increased measurably within 30 days",
      "Support inbound reduced by AI-assisted FAQ coverage",
      "SEO foundation established for commercial granite queries",
    ],
    nextIteration:
      "Expand AI layer to handle custom quote requests and integrate with dealer CRM.",
  },
  {
    id: "queen-city-soundboard",
    title: "Queen City Soundboard",
    client: "Queen City Soundboard",
    url: "queencitysoundboard.com",
    category: "AI-Enhanced Web Platform",
    tags: ["Music", "AI Discovery", "Platform"],
    summary:
      "A modern platform for local music discovery and session booking — built with AI-assisted search and matching to connect artists, studios, and event organisers in the greater Charlotte area.",
    problem:
      "Local music infrastructure is fragmented — artists, studios, and promoters all use disconnected DMs, spreadsheets, and word-of-mouth. Queen City Soundboard needed a platform that could surface the right match at the right time.",
    approach:
      "We built a searchable directory with AI-assisted matching logic, structured profiles, and a booking inquiry flow — optimised for both local SEO and direct conversion.",
    architecture: [
      "Next.js with static generation for directory pages",
      "Search layer with semantic matching on artist bios and capabilities",
      "Structured Schema.org markup for local business and events",
      "Inquiry routing with automated acknowledgement",
      "Analytics instrumentation for match quality improvement",
    ],
    timeline: "5 weeks to initial launch",
    impactHeading: "Project Outcomes",
    demoUrl: undefined,
    impact: [
      "Platform launched with 50+ artist profiles at go-live",
      "Booking inquiry flow operational from day one",
      "Local SEO coverage for Charlotte music search queries",
    ],
    nextIteration:
      "Add AI-driven event matching and session availability calendar integration.",
  },
  {
    id: "openclaw-agent",
    title: "OpenClaw Workflow Exploration",
    client: "Internal exploration",
    url: "",
    category: "AI Agent",
    tags: ["AI Agent", "Workflow Automation", "LLM Orchestration"],
    summary:
      "An internal exploration of how an OpenClaw-based assistant could support software-development workflows. This project note describes scope only; no client deployment or measured productivity result is claimed.",
    problem:
      "The exploration considered whether an operator-directed assistant could help with recurring repository review, documentation, and cross-repository coordination tasks.",
    approach:
      "The work remained an internal prototype and planning effort. Any suggested code or documentation changes require human review; this page does not represent an autonomous production service.",
    architecture: [
      "OpenClaw-based internal assistant exploration",
      "Workflow themes: repository review, documentation, and coordination",
      "Operator direction and human review remain essential",
      "Not the CEO Executive Orchestrator or its public sampler",
    ],
    timeline: "Internal exploration; ongoing",
    impactHeading: "Scope and limits",
    impact: [
      "No measured productivity or reliability result is published",
      "No client deployment is claimed",
      "Private runtime details and operator data are not part of this case study",
    ],
    nextIteration:
      "Any future external demonstration requires a separately reviewed public-safe copy and evidence. This case study does not describe or expose the private runtime.",
    demoUrl: "/lab/ceo-agent",
  },
] as const;

export type CaseStudy = (typeof caseStudies)[number];
