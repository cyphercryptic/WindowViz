import Link from 'next/link';
import {
  Camera,
  Palette,
  Sparkles,
  Image as ImageIcon,
  BookOpen,
  FileText,
  Users,
  Share2,
  BarChart3,
  Paintbrush,
  Check,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import MobileNav from '@/components/landing/MobileNav';
import HeroVisual from '@/components/landing/HeroVisual';
import { DotRule, SectionNumber } from '@/components/landing/Ornament';
import { TEAM_PRICING } from '@/lib/pricing';

/* ------------------------------------------------------------------ */
/*  Plan data (Team pricing derived from lib/pricing.ts)              */
/* ------------------------------------------------------------------ */
const [teamBaseTier, ...teamVolumeTiers] = TEAM_PRICING.tiers;
const volumeDiscountLabel = teamVolumeTiers
  .map((tier, i) => `$${tier.pricePerSeat} at ${TEAM_PRICING.tiers[i].upTo + 1}+`)
  .join(' • ');
const PLANS = [
  {
    key: 'free',
    name: 'Free',
    priceLabel: '$0',
    priceUnit: '/ mo',
    description: 'Try it out',
    features: ['5 visualizations/month', '1 user', 'Standard quality'],
    highlighted: false,
    cta: { label: 'Start free', href: '/signup' },
  },
  {
    key: 'pay_per_use',
    name: 'Pay as you go',
    priceLabel: '$0.75',
    priceUnit: '/ viz',
    description: 'No commitment',
    features: [
      'Unlimited visualizations',
      '1 user',
      'High quality',
      'Pay only for what you use',
    ],
    highlighted: false,
    cta: { label: 'Get started', href: '/signup' },
  },
  {
    key: 'team',
    name: 'Team',
    priceLabel: `$${teamBaseTier.pricePerSeat}`,
    priceUnit: '/ seat / mo',
    description: 'Most popular',
    features: [
      `${TEAM_PRICING.visualizationsPerSeat} visualizations / seat / month`,
      'Unlimited team members',
      'High quality',
      'Gallery sharing & PDF proposals',
      'Priority support',
      `Volume discounts: ${volumeDiscountLabel}`,
    ],
    highlighted: true,
    cta: { label: 'Get started', href: '/signup' },
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    priceLabel: 'Custom',
    priceUnit: `${TEAM_PRICING.enterpriseSeatThreshold}+ seats`,
    description: 'Tailored to your team',
    features: [
      'Unlimited visualizations',
      'Unlimited team members',
      'White-label branding',
      'Dedicated support & SLAs',
      'Custom onboarding & training',
      'Annual contracts available',
    ],
    highlighted: false,
    cta: { label: 'Contact sales', href: 'mailto:sales@windowviz.com?subject=Enterprise%20inquiry' },
  },
];

/* ------------------------------------------------------------------ */
/*  Features grid data                                                */
/* ------------------------------------------------------------------ */
const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI visualization',
    description:
      'Generate photorealistic window and door renderings in seconds. Show the homeowner exactly what they are buying — not a swatch, not a catalog photo.',
    plans: 'All plans',
  },
  {
    icon: BookOpen,
    title: 'Product catalog',
    description:
      'Every window and door style your team sells — Acclaim, Impervia, Tuscany, Signature, Frenchwood, Ensemble — preloaded and ready.',
    plans: 'All plans',
  },
  {
    icon: ImageIcon,
    title: 'Before & after gallery',
    description:
      'Every visualization is saved, organized, and searchable. Share past projects with new prospects. Compare side-by-side.',
    plans: 'All plans',
  },
  {
    icon: FileText,
    title: 'Branded proposals',
    description:
      'Generate PDF proposals with visualization images, product specs, and pricing — in your branding, ready to leave behind.',
    plans: 'Pro and above',
  },
  {
    icon: Users,
    title: 'Team management',
    description:
      'Invite reps, assign roles, track who is closing the most. One subscription, your whole team.',
    plans: 'Starter and above',
  },
  {
    icon: Share2,
    title: 'Share links',
    description:
      'Send a branded, no-login link to any homeowner. They view the visualization. You stay top of mind.',
    plans: 'Pro and above',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description:
      'Visualizations per rep, per week. Which products convert. Which reps are pulling weight. Real numbers.',
    plans: 'Business and above',
  },
  {
    icon: Paintbrush,
    title: 'White-label',
    description:
      'Replace WindowViz branding with your own logo, colors, and custom domain. A fully private experience.',
    plans: 'Business Pro',
  },
];

