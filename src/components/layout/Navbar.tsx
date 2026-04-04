"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const navLinks = [
  { href: "/ai-solutions", label: "AI Solutions" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/wayalabs-mark.svg"
              alt="WayaLabs logo mark"
              width={32}
              height={32}
              className="shrink-0"
            />
          <span className="font-semibold text-[var(--foreground)] tracking-tight">
            WayaLabs
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors aria-[current=page]:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex">
          <ButtonLink href="/contact" size="sm" variant="primary">
            Book a Strategy Call
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors py-1 aria-[current=page]:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
          <ButtonLink
            href="/contact"
            onClick={() => setOpen(false)}
            size="sm"
            variant="primary"
            className="mt-2"
          >
            Book a Strategy Call
          </ButtonLink>
        </div>
      )}
    </header>
  );
}
