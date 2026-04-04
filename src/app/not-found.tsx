import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold mb-3">Page not found</h1>
        <p className="text-[var(--muted)] mb-8 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#9b6dff] text-white font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Back to Home <ArrowRight size={15} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] text-sm hover:bg-[var(--card)] transition-colors"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
