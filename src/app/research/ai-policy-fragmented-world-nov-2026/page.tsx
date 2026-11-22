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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="py-20 px-6 border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto">
          <Link href="/insights" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Insights
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">Research Note · November 22, 2026</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">AI Policy in a Fragmented World</h1>
          <p className="text-xl text-[var(--muted)] leading-relaxed max-w-3xl">
            Global governance, the US-China race, and practical architecture-first guardrails. Facts as of November 22, 2026.
          </p>
          <p className="text-sm text-[var(--muted)] mt-6">Wayalabs analysis · Prepared for builders and operators</p>
        </div>
      </section>

      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <p className="text-sm italic text-[var(--muted)]">
              Wayalabs analysis. Facts as of November 22, 2026. This note is written for builders who need to operate while rules remain fragmented.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4">1. Executive Summary</h2>
            <p className="leading-relaxed text-[var(--muted)] mb-4">
              There is no single global rulebook for AI. The first UN Global Dialogue on AI Governance (Geneva, July 6–7, 2026) produced a co-chairs&apos; summary, not binding rules. Three main approaches now sit side by side:
            </p>
            <ul className="space-y-3 text-[var(--muted)] leading-relaxed">
              <li><strong className="text-[var(--foreground)]">United States</strong> — Innovation first. Voluntary commitments, executive action, and export controls. At APEC in Shenzhen on November 19, 2026, President Trump said the US opposes &quot;any form of globalist regulation&quot; of AI.</li>
              <li><strong className="text-[var(--foreground)]">China</strong> — State direction at home, institution-building abroad via the World AI Cooperation Organization (WAICO), founded in Shanghai on July 16, 2026 with 29 founding members.</li>
              <li><strong className="text-[var(--foreground)]">European Union</strong> — Comprehensive risk-based regulation via the AI Act, with high-risk deadlines delayed by the 2026 AI Omnibus.</li>
            </ul>
            <p className="mt-4 leading-relaxed text-[var(--muted)]">
              Two coalitions give these approaches institutional form: US-led Pax Silica (~26 signatories) and China-led WAICO. Membership overlap is limited (Kazakhstan is the clearest dual member). The US retains the lead in frontier models and compute (Epoch AI: ~72% of new AI compute capacity 2022–June 2026). China advances in open-weight models and electricity generation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Current Global AI Policy Landscape</h2>
            <h3 className="text-lg font-semibold mt-6 mb-2">UN track</h3>
            <p className="leading-relaxed text-[var(--muted)]">
              The Global Dialogue (under General Assembly resolution 79/325) brought more than 3,000 participants. Co-chairs noted convergence on development potential, compute divides, human rights, and the view that no single actor can govern AI alone. Next session: New York, May 2027. Secretary-General Guterres warned that &quot;the danger is not technology. The danger is technology without accountability.&quot;
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-2">United States</h3>
            <ul className="space-y-2 text-[var(--muted)] leading-relaxed list-disc pl-5">
              <li>July 23, 2025: America&apos;s AI Action Plan and EO 14319 (&quot;Preventing Woke AI in the Federal Government&quot;).</li>
              <li>September 29, 2026: White House Accord on Frontier Responsibilities (voluntary; signed by Google, Anthropic, Meta, OpenAI, xAI, Nvidia). Four layers including independent external auditor and board committee.</li>
              <li>November 19, 2026 (APEC Shenzhen): Trump rejected &quot;any form of globalist regulation or anything to control and stifle SI.&quot;</li>
              <li>Export controls remain the primary binding tool.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-2">China</h3>
            <p className="leading-relaxed text-[var(--muted)]">
              Domestic rules are application-specific (generative AI, algorithms, deep synthesis, labeling). No comprehensive standalone AI law has been published. Abroad, WAICO focuses on capacity-building and open, inclusive AI under the UN framework.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-2">European Union</h3>
            <p className="leading-relaxed text-[var(--muted)]">
              AI Act remains the most comprehensive binding framework. AI Omnibus delays high-risk obligations (Annex III from December 2, 2027; Annex I from August 2, 2028). GPAI duties are not delayed.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-2">Competing blocs</h3>
            <p className="leading-relaxed text-[var(--muted)]">
              Pax Silica (launched December 2025) secures the AI supply chain. 26 signatories as of October 23, 2026. WAICO and Pax Silica have minimal membership overlap. Asia is split between the two.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. US-China AI Race Dynamics</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
                <h3 className="font-semibold mb-2">US leads</h3>
                <ul className="text-sm text-[var(--muted)] space-y-1">
                  <li>• ~72% of new AI compute (Epoch AI)</li>
                  <li>• Claude Fable 5 (June 2026)</li>
                  <li>• Anthropic IPO ~$1.5T</li>
                </ul>
              </div>
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
                <h3 className="font-semibold mb-2">China gains</h3>
                <ul className="text-sm text-[var(--muted)] space-y-1">
                  <li>• Kimi K3 (2.8T, open weights, July 2026)</li>
                  <li>• GLM-5.3 (August 2026)</li>
                  <li>• Electricity ~2.4× US</li>
                </ul>
              </div>
            </div>
            <p className="leading-relaxed text-[var(--muted)]">
              USCC 2026 Annual Report (November 18) highlighted PLA interest in advanced Nvidia processors and Chinese distillation of US model capabilities. A September 2026 agreement created an AI incident channel; independent trackers reported it was not yet operating in mid-November.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Latest US Developments (November 2026)</h2>
            <ul className="space-y-3 text-[var(--muted)] leading-relaxed">
              <li><strong className="text-[var(--foreground)]">BAAJA (Senate 62–33, Nov 19).</strong> Energy and permitting bill (not an AI-safety statute, not yet law). Would direct FERC to shift more grid costs onto large data centers. Outside estimate ~$55B over 10 years.</li>
              <li><strong className="text-[var(--foreground)]">SAFE AI Act outline (Nov 19).</strong> Reps. Beyer, Jacobs, Maloy. Outline only—no bill text. Would require frontier safety frameworks, evaluations, incident reporting, and emergency authority if enacted.</li>
              <li><strong className="text-[var(--foreground)]">California.</strong> SB 53 and SB 243 in force since January 1, 2026. Nov 19: AG investigative subpoena to Nvidia. Nov 16 report recommends emergency shutdown authority (recommendations only).</li>
              <li><strong className="text-[var(--foreground)]">Chip controls.</strong> 879,868 advanced chips approved for China-linked firms as of May 11, 2026 (approvals, not shipments). Nov 16 BIS rule on remote access to advanced compute from overseas data centers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Wayalabs Approach: Practical Guardrails</h2>
            <p className="leading-relaxed text-[var(--muted)] mb-4">
              Wayalabs treats guardrails as architectural and operational requirements rather than post-hoc policy overlays. Core practices from published work:
            </p>
            <ul className="space-y-2 text-[var(--muted)] leading-relaxed list-disc pl-5">
              <li>Begin with system boundaries, data access limits, failure modes, and testable acceptance criteria.</li>
              <li>Chatbots use only approved source material with explicit escalation and human handoff.</li>
              <li>Agents (still in research) require tool permissions, durable state, and mandatory human review before consequential actions.</li>
              <li>Deployment includes observability, monitoring, and clear escalation paths.</li>
              <li>No unattended posting, purchasing, or deployment of consequential actions.</li>
            </ul>
            <p className="mt-4 text-sm text-[var(--muted)] italic">
              These practices are illustrative of one studio&apos;s approach. They can support compliance readiness but do not replace applicable state, federal, or foreign rules.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Implications and Recommendations</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">For businesses adopting AI</h3>
                <ol className="list-decimal pl-5 space-y-1 text-[var(--muted)] leading-relaxed">
                  <li>Document data boundaries and acceptance criteria before building.</li>
                  <li>Gate consequential actions (payments, outbound messages, publishing) behind human approval.</li>
                  <li>Ask vendors for evaluation, incident reporting, and shutdown evidence.</li>
                  <li>Know model origin and licensing, especially in regulated workflows.</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold mb-2">For builders</h3>
                <ol className="list-decimal pl-5 space-y-1 text-[var(--muted)] leading-relaxed">
                  <li>Treat outlines and voluntary pledges as signals, not law.</li>
                  <li>Make logs and traces the default.</li>
                  <li>Keep open-weight options open with documented origin and license.</li>
                </ol>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Conclusion</h2>
            <p className="leading-relaxed text-[var(--muted)]">
              AI policy in late 2026 is fragmented by design. Washington emphasizes speed, voluntary commitments, and control of the compute stack. Beijing emphasizes open models, power capacity, and new institutions for the Global South. Brussels continues regulating on a slower high-risk timeline. For most organizations, waiting for rules to settle is not a strategy. The controls that recur across proposals—human approval, evaluation, incident reporting, and the ability to stop a system—can be built into a project today. That is the approach Wayalabs takes.
            </p>
          </section>

          <div className="pt-8 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--muted)]">Prepared by Wayalabs. Facts as of November 22, 2026. Primary sources include UN co-chairs&apos; summary, White House documents, State Department Pax Silica releases, Epoch AI compute data, USCC 2026 report, and congressional releases on BAAJA and the SAFE AI Act outline.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
