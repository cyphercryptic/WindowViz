'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Zap, ArrowRight, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { Subscription } from '@/types/billing';
import { TEAM_PRICING, getTeamSeatPrice } from '@/lib/pricing';

const TEAM_TIERS = TEAM_PRICING.tiers;
const VISUALIZATIONS_PER_SEAT = TEAM_PRICING.visualizationsPerSeat;
const ENTERPRISE_THRESHOLD = TEAM_PRICING.enterpriseSeatThreshold;

/* ------------------------------------------------------------------ */
/*  Self-serve plan cards (excluding Team — has its own configurator) */
/* ------------------------------------------------------------------ */
const SIMPLE_PLANS = [
  {
    key: 'pay_per_use' as const,
    name: 'Pay as you go',
    priceLabel: '$0.75',
    priceUnit: '/ viz',
    features: [
      'No monthly fee',
      'Unlimited visualizations',
      '1 user',
      'High quality',
      'Pay only for what you use',
    ],
  },
];

export default function BillingPage() {
  const { profile } = useUser();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<{ used: number; limit: number; plan: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [seats, setSeats] = useState(5);

  const isAdmin = profile?.role === 'admin' || profile?.role === 'owner';

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Subscription activated! Welcome to your new plan.');
    }
    if (searchParams.get('canceled') === 'true') {
      toast.info('Checkout canceled.');
    }
  }, [searchParams]);

  useEffect(() => {
    loadBillingData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadBillingData() {
    const [subRes, usageRes] = await Promise.all([
      supabase.from('subscriptions').select('*').single(),
      fetch('/api/billing/usage').then((r) => r.json()),
    ]);

    if (subRes.data) {
      setSubscription(subRes.data);
      // Pre-fill the seat picker with the current seat count if they're already on Team.
      if (subRes.data.plan === 'team' && subRes.data.seats) {
        setSeats(subRes.data.seats);
      }
    }
    if (usageRes.used !== undefined) setUsage(usageRes);
    setLoading(false);
  }

  async function handleCheckout(plan: 'pay_per_use' | 'team', seatCount?: number) {
    if (!isAdmin) {
      toast.error('Only admins can manage billing');
      return;
    }

    setCheckoutLoading(plan);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, ...(seatCount ? { seats: seatCount } : {}) }),
      });

      const data = await res.json();

      // Existing subscribers change plans through the Stripe portal.
      if (res.status === 409 && data.code === 'USE_PORTAL') {
        await handleManageBilling();
        return;
      }
      if (!res.ok) throw new Error(data.error);

      // Seat changes update the existing subscription in place — no redirect.
      if (data.updated) {
        toast.success(`Updated to ${data.seats} seat${data.seats === 1 ? '' : 's'}.`);
        await loadBillingData();
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout');
    } finally {
      setCheckoutLoading(null);
    }
  }

  async function handleManageBilling() {
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to open billing portal');
    }
  }

  const teamPricePerSeat = getTeamSeatPrice(seats);
  const teamMonthlyTotal = teamPricePerSeat * seats;
  const teamVizPool = seats * VISUALIZATIONS_PER_SEAT;
  const isEnterpriseSize = seats >= ENTERPRISE_THRESHOLD;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-orange border-t-transparent" />
      </div>
    );
  }

  const currentPlan = subscription?.plan || 'free';
  const isPayPerUse = currentPlan === 'pay_per_use';
  const isTeam = currentPlan === 'team';
  const usagePercent = usage && usage.limit > 0
    ? Math.round((usage.used / usage.limit) * 100)
    : 0;

  const planLabels: Record<string, string> = {
    free: 'Free',
    pay_per_use: 'Pay as you go',
    starter: 'Starter (legacy)',
    pro: 'Pro (legacy)',
    business: 'Business (legacy)',
    business_pro: 'Business Pro (legacy)',
    team: 'Team',
    enterprise: 'Enterprise',
  };
  const currentPlanName = planLabels[currentPlan] || 'Free';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Billing & Usage</h1>
        <p className="text-brand-brown/50">Manage your subscription and track usage</p>
      </div>

      {/* Usage overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-brand-orange" />
            Current Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-bold text-brand-brown">
                {usage?.used ?? 0}
                <span className="text-base font-normal text-brand-brown/50">
                  {isPayPerUse ? (
                    <> visualizations &middot; ${((usage?.used ?? 0) * 0.75).toFixed(2)} billed</>
                  ) : (
                    <>
                      {' / '}
                      {usage?.limit === -1 ? '∞' : usage?.limit ?? 5} visualizations
                    </>
                  )}
                </span>
              </p>
              <p className="text-sm text-brand-brown/40">
                Current billing period
                {isTeam && subscription?.seats
                  ? ` · ${subscription.seats} seat${subscription.seats === 1 ? '' : 's'}`
                  : ''}
              </p>
            </div>
            <Badge
              variant={isPayPerUse ? 'secondary' : 'default'}
              className="text-sm px-3 py-1"
            >
              {currentPlanName}
            </Badge>
          </div>

          {usage && usage.limit > 0 && (
            <div className="w-full bg-brand-peach/30 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-amber-500' : 'bg-brand-orange'
                }`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
          )}

          {subscription?.stripe_subscription_id && isAdmin && (
            <Button variant="outline" size="sm" className="mt-4" onClick={handleManageBilling}>
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Billing
            </Button>
          )}
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------ */}
      {/*  Team plan configurator                                       */}
      {/* ------------------------------------------------------------ */}
      <h2 className="text-lg font-semibold mb-4">Team plan</h2>
      <Card className="mb-8 ring-2 ring-brand-orange overflow-visible">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT: Seat configurator */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <h3 className="font-semibold text-lg">Choose seats</h3>
                <Badge className="bg-brand-orange text-white">Most popular</Badge>
              </div>

              <p className="text-sm text-brand-brown/60 mb-4">
                {VISUALIZATIONS_PER_SEAT} visualizations per seat per month. Volume discounts kick in automatically as you add seats.
              </p>

              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSeats((s) => Math.max(1, s - 1))}
                  disabled={seats <= 1}
                  aria-label="Decrease seats"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  min={1}
                  max={ENTERPRISE_THRESHOLD}
                  value={seats}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (!isNaN(n)) setSeats(Math.max(1, Math.min(ENTERPRISE_THRESHOLD, n)));
                  }}
                  className="w-20 text-center text-2xl font-bold border rounded-md py-2"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSeats((s) => Math.min(ENTERPRISE_THRESHOLD, s + 1))}
                  disabled={seats >= ENTERPRISE_THRESHOLD}
                  aria-label="Increase seats"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-brand-brown/60">
                  seat{seats === 1 ? '' : 's'}
                </span>
              </div>

              <input
                type="range"
                min={1}
                max={ENTERPRISE_THRESHOLD}
                value={seats}
                onChange={(e) => setSeats(parseInt(e.target.value, 10))}
                className="w-full accent-brand-orange"
              />

              {/* Tier table */}
              <div className="mt-6 text-xs text-brand-brown/70 space-y-1">
                <div className="font-medium text-brand-brown/90 mb-1.5">Volume tiers</div>
                {TEAM_TIERS.map((tier, i) => {
                  const lowerBound = i === 0 ? 1 : TEAM_TIERS[i - 1].upTo + 1;
                  const isCurrent = seats >= lowerBound && seats <= tier.upTo;
                  return (
                    <div
                      key={tier.upTo}
                      className={`flex justify-between rounded px-2 py-1 ${
                        isCurrent ? 'bg-brand-peach-light font-semibold text-brand-brown' : ''
                      }`}
                    >
                      <span>
                        {lowerBound}–{tier.upTo} seats
                      </span>
                      <span>${tier.pricePerSeat}/seat/mo</span>
                    </div>
                  );
                })}
                <div className="flex justify-between rounded px-2 py-1 text-brand-brown/60">
                  <span>{ENTERPRISE_THRESHOLD}+ seats</span>
                  <span>Contact sales</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Quote summary */}
            <div className="bg-brand-peach-light/50 rounded-lg p-5 flex flex-col">
              <div className="text-sm text-brand-brown/70 mb-1">Your quote</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold">${teamMonthlyTotal.toLocaleString()}</span>
                <span className="text-brand-brown/60">/ month</span>
              </div>
              <div className="text-sm text-brand-brown/60 mb-4">
                {seats} × ${teamPricePerSeat}/seat
              </div>

              <ul className="space-y-2 mb-6 text-sm flex-1">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>{teamVizPool.toLocaleString()}</strong> visualizations / month included
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Unlimited team members</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Gallery sharing & PDF proposals</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                {seats >= 11 && (
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Volume discount applied</span>
                  </li>
                )}
              </ul>

              {isEnterpriseSize ? (
                <a
                  href="mailto:sales@windowviz.com?subject=Enterprise%20inquiry"
                  className="inline-flex items-center justify-center w-full bg-brand-orange text-white rounded-md py-2 text-sm font-medium hover:bg-brand-orange/90 transition-colors"
                >
                  Contact sales <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              ) : isTeam && subscription?.seats === seats ? (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              ) : isAdmin ? (
                <Button
                  className="w-full"
                  disabled={checkoutLoading === 'team'}
                  onClick={() => handleCheckout('team', seats)}
                >
                  {checkoutLoading === 'team'
                    ? isTeam ? 'Updating...' : 'Redirecting...'
                    : isTeam
                    ? 'Update seats'
                    : 'Subscribe'}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <p className="text-xs text-center text-brand-brown/40">Ask admin to upgrade</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------ */}
      {/*  Other plans                                                  */}
      {/* ------------------------------------------------------------ */}
      <h2 className="text-lg font-semibold mb-4">Other options</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {SIMPLE_PLANS.map((plan) => {
          const isCurrent = plan.key === currentPlan;
          return (
            <Card key={plan.key} className={isCurrent ? 'bg-brand-peach-light' : ''}>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold">{plan.priceLabel}</span>
                  <span className="text-brand-brown/50">{plan.priceUnit}</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : isAdmin ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={!!checkoutLoading}
                    onClick={() => handleCheckout(plan.key)}
                  >
                    {checkoutLoading === plan.key ? 'Redirecting...' : 'Switch to plan'}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <p className="text-xs text-center text-brand-brown/40">Ask admin to upgrade</p>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Enterprise card */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-lg">Enterprise</h3>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold">Custom</span>
              <span className="text-brand-brown/50"> · {ENTERPRISE_THRESHOLD}+ seats</span>
            </div>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Unlimited visualizations
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                White-label branding
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Dedicated support & SLAs
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Annual contracts available
              </li>
            </ul>

            <a
              href="mailto:sales@windowviz.com?subject=Enterprise%20inquiry"
              className="inline-flex items-center justify-center w-full border border-input bg-background rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Contact sales <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
