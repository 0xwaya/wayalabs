/** Format integer dollars for the HUD (sandbox economy). */
export function formatUsd(amount: number): string {
  const n = Math.round(amount);
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString("en-US");
  return n < 0 ? `-$${formatted}` : `$${formatted}`;
}

/** Format Stripe-style minor units with currency (preserves cents). */
export function formatMoneyCents(
  amountCents: number,
  currency: string | null | undefined = "usd",
): string {
  const code = (currency ?? "usd").toLowerCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code.toUpperCase(),
      currencyDisplay: "narrowSymbol",
    }).format(amountCents / 100);
  } catch {
    const dollars = amountCents / 100;
    const sign = dollars < 0 ? "-" : "";
    return `${sign}${code.toUpperCase()} ${Math.abs(dollars).toFixed(2)}`;
  }
}

/** Lifetime revenue milestones that drive command progression. */
export const REVENUE_PER_COMMAND_LEVEL = 800;

export const INCOME_GOALS = [1_000, 2_500, 5_000, 10_000, 25_000] as const;

export function nextIncomeGoal(lifetimeRevenue: number): number {
  return INCOME_GOALS.find((g) => lifetimeRevenue < g) ?? INCOME_GOALS[INCOME_GOALS.length - 1]! * 2;
}
