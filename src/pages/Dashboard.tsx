import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Key, TrendingUp, Zap, Clock, ShieldCheck, Save, RefreshCw, BarChart3, X, ArrowLeft } from 'lucide-react';

interface BenchmarkData {
  age: number;
  height: number; // inches
  medicalHistory: string;
  lifestyle: 'sedentary' | 'active' | 'athlete';
  heartRateRest: number;
  heartRatePeak: number;
  heartRateRecovery: number; // 1 min post exercise
  benchPressMax: number;
  squatMax: number; 
  treadmillTime: number; 
  neuralIntensity: number; // T1-T5
  regenDuration: number;
  bodyWeight: number;
  updatedAt: string;
}

const DEFAULT_BENCHMARKS: BenchmarkData = {
  age: 30,
  height: 70,
  medicalHistory: 'None',
  lifestyle: 'active',
  heartRateRest: 60,
  heartRatePeak: 180,
  heartRateRecovery: 30,
  benchPressMax: 135,
  squatMax: 185,
  treadmillTime: 12,
  neuralIntensity: 3,
  regenDuration: 20,
  bodyWeight: 180,
  updatedAt: new Date().toISOString()
};

export default function Dashboard() {
  const [protocolKey, setProtocolKey] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [benchmarks, setBenchmarks] = useState<BenchmarkData>(DEFAULT_BENCHMARKS);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [isLoggingWorkout, setIsLoggingWorkout] = useState(false);
  const [protocolMode, setProtocolMode] = useState<'mechanical' | 'metabolic' | 'neural' | 'regenerative'>('mechanical');
  const [sessionPeakHR, setSessionPeakHR] = useState<number>(165);
  const [sessionRecovery, setSessionRecovery] = useState<number>(42);

  useEffect(() => {
    const savedKey = localStorage.getItem('mit2fit_protocol_key');
    const savedData = localStorage.getItem('mit2fit_benchmarks');
    
    if (savedKey) {
      setProtocolKey(savedKey);
      setIsAuthenticated(true);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setBenchmarks({ ...DEFAULT_BENCHMARKS, ...parsed });
        } catch (e) {
          console.error("Failed to parse benchmarks", e);
          setBenchmarks(DEFAULT_BENCHMARKS);
        }
      }
    }
  }, []);

  const generateKey = () => {
    const newKey = `MIT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    setProtocolKey(newKey);
  };

  const handleInitialize = () => {
    if (protocolKey.length < 4) return;
    localStorage.setItem('mit2fit_protocol_key', protocolKey);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('mit2fit_protocol_key');
    setIsAuthenticated(false);
    setProtocolKey('');
  };

  const saveBenchmarks = () => {
    const data = { ...benchmarks, updatedAt: new Date().toISOString() };
    localStorage.setItem('mit2fit_benchmarks', JSON.stringify(data));
    setBenchmarks(data);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  const calculateHREfficiency = () => {
    // Factor in Age for theoretical Max HR
    const maxHR = 220 - benchmarks.age;
    const intensityReached = (benchmarks.heartRatePeak / maxHR) * 100;
    
    // Recovery relative to intensity. Higher recovery is better.
    // Base recovery target: 30+ BPM for fit individuals.
    const recoveryScore = (benchmarks.heartRateRecovery / 40) * 100;
    
    // Weighted score: 70% recovery speed, 30% intensity capability
    const finalScore = (recoveryScore * 0.7) + (intensityReached * 0.3);
    return Math.min(Math.round(finalScore), 100);
  };

  const calculateStrengthRatio = () => {
    const rawRatio = (benchmarks.benchPressMax + benchmarks.squatMax) / benchmarks.bodyWeight;
    // Age adjustment: 1% bonus per year over 30
    const ageFactor = benchmarks.age > 30 ? 1 + ((benchmarks.age - 30) * 0.01) : 1;
    return (rawRatio * ageFactor).toFixed(2);
  };

  const calculateBMI = () => {
    if (!benchmarks.height || !benchmarks.bodyWeight) return '0.0';
    const bmi = (benchmarks.bodyWeight / (benchmarks.height * benchmarks.height)) * 703;
    return bmi.toFixed(1);
  };

  const handleCommitSession = () => {
    const updated = {
      ...benchmarks,
      heartRatePeak: sessionPeakHR,
      heartRateRecovery: sessionRecovery,
      updatedAt: new Date().toISOString()
    };
    setBenchmarks(updated);
    localStorage.setItem('mit2fit_benchmarks', JSON.stringify(updated));
    setIsLoggingWorkout(false);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black pt-32 px-6 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-zinc-900 border border-edge p-10 text-center"
        >
          <div className="w-16 h-16 border border-brand bg-brand/5 flex items-center justify-center mx-auto mb-8">
            <Key className="text-brand" size={32} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">Protocol <span className="text-brand not-italic">Identity</span></h2>
          <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest leading-loose mb-8">
            Enter your Protocol Key to access your biological dashboard. Personal data stays in your local buffer.
          </p>
          <div className="space-y-4">
            <input 
              type="text"
              value={protocolKey}
              onChange={(e) => setProtocolKey(e.target.value.toUpperCase())}
              placeholder="UNIQUE-KEY-000"
              className="w-full bg-black border border-edge p-4 focus:border-brand outline-none text-center font-mono text-brand uppercase tracking-widest"
            />
            <div className="flex gap-2">
              <button 
                onClick={handleInitialize}
                className="flex-grow btn-primary py-4 font-black uppercase tracking-[0.2em]"
              >
                Access Dashboard
              </button>
              <button 
                onClick={generateKey}
                title="Generate New Key"
                className="px-6 border border-edge bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <RefreshCw size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">
                Don't have a key? Click the refresh icon to generate your unique link.
              </p>
              <Link to="/" className="text-zinc-600 hover:text-white font-mono text-[9px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                <ArrowLeft size={10} /> Back to Performance Landing
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 md:mb-16 gap-8">
          <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={14} className="text-brand" />
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">SECURE ACCESS : {protocolKey}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter italic break-words">Biological <span className="text-brand not-italic">Output.</span></h1>
            <p className="text-zinc-500 font-mono text-[10px] mt-4 uppercase tracking-widest">Last Synced: {new Date(benchmarks.updatedAt).toLocaleString()}</p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <button 
              onClick={handleLogout}
              className="flex-grow lg:flex-none px-6 py-4 border border-edge text-zinc-600 font-mono text-[9px] uppercase tracking-widest hover:text-white transition-all bg-black/50"
            >
              Exit Protocol [ESC]
            </button>
            <button 
              onClick={() => setIsLoggingWorkout(true)}
              className="flex-grow lg:flex-none flex items-center justify-center gap-3 px-8 py-4 border border-brand text-brand font-black uppercase text-[10px] tracking-widest hover:bg-brand/5 transition-all"
            >
              LOG SESSION <Zap size={14} />
            </button>
            <button 
              onClick={saveBenchmarks}
              className="flex-grow lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-brand text-black font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all"
            >
              {showSavedMsg ? 'SYNCED' : 'SAVE'} <Save size={14} />
            </button>
          </div>
        </div>

        {/* Workout Log Modal Overlay */}
        <AnimatePresence>
          {isLoggingWorkout && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
             >
                <div className="max-w-2xl w-full bg-zinc-900 border border-edge p-6 sm:p-10 relative overflow-y-auto max-h-[90vh]">
                   <button 
                    onClick={() => setIsLoggingWorkout(false)}
                    className="absolute top-4 right-4 md:top-6 md:right-6 text-zinc-600 hover:text-white transition-colors bg-black/40 p-2 md:p-0 rounded-full md:rounded-none z-20"
                   >
                     <X size={20} />
                   </button>

                   <div className="mb-8">
                      <span className="text-brand text-[9px] font-mono uppercase tracking-[0.3em]">Recording Session</span>
                      <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter italic">Protocol <span className="text-brand not-italic">Log.</span></h2>
                   </div>

                   <div className="grid lg:grid-cols-12 gap-8 mb-10">
                      {/* Left: Mode Selection & Instructions */}
                      <div className="lg:col-span-5 space-y-6">
                        <div className="space-y-3">
                           <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-widest pl-1">Target Protocol</label>
                           <div className="grid grid-cols-1 gap-2">
                              {[
                                { id: 'mechanical', label: 'Mechanical Load', sub: 'Force Production' },
                                { id: 'metabolic', label: 'Metabolic', sub: 'Endurance/High-Intensity' },
                                { id: 'neural', label: 'Neural Oscillation', sub: 'Stability/Stimulation' },
                                { id: 'regenerative', label: 'Regenerative', sub: 'Flow/Recovery' }
                              ].map((mode) => (
                                <button 
                                  key={mode.id}
                                  onClick={() => setProtocolMode(mode.id as any)}
                                  className={`p-4 border text-left transition-all ${protocolMode === mode.id ? 'border-brand bg-brand/5' : 'border-edge opacity-40 hover:opacity-100'}`}
                                >
                                  <div className={`text-[10px] font-black uppercase tracking-tight italic ${protocolMode === mode.id ? 'text-brand' : 'text-white'}`}>{mode.label}</div>
                                  <div className="text-[8px] font-mono uppercase text-zinc-500 tracking-widest leading-none mt-1">{mode.sub}</div>
                                </button>
                              ))}
                           </div>
                        </div>

                        <div className="p-5 bg-black border border-edge">
                           <div className="text-[9px] font-mono uppercase text-brand tracking-[0.2em] mb-3">Protocol Guide:</div>
                           <p className="text-[10px] font-mono uppercase text-zinc-500 leading-relaxed tracking-wider">
                             {protocolMode === 'mechanical' && "* Execute 3-5 reps at RPE 9. Log estimated 1-rep max (1RM) based on volume."}
                             {protocolMode === 'metabolic' && "* Maintain Zone 4+ for 80% of session. Peak HR is mandatory for efficiency scaling."}
                             {protocolMode === 'neural' && "* Focus on micro-stability adjustments. Duration is proxy for neural endurance."}
                             {protocolMode === 'regenerative' && "* Target Parasympathetic dominance. Lowering RHR post-session is the success metric."}
                           </p>
                        </div>
                      </div>

                      {/* Right: Data Entry */}
                      <div className="lg:col-span-7 space-y-8">
                        <AnimatePresence mode="wait">
                          <motion.div 
                            key={protocolMode}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-zinc-950 p-6 border border-edge"
                          >
                             <div className="text-[10px] font-black uppercase tracking-widest mb-6 italic border-b border-edge pb-2">Session Parameters</div>
                             
                             {protocolMode === 'mechanical' && (
                               <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-[8px] font-mono uppercase text-zinc-600">Bench Max (LBS)</label>
                                    <input 
                                      type="number" 
                                      value={benchmarks.benchPressMax || 0}
                                      onChange={(e) => setBenchmarks({...benchmarks, benchPressMax: Number(e.target.value)})}
                                      className="w-full bg-black border border-edge p-3 text-brand font-mono focus:border-brand outline-none" 
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[8px] font-mono uppercase text-zinc-600">Squat Equiv.</label>
                                    <input 
                                      type="number" 
                                      value={benchmarks.squatMax || 0}
                                      onChange={(e) => setBenchmarks({...benchmarks, squatMax: Number(e.target.value)})}
                                      className="w-full bg-black border border-edge p-3 text-brand font-mono focus:border-brand outline-none" 
                                    />
                                  </div>
                               </div>
                             )}

                             {protocolMode === 'metabolic' && (
                               <div className="space-y-4">
                                  <div className="space-y-2">
                                    <label className="text-[8px] font-mono uppercase text-zinc-600">1.5 Mile Timed Effort</label>
                                    <input 
                                      type="number" 
                                      value={benchmarks.treadmillTime || 0}
                                      onChange={(e) => setBenchmarks({...benchmarks, treadmillTime: Number(e.target.value)})}
                                      className="w-full bg-black border border-edge p-3 text-brand font-mono focus:border-brand outline-none" 
                                    />
                                  </div>
                                  <div className="p-3 bg-brand/5 border border-brand/20 text-[9px] font-mono uppercase text-brand tracking-widest text-center">
                                    * Cardiorespiratory ceiling data captured
                                  </div>
                               </div>
                             )}

                             {protocolMode === 'neural' && (
                               <div className="space-y-4">
                                  <label className="text-[8px] font-mono uppercase text-zinc-600">Neural Drive Intensity (T1 - T5)</label>
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(t => (
                                      <button 
                                        key={t}
                                        onClick={() => setBenchmarks({...benchmarks, neuralIntensity: t})}
                                        className={`h-10 flex-grow border transition-all text-xs font-mono bg-black ${benchmarks.neuralIntensity === t ? 'border-brand text-brand shadow-[0_0_10px_rgba(234,255,0,0.15)] scale-105 z-10' : 'border-edge text-zinc-600'}`}
                                      >
                                        T{t}
                                      </button>
                                    ))}
                                  </div>
                               </div>
                             )}

                             {protocolMode === 'regenerative' && (
                               <div className="space-y-4">
                                  <div className="space-y-2">
                                    <label className="text-[8px] font-mono uppercase text-zinc-600">System Reset Duration (MIN)</label>
                                    <input 
                                      type="number"
                                      value={benchmarks.regenDuration || 0}
                                      onChange={(e) => setBenchmarks({...benchmarks, regenDuration: Number(e.target.value)})}
                                      className="w-full bg-black border border-edge p-3 text-brand font-mono focus:border-brand outline-none" 
                                    />
                                  </div>
                               </div>
                             )}
                          </motion.div>
                        </AnimatePresence>

                        <div className="bg-black border border-edge p-6">
                           <div className="text-[10px] font-black uppercase tracking-widest mb-6 italic border-b border-edge pb-2">Cardiac Output (Required)</div>
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Peak HR</label>
                                 <input 
                                   type="number" 
                                   value={sessionPeakHR}
                                   onChange={(e) => setSessionPeakHR(Number(e.target.value))}
                                   className="w-full bg-zinc-900 border border-edge p-3 text-xl text-brand font-mono outline-none focus:border-brand text-center" 
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">1-Min Recovery</label>
                                 <input 
                                   type="number" 
                                   value={sessionRecovery}
                                   onChange={(e) => setSessionRecovery(Number(e.target.value))}
                                   className="w-full bg-zinc-900 border border-brand/50 p-3 text-xl text-brand font-mono outline-none focus:border-brand text-center" 
                                 />
                              </div>
                           </div>
                           <div className="mt-4 text-[8px] font-mono text-zinc-600 uppercase text-center tracking-widest">
                             Cardiac delta determines overall efficiency tier
                           </div>
                        </div>
                      </div>
                   </div>

                   <button 
                    onClick={handleCommitSession}
                    className="w-full btn-primary py-5 font-black uppercase tracking-[0.2em] relative overflow-hidden group"
                   >
                     <span className="relative z-10">Commit to Protocol</span>
                     <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                   </button>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-10 md:mb-12">
          {[
            { label: 'Metabolic Efficiency', value: `${calculateHREfficiency()}%`, icon: Zap },
            { label: 'Strength Ratio', value: `${calculateStrengthRatio()}x`, icon: Activity },
            { label: 'Cardiac Recovery', value: `${benchmarks.heartRateRecovery} BPM`, icon: Clock },
            { label: 'BMI Index', value: calculateBMI(), icon: TrendingUp },
            { label: 'Performance Tier', value: 'OPTIMAL', icon: TrendingUp },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900 border border-edge p-4 md:p-6">
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <stat.icon size={16} className="text-brand" />
                <div className="w-8 h-[1px] bg-edge"></div>
              </div>
              <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-2xl font-black italic">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Input Matrix */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {/* Card: Bio Profile */}
          <div className="bg-zinc-900 border border-edge p-6 md:p-8">
             <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-10 h-10 border border-white/20 bg-white/5 flex items-center justify-center">
                  <Key size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight italic">Bio Profile</h3>
             </div>
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">Age</label>
                    <input 
                        type="number" 
                        value={benchmarks.age || 0}
                        onChange={(e) => setBenchmarks({...benchmarks, age: Number(e.target.value)})}
                        className="w-full bg-black border border-edge p-3 text-white font-mono focus:border-brand outline-none"
                      />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">Height (IN)</label>
                    <input 
                        type="number" 
                        value={benchmarks.height || 0}
                        onChange={(e) => setBenchmarks({...benchmarks, height: Number(e.target.value)})}
                        className="w-full bg-black border border-edge p-3 text-white font-mono focus:border-brand outline-none"
                      />
                  </div>
                </div>
                <div>
                   <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">Lifestyle Load</label>
                   <select 
                      value={benchmarks.lifestyle || 'active'}
                      onChange={(e) => setBenchmarks({...benchmarks, lifestyle: e.target.value as any})}
                      className="w-full bg-black border border-edge p-3 text-white font-mono focus:border-brand outline-none appearance-none"
                    >
                      <option value="sedentary">Sedentary (Low Motion)</option>
                      <option value="active">Active (Structural Training)</option>
                      <option value="athlete">Athlete (Elite Protocol)</option>
                    </select>
                </div>
                <div>
                   <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block text-white">Medical Context / Injuries</label>
                   <textarea 
                      value={benchmarks.medicalHistory || ''}
                      onChange={(e) => setBenchmarks({...benchmarks, medicalHistory: e.target.value})}
                      placeholder="e.g. Lower back sensitivity, ACL repair..."
                      className="w-full bg-black border border-edge p-3 text-[10px] text-zinc-400 font-mono focus:border-brand outline-none h-20 resize-none"
                    />
                </div>
             </div>
          </div>

          {/* Card: Neural/Cardiac */}
          <div className="bg-zinc-900/50 border border-edge p-6 md:p-8">
             <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-10 h-10 border border-brand/20 bg-brand/5 flex items-center justify-center">
                  <Activity size={20} className="text-brand" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight italic">Cardiac Protocol</h3>
             </div>
             <div className="space-y-4 md:space-y-6">
                <div>
                   <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">Resting Heart Rate</label>
                   <input 
                      type="number" 
                      value={benchmarks.heartRateRest || 0}
                      onChange={(e) => setBenchmarks({...benchmarks, heartRateRest: Number(e.target.value)})}
                      className="w-full bg-black border border-edge p-3 text-brand font-mono focus:border-brand outline-none"
                    />
                </div>
                <div>
                   <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">Peak HR (During Test)</label>
                   <input 
                      type="number" 
                      value={benchmarks.heartRatePeak || 0}
                      onChange={(e) => setBenchmarks({...benchmarks, heartRatePeak: Number(e.target.value)})}
                      className="w-full bg-black border border-edge p-3 text-brand font-mono focus:border-brand outline-none"
                    />
                </div>
                <div>
                   <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block text-brand flex items-center gap-2">
                     <Clock size={10} /> 1-Min Recovery Delta
                   </label>
                   <input 
                      type="number" 
                      value={benchmarks.heartRateRecovery || 0}
                      onChange={(e) => setBenchmarks({...benchmarks, heartRateRecovery: Number(e.target.value)})}
                      className="w-full bg-black border border-brand/30 p-3 text-brand font-mono focus:border-brand outline-none"
                    />
                </div>
             </div>
          </div>

          {/* Card: Mechanical Force */}
          <div className="bg-zinc-900/50 border border-edge p-6 md:p-8">
             <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-10 h-10 border border-brand/20 bg-brand/5 flex items-center justify-center">
                  <BarChart3 size={20} className="text-brand" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight italic">Force Output</h3>
             </div>
             <div className="space-y-4 md:space-y-6">
                <div>
                   <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">Bench Press (Estimated 1RM)</label>
                   <input 
                      type="number" 
                      value={benchmarks.benchPressMax || 0}
                      onChange={(e) => setBenchmarks({...benchmarks, benchPressMax: Number(e.target.value)})}
                      className="w-full bg-black border border-edge p-3 text-brand font-mono focus:border-brand outline-none"
                    />
                </div>
                <div>
                   <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">Squat or Leg Press Equiv.</label>
                   <input 
                      type="number" 
                      value={benchmarks.squatMax || 0}
                      onChange={(e) => setBenchmarks({...benchmarks, squatMax: Number(e.target.value)})}
                      className="w-full bg-black border border-edge p-3 text-brand font-mono focus:border-brand outline-none"
                    />
                </div>
                <div>
                   <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">Body Weight (LBS)</label>
                   <input 
                      type="number" 
                      value={benchmarks.bodyWeight || 0}
                      onChange={(e) => setBenchmarks({...benchmarks, bodyWeight: Number(e.target.value)})}
                      className="w-full bg-black border border-edge p-3 text-brand font-mono focus:border-brand outline-none"
                    />
                </div>
             </div>
          </div>

          {/* Card: Bio-Data Intelligence */}
          <div className="border border-brand/10 bg-brand/5 p-6 md:p-8 relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <div className="w-10 h-10 border border-brand/40 bg-zinc-900 flex items-center justify-center">
                      <RefreshCw size={20} className="text-brand" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight italic">Protocol Analytics</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-brand/10">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Strength-Weight Ratio</span>
                    <span className="text-lg font-black italic">{calculateStrengthRatio()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-brand/10">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Cardiac Efficiency</span>
                    <span className="text-lg font-black italic">{calculateHREfficiency()}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-brand/10">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Metabolic BMI</span>
                    <span className="text-lg font-black italic">{calculateBMI()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-brand/10">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Recovery Tempo</span>
                    <span className="text-sm font-black uppercase text-brand">Superior</span>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-[9px] font-mono uppercase text-zinc-500 leading-loose italic">
                    "Adaptive scoring: Your age ({benchmarks.age}) and lifestyle ({benchmarks.lifestyle}) are now calibrated into the neural feedback loop."
                  </p>
                </div>
             </div>
             
             {/* Background Pattern */}
             <div className="absolute right-0 bottom-0 opacity-[0.03] scale-150 rotate-12">
               <Zap size={200} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
