import { motion } from 'motion/react';
import { Dumbbell, Target, Zap, ShieldCheck } from 'lucide-react';

const services = [
  {
    icon: <Dumbbell className="text-brand" size={32} />,
    title: "Strength Design",
    description: "Systematic program design focused on foundational strength, muscle growth, and movement quality.",
    tags: ["Hypertrophy", "Strength", "NASM Principles"]
  },
  {
    icon: <Zap className="text-brand" size={32} />,
    title: "Reactive Power",
    description: "Developing explosive output and stability through high-intensity and plyometric movements.",
    tags: ["Power", "Explosiveness", "Agility"]
  },
  {
    icon: <Target className="text-brand" size={32} />,
    title: "Movement Quality",
    description: "In-depth form assessment to improve efficiency and reduce the risk of long-term injury.",
    tags: ["Form Analysis", "Mobility", "Longevity"]
  },
  {
    icon: <ShieldCheck className="text-brand" size={32} />,
    title: "Precision Nutrition",
    description: "Grounded nutrition coaching based on your real-world lifestyle and performance goals.",
    tags: ["Macros", "Lifestyle", "Consistency"]
  }
];

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-32 bg-paper border-b border-edge">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 md:mb-24 gap-8">
          <div className="max-w-3xl">
            <span className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-6 block">Core Services / Methodology</span>
            <h2 className="text-3xl sm:text-5xl md:text-8xl mb-8 break-words leading-none">Grounded <br /> <span className="text-brand italic underline decoration-edge underline-offset-8">Performance</span></h2>
            <p className="text-xl text-zinc-500 leading-relaxed font-sans">We prioritize functional longevity and measurable progress over generic fitness fads.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-edge">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 md:p-12 border-r border-b border-edge hover:bg-zinc-900 transition-all group flex flex-col min-h-[320px] md:min-h-[400px]"
            >
              <div className="mb-8 md:mb-12 flex justify-between items-start">
                <span className="text-brand font-mono text-xs font-bold uppercase tracking-widest">0{idx + 1}.</span>
                <div className="opacity-20 group-hover:opacity-100 transition-opacity text-brand">{service.icon}</div>
              </div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-brand transition-colors tracking-tighter">{service.title}</h3>
              <p className="text-zinc-500 group-hover:text-zinc-300 mb-8 flex-grow leading-relaxed">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map(tag => (
                  <span key={tag} className="font-mono text-[9px] uppercase tracking-widest border border-zinc-800 px-2 py-1 text-zinc-600 group-hover:text-brand group-hover:border-brand/40">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
