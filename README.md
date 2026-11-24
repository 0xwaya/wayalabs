<p align="center">
  <a href="https://wayalabs.com">
    <img src="docs/brand/wayalabs-mark-badge.png" alt="Wayalabs" width="360" />
  </a>
</p>

<h1 align="center">Wayalabs</h1>

<p align="center">
  Wayalabs builds lead systems for local trade and platforms for local listings.<br />
  Discovery first. Chatbots ship inside those builds. Agents stay in research — not for sale.
</p>

<p align="center">
  <a href="https://wayalabs.com"><strong>wayalabs.com</strong></a>
</p>

<p align="center">
  <a href="https://nextjs.org"><img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" /></a>
  <a href="https://typescriptlang.org"><img alt="TypeScript 5" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" /></a>
  <a href="https://tailwindcss.com"><img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" /></a>
</p>

---

## Overview

This repository is the source for [wayalabs.com](https://wayalabs.com).

- **Discovery → Lead system / Platform** — the public commercial ladder on `/offers`
- **AI Chatbots** — live inside lead systems, custom for the business
- **AI Agents** — research only; not for sale

The homepage, Open Graph, Twitter, and organization JSON-LD share one description from `src/lib/site.ts`. Page-level titles and descriptions override it. Do not set `title`, `description`, or `url` on the root `openGraph` or `twitter` objects, or inner pages will keep advertising the homepage.

---

## Case studies

Selected work from `src/lib/data/case-studies.ts`. Client brands are clients. Full notes: [wayalabs.com/case-studies](https://wayalabs.com/case-studies).

- [Urban Stone Collective](https://wayalabs.com/case-studies/urban-stone) — Client. Website and lead system for a granite, quartz, and quartzite countertop fabricator serving greater Cincinnati and Northern Kentucky.
- [Queen City Soundboard](https://wayalabs.com/case-studies/queen-city-soundboard) — Client. Guide to live music, comedy, and cultural events across Cincinnati and Northern Kentucky, with a local calendar and official ticket links.
- [Grok operator environments](https://wayalabs.com/case-studies/grok-operators) — Research, not a client product. Isolated checkouts, with a person approving changes before a push. Not for sale.
- [OpenClaw, private Echo runtime](https://wayalabs.com/case-studies/openclaw-agent) — Research, not a client deployment. Private runtime with a sandbox and gated tools. Not for sale.

---

## Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) | ISR, RSC, file-based routing |
| Language | TypeScript 5 | Full type safety across components and data |
| Styling | Tailwind CSS 4 | Design tokens, utility-first, zero runtime |
| Icons | Lucide React | Consistent, tree-shakeable icon set |
| Motion | CSS transitions | No animation runtime on the page |
| Tests | Vitest | Component and data smoke tests |
| Deployment | Vercel | Production host, preview URLs on pull requests |

---

## Project structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home
│   ├── layout.tsx                # Root layout, metadata, Navbar + Footer
│   ├── ai-solutions/
│   │   ├── page.tsx              # Services index
│   │   ├── chatbots/page.tsx
│   │   ├── agents/page.tsx
│   │   └── integrations/page.tsx
│   ├── services/page.tsx         # Redirects to /offers
│   ├── case-studies/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── process/page.tsx
│   ├── about/page.tsx
│   ├── insights/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── contact/page.tsx
│   ├── lab/ceo-agent/page.tsx    # Orchestrator research sampler
│   ├── api/contact/route.ts      # Contact form delivery
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── offers/page.tsx           # In the repo; hidden from navigation
│   └── logos/page.tsx            # Dev logo comparison; not in navigation
├── components/
│   ├── home/                     # Hero, services, projects, process, CTA
│   ├── layout/                   # Navbar, Footer
│   ├── contact/ContactForm.tsx
│   ├── ceo/CeoScenarioSampler.tsx
│   └── ui/                       # Button, Input, SectionWrapper
└── lib/
    ├── site.ts                   # Shared description; navigation flags
    ├── seo.ts                    # Per-page Open Graph helper
    ├── booking.ts
    ├── contact-validation.ts
    ├── contact-delivery.ts
    ├── data/                     # services, case-studies, insights, categories, offers
    └── utils.ts                  # cn()
```

`showOffersInNavigation` in `src/lib/site.ts` is true, so Offers appears in the header, mobile menu, and footer. `/services` permanently redirects to `/offers`. Tests live in `src/__tests__`.

---

## Getting started

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
npm run dev            # Development server with Turbopack
npm run build          # Production build
npm run start          # Serve production build locally
npm run lint           # ESLint
npm run test           # Vitest once
npm run test:watch     # Vitest watch mode
npm run test:coverage  # Vitest with coverage
```

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in values. **Never commit `.env.local` or any file containing real secrets.**

```bash
# .env.example — commit this file, not .env.local
# Contact form. Both are required before /api/contact accepts an inquiry.
# CONTACT_FROM_EMAIL must be a verified Resend sender.
RESEND_API_KEY=
CONTACT_FROM_EMAIL=
CONTACT_TO_EMAIL=admin@wayalabs.com
```

---

## Security practices

- Secrets and API keys stay out of git. `.env.example` lists the keys with empty values
- No credentials are hard-coded in source
- `/api/contact` sanitizes input, checks the payload, and rate-limits requests
- Content-Security-Policy and the other response headers are set in `next.config.ts`
- Outbound links use `rel="noopener noreferrer"`

---

## Deployment

The site is deployed on **Vercel** from the `main` branch. Preview deployments are generated for every pull request.

```bash
# Manual production deploy via Vercel CLI
npx vercel --prod
```

Configure environment variables in the Vercel dashboard (Settings → Environment Variables). Do not commit `.env.production`.

---

## Contributing

1. Branch from `main` — use `feat/`, `fix/`, or `chore/` prefixes
2. Run `npm run lint` and `npm run test` before opening a PR
3. PRs require at least one passing review before merge to `main`
4. Never commit secrets, tokens, or credentials

---

## Related repositories

| Repo | Description |
|---|---|
| [0xwaya](https://github.com/0xwaya) | Portfolio and active project shipping |

---

## License

MIT © [Wayalabs](https://wayalabs.com)
