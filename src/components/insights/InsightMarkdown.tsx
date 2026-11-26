import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h2 className="text-3xl font-bold tracking-tight mt-12 mb-4">{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold tracking-tight mt-12 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold tracking-tight mt-8 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="leading-relaxed text-[var(--muted)] mb-4">{children}</p>
  ),
  em: ({ children }) => {
    const text = String(children);
    if (/^Figure\s+\d/i.test(text)) {
      return (
        <span className="block text-sm text-[var(--muted)] -mt-3 mb-8 leading-relaxed not-italic">
          {children}
        </span>
      );
    }
    if (/^\d{2}\s*·/.test(text) || text.includes(" · ")) {
      return (
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mt-10 mb-2 not-italic">
          {children}
        </p>
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
  a: ({ href, children }) => (
    <a
      href={href}
      className="underline underline-offset-2 decoration-[var(--border)] hover:text-[var(--foreground)]"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    <span className="block my-6 rounded-2xl border border-[var(--border)] bg-white p-3">
      {/* Public-folder charts are authored on a light background. */}
      <img src={src} alt={alt ?? ""} className="w-full h-auto rounded-lg" />
    </span>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
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
    <td className="px-3 py-2 align-top border-b border-[var(--border)] text-[var(--muted)]">
      {children}
    </td>
  ),
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs leading-relaxed">
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
    <div className="insight-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
