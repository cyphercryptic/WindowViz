/**
 * Client-safe pricing constants for the per-seat Team plan.
 *
 * This module is the single source of truth for Team tier pricing. It is
 * imported by server code (lib/stripe.ts, API routes) AND client components
 * (billing page, landing page), so it must never touch the Stripe SDK or
 * server-only env vars.
 *
 * Keep in sync with the Stripe price `STRIPE_PRICE_TEAM` (volume mode —
 * whole-account tier). Each seat includes 200 visualizations/month. Overage
 * billed at $0.50/viz (configure separately in Stripe if/when overage
 * billing is enabled).
 */
export const TEAM_PRICING = {
  visualizationsPerSeat: 200,
  overagePerViz: 0.5,
  enterpriseSeatThreshold: 500, // >500 routes to sales, not self-serve
  tiers: [
    { upTo: 10, pricePerSeat: 40 },
    { upTo: 50, pricePerSeat: 35 },
    { upTo: 200, pricePerSeat: 32 },
    { upTo: 500, pricePerSeat: 28 },
  ],
} as const;

/** Resolve the per-seat price for a given seat count under the volume-tiered Team plan. */
export function getTeamSeatPrice(seats: number): number {
  for (const tier of TEAM_PRICING.tiers) {
    if (seats <= tier.upTo) return tier.pricePerSeat;
  }
  // Above the threshold — enterprise. Caller should route to "contact sales".
  return TEAM_PRICING.tiers[TEAM_PRICING.tiers.length - 1].pricePerSeat;
}
