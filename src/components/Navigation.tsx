import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Services', path: '/#services' },
    { name: 'Pricing', path: '/#pricing' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Tools', path: '/tools' },
    { name: 'Consultation', path: '/consultation' },
    { name: 'Fitness Science', path: '/blog' },
  ];

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/#' + id);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-ink">
        <Link to="/" className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-sm flex items-center justify-center font-black text-black text-xl italic leading-none">M</div>
            <span className="text-xl font-black tracking-tighter uppercase font-display">MIT2FIT</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold mt-1">You can move the mountains</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-zinc-400 uppercase">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => link.path.includes('#') && scrollToSection(link.path.split('#')[1])}
              className={`${location.pathname === link.path ? 'text-white' : 'hover:text-white'} transition-colors`}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => scrollToSection('book')}
            className="px-6 py-2 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-brand hover:text-white transition-all shadow-lg"
          >
            Book Consult
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden bg-paper overflow-hidden shadow-2xl border-b border-edge"
      >
        <div className="flex flex-col p-8 gap-6 border-t border-edge">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => {
                setIsOpen(false);
                if (link.path.includes('#')) scrollToSection(link.path.split('#')[1]);
              }}
              className="text-2xl font-display uppercase tracking-tighter text-white hover:text-brand transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => scrollToSection('book')}
            className="btn-primary w-full text-center"
          >
            Book Consult
          </button>
        </div>
      </motion.div>
    </nav>
  );
}
