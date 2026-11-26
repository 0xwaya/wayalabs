import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { isSafeHref, isSafeSitePath } from "@/lib/safe-url";

/** Intrinsic sizes for public assets referenced by Insights markdown. */
export const insightImageSizes: Record<string, { width: number; height: number }> = {
  "/research/ai-race-nov2026/infographics/a-us-vs-china.png": { width: 2160, height: 2700 },
  "/research/ai-race-nov2026/infographics/b-policy-blocs.png": { width: 2160, height: 3240 },
  "/research/ai-race-nov2026/infographics/c-lab-landscape.png": { width: 2160, height: 2700 },
  "/research/ai-race-nov2026/charts/01-aa-index-overall.png": { width: 1703, height: 792 },
  "/research/ai-race-nov2026/charts/03-model-timeline.png": { width: 1254, height: 696 },
  "/research/ai-race-nov2026/charts/07-export-timeline.png": { width: 1525, height: 636 },
  "/research/ai-race-nov2026/charts/09-efficiency-stack.png": { width: 1547, height: 502 },
  "/research/ai-race-nov2026/charts/11-guardrail-architecture.png": { width: 1304, height: 687 },
  "/research/ai-race-nov2026/charts/12-datacenters.png": { width: 2249, height: 624 },
};

function figureCaptionKind(text: string): "figure" | "kicker" | null {
  if (/^(Figure|Infographic)\s+\d/i.test(text)) return "figure";
  if (/^\d{2}\s*·/.test(text)) return "kicker";
  return null;
}

const components: Components = {
  h1: ({ children }) => (
    <h2 className="text-3xl font-bold tracking-tight mt-12 mb-4">{children}</h2>
  ),
  h2: ({ children }) => (
    <h3 className="text-2xl font-bold tracking-tight mt-12 mb-3">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="text-lg font-semibold tracking-tight mt-8 mb-2">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="leading-relaxed text-[var(--muted)] mb-4">{children}</p>
  ),
  em: ({ children }) => {
    const text = String(children);
    const kind = figureCaptionKind(text);
    if (kind === "figure") {
      return (
        <span className="block text-sm text-[var(--muted)] -mt-3 mb-8 leading-relaxed not-italic">
          {children}
        </span>
      );
    }
    if (kind === "kicker") {
      return (
        <span className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mt-10 mb-2 not-italic">
          {children}
        </span>
      );
    }
    return <em>{children}</em>;
  },
  ul: ({ children }) => (
    <ul className="space-y-2 mb-6 list-disc pl-5 text-[var(--muted)]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-2 mb-6 list-decimal pl-5 text-[var(--muted)]">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => {
    if (!href || !isSafeHref(href)) {
      return <span>{children}</span>;
    }
    const external = /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        className="underline underline-offset-2 decoration-[var(--border)] hover:text-[var(--foreground)]"
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt }) => {
    if (typeof src !== "string" || !isSafeSitePath(src)) {
      return null;
    }
    const poster = src.includes("/infographics/");
    const size = insightImageSizes[src] ?? { width: 1600, height: 900 };
    return (
      <span
        className={
          poster
            ? "block my-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[#07080c]"
            : "block my-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-3"
        }
      >
        <Image
          src={src}
          alt={alt?.trim() ?? ""}
          width={size.width}
          height={size.height}
          sizes="(min-width: 896px) 896px, 100vw"
          className="block h-auto w-full max-w-full"
          style={{ width: "100%", height: "auto" }}
          // Serve static public/ files directly. Vercel /_next/image is 402 when the
          // image-optimization quota is exhausted (x-vercel-error: OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED).
          unoptimized
        />
      </span>
    );
  },
  table: ({ children }) => (
    <div className="my-6 max-w-full overflow-x-auto rounded-2xl border border-[var(--border)]">
      <table className="w-full text-sm text-left">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[var(--card)] text-[var(--foreground)]">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider border-b border-[var(--border)]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 align-top border-b border-[var(--border)] text-[var(--muted)] break-words">
      {children}
    </td>
  ),
  pre: ({ children }) => (
    <pre className="my-6 max-w-full overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs leading-relaxed">
      {children}
    </pre>
  ),
  code: ({ children, className }) => {
    if (className) {
      return <code className="font-mono text-[11px]">{children}</code>;
    }
    return (
      <code className="font-mono text-[0.9em] px-1 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]">
        {children}
      </code>
    );
  },
  hr: () => <hr className="my-10 border-[var(--border)]" />,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[var(--border)] pl-4 my-6 text-[var(--muted)] italic">
      {children}
    </blockquote>
  ),
};

export function InsightMarkdown({ content }: { content: string }) {
  return (
    <div className="insight-body max-w-full overflow-x-hidden">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
