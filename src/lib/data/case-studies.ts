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
      "We built a Next.js site on Vercel. Quote requests and the on-site Onyx chat both hand a lead to the sales webhook. Trade partners use a contractor portal with magic-link sign-in. A separate lead-sourcer checks public sources only when that source is explicitly switched on, and it writes a run report instead of contacting anyone.",
    architecture: [
      "Next.js Pages router on Vercel, React 19",
      "Quote form and Onyx chat → API route → sales webhook",
      "Contractor portal with Supabase access control and Resend mail",
      "Spanish-language page (/es) and coverage page",
      "Schema.org HomeAndConstructionBusiness, Service, and FAQPage markup",
      "Lead-sourcer on GitHub Actions. County permits and Facebook Marketplace stay off until a repo flag enables them, with per-run caps",
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
      "Keep lead-sourcer sources opt-in until lead quality is reviewed. Move social publishing into this project's own backend so campaign images are scheduled by Urban Stone, not by an outside uploader.",
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
      "We built a Next.js 16 event guide with a filterable calendar, Cincinnati and Covington city pages, English and Spanish copy, live local sports scores, and forms that store event and promotion requests for editorial review. Checkout stays with the venue or ticket seller.",
    architecture: [
      "Next.js 16 App Router on Vercel, React 19, TypeScript",
      "Supabase for published events and submissions waiting on review",
      "Official ticket links. Listings that use Ticketmaster are wrapped for attribution",
      "Schema.org Event markup and a share image per event when the show has artwork",
      "Locale cookie for English and Spanish. No separate language URLs",
      "Cincinnati sports scores card",
      "Profile and cover images hosted by the site. Posting them is still a manual step",
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
      "Add a native publisher inside Queen City Soundboard so social images and captions are scheduled by this app. An operator may draft them, but the project should own the job.",
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
  {
    id: "grok-operators",
    title: "Grok operator environments",
    client: "Internal studio workflow",
    url: "",
    category: "AI Agent",
    tags: ["Grok", "Virtual environments", "Human review"],
    summary:
      "Grok sessions run in an isolated checkout, and in a Python virtual environment when the project needs one. They review the studio repos, draft changes, and stop for a person to approve. They do not post, purchase, or deploy on their own.",
    problem:
      "Urban Stone, Queen City Soundboard, and the agent prototypes move on different clocks. One shared environment would mix credentials, and a social post or a code change would be hard to trace back to the project that owns it.",
    approach:
      "Each project keeps its own checkout. Python runtimes, including the CEO orchestrator, keep their own virtual environment. A Grok operator reads that repo, proposes a diff, and a person approves it before anything is pushed. Scheduled work such as social publishing is meant to live in that project's backend, with the operator drafting rather than posting from outside.",
    architecture: [
      "One checkout per project, with that project's own environment variables",
      "Python virtual environments for the CEO orchestrator and similar runtimes",
      "Grok sessions propose changes. A person approves before a push",
      "Separate from the CEO Executive Orchestrator sampler and from the OpenClaw exploration",
      "Native project jobs own anything that should run on a schedule, including social posts",
    ],
    timeline: "In use across the studio repos; ongoing",
    impactHeading: "Scope and limits",
    impact: [
      "Used to review and update the WayaLabs, Queen City Soundboard, and Urban Stone repositories",
      "No unattended posting, purchasing, or deployment",
      "Credentials stay with the project that owns them",
    ],
    nextIteration:
      "Give each live product a native scheduler for its own social and lead workflows, and keep the Grok operator on drafting and review.",
    demoUrl: undefined,
  },
] as const;

export type CaseStudy = (typeof caseStudies)[number];
