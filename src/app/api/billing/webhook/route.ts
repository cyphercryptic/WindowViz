import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANS, TEAM_PLAN, type PlanKey } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import type Stripe from 'stripe';

/** Pull seat quantity off the first subscription item (Team plan). */
function getSeats(sub: Stripe.Subscription): number {
  return sub.items.data[0]?.quantity ?? 1;
}

/** Visualization limit for a given plan + seats. -1 = unlimited. */
function computeLimit(plan: PlanKey | 'team', seats: number): number {
  if (plan === 'team') return seats * TEAM_PLAN.visualizationsPerSeat;
  return PLANS[plan as PlanKey].visualizationLimit;
}

/**
 * Map a Stripe subscription to our status enum. Scheduled cancellation keeps
 * the existing 'canceled' semantics; otherwise the real Stripe status wins so
 * a past_due row is never silently flipped back to active by an unrelated
 * subscription.updated event (e.g. a dunning retry).
 */
function mapStatus(sub: Stripe.Subscription): 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete' {
  if (sub.cancel_at_period_end) return 'canceled';
  switch (sub.status) {
    case 'trialing':
      return 'trialing';
    case 'past_due':
    case 'unpaid':
      return 'past_due';
    case 'canceled':
      return 'canceled';
    case 'incomplete':
    case 'incomplete_expired':
      return 'incomplete';
    default:
      return 'active';
  }
}

/** Extract billing period from the first subscription item */
function getPeriod(sub: Stripe.Subscription) {
  const item = sub.items.data[0];
  if (!item) return { start: null, end: null };
  return {
    start: new Date(item.current_period_start * 1000).toISOString(),
    end: new Date(item.current_period_end * 1000).toISOString(),
  };
}

/** Extract subscription ID from an invoice (Stripe v21 structure) */
function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const subDetails = invoice.parent?.subscription_details;
  if (subDetails?.subscription) {
    return typeof subDetails.subscription === 'string'
      ? subDetails.subscription
      : subDetails.subscription.id;
  }
  return null;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const adminSupabase = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const tenantId = session.metadata?.tenant_id;
      const planMeta = session.metadata?.plan;

      if (!tenantId || !planMeta) break;

      // Metadata is unvalidated input: sessions can be created outside the
      // app flow (dashboard, future tooling). Skip unknown plans instead of
      // crashing into a Stripe retry loop.
      if (planMeta !== 'team' && !(planMeta in PLANS)) {
        console.error(`Webhook: unknown plan "${planMeta}" in checkout session metadata; skipping`);
        break;
      }
      const plan = planMeta as PlanKey | 'team';

      const subscriptionId = session.subscription as string;
      const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
      const period = getPeriod(stripeSub);

      // Team plan: read seat count from the subscription item quantity.
      // Other plans: 1 seat (legacy fixed-tier).
      const seats = plan === 'team' ? getSeats(stripeSub) : 1;
      const limit = computeLimit(plan, seats);

      await adminSupabase
        .from('subscriptions')
        .update({
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: session.customer as string,
          plan,
          status: 'active',
          seats,
          visualization_limit: limit,
          current_period_start: period.start,
          current_period_end: period.end,
        })
        .eq('tenant_id', tenantId);

      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object;
      const subscriptionId = getInvoiceSubscriptionId(invoice);
      if (!subscriptionId) break;

      const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
      const period = getPeriod(stripeSub);
      const customerId = invoice.customer as string;

      const { data: sub } = await adminSupabase
        .from('subscriptions')
        .select('tenant_id')
        .eq('stripe_customer_id', customerId)
        .single();

      if (sub) {
        await adminSupabase
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_start: period.start,
            current_period_end: period.end,
          })
          .eq('tenant_id', sub.tenant_id);
      }

      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;

      await adminSupabase
        .from('subscriptions')
        .update({ status: 'past_due' })
        .eq('stripe_customer_id', customerId);

      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;
      const period = getPeriod(subscription);

      const status = mapStatus(subscription);

      // Find the existing row to know whether this is a Team subscription
      // (so we can recompute limit from the new seat count).
      const { data: existing } = await adminSupabase
        .from('subscriptions')
        .select('plan')
        .eq('stripe_customer_id', customerId)
        .single();

      const updates: Record<string, unknown> = {
        status,
        current_period_start: period.start,
        current_period_end: period.end,
      };

      if (existing?.plan === 'team') {
        const seats = getSeats(subscription);
        updates.seats = seats;
        updates.visualization_limit = computeLimit('team', seats);
      }

      await adminSupabase
        .from('subscriptions')
        .update(updates)
        .eq('stripe_customer_id', customerId);

      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;

      // Downgrade to free
      await adminSupabase
        .from('subscriptions')
        .update({
          plan: 'free',
          status: 'active',
          seats: 1,
          visualization_limit: PLANS.free.visualizationLimit,
          stripe_subscription_id: null,
          current_period_start: null,
          current_period_end: null,
        })
        .eq('stripe_customer_id', customerId);

      break;
    }
  }

  return NextResponse.json({ received: true });
}
