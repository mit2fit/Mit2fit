import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, ArrowUp } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-black py-12 md:py-16 border-t border-edge overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 md:mb-20 gap-16">
          <div className="max-w-md">
            <Link to="/" className="inline-flex mb-8" aria-label="MIT2FIT home">
              <BrandLogo taglineTone="brand" />
            </Link>
            <p className="text-zinc-500 text-lg leading-relaxed mb-10">
              Pushing the boundaries of human potential through biological data and elite training protocols. Optimized for life.
            </p>
            <div className="flex gap-2">
              {[Instagram, Twitter, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 flex items-center justify-center border border-edge text-zinc-500 hover:bg-brand hover:text-white transition-all uppercase font-mono text-[9px] font-bold">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div>
              <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-600 mb-8 border-b border-edge/50 pb-2">Protocols</h4>
              <ul className="space-y-4 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                <li><Link to="/blog" className="hover:text-brand transition-colors">Journal</Link></li>
                <li><Link to="/tools" className="hover:text-brand transition-colors">Performance Tools</Link></li>
                <li><Link to="/consultation" className="hover:text-brand transition-colors">Intake Form</Link></li>
                <li><a href="#" className="hover:text-brand transition-colors">Nutrition</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-600 mb-8 border-b border-edge/50 pb-2">HQ</h4>
              <ul className="space-y-4 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                <li><Link to="/#about" className="hover:text-brand transition-colors">DNA</Link></li>
                <li><Link to="/#book" className="hover:text-brand transition-colors">Contact</Link></li>
                <li><a href="#" className="hover:text-brand transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-edge gap-8">
          <div className="flex gap-6">
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">© 2026 MIT2FIT — Hackensack, NJ</span>
            <span className="hidden sm:block font-mono text-[9px] uppercase tracking-widest text-zinc-700">STAY VOID OF COMPLACENCY.</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex gap-4 font-mono text-[9px] text-zinc-700 uppercase tracking-widest">
              <span>V.121 OK</span>
              <span>Safari READY</span>
            </div>
            <button 
              onClick={scrollToTop}
              className="w-10 h-10 border border-edge flex items-center justify-center text-zinc-500 hover:text-brand hover:border-brand transition-all"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
