import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Users, Monitor, MapPin, Zap } from 'lucide-react';
import {
  appendCalendlyParams,
  getConsultCalendlyUrl,
  getTrainingCalendlyUrl,
} from '../lib/calendly';

type ScheduleKind = 'consult' | 'training';

type Tier = {
  name: string;
  duration: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
  scheduleKind: ScheduleKind;
  tierId: string;
};

const tiers: Tier[] = [
  {
    name: "Standard Audit",
    duration: "45 MIN",
    price: "150",
    description: "Ideal for form corrections, plateaus, or a single-objective technical deep dive.",
    features: [
      "Objective Assessment",
      "Real-time Correction",
      "Post-Session Protocol PDF",
      "Virtual or In-Person"
    ],
    cta: "Select Session",
    highlight: false,
    scheduleKind: 'consult',
    tierId: 'standard-audit',
  },
  {
    name: "Performance Build",
    duration: "5 SESSIONS",
    price: "675",
    description: "The sweet spot for establishing new neural pathways and metabolic adaptation.",
    features: [
      "10% Bulk Discount Applied",
      "Custom Macro Blueprint",
      "Weekly Progress Audit",
      "Priority Scheduling",
      "Virtual or In-Person"
    ],
    cta: "Start Protocol",
    highlight: true,
    scheduleKind: 'training',
    tierId: 'performance-build',
  },
  {
    name: "Elite Protocol",
    duration: "10 SESSIONS",
    price: "1200",
    description: "Total biological overhaul for those demanding peak performance year-round.",
    features: [
      "20% Optimized Value",
      "24/7 Priority Support",
      "Advanced Bio-Data Tracking",
      "Guest Pass for Group Sessions",
      "Virtual or In-Person"
    ],
    cta: "Commit to Excellence",
    highlight: false,
    scheduleKind: 'training',
    tierId: 'elite-protocol',
  }
];

