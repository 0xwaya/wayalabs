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
      "We built a Next.js site on Vercel. Quote requests and the on-site Onyx chat both hand a lead to the sales webhook. Onyx answers through Ollama, using Urban Stone's playbook, and falls back to the on-site knowledge base if that call fails. Trade partners use a contractor portal with magic-link sign-in. A lead-sourcer runs unattended three times a day and, in live mode, delivers matched leads to the sales inbox. It does not contact the people who posted.",
    architecture: [
      "Next.js Pages router on Vercel, React 19",
      "Onyx chat → Ollama, with the Urban Stone playbook as the prompt",
      "Quote form and Onyx chat → API route → sales webhook",
      "Contractor portal with Supabase access control and Resend mail",
      "Spanish-language page (/es) and coverage page",
      "Schema.org HomeAndConstructionBusiness, Service, and FAQPage markup",
      "Lead-sourcer on GitHub Actions, unattended at 8:00, 12:00, and 5:00 ET, in live mode",
    ],
    timeline: "Live at urbanstone.co; ongoing iteration",
    impactHeading: "What's live",
    demoUrl: undefined,
    impact: [
      "A scheduled lead-sourcer runs unattended and delivers matched leads to the sales inbox",
      "Onyx, the on-site chat, answers through Ollama and can hand a project to the sales inbox",
      "Trade partners have a dedicated contractor portal",
      "English- and Spanish-speaking customers are served from one site",
    ],
    nextIteration:
      "Move social publishing into this project's own backend so campaign images are scheduled by Urban Stone, not by an outside uploader.",
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
    title: "OpenClaw, private Echo runtime",
    client: "Internal runtime",
    url: "",
    category: "AI Agent",
    tags: ["OpenClaw", "Sandbox", "Gated tools"],
    summary:
      "Echo is the private OpenClaw deployment. It runs in a private cloud network, with the session sandboxed and tool use behind gates. This note states that boundary only. It is not a client deployment, and no measured result is published.",
    problem:
      "An assistant that can review repositories and draft work also needs a place to run where a mistake stays inside the network, and where a high-impact action cannot proceed on its own.",
    approach:
      "Echo keeps OpenClaw inside a private cloud network. The session runs in a sandbox. If that sandbox network is not there, the session does not fall back to an open network. Tool use is gated: ordinary work stays in the sandbox, and high-impact actions wait for the owner. Other agents cannot grant that approval.",
    architecture: [
      "Private cloud network. Echo is not a public service",
      "Container sandbox for the session, with no fallback to the host network",
      "Gates on tool use. Host execution is denied unless the owner approves",
      "Separate from the CEO Executive Orchestrator sampler and from Grok operator sessions",
      "Private configuration stays in the private repository",
    ],
    timeline: "Private runtime; ongoing",
    impactHeading: "Scope and limits",
    impact: [
      "Contained in a private cloud network, with a sandbox and gated tools",
      "No measured productivity or reliability result is published",
      "No client deployment is claimed",
    ],
    nextIteration:
      "Keep the private runtime unpublished here. A public demonstration would need its own reviewed copy and evidence.",
    demoUrl: undefined,
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
