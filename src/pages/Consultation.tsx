import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, CheckCircle2, FileText, ShieldAlert, HeartPulse, Utensils, Send } from 'lucide-react';

type Step = 'info' | 'health' | 'habits' | 'legal' | 'success';

export default function Consultation() {
  const [step, setStep] = useState<Step>('info');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goal: '',
    medicalConditions: '',
    medications: '',
    activityLevel: 'moderate',
    dietType: '',
    waterIntake: '',
    sleepHours: '',
    waiverAgreed: false,
    parq1: false, // Has a doctor ever said you have a heart condition?
    parq2: false, // Do you feel pain in your chest when you perform physical activity?
    parq3: false, // Do you lose your balance because of dizziness?
  });

  const nextStep = (target: Step) => setStep(target);
  const prevStep = (target: Step) => setStep(target);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Transmit to contact@mit2fit.com
    console.log('TRANSMITTING BIO-READINESS INTAKE TO contact@mit2fit.com:', formData);
    setStep('success');
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <main className="pt-32 pb-16 md:pt-40 md:pb-32 bg-paper text-ink min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-12 md:mb-16 border-b border-edge pb-10 md:pb-12">
          <span className="text-brand font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block">Onboarding Protocol</span>
          <h1 className="text-2xl sm:text-5xl md:text-7xl mb-6 tracking-tighter uppercase font-black italic break-words">Consultation <br /> <span className="text-brand not-italic">Intake.</span></h1>
          <p className="text-zinc-500 font-serif italic text-lg">Initial assessment for performance design and biological readiness.</p>
        </header>

        <div className="bg-surface border border-edge p-6 md:p-12 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-edge">
             <motion.div 
              className="h-full bg-brand"
              initial={{ width: '0%' }}
              animate={{ 
                width: step === 'info' ? '25%' : step === 'health' ? '50%' : step === 'habits' ? '75%' : '100%' 
              }}
             />
          </div>

          <AnimatePresence mode="wait">
            {step === 'info' && (
              <motion.div 
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 text-brand mb-8">
                  <FileText size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Step 01 / Identity & Objectives</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full bg-black border border-edge p-4 outline-none focus:border-brand transition-colors font-mono text-sm" 
                      placeholder="e.g. JOHN DOE"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full bg-black border border-edge p-4 outline-none focus:border-brand transition-colors font-mono text-sm"
                      placeholder="CONTACT@DOMAIN.COM"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Primary Fitness Goal</label>
                  <textarea 
                    value={formData.goal}
                    onChange={(e) => updateField('goal', e.target.value)}
                    className="w-full bg-black border border-edge p-4 outline-none focus:border-brand transition-colors font-mono text-sm h-32"
                    placeholder="Describe what moving mountains looks like for you..."
                  />
                </div>

                <button 
                  onClick={() => nextStep('health')}
                  className="group flex items-center gap-3 bg-brand text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors"
                >
                  Proceed to Health Screening <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 'health' && (
              <motion.div 
                key="health"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 text-red-500 mb-8">
                   <HeartPulse size={20} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Step 02 / PAR-Q & Medical readiness</span>
                </div>

                <div className="space-y-6">
                  <p className="text-zinc-500 text-xs italic font-serif leading-relaxed bg-zinc-900/50 p-6 border-l-2 border-brand">
                    Physical Activity Readiness Questionnaire (PAR-Q): Your safety is paramount. If you answer YES to any of these, we may require a doctor's clearance.
                  </p>

                  {[
                    { id: 'parq1', q: 'Has your doctor ever said that you have a heart condition?' },
                    { id: 'parq2', q: 'Do you feel pain in your chest when you perform physical activity?' },
                    { id: 'parq3', q: 'Do you ever lose your balance or lose consciousness?' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-edge bg-black/40">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-300 max-w-md">{item.q}</span>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => updateField(item.id, true)}
                          className={`px-4 py-2 text-[8px] font-black uppercase border transition-all ${formData[item.id as keyof typeof formData] === true ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-edge text-zinc-600'}`}
                        >YES</button>
                        <button 
                          onClick={() => updateField(item.id, false)}
                          className={`px-4 py-2 text-[8px] font-black uppercase border transition-all ${formData[item.id as keyof typeof formData] === false ? 'border-brand text-brand bg-brand/10' : 'border-edge text-zinc-600'}`}
                        >NO</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Existing Medical Conditions / Injuries</label>
                  <input 
                    type="text" 
                    value={formData.medicalConditions}
                    onChange={(e) => updateField('medicalConditions', e.target.value)}
                    className="w-full bg-black border border-edge p-4 outline-none focus:border-brand transition-colors font-mono text-sm" 
                    placeholder="None or list details..."
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => prevStep('info')}
                    className="group flex items-center gap-3 border border-edge text-zinc-500 px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                  >
                   <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
                  </button>
                  <button 
                    onClick={() => nextStep('habits')}
                    className="group flex items-center gap-3 bg-brand text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors flex-1 justify-center"
                  >
                    Lifestyle Assessment <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'habits' && (
              <motion.div 
                key="habits"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 text-brand mb-8">
                  <Utensils size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Step 03 / Lifestyle & Bio-Habits</span>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Average Sleep (Hours)</label>
                    <input 
                      type="number" 
                      value={formData.sleepHours}
                      onChange={(e) => updateField('sleepHours', e.target.value)}
                      className="w-full bg-black border border-edge p-4 outline-none focus:border-brand transition-colors font-mono text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Dietary Preferences</label>
                    <select 
                      value={formData.dietType}
                      onChange={(e) => updateField('dietType', e.target.value)}
                      className="w-full bg-black border border-edge p-4 outline-none focus:border-brand transition-colors font-mono text-xs uppercase tracking-widest"
                    >
                      <option value="">Select...</option>
                      <option value="omnivore">Omnivore</option>
                      <option value="vegan">Vegan / Plant-based</option>
                      <option value="keto">Keto / Low Carb</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Current Exercise Frequency</label>
                  <div className="flex flex-wrap gap-2">
                    {['0-1', '2-3', '4-5', '6+'].map(val => (
                      <button 
                        key={val}
                        onClick={() => updateField('activityLevel', val)}
                        className={`px-6 py-3 text-[10px] font-black uppercase border transition-all ${formData.activityLevel === val ? 'border-brand text-brand bg-brand/5' : 'border-edge text-zinc-600'}`}
                      >
                        {val} Days / Week
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => prevStep('health')}
                    className="group flex items-center gap-3 border border-edge text-zinc-500 px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                  >
                   <ChevronLeft size={16} /> Back
                  </button>
                  <button 
                    onClick={() => nextStep('legal')}
                    className="group flex items-center gap-3 bg-brand text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors flex-1 justify-center"
                  >
                    Waiver & Finalize <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'legal' && (
              <motion.div 
                key="legal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 text-brand mb-8">
                  <ShieldAlert size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Step 04 / Legal Acknowledgement</span>
                </div>

                <div className="bg-zinc-900 border border-edge p-8 max-h-64 overflow-y-auto font-mono text-[10px] text-zinc-500 leading-relaxed space-y-4">
                  <h4 className="text-white font-black uppercase tracking-widest">Release of Liability / Waiver</h4>
                  <p>In consideration of being allowed to participate in training sessions with MIT2FIT LLC, I acknowledge that fitness involves risk of injury...</p>
                  <p>I represent that I am in good physical condition and have no medical impairment which might prevent my participation in said activity.</p>
                  <p>I agree to indemnify MIT2FIT LLC and its trainers against any loss or damage. This agreement is governed by the laws of the State of New Jersey.</p>
                </div>

                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => updateField('waiverAgreed', !formData.waiverAgreed)}>
                  <div className={`w-6 h-6 border flex items-center justify-center transition-all ${formData.waiverAgreed ? 'border-brand bg-brand text-black' : 'border-edge bg-black'}`}>
                    {formData.waiverAgreed && <CheckCircle2 size={16} />}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">I accept the terms of the fitness waiver and PAR-Q screening.</span>
                </div>

                <div className="flex gap-4">
                   <button 
                    onClick={() => prevStep('habits')}
                    className="group flex items-center gap-3 border border-edge text-zinc-500 px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                  >
                   <ChevronLeft size={16} /> Back
                  </button>
                  <button 
                    disabled={!formData.waiverAgreed}
                    onClick={handleSubmit}
                    className="group flex items-center gap-3 bg-brand text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors flex-1 justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Submit Intake to HQ <Send size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 space-y-8"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 bg-brand/10 border border-brand text-brand rounded-full mb-8">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Intake <br /><span className="text-brand not-italic">Received.</span></h2>
                <div className="max-w-md mx-auto space-y-4">
                  <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
                    Your readiness profile has been formatted and transmitted to <span className="text-white">contact@mit2fit.com</span>. 
                  </p>
                  <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
                    A copy is being queued for archival in our Hackensack, NJ secure operations cloud.
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="bg-brand text-black px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(240,255,0,0.1)]"
                  >
                    Return to Mission Control
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-surface/50 border border-edge p-8">
             <h4 className="text-xs font-black uppercase tracking-widest text-brand mb-4">Security Note</h4>
             <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest leading-relaxed">
               All health data is treated with clinical confidentiality. We do not store financial profiles on our web servers.
             </p>
          </div>
          <div className="bg-surface/50 border border-edge p-8">
             <h4 className="text-xs font-black uppercase tracking-widest text-brand mb-4">Next Steps</h4>
             <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest leading-relaxed">
               Once reviewed, you will receive a booking link for your 1-on-1 strategy call to finalize your performance cycle.
             </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
