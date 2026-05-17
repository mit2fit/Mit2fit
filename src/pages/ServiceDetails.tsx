import { Link, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, Dumbbell, ShieldCheck, Target, Zap } from 'lucide-react';
import { getServiceById, ServiceId } from '../data/services';

const serviceIcons: Record<ServiceId, ReactNode> = {
  'strength-design': <Dumbbell className="text-brand" size={36} />,
  'reactive-power': <Zap className="text-brand" size={36} />,
  'movement-quality': <Target className="text-brand" size={36} />,
  'precision-nutrition': <ShieldCheck className="text-brand" size={36} />,
};

export default function ServiceDetails() {
  const { id } = useParams();
  const service = getServiceById(id);

  if (!service) {
    return (
      <main className="pt-32 pb-16 md:pt-40 md:pb-32 bg-paper text-ink min-h-screen">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-brand font-mono text-[10px] uppercase tracking-[0.4em] mb-6">Service Not Found</p>
          <h1 className="text-4xl md:text-7xl mb-8">Unknown Protocol.</h1>
          <Link to="/#services" className="btn-primary inline-flex items-center gap-3">
            Back to Services <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-16 md:pt-40 md:pb-32 bg-paper text-ink min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          to="/#services"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 hover:text-brand transition-colors mb-10 md:mb-16"
        >
          <ArrowLeft size={14} /> Back to Services
        </Link>

        <header className="grid lg:grid-cols-12 gap-10 md:gap-16 border-b border-edge pb-12 md:pb-20 mb-12 md:mb-20">
          <div className="lg:col-span-8">
            <span className="text-brand font-mono text-[10px] uppercase tracking-[0.4em] mb-6 block">
              {service.eyebrow}
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl leading-none mb-8">
              {service.title}
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed max-w-3xl">
              {service.lead}
            </p>
          </div>

          <aside className="lg:col-span-4 border border-edge bg-surface p-8 md:p-10 flex flex-col justify-between gap-12">
            <div className="flex justify-between items-start">
              <div className="w-16 h-16 border border-brand/20 bg-brand/5 flex items-center justify-center">
                {serviceIcons[service.id]}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">MIT2FIT</span>
            </div>
            <div>
              <p className="text-zinc-500 leading-relaxed mb-6">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span key={tag} className="font-mono text-[9px] uppercase tracking-widest border border-zinc-800 px-2 py-1 text-brand">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </header>

        <div className="grid lg:grid-cols-3 gap-px bg-edge border border-edge mb-12 md:mb-20">
          <DetailPanel title="Expected Outcomes" items={service.outcomes} />
          <DetailPanel title="What This Includes" items={service.includes} />
          <DetailPanel title="Best For" items={service.bestFor} />
        </div>

        <section className="grid md:grid-cols-2 gap-8 items-center bg-zinc-900 border border-edge p-8 md:p-12">
          <div>
            <span className="text-brand font-mono text-[10px] uppercase tracking-[0.3em] mb-4 block">Next Step</span>
            <h2 className="text-3xl md:text-5xl leading-none mb-6">Build This Into Your Plan.</h2>
            <p className="text-zinc-500 leading-relaxed">
              Book an initial consult if you want this service matched to your current training history, schedule, and goals.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
            <Link to="/#book" className="btn-primary inline-flex items-center justify-center gap-3">
              Book Initial Consult <ArrowRight size={16} />
            </Link>
            <Link to="/#pricing" className="btn-secondary inline-flex items-center justify-center">
              View Pricing
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function DetailPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="bg-paper p-8 md:p-10">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand mb-8">
        {title}
      </h2>
      <ul className="space-y-5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-zinc-400 leading-relaxed">
            <Check size={16} className="text-brand shrink-0 mt-1" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
