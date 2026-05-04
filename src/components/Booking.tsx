import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, MapPin, Calendar, ArrowRight } from 'lucide-react';
import {
  getCalendlyFallbackUrl,
  getConsultCalendlyUrl,
} from '../lib/calendly';

export default function Booking() {
  const embedSrc = useMemo(
    () =>
      getConsultCalendlyUrl(true) ??
      getConsultCalendlyUrl(false) ??
      getCalendlyFallbackUrl(),
    []
  );

  return (
    <section id="book" className="py-16 md:py-32 bg-paper text-ink overflow-hidden border-b border-edge relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em] mb-6 block">Consultation / Booking</span>
            <h2 className="text-3xl sm:text-6xl md:text-[8rem] mb-8 md:mb-12 leading-none font-black uppercase tracking-tighter break-words">
              Start Your <br /><span className="text-brand">Evolution.</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12 mt-12 md:mt-16 border-t border-edge pt-8 md:pt-12">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <Mail className="text-brand shrink-0" size={20} />
                  <div>
                    <p className="font-mono uppercase tracking-widest text-[9px] text-zinc-600 mb-1">Direct Communication</p>
                    <p className="text-xl font-bold tracking-tight uppercase">contact@mit2fit.com</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin className="text-brand shrink-0" size={20} />
                  <div>
                    <p className="font-mono uppercase tracking-widest text-[9px] text-zinc-600 mb-1">Base of Operations</p>
                    <p className="text-xl font-bold tracking-tight uppercase">Hackensack, NJ — Global Remote</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface p-8 border border-edge skew-x-[-2deg]">
                <div className="skew-x-[2deg]">
                  <p className="text-brand font-display italic text-2xl mb-2 font-black leading-none uppercase tracking-tighter">"Results are the only valid metric."</p>
                  <p className="font-mono text-[9px] uppercase text-zinc-600 tracking-widest">— The Mit2Fit Protocol</p>
                </div>
              </div>
            </div>

            <div className="mt-12 md:mt-16 border border-edge bg-surface/50 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Calendar className="text-brand shrink-0 mt-1" size={22} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white mb-2">After you book</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 leading-relaxed mb-4">
                    Complete the performance intake so we can align your session to your goals and readiness.
                  </p>
                  <Link
                    to="/consultation"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-brand text-brand px-6 py-3 hover:bg-brand hover:text-black transition-all"
                  >
                    Open intake protocol <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-surface p-[1px] border border-edge relative group">
            <div className="absolute -inset-1 bg-brand/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="bg-zinc-950 h-full p-6 md:p-12 relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">
                Schedule <span className="text-brand not-italic">Consult</span>
              </h3>
              <p className="text-zinc-500 mb-6 md:mb-8 text-[10px] font-mono uppercase tracking-widest leading-loose">
                Pick a live time below. No account required—Calendly confirms your slot by email.
              </p>

              {embedSrc ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-sm border border-edge overflow-hidden bg-black min-h-[640px]"
                >
                  <iframe
                    title="Schedule a consultation"
                    src={embedSrc}
                    className="w-full min-h-[640px] h-[70vh] max-h-[900px]"
                    loading="lazy"
                  />
                </motion.div>
              ) : (
                <div className="border border-edge bg-black/40 p-8 text-center space-y-4">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 leading-relaxed">
                    Set <span className="text-zinc-300">VITE_CALENDLY_CONSULT_URL</span> or{' '}
                    <span className="text-zinc-300">VITE_CALENDLY_URL</span> in your environment to enable the scheduler.
                  </p>
                  <Link
                    to="/consultation"
                    className="inline-block text-[10px] font-black uppercase tracking-widest border border-brand text-brand px-8 py-4 hover:bg-brand hover:text-black transition-all"
                  >
                    Proceed to intake only
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
