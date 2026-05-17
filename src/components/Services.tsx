import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Dumbbell, Target, Zap, ShieldCheck } from 'lucide-react';
import { ServiceId, services } from '../data/services';

const serviceIcons: Record<ServiceId, ReactNode> = {
  'strength-design': <Dumbbell className="text-brand" size={32} />,
  'reactive-power': <Zap className="text-brand" size={32} />,
  'movement-quality': <Target className="text-brand" size={32} />,
  'precision-nutrition': <ShieldCheck className="text-brand" size={32} />,
};

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
              key={service.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="border-r border-b border-edge"
            >
              <Link
                to={`/services/${service.id}`}
                className="p-8 md:p-12 hover:bg-zinc-900 transition-all group flex flex-col min-h-[320px] md:min-h-[400px] h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                aria-label={`View details for ${service.title}`}
              >
                <div className="mb-8 md:mb-12 flex justify-between items-start">
                  <span className="text-brand font-mono text-xs font-bold uppercase tracking-widest">0{idx + 1}.</span>
                  <div className="opacity-20 group-hover:opacity-100 transition-opacity text-brand">{serviceIcons[service.id]}</div>
                </div>
                <h3 className="text-2xl font-black mb-4 group-hover:text-brand transition-colors tracking-tighter">{service.title}</h3>
                <p className="text-zinc-500 group-hover:text-zinc-300 mb-8 flex-grow leading-relaxed">{service.description}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {service.tags.map(tag => (
                    <span key={tag} className="font-mono text-[9px] uppercase tracking-widest border border-zinc-800 px-2 py-1 text-zinc-600 group-hover:text-brand group-hover:border-brand/40">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
