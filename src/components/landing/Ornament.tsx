// Editorial ornament — used as section dividers and markers.

export function DotRule({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px flex-1 bg-brand-ink/20" />
      <span className="h-1.5 w-1.5 rounded-full bg-brand-oxblood" />
      <span className="h-px flex-1 bg-brand-ink/20" />
    </div>
  );
}

export function SectionNumber({
  n,
  label,
}: {
  n: string;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.32em] uppercase text-brand-ink-soft">
      <span className="text-brand-oxblood font-medium">N° {n}</span>
      <span className="h-px w-8 bg-brand-ink/25" />
      <span>{label}</span>
    </div>
  );
}
