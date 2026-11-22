import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/seo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Policy in a Fragmented World (November 2026)",
  description: "A fact-checked look at global AI governance, the US-China race, and practical architecture-first guardrails as of November 22, 2026.",
  alternates: { canonical: "/research/ai-policy-fragmented-world-nov-2026" },
  openGraph: pageOpenGraph("/research/ai-policy-fragmented-world-nov-2026"),
};

export default function AIPolicyResearchNote() {
  return (
    <div className="min-h-screen">
      <section className="py-16 px-6 border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <Link href="/insights" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8">
            <ArrowLeft size={14} /> Insights
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">Research Note · November 22, 2026</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">AI Policy in a Fragmented World</h1>
          <p className="text-lg text-[var(--muted)] leading-relaxed">Global governance, the US-China race, and practical guardrails. Facts as of November 22, 2026.</p>
          <p className="text-sm text-[var(--muted)] mt-4">Wayalabs analysis</p>
        </div>
      </section>
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto prose prose-invert max-w-none">
          <p className="italic text-[var(--muted)]">Wayalabs analysis. Facts as of November 22, 2026.</p>
          <h2>1. Executive Summary</h2>
          <p>There is no single global rulebook for AI. The first UN Global Dialogue on AI Governance (Geneva, July 6–7, 2026) drew delegations from 163 countries but produced a co-chairs&apos; summary, not binding rules. Three main approaches now sit side by side:</p>
          <ul>
            <li><strong>The United States</strong> favors innovation first. It relies on voluntary industry commitments, executive action and export controls, and at APEC in Shenzhen on November 19, 2026, President Trump said the US opposes &quot;any form of globalist regulation&quot; of AI.</li>
            <li><strong>China</strong> pairs state direction at home with an institution-building push abroad. Its main vehicle is the World AI Cooperation Organization (WAICO), founded in Shanghai on July 16, 2026 by 29 countries.</li>
            <li><strong>The European Union</strong> is staying on its regulatory path with the AI Act, while pushing back key high-risk deadlines through the 2026 &quot;AI Omnibus.&quot;</li>
          </ul>
          <p>Two coalitions with very different memberships now give these approaches institutional form: the US-led Pax Silica (26 signatories as of October 2026) and WAICO (29 founders, with more countries signing since).</p>
          <p>The US still leads in frontier models and compute. Epoch AI estimates that 72% of the world&apos;s new AI compute from 2022 through June 2026 went to the US, against about 10% to China. China is closing the gap through open-weight models, cheaper inference and a large electricity advantage.</p>
          <p>US policy moved quickly in November. The Senate passed the Bipartisan American Affordability and Jobs Act (BAAJA) 62–33. A bipartisan group of House members released an outline of the SAFE AI Act. Commerce added a remote-access rule on advanced chips. California served Nvidia an investigative subpoena and proposed emergency shutdown powers.</p>
          <p>The practical lesson for builders is the same under any of these regimes: design accountability into the system. That means clear data boundaries, approval gates before consequential actions, evaluation and monitoring, and a clear escalation path. These are the practices Wayalabs builds with.</p>
          <h2>2. Current Global AI Policy Landscape</h2>
          <h3>The UN track: broad participation, no binding outcome</h3>
          <p>The Global Dialogue was set up under General Assembly resolution 79/325. Its first session brought together more than 3,000 participants, six heads of state or government and over 60 ministers. The co-chairs found convergence in four areas: AI&apos;s development potential, persistent divides in compute and capacity, human rights (especially protecting children), and the view that &quot;no single government, company or institution can govern AI alone.&quot; The next session is set for New York in May 2027.</p>
          <p>In his September 2026 General Assembly address, Secretary-General Guterres warned that &quot;the danger is not technology. The danger is technology without accountability.&quot; He called for a multilateral AI risk-management framework with independent oversight, and warned against the world splitting into rival blocs.</p>
          <h3>United States: innovation first, voluntary commitments, export controls</h3>
          <ul>
            <li><strong>Executive framework.</strong> On July 23, 2025, the White House released America&apos;s AI Action Plan and signed Executive Order 14319, &quot;Preventing Woke AI in the Federal Government.&quot;</li>
            <li><strong>APEC Shenzhen (November 2026).</strong> Trump told APEC leaders: &quot;we oppose any form of globalist regulation or anything to control and stifle SI, and we won&apos;t allow that to happen.&quot; After meeting Trump, Xi Jinping said the two countries should ensure AI &quot;always remains under human control.&quot;</li>
            <li><strong>White House Accord (September 29, 2026).</strong> This &quot;Joint Commitment on Frontier Responsibilities&quot; was signed by the President and by leaders of Google, Anthropic, Meta, OpenAI, xAI and Nvidia. It is voluntary.</li>
            <li><strong>Export controls.</strong> These remain the main tool with binding force.</li>
          </ul>
          <h3>China: state direction at home, institution-building abroad</h3>
          <p>At home, China regulates AI through targeted rules rather than one comprehensive statute. Abroad, Beijing has built WAICO, an intergovernmental body headquartered in Shanghai with 29 founding members including Russia, Brazil, Indonesia, Malaysia, Pakistan, Kazakhstan, South Africa and Kenya.</p>
          <h3>European Union: regulation, now on a slower timetable</h3>
          <p>The AI Act is still the most comprehensive binding framework. The AI Omnibus delays the high-risk obligations: stand-alone Annex III systems from December 2, 2027, and AI embedded in regulated products from August 2, 2028.</p>
          <h3>Competing blocs: Pax Silica and WAICO</h3>
          <p>Pax Silica had 26 signatories as of October 23, 2026. The two blocs barely overlap. Kazakhstan is the clearest dual member. Asia is split between the two coalitions.</p>
          <h2>3. US-China AI Race Dynamics</h2>
          <h3>Where the US leads</h3>
          <ul>
            <li><strong>Compute.</strong> From 2022 through June 2026, the US received about 72% of the world&apos;s new AI compute capacity. China received about 10%.</li>
            <li><strong>Frontier models.</strong> Anthropic released Claude Fable 5 on June 9, 2026. Independent benchmarks still put Fable 5 and OpenAI&apos;s GPT-5.6 ahead of China&apos;s best model overall.</li>
            <li><strong>Capital.</strong> Anthropic&apos;s November 2026 IPO priced at a fully diluted valuation of about $1.5 trillion.</li>
          </ul>
          <h3>Where China is gaining</h3>
          <ul>
            <li><strong>Open-weight models.</strong> Moonshot AI announced Kimi K3 on July 16, 2026 (2.8-trillion-parameter, open weights). Zhipu released GLM-5.3 on August 14, 2026.</li>
            <li><strong>Electricity.</strong> China generated 10.6 trillion kWh in 2025, about 2.4 times the US total.</li>
            <li><strong>Self-reliance under export controls.</strong> Huawei says its Ascend chips now outsell Nvidia&apos;s in China, though the USCC assesses they still trail Nvidia and AMD.</li>
          </ul>
          <h2>4. Latest US Developments (November 2026)</h2>
          <ul>
            <li><strong>BAAJA passes the Senate.</strong> On November 19, the Senate passed the Bipartisan American Affordability and Jobs Act 62–33. It is a permitting and energy bill that would direct FERC to require large data centers to pay a larger share of grid costs. It is not yet law.</li>
            <li><strong>SAFE AI Act outline.</strong> On November 19, Representatives Beyer, Jacobs, and Maloy released an outline (not bill text) of the Safe and Accountable Federal Evaluations of AI Act.</li>
            <li><strong>California.</strong> SB 53 and SB 243 have been in force since January 1, 2026. On November 19 the Attorney General served Nvidia an investigative subpoena. A November 16 report recommends emergency shutdown authority (recommendations only).</li>
            <li><strong>Chip licensing and remote access.</strong> Commerce had approved 879,868 advanced chips for China-linked companies as of May 11, 2026 (approvals, not shipments). On November 16, BIS issued a rule on remote access to advanced compute from overseas data centers.</li>
          </ul>
          <h2>5. Wayalabs Approach: Practical Guardrails</h2>
          <p>Wayalabs treats guardrails as architectural and operational requirements. Core practices: begin with system boundaries, data access limits, failure modes, and testable acceptance criteria. Chatbots use only approved source material with explicit escalation and human handoff. Agents (in research) require tool permissions, durable state, and mandatory human review before consequential actions. Deployment includes observability, monitoring, and clear escalation paths. No unattended posting, purchasing, or deployment of consequential actions.</p>
          <h2>6. Implications and Recommendations</h2>
          <p>For builders: document data boundaries and acceptance criteria at the start. Implement human approval gates for tool use and high-impact actions. Maintain audit logs and evaluation cycles. Treat voluntary commitments and legislative outlines as signals rather than settled law. Prefer verifiable, scoped deployments.</p>
          <h2>7. Conclusion</h2>
          <p>AI policy in late 2026 is fragmented by design. Organizations that embed clear boundaries, human oversight, and continuous evaluation from the architecture stage can operate effectively amid this fragmentation. That is the approach Wayalabs takes: clear boundaries, gated actions and measured iteration.</p>
          <p className="mt-8 text-sm text-[var(--muted)]">Prepared by Wayalabs. Facts as of November 22, 2026.</p>
        </div>
      </article>
    </div>
  );
}
