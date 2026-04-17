// Editorial hero visual — stylized "before / after" window card with color
// swatches. All SVG + CSS, no stock imagery. Built to feel like a plate from
// an architectural catalog, not a SaaS screenshot.

export default function HeroVisual() {
  return (
    <div className="relative w-full h-full">
      {/* Warm halo bloom behind the card */}
      <div className="absolute -inset-8 warm-halo rounded-[40px] blur-2xl opacity-70" />

      {/* Outer card — paper with grain */}
      <div className="relative grain rounded-[14px] overflow-hidden bg-brand-cream-soft border border-brand-ink/15 shadow-[0_30px_80px_-20px_rgba(45,26,19,0.35),0_8px_24px_-10px_rgba(146,58,57,0.25)]">
        {/* Metadata strip at top */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-brand-ink/12">
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-ink-mute">
            Plate N° 01 · Field Study
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-oxblood" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand-clay" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand-wheat" />
          </div>
        </div>

        {/* Before / After split */}
        <div className="grid grid-cols-2 divide-x divide-brand-ink/12">
          {/* BEFORE */}
          <div className="relative aspect-[5/6] bg-gradient-to-b from-[#e8d9a0] to-[#d8c288] overflow-hidden">
            <div className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.25em] uppercase text-brand-ink/55">
              Before
            </div>
            <svg
              viewBox="0 0 200 240"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden
            >
              {/* Old window — white vinyl, small, unremarkable */}
              <g stroke="#2D1A13" strokeOpacity="0.6" strokeWidth="0.8" fill="none">
                {/* House wall suggestion */}
                <line x1="0" y1="190" x2="200" y2="190" strokeOpacity="0.25" />
                <line x1="0" y1="210" x2="200" y2="210" strokeOpacity="0.2" />
                <line x1="0" y1="170" x2="200" y2="170" strokeOpacity="0.2" />
              </g>
              <g>
                {/* Trim / casing */}
                <rect x="55" y="60" width="90" height="120" fill="#F5EDC0" stroke="#2D1A13" strokeOpacity="0.35" strokeWidth="1" />
                {/* Window */}
                <rect x="62" y="67" width="76" height="106" fill="#FBFBF2" stroke="#2D1A13" strokeOpacity="0.45" strokeWidth="0.8" />
                {/* Middle rail */}
                <line x1="62" y1="120" x2="138" y2="120" stroke="#2D1A13" strokeOpacity="0.35" strokeWidth="1" />
                {/* Glass shimmer */}
                <line x1="72" y1="74" x2="86" y2="74" stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="0.8" />
                <line x1="72" y1="127" x2="82" y2="127" stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="0.8" />
              </g>
            </svg>
          </div>

          {/* AFTER */}
          <div className="relative aspect-[5/6] bg-gradient-to-b from-[#f0e2ac] to-[#e4d08c] overflow-hidden">
            <div className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.25em] uppercase text-brand-oxblood">
              After
            </div>
            <svg
              viewBox="0 0 200 240"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden
            >
              <defs>
                <linearGradient id="frame" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#923A39" />
                  <stop offset="1" stopColor="#7A2E2D" />
                </linearGradient>
              </defs>
              <g stroke="#2D1A13" strokeOpacity="0.6" strokeWidth="0.8" fill="none">
                <line x1="0" y1="190" x2="200" y2="190" strokeOpacity="0.25" />
                <line x1="0" y1="210" x2="200" y2="210" strokeOpacity="0.2" />
                <line x1="0" y1="170" x2="200" y2="170" strokeOpacity="0.2" />
              </g>
              <g>
                {/* Trim — stays white/cream */}
                <rect x="55" y="60" width="90" height="120" fill="#F5EDC0" stroke="#2D1A13" strokeOpacity="0.35" strokeWidth="1" />
                {/* Oxblood window frame */}
                <rect x="60" y="65" width="80" height="110" fill="url(#frame)" />
                {/* Glass inside */}
                <rect x="66" y="71" width="68" height="98" fill="#CFDFD2" />
                {/* Middle rail — oxblood */}
                <rect x="60" y="117" width="80" height="6" fill="url(#frame)" />
                {/* Glass highlights */}
                <line x1="74" y1="78" x2="96" y2="78" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="0.8" />
                <line x1="74" y1="131" x2="92" y2="131" stroke="#FFFFFF" strokeOpacity="0.65" strokeWidth="0.8" />
              </g>
            </svg>
          </div>
        </div>

        {/* Swatch strip */}
        <div className="px-5 py-4 border-t border-brand-ink/12 bg-brand-cream">
          <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-brand-ink-mute mb-2.5">
            Specification — Acclaim Double-Hung
          </div>
          <div className="flex items-center gap-2">
            {[
              { c: "#923A39", n: "Oxblood" },
              { c: "#B87A65", n: "Terracotta" },
              { c: "#DFC68A", n: "Wheat" },
              { c: "#2D1A13", n: "Espresso" },
              { c: "#F5EDC0", n: "Butter", ring: true },
            ].map((s) => (
              <div key={s.n} className="flex-1 flex flex-col items-start">
                <div
                  className={`w-full h-7 rounded-[2px] ${s.ring ? "ring-1 ring-brand-ink/15" : ""}`}
                  style={{ background: s.c }}
                />
                <div className="mt-1.5 font-mono text-[8px] tracking-[0.15em] uppercase text-brand-ink-soft">
                  {s.n}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative corner marker */}
      <div className="absolute -top-4 -right-4 hidden sm:block drift">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border border-brand-ink/30 flex items-center justify-center bg-brand-cream-soft/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="font-display italic text-brand-oxblood text-2xl leading-none">
                new
              </div>
              <div className="font-mono text-[8px] tracking-[0.2em] uppercase text-brand-ink-soft mt-0.5">
                2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
