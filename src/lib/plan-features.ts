const SHARING_PLANS = ['pro', 'business', 'business_pro', 'team', 'enterprise'];
const PDF_PLANS = ['pro', 'business', 'business_pro', 'team', 'enterprise'];
const ANALYTICS_PLANS = ['business', 'business_pro', 'team', 'enterprise'];
const SUPPORT_PLANS = ['business', 'business_pro', 'team', 'enterprise'];
const WHITE_LABEL_PLANS = ['business_pro', 'enterprise'];

/** Plans with no cap on team members (per-seat or unlimited-member tiers). */
const UNLIMITED_MEMBER_PLANS = ['business', 'business_pro', 'team', 'enterprise'];

export function canShare(plan: string | undefined | null): boolean {
  return SHARING_PLANS.includes(plan || '');
}

export function canGeneratePdf(plan: string | undefined | null): boolean {
  return PDF_PLANS.includes(plan || '');
}

export function canViewAnalytics(plan: string | undefined | null): boolean {
  return ANALYTICS_PLANS.includes(plan || '');
}

export function hasSupport(plan: string | undefined | null): boolean {
  return SUPPORT_PLANS.includes(plan || '');
}

export function canWhiteLabel(plan: string | undefined | null): boolean {
  return WHITE_LABEL_PLANS.includes(plan || '');
}

export function hasUnlimitedMembers(plan: string | undefined | null): boolean {
  return UNLIMITED_MEMBER_PLANS.includes(plan || '');
}