export default function Pricing() {
  const navigate = useNavigate();
  const [isVirtual, setIsVirtual] = useState(true);

  const handleTierSchedule = async (tier: Tier) => {
    const url =
      tier.scheduleKind === 'consult'
        ? getConsultCalendlyUrl(isVirtual)
        : getTrainingCalendlyUrl(isVirtual);
    if (url) {
      const trackedUrl = appendCalendlyParams(url, { utm_content: tier.tierId });
      window.open(trackedUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    navigate({ pathname: '/', hash: 'book' });
  };

  return (
    <section id="pricing" className="py-16 md:py-32 bg-black border-b border-edge">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.3em] mb-4 block underline decoration-brand underline-offset-4">Performance Investment</span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter leading-none italic break-words">
              Scale Your <span className="text-brand not-italic">Output.</span>
            </h2>
            <p className="text-xl text-zinc-500 leading-relaxed font-sans max-w-xl">
              Precision protocols designed for the high-impact individual. Choose your entry point and optimize your trajectory.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex bg-zinc-900 border border-edge p-1">
              <button 
                onClick={() => setIsVirtual(true)}
                className={`flex items-center gap-2 px-6 py-3 text-[10px] font-mono uppercase tracking-widest transition-all ${isVirtual ? 'bg-brand text-black font-black' : 'text-zinc-500 hover:text-white'}`}
              >
                <Monitor size={14} /> Virtual
              </button>
              <button 
                onClick={() => setIsVirtual(false)}
                className={`flex items-center gap-2 px-6 py-3 text-[10px] font-mono uppercase tracking-widest transition-all ${!isVirtual ? 'bg-brand text-black font-black' : 'text-zinc-500 hover:text-white'}`}
              >
                <MapPin size={14} /> In-Person
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-0 border border-edge">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 md:p-12 border-edge flex flex-col ${i !== tiers.length - 1 ? 'lg:border-r border-b lg:border-b-0' : ''} ${tier.highlight ? 'bg-zinc-900/50 relative overflow-hidden' : 'bg-black'}`}
            >
              {tier.highlight && (
                <div className="absolute top-0 right-0 p-4">
                  <div className="bg-brand text-black text-[8px] font-black uppercase px-2 py-1 tracking-widest rotate-6">Popular</div>
                </div>
              )}
              
              <div className="mb-6 md:mb-8">
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">{tier.duration}</div>
                <h3 className="text-3xl font-black uppercase tracking-tight mb-4">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-brand tracking-tighter">${tier.price}</span>
                  <span className="text-xs text-zinc-600 font-mono">/ SESSION PACK</span>
                </div>
              </div>

              <p className="text-zinc-500 text-sm leading-relaxed mb-8 h-12">
                {tier.description}
              </p>

              <div className="space-y-4 mb-12 flex-grow">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-4 h-4 border border-zinc-800 flex items-center justify-center">
                      <Check size={10} className="text-brand" />
                    </div>
                    <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wide">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => void handleTierSchedule(tier)}
                aria-label={`${tier.cta} for ${tier.name}`}
                className={`w-full py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all group border ${tier.highlight ? 'bg-brand text-black border-brand hover:brightness-110' : 'bg-transparent text-white border-edge hover:border-brand hover:text-brand'}`}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 md:mt-24 mb-12">
          <div className="flex items-center gap-2 md:gap-4 mb-8 md:mb-12">
            <div className="h-[1px] flex-grow bg-edge"></div>
            <h3 className="text-[10px] md:text-sm font-mono uppercase tracking-[0.2em] md:tracking-[0.4em] text-zinc-500 text-center">Momentum Protocol : Rewards</h3>
            <div className="h-[1px] flex-grow bg-edge"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Zero-Break Streak",
                metric: "4 CONSECUTIVE",
                reward: "5TH FREE",
                desc: "Complete your first 4-session block without a single reschedule to unlock your 5th session."
              },
              {
                title: "Momentum Compound",
                metric: "6TH SESSION",
                reward: "FREE",
                desc: "Every 6th hour of high-intensity training is on the house for clients maintaining a bi-weekly cadence."
              },
              {
                title: "Legacy Protocol",
                metric: "CONSISTENCY",
                reward: "20% OFF",
                desc: "Returning clients receive a 20% flat discount on single session rates after their initial audit."
              }
            ].map((item, idx) => (
              <div key={idx} className="border border-edge p-8 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
                <div className="text-[10px] font-mono text-brand mb-4 uppercase tracking-[0.2em]">{item.metric}</div>
                <h4 className="text-xl font-black uppercase tracking-tight mb-2">{item.title}</h4>
                <div className="text-2xl font-black text-white mb-4 italic">{item.reward}</div>
                <p className="text-[10px] font-mono uppercase leading-loose text-zinc-500 tracking-wider">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Group Training Callout */}
        <div className="mt-16 md:mt-24 grid md:grid-cols-2 gap-8 items-center bg-zinc-900 border border-edge p-8 md:p-12 overflow-hidden relative group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-brand/10 border border-brand/20">
                <Users className="text-brand" size={24} />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand">Corporate / Team Protocol</span>
            </div>
            <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">Power of the <span className="text-brand not-italic">Pack.</span></h3>
            <p className="text-zinc-500 max-w-md leading-relaxed mb-8">
              Transform your unit. We offer specialized group rates for teams of 3+ looking to synchronize their performance cycles and build collective momentum.
            </p>
            <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white hover:text-brand transition-colors">
              Request Group Quote <Zap size={14} className="text-brand" />
            </button>
          </div>
          
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/3 opacity-10 group-hover:opacity-20 transition-opacity">
             <div className="w-full h-full border-l border-zinc-800 grid grid-cols-4 grid-rows-8 gap-1 p-4">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className="bg-zinc-800/50"></div>
                ))}
             </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-[0.2em]">
            * All scaling provided by the MIT2FIT Performance Network. Certified Trainers vetted personally by MIT.
          </p>
        </div>
      </div>
    </section>
  );
}
