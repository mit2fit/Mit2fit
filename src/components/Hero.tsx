import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Activity } from 'lucide-react';

export default function Hero() {
  const scrollToBook = () => {
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex items-center pt-24 md:pt-20 overflow-hidden bg-paper text-ink border-b border-edge">
      <div className="max-w-7xl mx-auto px-6 w-full py-12 md:py-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8"
          >
            <span className="text-brand font-mono text-xs font-bold uppercase tracking-[0.4em] mb-8 block">
              Performance & Longevity
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] mb-10 tracking-tighter break-words">
              Effective <br /> 
              <span className="text-brand">Performance</span> <br /> 
              Coaching.
            </h1>
            <p className="text-zinc-500 max-w-lg text-lg md:text-xl leading-relaxed mb-12 font-sans">
              No shortcuts. No fluff. Just grounded, science-backed protocols designed for high-performing individuals who value efficiency, results, and long-term health.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={scrollToBook}
                className="btn-primary flex items-center justify-center gap-3"
              >
                Book Strategy Session <ArrowRight size={18} />
              </button>
              <button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary"
              >
                View Services
              </button>
            </div>
          </motion.div>

          <div className="lg:col-span-4 hidden lg:block relative">
            <div className="aspect-[4/5] bg-surface border border-edge p-2 group overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000"
                alt="Elite Performance"
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-brand p-8 shadow-2xl skew-x-[-10deg]">
              <div className="skew-x-[10deg]">
                <span className="block font-display text-4xl font-black italic text-black">+250%</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-black/80">Power Output</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
