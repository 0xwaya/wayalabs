# WayaLabs

> **AI solutions studio** — building chatbots, AI agents, and intelligent web platforms for ambitious businesses.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Overview

This repository contains the source for **wayalabs.com** — a full rebuild repositioning WayaLabs from a Web3-forward studio to an AI solutions company focused on:

- **AI Chatbots** — customer support deflection, lead capture, onboarding
- **AI Agents** — workflow automation, internal ops, cross-system orchestration
- **AI Integrations** — LLM + CRM + docs + APIs with observability built in
- **AI-Enhanced Web Platforms** — frontend + backend intelligence in one build

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) | ISR, RSC, file-based routing |
| Language | TypeScript 5 | Full type safety across components and data |
| Styling | Tailwind CSS 4 | Design tokens, utility-first, zero runtime |
| Icons | Lucide React | Consistent, tree-shakeable icon set |
| Animation | Framer Motion | Lightweight, production-safe motion |
| Deployment | Vercel (target) | Edge network, preview URLs, zero config |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home
│   ├── layout.tsx                # Root layout (Navbar + Footer)
│   ├── ai-solutions/             # Service pages
│   │   ├── page.tsx              # Services index
│   │   ├── chatbots/page.tsx
│   │   ├── agents/page.tsx
│   │   └── integrations/page.tsx
│   ├── case-studies/             # Project case studies
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── process/page.tsx
│   ├── about/page.tsx
│   ├── insights/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── home/                     # Homepage sections
│   │   ├── Hero.tsx
│   │   ├── ServicesGrid.tsx
│   │   ├── OutcomeMetrics.tsx
│   │   ├── FeaturedProjects.tsx
│   │   ├── ProcessFramework.tsx
│   │   └── CTABanner.tsx
│   ├── layout/                   # Global layout components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── ui/                       # Reusable UI primitives
│       └── SectionWrapper.tsx
└── lib/
    ├── data/                     # Static content data
    │   ├── services.ts
    │   └── case-studies.ts
    └── utils.ts                  # cn() and shared helpers
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Local development

```bash
# Clone
git clone https://github.com/0xwaya/wayalabs.git
cd wayalabs

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start dev server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

```bash
npm run dev        # Development server with Turbopack
npm run build      # Production build
npm run start      # Serve production build locally
npm run lint       # ESLint
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values. **Never commit `.env.local` or any file containing real secrets.**

```bash
# .env.example — commit this file, not .env.local
# Contact form / email
CONTACT_API_KEY=

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=

# Calendar embed (Calendly / Cal.com)
NEXT_PUBLIC_CALENDAR_URL=

# CMS (if Sanity/Contentful is added)
SANITY_PROJECT_ID=
SANITY_DATASET=
SANITY_API_TOKEN=
```

---

## Security Practices

- All secrets and API keys are excluded via `.gitignore` — see the env section above
- No credentials are hard-coded anywhere in source
- `.env.example` ships with keys but no values — copy and fill locally
- `rel="noopener noreferrer"` on all outbound links
- Input sanitisation enforced at any future API route boundary
- CSP headers planned for production deployment

---

## Deployment

Deployed to **Vercel** from the `main` branch. Preview deployments are generated automatically for every pull request.

```bash
# Manual production deploy via Vercel CLI
npx vercel --prod
```

Configure these environment variables in the Vercel dashboard (Settings → Environment Variables) — **do not use `.env.production` in the repo**.

---

## Contributing

1. Branch from `main` — use `feat/`, `fix/`, or `chore/` prefixes
2. Run `npm run lint` before opening a PR
3. PRs require at least one passing review before merge to `main`
4. Never commit secrets, tokens, or credentials

---

## Related Repositories

| Repo | Description |
|---|---|
| [0xwaya](https://github.com/0xwaya) | Portfolio and active project shipping |

---

## License

MIT © [WayaLabs](https://wayalabs.com)
