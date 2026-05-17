type BrandLogoProps = {
  taglineTone?: 'muted' | 'brand';
};

export default function BrandLogo({ taglineTone = 'muted' }: BrandLogoProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <span className="relative inline-flex items-end font-display text-[28px] font-black italic leading-none tracking-tight text-zinc-100 drop-shadow-[2px_2px_0_rgba(0,0,0,0.65)]">
          <span className="-skew-x-12">MIT</span>
          <span className="relative z-10 -mx-0.5 -translate-y-0.5 scale-x-[1.18] scale-y-[1.75] text-brand drop-shadow-[3px_1px_0_rgba(255,255,255,0.14)]">
            2
          </span>
          <span className="absolute left-[58px] top-[7px] h-2 w-8 -skew-x-12 bg-brand/80 blur-[1px]" />
          <span className="absolute left-[64px] top-[4px] h-1 w-5 -skew-x-12 bg-brand/60 blur-[1px]" />
          <span className="absolute left-[69px] top-[12px] h-1.5 w-3 rounded-full bg-brand/70 blur-[1px]" />
          <span className="absolute left-[74px] top-[2px] h-1 w-1 rounded-full bg-brand/80" />
          <span className="absolute left-[79px] top-[10px] h-1 w-1 rounded-full bg-brand/70" />
          <span className="relative z-20 -skew-x-12">Fit</span>
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
