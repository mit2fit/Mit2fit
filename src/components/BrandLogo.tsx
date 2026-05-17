type BrandLogoProps = {
  taglineTone?: 'muted' | 'brand';
};

export default function BrandLogo({ taglineTone = 'muted' }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-11 w-11 shrink-0 border border-brand/60 bg-black shadow-[0_0_24px_rgba(234,88,12,0.18)]">
        <span className="absolute left-1.5 top-1 font-display text-[12px] font-black leading-none tracking-tight text-white">
          MIT
        </span>
        <span className="absolute left-[13px] top-[10px] font-display text-[31px] font-black italic leading-none text-brand drop-shadow-[2px_2px_0_rgba(255,255,255,0.12)]">
          2
        </span>
        <span className="absolute bottom-1 right-1.5 font-display text-[13px] font-black leading-none tracking-tight text-zinc-200">
          FIT
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-display text-xl font-black uppercase leading-none tracking-tight text-white">
          MIT<span className="text-brand">2</span>FIT
        </span>
        <span
          className={`mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] ${
            taglineTone === 'brand' ? 'text-brand' : 'text-zinc-500'
          }`}
        >
          You can move the mountains
        </span>
      </div>
    </div>
  );
}
