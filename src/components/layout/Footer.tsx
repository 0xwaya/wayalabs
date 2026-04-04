import Link from "next/link";
import { GitFork, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  Services: [
    { href: "/ai-solutions/chatbots", label: "AI Chatbots" },
    { href: "/ai-solutions/agents", label: "AI Agents" },
    { href: "/ai-solutions/integrations", label: "AI Integrations" },
  ],
  Company: [
    { href: "/case-studies", label: "Case Studies" },
    { href: "/process", label: "Our Process" },
    { href: "/about", label: "About" },
    { href: "/insights", label: "Insights" },
  ],
  Contact: [
    { href: "/contact", label: "Book a Call" },
    { href: "mailto:hello@wayalabs.com", label: "hello@wayalabs.com" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4f8ef7] to-[#9b6dff] flex items-center justify-center text-white font-bold text-sm">
                W
              </span>
              <span className="font-semibold text-[var(--foreground)] tracking-tight">
                WayaLabs
              </span>
            </Link>
            <p className="text-sm text-[var(--muted)] leading-relaxed max-w-xs">
              AI solutions studio building chatbots, AI agents, and intelligent
              web platforms for ambitious businesses.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://github.com/0xwaya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                aria-label="GitHub"
              >
                <GitFork size={18} />
              </a>
              <a
                href="https://twitter.com/wayalabs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com/company/wayalabs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
                {group}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} WayaLabs. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
