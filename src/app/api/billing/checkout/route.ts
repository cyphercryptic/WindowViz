import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { stripe, PLANS, TEAM_PLAN } from '@/lib/stripe';
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from '@/lib/rate-limit';
import { billingCheckoutSchema, parseBody } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id, role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'owner')) {
    return NextResponse.json({ error: 'Only admins can manage billing' }, { status: 403 });
  }

  // Rate limit by user
  const adminSupabaseRL = createAdminClient();
  const rateCheck = await checkRateLimit(adminSupabaseRL, user.id, '/api/billing/checkout', RATE_LIMITS.general);
  if (!rateCheck.allowed) return rateLimitResponse(rateCheck.retryAfterSeconds);

  const body = await request.json();
  const parsed = parseBody(billingCheckoutSchema, body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { plan, seats: seatsInput } = parsed.data;

  // Resolve the Stripe price + quantity for this checkout.
  // Team plan uses the volume-tiered price with `quantity = seats`.
  // Legacy plans use their fixed price with quantity 1.
  let stripePriceId: string | null | undefined;
  let quantity = 1;

  if (plan === 'team') {
    if (!seatsInput || seatsInput < 1) {
      return NextResponse.json(
        { error: 'Seats are required for the Team plan' },
        { status: 400 }
      );
    }
    if (seatsInput > TEAM_PLAN.enterpriseSeatThreshold) {
      return NextResponse.json(
        {
          error:
            'Teams over 500 seats use enterprise pricing — please contact sales@windowviz.com.',
        },
        { status: 400 }
      );
    }
    stripePriceId = TEAM_PLAN.stripePriceId;
    quantity = seatsInput;
  } else {
    stripePriceId = PLANS[plan].stripePriceId;
  }

  if (!stripePriceId) {
    return NextResponse.json({ error: 'Plan not configured' }, { status: 400 });
  }

  const adminSupabase = createAdminClient();

  // Get or create Stripe customer
  const { data: subscription } = await adminSupabase
    .from('subscriptions')
    .select('*')
    .eq('tenant_id', profile.tenant_id)
    .single();

  // Never create a second subscription for a tenant that already has one —
  // a fresh checkout would leave the old subscription active and billing.
  if (subscription?.stripe_subscription_id) {
    if (plan === 'team' && subscription.plan === 'team') {
      // Seat change: update the existing subscription's quantity in place.
      // The customer.subscription.updated webhook recomputes seats + limit.
      const stripeSub = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
      const item = stripeSub.items.data[0];
      if (!item) {
        return NextResponse.json({ error: 'Subscription has no items to update' }, { status: 500 });
      }
      await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        items: [{ id: item.id, quantity }],
        proration_behavior: 'create_prorations',
      });
      return NextResponse.json({ updated: true, seats: quantity });
    }
    return NextResponse.json(
      {
        error: 'You already have an active subscription. Use Manage Billing to change plans.',
        code: 'USE_PORTAL',
      },
      { status: 409 }
    );
  }

  let customerId = subscription?.stripe_customer_id;

  if (!customerId) {
    const { data: tenant } = await adminSupabase
      .from('tenants')
      .select('name')
      .eq('id', profile.tenant_id)
      .single();

    const customer = await stripe.customers.create({
      email: user.email,
      name: tenant?.name || undefined,
      metadata: { tenant_id: profile.tenant_id },
    });

    customerId = customer.id;

    await adminSupabase
      .from('subscriptions')
      .update({ stripe_customer_id: customerId })
      .eq('tenant_id', profile.tenant_id);
  }

  // Build line items. Team plan uses adjustable_quantity so the customer can
  // change seat count from the Stripe portal post-checkout. Pay-per-use is a
  // metered price — Stripe rejects a quantity for those — legacy plans are
  // fixed quantity 1.
  const lineItem: import('stripe').Stripe.Checkout.SessionCreateParams.LineItem = {
    price: stripePriceId,
    ...(plan === 'pay_per_use' ? {} : { quantity }),
  };

  if (plan === 'team') {
    lineItem.adjustable_quantity = {
      enabled: true,
      minimum: 1,
      maximum: TEAM_PLAN.enterpriseSeatThreshold,
    };
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [lineItem],
    success_url: `${request.nextUrl.origin}/settings/billing?success=true`,
    cancel_url: `${request.nextUrl.origin}/settings/billing?canceled=true`,
    metadata: {
      tenant_id: profile.tenant_id,
      plan,
      // Echo requested seats so the webhook can persist it without re-fetching.
      ...(plan === 'team' ? { seats: String(quantity) } : {}),
    },
  });

  return NextResponse.json({ url: session.url });
}
