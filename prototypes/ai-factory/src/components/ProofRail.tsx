"use client";

import { useEffect, useState } from "react";
import { formatUsd } from "@/lib/engine/money";

type ProofRow = {
  id: string;
  provider: string;
  eventId: string;
  kind: string;
  commerceKey: string | null;
  amountCents: number | null;
  currency: string | null;
  runId: string | null;
  receivedAt: string;
};

type ProofsResponse = {
  mode: string;
  configured: boolean;
  proofs: ProofRow[];
  error?: string;
};

export default function ProofRail() {
  const [data, setData] = useState<ProofsResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/factory/proofs", { cache: "no-store" });
        const json = (await res.json()) as ProofsResponse;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) {
          setData({ mode: "sandbox", configured: false, proofs: [] });
        }
      }
    };
    void load();
    const id = window.setInterval(load, 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const configured = data?.configured ?? false;
  const proofs = data?.proofs ?? [];

  return (
    <section className="panel p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase">
            Proof rail
          </p>
          <h2 className="font-[family-name:var(--font-orbitron)] text-sm text-[var(--cyan)]">
            Live webhook receipts
          </h2>
        </div>
        <span className="text-[10px] tracking-wider text-[var(--muted)] uppercase">
          mode · {data?.mode ?? "…"}
          {configured ? "" : " · db offline"}
        </span>
      </div>

      {!configured ? (
        <p className="text-xs text-[var(--muted)]">
          Connect DATABASE_URL to stream Stripe/Shopify proofs. Sandbox cash
          still ticks locally.
        </p>
      ) : proofs.length === 0 ? (
        <p className="text-xs text-[var(--muted)]">
          No webhook events yet. Point Stripe to{" "}
          <code className="text-[var(--lime)]">/api/hooks/stripe</code>.
        </p>
      ) : (
        <ul className="space-y-2">
          {proofs.map((proof) => (
            <li
              key={proof.id}
              className="border border-[var(--line)] bg-black/20 px-3 py-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-[family-name:var(--font-orbitron)] text-[var(--lime)]">
                  {proof.provider} · {proof.kind}
                </span>
                <span className="text-[var(--amber)]">
                  {proof.amountCents == null
                    ? "—"
                    : formatUsd(proof.amountCents / 100)}
                </span>
              </div>
              <p className="mt-1 truncate text-[var(--muted)]">
                {proof.commerceKey ?? proof.eventId}
                {proof.runId ? ` · run ${proof.runId}` : ""}
              </p>
              <p className="mt-0.5 text-[10px] text-[var(--muted)]/80">
                {new Date(proof.receivedAt).toLocaleString("en-US", {
                  timeZone: "America/New_York",
                })}{" "}
                ET
              </p>
            </li>
          ))}
        </ul>
      )}
      {data?.error ? (
        <p className="mt-2 text-[11px] text-[var(--magenta)]">{data.error}</p>
      ) : null}
    </section>
  );
}
