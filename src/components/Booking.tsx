import React, { useEffect, useState } from 'react';
import { useForm } from '@formspree/react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { getConsultCalendlyUrl } from '../lib/calendly';

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID ?? 'xnjwjkld';

export default function Booking() {
  const calendlyConsultUrl = getConsultCalendlyUrl(true) ?? getConsultCalendlyUrl(false) ?? '';
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(2); // 13:00
  const [identity, setIdentity] = useState('');
  const [email, setEmail] = useState('');
  const [objective, setObjective] = useState('');
  const [state, handleSubmitFormspree] = useForm(FORMSPREE_ID);
  const [isRedirectingToIntake, setIsRedirectingToIntake] = useState(false);
  const [redirectSource, setRedirectSource] = useState<'calendly' | 'fallback' | null>(null);
  const [showFallbackForm, setShowFallbackForm] = useState(false);
  const [countdown, setCountdown] = useState(15);

  const startConsultationRedirect = (source: 'calendly' | 'fallback') => {
    setRedirectSource(source);
    setCountdown(15);
    setIsRedirectingToIntake(true);
  };

  useEffect(() => {
    if (state.succeeded) {
      startConsultationRedirect('fallback');
    }
  }, [state.succeeded]);

  useEffect(() => {
    if (!isRedirectingToIntake) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const redirectTimer = setTimeout(() => {
      window.location.href = '/consultation';
    }, 15000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [isRedirectingToIntake]);

  const getDates = () => {
    const dates = [];
    const startDate = new Date('2026-05-04');
    let current = new Date(startDate);
    while (dates.length < 10) {
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const availabilityDates = getDates();

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const times = ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30'];
    const date = availabilityDates[selectedDateIndex];
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();

    await handleSubmitFormspree({
      name: identity,
      email,
      objective,
      slot: `${dateStr} @ ${times[selectedTime]}`,
      duration: '30 MIN',
      _subject: `Strategy Session Request: ${identity}`,
    });
  };

  return (
    <section id="book" className="py-16 md:py-32 bg-paper text-ink overflow-hidden border-b border-edge relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em] mb-6 block">Consultation / Booking</span>
            <h2 className="text-3xl sm:text-6xl md:text-[8rem] mb-8 md:mb-12 leading-none font-black uppercase tracking-tighter break-words">
              Start Your <br />
              <span className="text-brand">Evolution.</span>
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
            </div>
          </div>

          <div className="lg:col-span-5 bg-surface p-[1px] border border-edge relative group">
            <div className="absolute -inset-1 bg-brand/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-zinc-950 h-full p-6 md:p-12 relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">Request Protocol <span className="text-brand not-italic">Access</span></h3>
              <p className="text-zinc-500 mb-8 md:mb-10 text-[10px] font-mono uppercase tracking-widest leading-loose">
                Request a performance audit. We&apos;ll analyze your current output and define your optimization pathway.
              </p>

              {isRedirectingToIntake ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 py-12 text-center">
                  <div className="w-16 h-16 border border-brand bg-brand/5 flex items-center justify-center mx-auto mb-6">
                    <Calendar className="text-brand" size={32} />
                  </div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter italic">Session <span className="text-brand not-italic">Secured.</span></h3>
                  <div className="space-y-4 max-w-sm mx-auto">
                    {redirectSource === 'calendly' ? (
                      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 leading-loose">
                        <span className="text-white">Calendly confirmation received.</span>
                        <br />
                        Preparing your consultation intake sequence.
                      </p>
                    ) : (
                      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 leading-loose">
                        <span className="text-white">{availabilityDates[selectedDateIndex].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()} @ {['09:00', '10:30', '13:00', '14:30', '16:00', '17:30'][selectedTime]}</span>
                        <br />
                        Formspree fallback submitted to HQ.
                      </p>
                    )}
                    <div className="pt-4 border-t border-edge">
                      <p className="text-[11px] font-black uppercase tracking-widest text-brand mb-1">Next: Intake Protocol</p>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 leading-relaxed mb-4">
                        Provide your bio-data now to maximize our technical duration.
                      </p>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 opacity-60">
                        Auto-redirecting in {countdown}s...
                      </p>
                    </div>
                  </div>
                  <Link to="/consultation" className="inline-block mt-8 text-[10px] font-black uppercase tracking-widest border border-brand text-brand px-8 py-4 hover:bg-brand hover:text-black transition-all">
                    Proceed Manually
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div className="border border-edge p-6 bg-zinc-900/30 space-y-4">
                    <p className="text-[9px] font-mono uppercase text-zinc-500 tracking-widest leading-relaxed">
                      Primary booking runs through Calendly for live scheduling.
                    </p>
                    <div className="space-y-3">
                      <a
                        href={calendlyConsultUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full btn-primary group flex items-center justify-center gap-4 py-5 ${!calendlyConsultUrl ? 'pointer-events-none opacity-40' : ''}`}
                      >
                        Open Calendly Booking <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </a>
                      <button
                        type="button"
                        onClick={() => startConsultationRedirect('calendly')}
                        className="w-full border border-brand text-brand py-4 text-[10px] font-black uppercase tracking-widest hover:bg-brand hover:text-black transition-all"
                      >
                        I Confirmed My Calendly Booking
                      </button>
                    </div>
                    {!calendlyConsultUrl && (
                      <p className="text-[8px] font-mono uppercase text-zinc-600 tracking-widest">
                        Set `VITE_CALENDLY_CONSULT_URL` or `VITE_CALENDLY_URL` to enable live Calendly booking.
                      </p>
                    )}
                  </div>

                  <div className="border-t border-edge pt-6">
                    <button
                      type="button"
                      onClick={() => setShowFallbackForm((prev) => !prev)}
                      className="w-full border border-edge text-zinc-400 py-4 text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-zinc-600 transition-all"
                    >
                      {showFallbackForm ? 'Hide' : 'Use'} Email Fallback (Formspree)
                    </button>
                  </div>

                  {showFallbackForm && (
                    <form className="space-y-6" onSubmit={handleBooking}>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono uppercase text-zinc-600 tracking-widest pl-1">Full Identity</label>
                            <input
                              type="text"
                              required
                              value={identity}
                              onChange={(e) => setIdentity(e.target.value)}
                              placeholder="NAME"
                              className="w-full bg-black border border-edge p-4 focus:border-brand outline-none transition-colors uppercase text-[10px] tracking-widest text-white placeholder:text-zinc-800"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono uppercase text-zinc-600 tracking-widest pl-1">Contact Email</label>
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="EMAIL"
                              className="w-full bg-black border border-edge p-4 focus:border-brand outline-none transition-colors uppercase text-[10px] tracking-widest text-white placeholder:text-zinc-800"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-end pr-1">
                            <label className="text-[9px] font-mono uppercase text-zinc-600 tracking-widest pl-1">Target Date (2 Week Window)</label>
                            <span className="text-[8px] font-mono text-zinc-500 uppercase">Mon-Fri Only</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1">
                            {availabilityDates.map((date, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setSelectedDateIndex(i)}
                                className={`py-3 border text-[10px] font-black tracking-widest transition-all ${selectedDateIndex === i ? 'border-brand text-brand bg-brand/5 shadow-[0_0_10px_rgba(234,255,0,0.1)]' : 'border-edge text-zinc-600 hover:text-white hover:border-zinc-700'}`}
                              >
                                {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()} <br />
                                <span className="text-[8px] opacity-60">
                                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center pr-1">
                            <label className="text-[9px] font-mono uppercase text-zinc-600 tracking-widest pl-1">Available Windows (30 MIN)</label>
                            <span className="text-[8px] font-mono text-brand uppercase tracking-tighter">Eastern Time</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {['09:00', '10:30', '13:00', '14:30', '16:00', '17:30'].map((time, i) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setSelectedTime(i)}
                                className={`py-3 border text-[10px] font-mono transition-all ${selectedTime === i ? 'border-brand text-brand bg-brand/5' : 'border-edge text-zinc-500 hover:text-white'}`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-mono uppercase text-zinc-600 tracking-widest pl-1">Primary Performance Objective</label>
                          <textarea
                            required
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                            placeholder="WHAT ARE WE OPTIMIZING?"
                            rows={2}
                            className="w-full bg-black border border-edge p-4 focus:border-brand outline-none transition-colors uppercase text-[10px] tracking-widest text-white resize-none placeholder:text-zinc-800"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={state.submitting}
                        className="w-full btn-primary group flex items-center justify-center gap-4 py-5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {state.submitting ? 'TRANSMITTING...' : (
                          <>Send Fallback Booking Request <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                      </button>

                      <p className="text-[8px] font-mono uppercase text-zinc-700 tracking-widest leading-relaxed text-center px-4 mt-6 italic">
                        * Formspree fallback opens an email chain with your requested slot and optimization objective.
                      </p>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
