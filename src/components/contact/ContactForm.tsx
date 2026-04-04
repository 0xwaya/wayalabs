"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

type Intent = "chatbot" | "agent" | "integration" | "platform" | "unsure";

const intents: { value: Intent; label: string; description: string }[] = [
  { value: "chatbot", label: "AI Chatbot", description: "Support, sales, or onboarding bot" },
  { value: "agent", label: "AI Agent", description: "Workflow or ops automation" },
  { value: "integration", label: "AI Integration", description: "Connect LLM to existing tools" },
  { value: "platform", label: "Web Platform", description: "AI-enhanced web build" },
  { value: "unsure", label: "Not sure yet", description: "Help me figure it out" },
];

export default function ContactForm() {
  const [intent, setIntent] = useState<Intent | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
      intent: intent ?? "unsure",
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Unable to submit right now. Please try again.");
      }

      setSubmitted(true);
      form.reset();
      setIntent(null);
    } catch (submitError) {
      const message = submitError instanceof Error
        ? submitError.message
        : "Unable to submit right now. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div role="status" aria-live="polite" className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-[#4f8ef718] flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={28} className="text-[#4f8ef7]" />
        </div>
        <h3 className="text-2xl font-bold mb-3">Message received</h3>
        <p className="text-[var(--muted)]">
          We&apos;ll respond within one business day. Check your inbox — and feel free to book a
          call directly below if you&apos;d prefer to move faster.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        className="hidden"
        aria-label="Leave this field empty"
        aria-hidden
      />

      {/* Intent selector */}
      <div>
        <label className="block text-sm font-medium mb-3">
          What are you looking to build?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {intents.map(({ value, label, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => setIntent(value)}
              className={`p-3 rounded-xl border text-left text-sm transition-all ${
                intent === value
                  ? "border-[#4f8ef7] bg-[#4f8ef718] text-[var(--foreground)]"
                  : "border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:border-[#4f8ef760]"
              }`}
            >
              <div className="font-medium">{label}</div>
              <div className="text-xs opacity-70 mt-0.5">{description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Name + email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5">
            Name <span className="text-[var(--muted)]">*</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Alex Johnson"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Work email <span className="text-[var(--muted)]">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="alex@company.com"
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium mb-1.5">
          Company / Project
        </label>
        <Input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          placeholder="Acme Inc."
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1.5">
          Tell us what you&apos;re working on <span className="text-[var(--muted)]">*</span>
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Describe your use case, current pain points, or the outcome you're trying to achieve..."
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className="w-full"
      >
        {loading ? "Sending..." : <>Send Message <ArrowRight size={16} /></>}
      </Button>

      {error && (
        <p role="alert" aria-live="assertive" className="text-sm text-center text-[#ff7e7e]">
          {error}
        </p>
      )}

      <p className="text-xs text-center text-[var(--muted)]">
        We respond within one business day. No spam, no cold-call follow-ups.
      </p>
    </form>
  );
}
