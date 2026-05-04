import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-16 md:py-32 bg-paper text-ink overflow-hidden border-b border-edge">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-square bg-surface border border-edge p-2 bg-zinc-900"
          >
            <img 
              src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=1000" 
              alt="Elite Training" 
              className="w-full h-full object-cover grayscale opacity-60"
            />
          </motion.div>
          <div className="absolute inset-0 border border-brand/20 translate-x-4 translate-y-4 -z-10" />
        </div>

        <div>
          <span className="text-brand font-mono text-xs font-bold uppercase tracking-widest mb-6 block">Our Story / Real Results</span>
          <h2 className="text-3xl sm:text-5xl md:text-8xl mb-10 tracking-tighter uppercase font-black italic text-ink break-words">
            The <span className="text-brand not-italic">Mit2Fit</span> <br /> Purpose.
          </h2>
          <div className="space-y-6 text-xl text-zinc-500 leading-relaxed font-sans">
            <p>
              Success isn't reserved for the young. As a NASM Certified Personal Trainer and Nutrition Coach who started this professional journey at 40, I know that effective fitness is about sustainability and smart application.
            </p>
            <p>
              At MIT2FIT, we don't chase trends. We use foundational, science-backed training protocols to bridge the gap between where you are and where your biology is capable of going.
            </p>
            <p className="border-l-2 border-brand pl-6 italic text-zinc-300">
              "We focus on the fundamentals: Movement efficiency, metabolic health, and the discipline to execute every single day."
            </p>
            <ul className="grid grid-cols-2 gap-4 mt-12 pt-12 border-t border-edge uppercase font-display text-[10px] tracking-[0.2em] text-brand">
              <li className="flex items-center gap-2 underline decoration-zinc-800">NASM Certified</li>
              <li className="flex items-center gap-2 underline decoration-zinc-800">Nutrition Focused</li>
              <li className="flex items-center gap-2 underline decoration-zinc-800">Longevity First</li>
              <li className="flex items-center gap-2 underline decoration-zinc-800">No Glitch Fitness</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
