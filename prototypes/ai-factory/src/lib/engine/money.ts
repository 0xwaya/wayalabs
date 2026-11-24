/** Format integer cents-free USD for the HUD. */
export function formatUsd(amount: number): string {
  const n = Math.round(amount);
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString("en-US");
  return n < 0 ? `-$${formatted}` : `$${formatted}`;
}

/** Lifetime revenue milestones that drive command progression. */
export const REVENUE_PER_COMMAND_LEVEL = 800;

export const INCOME_GOALS = [1_000, 2_500, 5_000, 10_000, 25_000] as const;

export function nextIncomeGoal(lifetimeRevenue: number): number {
  return INCOME_GOALS.find((g) => lifetimeRevenue < g) ?? INCOME_GOALS[INCOME_GOALS.length - 1]! * 2;
}