/* ------------------------------------------------------------------ */
/*  Steps data                                                        */
/* ------------------------------------------------------------------ */
const STEPS = [
  {
    number: '01',
    icon: Camera,
    title: 'Upload a home photo',
    description:
      'Snap the house on your phone. Upload existing site photos. Interior or exterior — our AI handles both.',
  },
  {
    number: '02',
    icon: Palette,
    title: 'Pick the product',
    description:
      'Choose a window or door from your catalog — style, color, grid, hardware. Configured like a real order.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Hand them the after',
    description:
      'Seconds later, a photorealistic rendering of the new product installed on the actual home. Share, print, or PDF.',
  },
];

/* ================================================================== */
/*  Page                                                              */
/* ================================================================== */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-ink selection:bg-brand-oxblood selection:text-brand-cream">
      {/* ============================================================ */}
      {/*  Top hairline + masthead                                     */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 bg-brand-cream/85 backdrop-blur-md border-b border-brand-ink/15">
        {/* Ultra-fine top rule — editorial detail */}
        <div className="h-[3px] w-full bg-gradient-to-r from-brand-oxblood via-brand-clay to-brand-wheat" />
        <nav className="relative mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Logo — serif wordmark with oxblood period */}
          <Link href="/" className="flex items-baseline gap-1 group">
            <span className="font-display font-medium text-2xl tracking-tight text-brand-ink">
              WindowViz
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand-oxblood translate-y-[-2px]" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { href: '#how', label: 'How it works' },
              { href: '#why', label: 'Why' },
              { href: '#features', label: 'Features' },
              { href: '#pricing', label: 'Pricing' },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-[10px] tracking-[0.24em] uppercase text-brand-ink/65 hover:text-brand-oxblood transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="font-mono text-[10px] tracking-[0.24em] uppercase text-brand-ink/65 hover:text-brand-oxblood transition-colors px-3 py-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-ink px-5 py-2.5 font-mono text-[10px] tracking-[0.24em] uppercase text-brand-cream hover:bg-brand-oxblood transition-colors"
            >
              Start free
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <MobileNav />
        </nav>
      </header>

      <main className="flex-1">
        {/* ============================================================ */}
        {/*  HERO — editorial, asymmetric                                */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden">
          {/* Ambient warm halo */}
          <div className="pointer-events-none absolute inset-0 warm-halo" />
          {/* Subtle grain */}
          <div className="pointer-events-none absolute inset-0 grain" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              {/* Left — editorial headline */}
              <div className="lg:col-span-7 rise rise-1">
                <div className="mb-8 flex items-center gap-4">
                  <SectionNumber n="00" label="AI for Window & Door Sales" />
                </div>

                <h1 className="font-display font-light text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[0.95] tracking-[-0.02em] text-brand-ink">
                  <span className="block">Walk in with</span>
                  <span className="block">
                    the{' '}
                    <em className="not-italic font-display italic font-normal text-brand-oxblood relative">
                      after
                      <svg
                        className="absolute -bottom-2 left-0 w-full"
                        viewBox="0 0 240 10"
                        preserveAspectRatio="none"
                        aria-hidden
                      >
                        <path
                          d="M2,6 Q60,1 120,5 T238,4"
                          stroke="#923A39"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </em>
                    ,
                  </span>
                  <span className="block text-brand-ink-soft font-extralight">
                    not a brochure.
                  </span>
                </h1>

                <p className="mt-8 max-w-xl text-lg sm:text-xl text-brand-ink-soft leading-relaxed">
                  WindowViz is how modern window and door reps run appointments.
                  Snap a home photo, pick a product, hand back a photorealistic
                  rendering of the install — in under a minute.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 rise rise-3">
                  <Link
                    href="/signup"
                    className="group inline-flex items-center gap-3 rounded-full bg-brand-oxblood px-7 py-4 font-sans text-sm font-medium text-brand-cream shadow-[0_10px_30px_-10px_rgba(146,58,57,0.6)] hover:bg-brand-oxblood-dark transition-all hover:shadow-[0_14px_38px_-10px_rgba(146,58,57,0.75)]"
                  >
                    Start free — 5/month
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="#how"
                    className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-brand-ink hover:text-brand-oxblood transition-colors"
                  >
                    See how it works
                    <span className="h-px w-8 bg-brand-ink group-hover:bg-brand-oxblood transition-colors" />
                  </Link>
                </div>

                <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.2em] uppercase text-brand-ink-mute rise rise-4">
                  <span>No credit card</span>
                  <span className="h-1 w-1 rounded-full bg-brand-clay" />
                  <span>5 free renders / month</span>
                  <span className="h-1 w-1 rounded-full bg-brand-clay" />
                  <span>Cancel anytime</span>
                </div>
              </div>

              {/* Right — hero visual */}
              <div className="lg:col-span-5 rise rise-2">
                <div className="relative max-w-md mx-auto lg:max-w-none">
                  <HeroVisual />
                </div>
              </div>
            </div>
          </div>

          {/* Marquee-style brand strip — brands the app works with, not brand partnerships */}
          <div className="relative border-y border-brand-ink/15 bg-brand-cream-soft">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8">
              <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-brand-ink-mute whitespace-nowrap">
                Catalog includes
              </span>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2 font-display text-lg sm:text-xl italic text-brand-ink-soft/85">
                <span>Renewal by Andersen</span>
                <span className="h-1 w-1 rounded-full bg-brand-clay" />
                <span>Pella</span>
                <span className="h-1 w-1 rounded-full bg-brand-clay" />
                <span>Marvin</span>
                <span className="h-1 w-1 rounded-full bg-brand-clay" />
                <span>Milgard</span>
                <span className="h-1 w-1 rounded-full bg-brand-clay" />
                <span>Therma-Tru</span>
                <span className="h-1 w-1 rounded-full bg-brand-clay" />
                <span>Masonite</span>
                <span className="h-1 w-1 rounded-full bg-brand-clay" />
                <span>JELD-WEN</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  HOW IT WORKS                                                */}
        {/* ============================================================ */}
        <section id="how" className="relative py-24 sm:py-32 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-20">
              <SectionNumber n="01" label="The Workflow" />
              <h2 className="mt-5 font-display font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.02em] text-brand-ink">
                Three steps.{' '}
                <em className="font-display italic text-brand-clay-dark">
                  Under a minute.
                </em>
              </h2>
              <p className="mt-6 text-lg text-brand-ink-soft leading-relaxed">
                No learning curve. Designed to be run in-home, on a phone, with
                a homeowner reading over your shoulder.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 md:gap-x-14">
              {STEPS.map((step, i) => (
                <div
                  key={step.number}
                  className="relative group"
                >
                  {/* Top rule */}
                  <div className="h-px w-full bg-brand-ink/18 mb-8" />

                  {/* Large numeric */}
                  <div className="flex items-start justify-between mb-10">
                    <div className="font-display italic font-extralight text-[6.5rem] leading-none text-brand-oxblood/90">
                      {step.number}
                    </div>
                    <div className="mt-4 w-12 h-12 flex items-center justify-center rounded-full border border-brand-ink/20 group-hover:border-brand-oxblood group-hover:rotate-6 transition-all">
                      <step.icon className="h-5 w-5 text-brand-ink group-hover:text-brand-oxblood transition-colors" />
                    </div>
                  </div>

                  <h3 className="font-display font-normal text-2xl sm:text-3xl leading-tight text-brand-ink tracking-[-0.01em] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-brand-ink-soft leading-relaxed text-[15px] max-w-sm">
                    {step.description}
                  </p>

                  {/* Hidden visual cue on last step */}
                  {i === STEPS.length - 1 && (
                    <div className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-brand-oxblood">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-oxblood" />
                      Deal closes
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  WHY IT WORKS — editorial pull quote + benefits              */}
        {/* ============================================================ */}
        <section id="why" className="relative py-24 sm:py-32 bg-brand-ink text-brand-cream overflow-hidden scroll-mt-24">
          {/* Warm vignette */}
          <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              background:
                'radial-gradient(ellipse 60% 60% at 80% 20%, rgba(146,58,57,0.5), transparent 60%)',
            }}
          />
          <div className="pointer-events-none absolute inset-0 grain opacity-40" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <div className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.32em] uppercase text-brand-wheat">
                <span className="text-brand-clay-soft font-medium">N° 02</span>
                <span className="h-px w-8 bg-brand-wheat/50" />
                <span>On Selling Windows</span>
              </div>
            </div>

            {/* Pull quote */}
            <blockquote className="max-w-5xl mb-20">
              <p className="font-display font-extralight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-[-0.02em] text-brand-cream text-balance">
                A homeowner doesn&rsquo;t buy a{' '}
                <em className="font-display italic text-brand-clay-soft">swatch</em>.
                {' '}They buy the{' '}
                <em className="font-display italic text-brand-clay-soft">feeling</em>
                {' '}of coming home and seeing it{' '}
                <em className="font-display italic text-brand-clay-soft">finally finished</em>.
              </p>
            </blockquote>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-cream/15">
              {[
                {
                  label: 'In-home, in-hand',
                  body:
                    'Built for iPhone and iPad during the consultation. Snap, configure, render, hand back — without leaving the couch.',
                },
                {
                  label: 'Your catalog, your brand',
                  body:
                    'Load every window and door your team sells. Render in your colors. Proposals leave with your logo, not ours.',
                },
                {
                  label: 'The whole team, one roof',
                  body:
                    'Invite every rep. Track who’s running visualizations, keep one shared gallery, build a library of closed jobs for referrals.',
                },
              ].map((b, i) => (
                <div
                  key={b.label}
                  className="bg-brand-ink p-10 sm:p-12 relative"
                >
                  <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-brand-clay-soft mb-5">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-display font-normal text-2xl text-brand-cream mb-4 tracking-[-0.01em]">
                    {b.label}
                  </h3>
                  <p className="text-brand-cream/70 leading-relaxed text-[15px]">
                    {b.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  FEATURES — magazine grid                                    */}
        {/* ============================================================ */}
        <section id="features" className="relative py-24 sm:py-32 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
              <div className="max-w-2xl">
                <SectionNumber n="03" label="The Features" />
                <h2 className="mt-5 font-display font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.02em] text-brand-ink">
                  Everything you need
                  <br />
                  <em className="font-display italic text-brand-clay-dark">
                    and nothing you don&rsquo;t.
                  </em>
                </h2>
              </div>
              <p className="max-w-sm text-brand-ink-soft leading-relaxed">
                AI rendering is the center. Everything else is what makes it
                usable by a real sales team on a real Tuesday.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-ink/15 border border-brand-ink/15 rounded-xl overflow-hidden">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group relative bg-brand-cream-soft p-7 hover:bg-brand-ivory transition-colors"
                >
                  <f.icon
                    className="h-6 w-6 text-brand-oxblood mb-5 group-hover:rotate-[-6deg] transition-transform"
                    strokeWidth={1.5}
                  />
                  <h3 className="font-display font-normal text-xl text-brand-ink tracking-[-0.01em] mb-2.5">
                    {f.title}
                  </h3>
                  <p className="text-[14px] text-brand-ink-soft leading-relaxed mb-5">
                    {f.description}
                  </p>
                  <span className="inline-block font-mono text-[9px] tracking-[0.22em] uppercase text-brand-clay-dark border border-brand-clay/40 rounded-full px-2.5 py-1">
                    {f.plans}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  PRICING                                                     */}
        {/* ============================================================ */}
        <section id="pricing" className="relative py-24 sm:py-32 bg-brand-wheat-soft scroll-mt-24 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grain opacity-50" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-20 text-center mx-auto">
              <SectionNumber n="04" label="Pricing" />
              <h2 className="mt-5 font-display font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.02em] text-brand-ink">
                Start free.{' '}
                <em className="font-display italic text-brand-oxblood">
                  Grow into it.
                </em>
              </h2>
              <p className="mt-6 text-lg text-brand-ink-soft leading-relaxed">
                Five free renderings a month, forever. Pay as you go when the
                need is lumpy. Subscribe when it&rsquo;s steady.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {PLANS.map((plan) => (
                <div
                  key={plan.key}
                  className={`relative flex flex-col rounded-2xl p-7 transition-all ${
                    plan.highlighted
                      ? 'bg-brand-ink text-brand-cream ring-1 ring-brand-oxblood shadow-[0_30px_60px_-20px_rgba(45,26,19,0.35)]'
                      : 'bg-brand-cream-soft border border-brand-ink/15 hover:border-brand-clay/50'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-7">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-oxblood px-3 py-1 font-mono text-[9px] tracking-[0.24em] uppercase text-brand-cream shadow-lg">
                        <span className="h-1 w-1 rounded-full bg-brand-cream" />
                        Most popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3
                      className={`font-display font-normal text-2xl tracking-[-0.01em] ${
                        plan.highlighted ? 'text-brand-cream' : 'text-brand-ink'
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`mt-1 font-mono text-[10px] tracking-[0.24em] uppercase ${
                        plan.highlighted
                          ? 'text-brand-clay-soft'
                          : 'text-brand-ink-mute'
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-7 flex items-baseline gap-2">
                    <span
                      className={`font-display font-light text-5xl sm:text-6xl tracking-[-0.03em] leading-none ${
                        plan.highlighted ? 'text-brand-cream' : 'text-brand-ink'
                      }`}
                    >
                      {plan.priceLabel}
                    </span>
                    <span
                      className={`font-mono text-xs tracking-wider ${
                        plan.highlighted
                          ? 'text-brand-cream/60'
                          : 'text-brand-ink-mute'
                      }`}
                    >
                      {plan.priceUnit}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className={`flex items-start gap-2.5 text-sm ${
                          plan.highlighted
                            ? 'text-brand-cream/85'
                            : 'text-brand-ink-soft'
                        }`}
                      >
                        <Check
                          className={`h-4 w-4 mt-0.5 shrink-0 ${
                            plan.highlighted
                              ? 'text-brand-clay-soft'
                              : 'text-brand-oxblood'
                          }`}
                          strokeWidth={2}
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.cta.href}
                    className={`inline-flex items-center justify-center gap-2 rounded-full py-3 font-mono text-[10px] tracking-[0.24em] uppercase transition-colors ${
                      plan.highlighted
                        ? 'bg-brand-oxblood text-brand-cream hover:bg-brand-oxblood-dark'
                        : 'border border-brand-ink/30 text-brand-ink hover:bg-brand-ink hover:text-brand-cream hover:border-brand-ink'
                    }`}
                  >
                    {plan.cta.label}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  CLOSING CTA                                                 */}
        {/* ============================================================ */}
        <section className="relative py-24 sm:py-32 bg-brand-oxblood-deep overflow-hidden">
          {/* Layered gradients for depth */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 30% 20%, rgba(184,122,101,0.35), transparent 60%), radial-gradient(ellipse 80% 80% at 80% 90%, rgba(223,198,138,0.18), transparent 60%)',
            }}
          />
          <div className="pointer-events-none absolute inset-0 grain opacity-40" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.32em] uppercase text-brand-clay-soft mb-8">
              <span className="h-px w-8 bg-brand-clay-soft/50" />
              <span>Start today</span>
              <span className="h-px w-8 bg-brand-clay-soft/50" />
            </div>
            <h2 className="font-display font-extralight text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.02em] text-brand-cream">
              Your next appointment
              <br />
              is{' '}
              <em className="font-display italic text-brand-clay-soft">
                already warmer
              </em>
              .
            </h2>
            <p className="mt-8 max-w-xl mx-auto text-lg text-brand-cream/70 leading-relaxed">
              Five free visualizations every month. No card, no commitment —
              just better appointments.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-3 rounded-full bg-brand-cream px-8 py-4 font-sans text-sm font-medium text-brand-ink shadow-[0_14px_40px_-10px_rgba(0,0,0,0.4)] hover:bg-brand-wheat transition-colors"
              >
                Start free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="font-mono text-[10px] tracking-[0.28em] uppercase text-brand-cream/70 hover:text-brand-cream transition-colors"
              >
                Already have an account? Log in
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/*  FOOTER — colophon                                           */}
      {/* ============================================================ */}
      <footer className="relative bg-brand-ink text-brand-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Masthead */}
            <div className="md:col-span-5">
              <Link href="/" className="inline-flex items-baseline gap-1">
                <span className="font-display font-medium text-3xl tracking-tight text-brand-cream">
                  WindowViz
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-brand-oxblood translate-y-[-4px]" />
              </Link>
              <p className="mt-5 max-w-sm text-brand-cream/55 leading-relaxed text-sm">
                AI-powered window &amp; door visualization — built for the reps,
                designers, and owners who sell them every day.
              </p>

              <div className="mt-8">
                <DotRule className="w-40 !gap-2 !opacity-50" />
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
              <div>
                <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-clay-soft mb-5">
                  Product
                </div>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#how" className="text-brand-cream/70 hover:text-brand-cream transition-colors">
                      How it works
                    </a>
                  </li>
                  <li>
                    <a href="#features" className="text-brand-cream/70 hover:text-brand-cream transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="text-brand-cream/70 hover:text-brand-cream transition-colors">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-clay-soft mb-5">
                  Account
                </div>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/login" className="text-brand-cream/70 hover:text-brand-cream transition-colors">
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="text-brand-cream/70 hover:text-brand-cream transition-colors">
                      Start free
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-clay-soft mb-5">
                  Legal
                </div>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/terms" className="text-brand-cream/70 hover:text-brand-cream transition-colors">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-brand-cream/70 hover:text-brand-cream transition-colors">
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-brand-cream/12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-cream/45">
              © {new Date().getFullYear()} WindowViz · All rights reserved
            </p>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-cream/45">
              Set in Fraunces &amp; DM Sans
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
