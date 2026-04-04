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
    title: "OpenClaw Agentic Automation System",
    client: "Internal / WayaLabs",
    url: "github.com/0xwaya",
    category: "AI Agent",
    tags: ["AI Agent", "Workflow Automation", "LLM Orchestration"],
    summary:
      "An internal agentic system built to automate development workflows — from code review assistance to documentation generation and cross-repo task orchestration. Now the foundation for client agent deployments.",
    problem:
      "Repetitive development lifecycle tasks — PR reviews, documentation updates, context switching across repos — were consuming disproportionate engineering time. We needed an autonomous system that could handle these reliably.",
    approach:
      "We designed a modular agent architecture with clear tool boundaries, a prompt/version management system, and observability baked in from the start. Built iteratively with real production feedback.",
    architecture: [
      "Modular agent runtime with pluggable tool definitions",
      "Prompt versioning and evaluation pipeline",
      "Multi-LLM routing (OpenAI + Anthropic with fallback logic)",
      "Safety layer: role constraints, input sanitisation, output moderation",
      "Structured logging and trace replay for debugging",
      "CLI interface for human-in-the-loop control",
    ],
    timeline: "Ongoing — initial version in 3 weeks, production in 6",
    impact: [
      "Documentation generation time reduced by ~85%",
      "Code review pre-checks automated end-to-end",
      "Pattern now deployed for 2 client automation engagements",
    ],
    nextIteration:
      "Multi-agent coordination layer and external client deployment packaging.",
  },
] as const;

export type CaseStudy = (typeof caseStudies)[number];
