type BrandLogoProps = {
  taglineTone?: 'muted' | 'brand';
};

export default function BrandLogo({ taglineTone = 'muted' }: BrandLogoProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <span className="relative inline-flex items-end font-display text-[28px] font-black italic leading-none tracking-tight text-zinc-100 drop-shadow-[2px_2px_0_rgba(0,0,0,0.65)]">
          <span className="-skew-x-12">MIT</span>
          <span className="-mx-1 -translate-y-0.5 scale-125 text-brand drop-shadow-[2px_1px_0_rgba(255,255,255,0.14)]">
            2
          </span>
          <span className="-skew-x-12">Fit</span>
        </span>
        <span
          className={`mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.24em] ${
            taglineTone === 'brand' ? 'text-brand' : 'text-zinc-500'
          }`}
        >
          You can move the mountains
        </span>
      </div>
    </div>
  );
}
