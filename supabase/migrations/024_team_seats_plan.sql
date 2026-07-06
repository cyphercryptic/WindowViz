-- Per-seat Team plan: adds 'team' & 'enterprise' plan options + seats column.
-- Old fixed-tier plans (starter/pro/business/business_pro) remain valid so
-- existing test data isn't broken; new self-serve checkouts use 'team'.

-- 1. Allow new plan keys
ALTER TABLE subscriptions DROP CONSTRAINT subscriptions_plan_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_plan_check
  CHECK (plan IN (
    'free',
    'pay_per_use',
    'starter',
    'pro',
    'business',
    'business_pro',
    'team',
    'enterprise'
  ));

-- 2. Track seat count for per-seat plans
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS seats INTEGER NOT NULL DEFAULT 1 CHECK (seats >= 1);

COMMENT ON COLUMN subscriptions.seats IS
  'Seats purchased on per-seat plans (Team). 1 for legacy fixed-tier plans.';
