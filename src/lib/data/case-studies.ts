export const caseStudies = [
  {
    id: "urban-stone",
    title: "Urban Stone Collective — Countertop Website & Lead System",
    client: "Urban Stone Collective (Amazon Granite LLC)",
    url: "urbanstone.co",
    category: "AI-Enhanced Web Platform",
    tags: ["Local Business", "Lead Capture", "Automation"],
    summary:
      "Website and lead system for Urban Stone Collective, a granite, quartz, and quartzite countertop fabrication and installation company serving greater Cincinnati and Northern Kentucky.",
    problem:
      "Urban Stone Collective fabricates and installs custom countertops for homeowners, remodelers, and builders, with a 3–5 day turnaround from deposit to install. It needed a fast, credible web presence that turns local search traffic into quote requests and routes every lead to the sales inbox without manual copying.",
    approach:
      "We built a Next.js site on Vercel with a quote form that delivers each lead through a Zapier webhook to the sales inbox, a contractor portal for trade partners, a Spanish-language page, a service coverage page, and an on-site AI chat assistant.",
    architecture: [
      "Next.js on Vercel with materials and service-area pages",
      "Quote form → API route → Zapier webhook → sales inbox",
      "Contractor portal with sign-in",
      "Spanish-language page (/es) and coverage page",
      "Schema.org HomeAndConstructionBusiness, Service, and FAQPage markup",
      "Lead-sourcing automation running in review-only mode",
    ],
    timeline: "Live at urbanstone.co; ongoing iteration",
    impactHeading: "What's live",
    demoUrl: undefined,
    impact: [
      "Quote requests route automatically to the sales inbox",
      "Trade partners have a dedicated contractor portal",
      "English- and Spanish-speaking customers are served from one site",
    ],
    nextIteration:
      "Move automated lead sourcing beyond review-only mode once lead quality is validated.",
  },
  {
    id: "queen-city-soundboard",
    title: "Queen City Soundboard",
    client: "Queen City Soundboard",
    url: "queencitysoundboard.com",
    category: "AI-Enhanced Web Platform",
    tags: ["Local Events", "Event Calendar", "Structured Data"],
    summary:
      "\"Sounds of the Queen City\" — a guide to live music, comedy, and cultural events across Cincinnati and Northern Kentucky, with a local event calendar and official ticket links.",
    problem:
      "Event listings for Cincinnati and Northern Kentucky are scattered across venue sites, ticketing platforms, and social feeds. Fans needed one local calendar that points to official tickets, and venues and promoters needed a simple way to get their shows listed.",
    approach:
      "We built a Next.js event guide with a filterable calendar, Cincinnati and Covington city pages, a Latin events category, live local sports scores, and forms for venues and promoters to submit events for review or request promoted placement.",
    architecture: [
      "Next.js App Router event calendar and city pages",
      "Official ticket links on every listing",
      "Schema.org Event and WebSite markup for search",
      "Event submission and promotion request forms with editorial review",
      "Cincinnati sports scores card",
    ],
    timeline: "Live at queencitysoundboard.com; ongoing iteration",
    impactHeading: "What's live",
    demoUrl: undefined,
    impact: [
      "Current events across Cincinnati and Northern Kentucky with official ticket links",
      "Venues, promoters, and artists can submit events for review",
      "Promoted placements are clearly labeled as promoted",
    ],
    nextIteration:
      "Grow venue and promoter submissions and expand coverage across Northern Kentucky.",
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
