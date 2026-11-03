import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Key, 
  TrendingUp, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Save, 
  RefreshCw, 
  BarChart3, 
  X, 
  ArrowLeft, 
  Dumbbell, 
  HardDrive, 
  Share2, 
  Plus, 
  Copy, 
  Check, 
  Mail, 
  MessageCircle, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Calendar,
  Layers,
  Scale
} from 'lucide-react';
import {
  BiometricProfile,
  BiometricSnapshot,
  loadStoredProfile,
  saveStoredProfile,
  loadStoredBiometricHistory,
  saveStoredBiometricHistory,
  loadStoredProtocolKey,
  saveStoredProtocolKey,
  generateProtocolKey,
  exportBiometricsCSV,
  formatBiometricsTextReport,
  PROFILE_STORAGE_KEY,
  HISTORY_STORAGE_KEY
} from '../utils/fitnessStorage';

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
  age: 28,
  height: 70,
  medicalHistory: 'None',
  lifestyle: 'active',
  heartRateRest: 60,
  heartRatePeak: 180,
  heartRateRecovery: 32,
  benchPressMax: 185,
  squatMax: 245,
  treadmillTime: 12,
  neuralIntensity: 3,
  regenDuration: 20,
  bodyWeight: 168,
  updatedAt: new Date().toISOString()
};

export default function Dashboard() {
  // Protocol Key is auto-loaded or generated; zero friction, no blocking gate!
  const [protocolKey, setProtocolKey] = useState<string>(loadStoredProtocolKey);
  const [benchmarks, setBenchmarks] = useState<BenchmarkData>(() => {
    const profile = loadStoredProfile();
    const savedData = localStorage.getItem('mit2fit_benchmarks');
    let base = DEFAULT_BENCHMARKS;
    if (savedData) {
      try {
        base = { ...DEFAULT_BENCHMARKS, ...JSON.parse(savedData) };
      } catch (e) {
        console.error("Failed to parse benchmarks", e);
      }
    }
    // Sync with persistent biometric profile if available
    if (profile) {
      base.age = profile.age || base.age;
      base.height = Math.round(profile.heightCm * 0.393701) || base.height;
      base.bodyWeight = Math.round(profile.weightKg * 2.20462) || base.bodyWeight;
      if (profile.activity >= 1.7) base.lifestyle = 'athlete';
      else if (profile.activity >= 1.4) base.lifestyle = 'active';
      else base.lifestyle = 'sedentary';
    }
    return base;
  });

  const [history, setHistory] = useState<BiometricSnapshot[]>(loadStoredBiometricHistory);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [isLoggingWorkout, setIsLoggingWorkout] = useState(false);
  const [protocolMode, setProtocolMode] = useState<'mechanical' | 'metabolic' | 'neural' | 'regenerative'>('mechanical');
  const [sessionPeakHR, setSessionPeakHR] = useState<number>(165);
  const [sessionRecovery, setSessionRecovery] = useState<number>(42);

  // Modals & Notifications
  const [isDataPortalOpen, setIsDataPortalOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [checkinNote, setCheckinNote] = useState('');
  const [alertNotice, setAlertNotice] = useState<string | null>(null);
  
  // Safe in-app confirmation modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    isDanger?: boolean;
    onConfirm: () => void;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-save benchmarks to localStorage whenever modified
  useEffect(() => {
    localStorage.setItem('mit2fit_benchmarks', JSON.stringify(benchmarks));
  }, [benchmarks]);

  // Keep protocol key stored
  useEffect(() => {
    saveStoredProtocolKey(protocolKey);
  }, [protocolKey]);

  // Sync back to biometrics profile
  const syncBenchmarksToProfile = (newBench: BenchmarkData) => {
    try {
      const currentProfile = loadStoredProfile();
      const updatedProfile: BiometricProfile = {
        ...currentProfile,
        age: newBench.age,
        heightCm: Math.round(newBench.height / 0.393701),
        weightKg: Math.round((newBench.bodyWeight / 2.20462) * 10) / 10,
        activity: newBench.lifestyle === 'athlete' ? 1.725 : newBench.lifestyle === 'active' ? 1.55 : 1.2,
        protocolKey: protocolKey,
        updatedAt: new Date().toISOString()
      };
      saveStoredProfile(updatedProfile);
    } catch (e) {
      console.error('Failed to sync benchmarks to profile', e);
    }
  };

  const handleRegenerateKey = () => {
    const newKey = generateProtocolKey();
    setProtocolKey(newKey);
    saveStoredProtocolKey(newKey);
    setAlertNotice(`Protocol Key updated to ${newKey}`);
    setTimeout(() => setAlertNotice(null), 3000);
  };

  const saveBenchmarks = () => {
    const data = { ...benchmarks, updatedAt: new Date().toISOString() };
    localStorage.setItem('mit2fit_benchmarks', JSON.stringify(data));
    setBenchmarks(data);
    syncBenchmarksToProfile(data);
    setShowSavedMsg(true);
    setAlertNotice('Protocol benchmarks synced to device buffer!');
    setTimeout(() => {
      setShowSavedMsg(false);
      setAlertNotice(null);
    }, 3000);
  };

  const calculateHREfficiency = () => {
    const maxHR = 220 - benchmarks.age;
    const intensityReached = (benchmarks.heartRatePeak / maxHR) * 100;
    const recoveryScore = (benchmarks.heartRateRecovery / 40) * 100;
    const finalScore = (recoveryScore * 0.7) + (intensityReached * 0.3);
    return Math.min(Math.round(finalScore), 100);
  };

  const calculateStrengthRatio = () => {
    if (!benchmarks.bodyWeight || benchmarks.bodyWeight <= 0) return '0.00';
    const rawRatio = (benchmarks.benchPressMax + benchmarks.squatMax) / benchmarks.bodyWeight;
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
    syncBenchmarksToProfile(updated);
    setIsLoggingWorkout(false);
    setShowSavedMsg(true);
    setAlertNotice('Session metrics committed to protocol log!');
    setTimeout(() => {
      setShowSavedMsg(false);
      setAlertNotice(null);
    }, 3000);
  };

  // Instant Check-in Snapshot from Dashboard
  const handleLogDashboardSnapshot = (noteText?: string) => {
    const currentProfile = loadStoredProfile();
    const heightCm = Math.round(benchmarks.height / 0.393701);
    const weightKg = Math.round((benchmarks.bodyWeight / 2.20462) * 10) / 10;
    const waistCm = currentProfile.waistCm || 82;
    const hipCm = currentProfile.hipCm || 98;
    const whr = hipCm > 0 ? Math.round((waistCm / hipCm) * 100) / 100 : 0.84;
    const heightM = heightCm / 100;
    const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
    const bfFactor = currentProfile.gender === 'male' ? 1 : 0;
    const bodyFat = Math.round(Math.max(3, (1.20 * bmi) + (0.23 * benchmarks.age) - (10.8 * bfFactor) - 5.4) * 10) / 10;
    const activityMult = benchmarks.lifestyle === 'athlete' ? 1.725 : benchmarks.lifestyle === 'active' ? 1.55 : 1.2;
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * benchmarks.age);
    bmr = currentProfile.gender === 'male' ? bmr + 5 : bmr - 161;
    const tdee = Math.round(bmr * activityMult);

    const newSnapshot: BiometricSnapshot = {
      id: `snap-${Date.now()}`,
      date: new Date().toISOString(),
      weightKg,
      heightCm,
      waistCm,
      hipCm,
      whr,
      bmi,
      bodyFat,
      tdee,
      targetCalories: tdee,
      goal: currentProfile.nutritionGoal || 'maintain',
      notes: noteText?.trim() || `Dashboard Check-in: ${benchmarks.bodyWeight} lbs | RHR: ${benchmarks.heartRateRest} BPM | Strength Ratio: ${calculateStrengthRatio()}x`
    };

    const updated = [newSnapshot, ...history];
    setHistory(updated);
    saveStoredBiometricHistory(updated);
    setIsCheckinModalOpen(false);
    setCheckinNote('');
    setAlertNotice('Biometric snapshot logged to progress timeline!');
    setTimeout(() => setAlertNotice(null), 3500);
  };

  // Delete snapshot
  const handleDeleteSnapshot = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    saveStoredBiometricHistory(updated);
    setAlertNotice('Snapshot deleted from history.');
    setTimeout(() => setAlertNotice(null), 3000);
  };

  // WhatsApp share
  const handleSendWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // Email share
  const handleSendEmail = (subject: string, body: string) => {
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  // Copy to clipboard
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setAlertNotice(`${label} copied to clipboard!`);
    setTimeout(() => setAlertNotice(null), 3000);
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const backupData = {
      protocolKey,
      benchmarks,
      history,
      exportedAt: new Date().toISOString(),
      app: 'MIT2FIT-DASHBOARD'
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mit2fit-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setAlertNotice('Backup JSON file exported.');
    setTimeout(() => setAlertNotice(null), 3000);
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        const parsed = JSON.parse(raw);
        if (parsed.protocolKey) {
          setProtocolKey(parsed.protocolKey);
          saveStoredProtocolKey(parsed.protocolKey);
        }
        if (parsed.benchmarks && typeof parsed.benchmarks.age === 'number') {
          setBenchmarks(parsed.benchmarks);
          localStorage.setItem('mit2fit_benchmarks', JSON.stringify(parsed.benchmarks));
        }
        if (Array.isArray(parsed.history)) {
          setHistory(parsed.history);
          saveStoredBiometricHistory(parsed.history);
        }
        setAlertNotice('Backup successfully restored to dashboard!');
        setTimeout(() => setAlertNotice(null), 3500);
      } catch (err) {
        setAlertNotice('Failed to import backup file. Invalid format.');
        setTimeout(() => setAlertNotice(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 text-white font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Floating Toast Notice */}
        <AnimatePresence>
          {alertNotice && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-stone-900 border border-brand/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-mono tracking-wider backdrop-blur-md"
            >
              <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
              <span>{alertNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden File Input for JSON Backup Import */}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleImportBackup}
          accept=".json"
          className="hidden"
        />

        {/* Header - Zero Friction Access & Auto Persistence */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 md:mb-16 gap-8">
          <div className="w-full">
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-brand/10 border border-brand/30 rounded-lg text-brand text-[10px] font-mono uppercase tracking-widest font-bold">
                <ShieldCheck size={13} />
                <span>PROTOCOL ACCESS : {protocolKey}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(protocolKey, 'Protocol Key')}
                className="text-[10px] font-mono text-zinc-500 hover:text-white flex items-center gap-1 transition"
                title="Copy Protocol Key"
              >
                <Copy size={11} /> Copy
              </button>
              <span className="text-zinc-700 hidden sm:inline">•</span>
              <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                Synced: {new Date(benchmarks.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter italic break-words">
              Biological <span className="text-brand not-italic">Output.</span>
            </h1>
            <p className="text-zinc-500 font-mono text-[10px] mt-2 uppercase tracking-widest">
              Biometric feedback & neuromuscular diagnostic matrix. Local buffer auto-saved.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
            {/* Quick Log Check-in Snapshot */}
            <button
              type="button"
              onClick={() => setIsCheckinModalOpen(true)}
              className="flex-grow lg:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-brand/10 hover:bg-brand/20 border border-brand/40 text-brand font-mono text-[10px] uppercase tracking-wider font-bold transition-all"
            >
              <Plus size={13} /> LOG CHECK-IN
            </button>

            {/* Save & Share Data Portal */}
            <button
              type="button"
              onClick={() => setIsDataPortalOpen(true)}
              className="flex-grow lg:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-zinc-900 border border-edge hover:border-brand/40 text-zinc-200 font-mono text-[10px] uppercase tracking-wider font-bold transition-all"
            >
              <HardDrive size={13} className="text-brand" /> SAVE & SHARE
            </button>

            <Link
              to="/tools"
              className="flex-grow lg:flex-none flex items-center justify-center gap-2 px-5 py-3.5 border border-edge text-zinc-300 font-mono text-[10px] uppercase tracking-widest hover:border-brand hover:text-brand transition-all bg-surface"
            >
              <Layers size={13} className="text-brand" /> TOOLS
            </Link>

            <Link
              to="/tracker"
              className="flex-grow lg:flex-none flex items-center justify-center gap-2 px-5 py-3.5 border border-edge text-zinc-300 font-mono text-[10px] uppercase tracking-widest hover:border-brand hover:text-brand transition-all bg-surface"
            >
              <Dumbbell size={13} className="text-brand" /> TRACKER
            </Link>

            <button 
              onClick={() => setIsLoggingWorkout(true)}
              className="flex-grow lg:flex-none flex items-center justify-center gap-2 px-6 py-3.5 border border-brand text-brand font-black uppercase text-[10px] tracking-widest hover:bg-brand/5 transition-all"
            >
              LOG SESSION <Zap size={14} />
            </button>

            <button 
              onClick={saveBenchmarks}
              className="flex-grow lg:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-brand text-black font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all"
            >
              {showSavedMsg ? 'SYNCED' : 'SAVE'} <Save size={14} />
            </button>
          </div>
        </div>

        {/* Global Stats Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-10 md:mb-12">
          {[
            { label: 'Metabolic Efficiency', value: `${calculateHREfficiency()}%`, icon: Zap },
            { label: 'Strength Ratio', value: `${calculateStrengthRatio()}x`, icon: Activity },
            { label: 'Cardiac Recovery', value: `${benchmarks.heartRateRecovery} BPM`, icon: Clock },
            { label: 'Metabolic BMI', value: calculateBMI(), icon: TrendingUp },
            { label: 'Timeline Check-ins', value: `${history.length} Logs`, icon: History },
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
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
          {/* Card 1: Bio Profile */}
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
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const updated = { ...benchmarks, age: val };
                        setBenchmarks(updated);
                        syncBenchmarksToProfile(updated);
                      }}
                      className="w-full bg-black border border-edge p-3 text-white font-mono focus:border-brand outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">Height (IN)</label>
                    <input 
                      type="number" 
                      value={benchmarks.height || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const updated = { ...benchmarks, height: val };
                        setBenchmarks(updated);
                        syncBenchmarksToProfile(updated);
                      }}
                      className="w-full bg-black border border-edge p-3 text-white font-mono focus:border-brand outline-none"
                    />
                  </div>
                </div>
                <div>
                   <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">Lifestyle Load</label>
                   <select 
                      value={benchmarks.lifestyle || 'active'}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        const updated = { ...benchmarks, lifestyle: val };
                        setBenchmarks(updated);
                        syncBenchmarksToProfile(updated);
                      }}
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
                      onChange={(e) => setBenchmarks({ ...benchmarks, medicalHistory: e.target.value })}
                      placeholder="e.g. Lower back sensitivity, ACL repair..."
                      className="w-full bg-black border border-edge p-3 text-[10px] text-zinc-400 font-mono focus:border-brand outline-none h-20 resize-none"
                    />
                </div>
             </div>
          </div>

          {/* Card 2: Neural/Cardiac */}
          <div className="bg-zinc-900/50 border border-edge p-6 md:p-8">
             <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-10 h-10 border border-brand/20 bg-brand/5 flex items-center justify-center">
                  <Activity size={20} className="text-brand" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight italic">Cardiac Protocol</h3>
             </div>
             <div className="space-y-4 md:space-y-6">
                <div>
                   <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">Resting Heart Rate (BPM)</label>
                   <input 
                      type="number" 
                      value={benchmarks.heartRateRest || 0}
                      onChange={(e) => setBenchmarks({ ...benchmarks, heartRateRest: Number(e.target.value) })}
                      className="w-full bg-black border border-edge p-3 text-brand font-mono focus:border-brand outline-none"
                    />
                </div>
                <div>
                   <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">Peak HR (During Test)</label>
                   <input 
                      type="number" 
                      value={benchmarks.heartRatePeak || 0}
                      onChange={(e) => setBenchmarks({ ...benchmarks, heartRatePeak: Number(e.target.value) })}
                      className="w-full bg-black border border-edge p-3 text-brand font-mono focus:border-brand outline-none"
                    />
                </div>
                <div>
                   <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block text-brand flex items-center gap-2">
                     <Clock size={10} /> 1-Min Recovery Delta (BPM)
                   </label>
                   <input 
                      type="number" 
                      value={benchmarks.heartRateRecovery || 0}
                      onChange={(e) => setBenchmarks({ ...benchmarks, heartRateRecovery: Number(e.target.value) })}
                      className="w-full bg-black border border-brand/30 p-3 text-brand font-mono focus:border-brand outline-none"
                    />
                </div>
             </div>
          </div>

          {/* Card 3: Mechanical Force Output */}
          <div className="bg-zinc-900/50 border border-edge p-6 md:p-8">
             <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-10 h-10 border border-brand/20 bg-brand/5 flex items-center justify-center">
                  <BarChart3 size={20} className="text-brand" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight italic">Force Output</h3>
             </div>
             <div className="space-y-4 md:space-y-6">
                <div>
                   <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">Bench Press (Estimated 1RM LBS)</label>
                   <input 
                      type="number" 
                      value={benchmarks.benchPressMax || 0}
                      onChange={(e) => setBenchmarks({ ...benchmarks, benchPressMax: Number(e.target.value) })}
                      className="w-full bg-black border border-edge p-3 text-brand font-mono focus:border-brand outline-none"
                    />
                </div>
                <div>
                   <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">Squat or Leg Press Equiv. (LBS)</label>
                   <input 
                      type="number" 
                      value={benchmarks.squatMax || 0}
                      onChange={(e) => setBenchmarks({ ...benchmarks, squatMax: Number(e.target.value) })}
                      className="w-full bg-black border border-edge p-3 text-brand font-mono focus:border-brand outline-none"
                    />
                </div>
                <div>
                   <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">Body Weight (LBS)</label>
                   <input 
                      type="number" 
                      value={benchmarks.bodyWeight || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const updated = { ...benchmarks, bodyWeight: val };
                        setBenchmarks(updated);
                        syncBenchmarksToProfile(updated);
                      }}
                      className="w-full bg-black border border-edge p-3 text-brand font-mono focus:border-brand outline-none"
                    />
                </div>
             </div>
          </div>

          {/* Card 4: Protocol Analytics */}
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
                    "Adaptive scoring: Age ({benchmarks.age}) and lifestyle ({benchmarks.lifestyle}) calibrated into your biological dashboard."
                  </p>
                </div>
             </div>
             
             {/* Background Pattern */}
             <div className="absolute right-0 bottom-0 opacity-[0.03] scale-150 rotate-12">
               <Zap size={200} />
             </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BIOMETRIC & VITALS PROGRESSION TIMELINE                                   */}
        {/* ========================================================================= */}
        <div className="bg-zinc-900 border border-edge p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge pb-4">
            <div>
              <div className="flex items-center gap-2 text-brand font-mono text-[10px] uppercase tracking-widest font-bold">
                <History size={14} /> Historical Progression Tracking
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight italic text-white mt-1">
                Biometric Timeline & Vitals History
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Saved snapshots from your check-ins over time. Never lose your historical measurements.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCheckinModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-brand text-black font-black text-xs uppercase tracking-wider hover:brightness-110 transition"
              >
                <Plus size={14} /> Log Check-in
              </button>
              <button
                type="button"
                onClick={() => exportBiometricsCSV(history, 'imperial')}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-black border border-edge text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider transition"
              >
                <FileSpreadsheet size={14} className="text-cyan-400" /> Export CSV
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs">
              No historical check-in snapshots recorded yet. Click "Log Check-in" above to add your first entry!
            </div>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 5).map((snap, i) => {
                const prev = history[i + 1];
                const weightDiff = prev ? Math.round((snap.weightKg - prev.weightKg) * 2.20462) : null;
                const dateStr = new Date(snap.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <div 
                    key={snap.id}
                    className="p-4 bg-black border border-edge flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-brand shrink-0" />
                      <div>
                        <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
                          <span>{dateStr}</span>
                          <span className="px-2 py-0.5 text-[9px] uppercase font-bold border border-brand/30 bg-brand/10 text-brand">
                            {snap.goal}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                          {snap.notes || 'Routine check-in logged'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-center font-mono text-xs">
                      <div className="bg-zinc-900/60 p-2 border border-edge">
                        <span className="text-[9px] text-zinc-500 block uppercase">Weight</span>
                        <span className="font-bold text-white">{Math.round(snap.weightKg * 2.20462)} lbs</span>
                        {weightDiff !== null && (
                          <span className={`text-[9px] block ${weightDiff <= 0 ? 'text-brand' : 'text-amber-400'}`}>
                            {weightDiff > 0 ? `+${weightDiff}` : weightDiff} lbs
                          </span>
                        )}
                      </div>
                      <div className="bg-zinc-900/60 p-2 border border-edge">
                        <span className="text-[9px] text-zinc-500 block uppercase">WHR</span>
                        <span className="font-bold text-brand">{snap.whr}</span>
                      </div>
                      <div className="bg-zinc-900/60 p-2 border border-edge">
                        <span className="text-[9px] text-zinc-500 block uppercase">Body Fat</span>
                        <span className="font-bold text-white">{snap.bodyFat}%</span>
                      </div>
                      <div className="bg-zinc-900/60 p-2 border border-edge">
                        <span className="text-[9px] text-zinc-500 block uppercase">Calories</span>
                        <span className="font-bold text-zinc-300">{snap.targetCalories}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteSnapshot(snap.id)}
                      className="p-2 text-zinc-600 hover:text-red-400 self-end md:self-center transition"
                      title="Remove snapshot"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}

              <div className="pt-2 text-center">
                <Link
                  to="/tools"
                  className="text-xs font-mono text-brand hover:underline inline-flex items-center gap-1.5 uppercase font-bold tracking-wider"
                >
                  View Full Biometric History & Diagnostics in Tools &rarr;
                </Link>
              </div>
            </div>
          )}
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
                             
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-widest block">Session Peak HR</label>
                                  <input 
                                    type="number"
                                    value={sessionPeakHR}
                                    onChange={(e) => setSessionPeakHR(Number(e.target.value))}
                                    className="w-full bg-black border border-edge p-3 font-mono text-brand focus:border-brand outline-none"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-widest block">1-Min Recovery Delta</label>
                                  <input 
                                    type="number"
                                    value={sessionRecovery}
                                    onChange={(e) => setSessionRecovery(Number(e.target.value))}
                                    className="w-full bg-black border border-edge p-3 font-mono text-brand focus:border-brand outline-none"
                                  />
                                </div>
                             </div>
                          </motion.div>
                        </AnimatePresence>

                        <button 
                          onClick={handleCommitSession}
                          className="w-full btn-primary py-5 font-black uppercase tracking-[0.2em] relative overflow-hidden group"
                        >
                          <span className="relative z-10">Commit to Protocol</span>
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                      </div>
                   </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Check-in Modal */}
        {isCheckinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
              <div className="flex items-start justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Log Biometric Check-in</h3>
                    <p className="text-xs text-stone-400">Record current measurements</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCheckinModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs font-mono space-y-1.5">
                <div>Weight: <strong className="text-white">{benchmarks.bodyWeight} lbs</strong></div>
                <div>Resting HR: <strong className="text-brand">{benchmarks.heartRateRest} BPM</strong></div>
                <div>Strength Ratio: <strong className="text-white">{calculateStrengthRatio()}x</strong></div>
                <div>Cardiac Recovery: <strong className="text-brand">{benchmarks.heartRateRecovery} BPM</strong></div>
              </div>

              <div>
                <label className="block text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Session / Check-in Notes
                </label>
                <textarea
                  value={checkinNote}
                  onChange={(e) => setCheckinNote(e.target.value)}
                  placeholder="e.g. Completed mechanical squat workout, resting HR down, feeling recovered..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-brand h-20 resize-none font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckinModalOpen(false)}
                  className="flex-1 py-3 bg-stone-800 text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleLogDashboardSnapshot(checkinNote)}
                  className="flex-1 py-3 bg-brand text-black rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 transition"
                >
                  Save Check-in
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data & Share Portal Modal (Matching Tracker & Tools) */}
        {isDataPortalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Dashboard Storage & Share Portal</h3>
                    <p className="text-xs text-stone-400">Zero-login, 100% private local storage</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDataPortalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Protocol Key Card */}
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider text-[11px]">
                    <Key className="w-4 h-4 text-brand" />
                    <span>Protocol Access Key</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRegenerateKey}
                    className="text-[10px] font-mono text-zinc-400 hover:text-white flex items-center gap-1"
                    title="Generate a new protocol key"
                  >
                    <RefreshCw size={11} /> Regenerate
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-black border border-stone-800 px-3 py-2 font-mono text-brand font-bold text-sm tracking-widest text-center rounded-xl">
                    {protocolKey}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(protocolKey, 'Protocol Key')}
                    className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <Copy size={13} /> Copy
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-800/80">
                  <span>Storage Key: <strong className="font-mono text-stone-400">mit2fit_benchmarks</strong></span>
                  <span>Logged Check-ins: <strong className="font-mono text-brand">{history.length}</strong></span>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Send & Share Options:
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      const profile = loadStoredProfile();
                      const text = formatBiometricsTextReport(profile, history[0], 'imperial');
                      handleSendWhatsApp(text);
                      setIsDataPortalOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 p-3 bg-stone-950 hover:bg-emerald-950/40 border border-stone-800 hover:border-emerald-500/40 rounded-xl transition text-stone-200"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Send via WhatsApp</span>
                  </button>

                  <button
                    onClick={() => {
                      const profile = loadStoredProfile();
                      const text = formatBiometricsTextReport(profile, history[0], 'imperial');
                      handleSendEmail(`MIT2FIT Biological Output Summary`, text);
                      setIsDataPortalOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 p-3 bg-stone-950 hover:bg-amber-950/40 border border-stone-800 hover:border-amber-500/40 rounded-xl transition text-stone-200"
                  >
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Email to Coach / Self</span>
                  </button>

                  <button
                    onClick={() => {
                      const profile = loadStoredProfile();
                      const text = formatBiometricsTextReport(profile, history[0], 'imperial');
                      handleCopyText(text, 'Dashboard summary');
                      setIsDataPortalOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 p-3 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl transition text-stone-200"
                  >
                    <Copy className="w-4 h-4 text-zinc-300" />
                    <span>Copy Summary</span>
                  </button>

                  <button
                    onClick={() => {
                      exportBiometricsCSV(history, 'imperial');
                      setIsDataPortalOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 p-3 bg-stone-950 hover:bg-cyan-950/40 border border-stone-800 hover:border-cyan-500/40 rounded-xl transition text-stone-200"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => {
                      handleExportBackup();
                      setIsDataPortalOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 p-3 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl transition text-stone-200 col-span-2"
                  >
                    <Download className="w-4 h-4 text-brand" />
                    <span>Backup Dashboard (JSON)</span>
                  </button>
                </div>
              </div>

              {/* Restore & Danger Zone */}
              <div className="pt-3 border-t border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-500">Need to transfer dashboard data?</span>
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setIsDataPortalOpen(false);
                    }}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Import Backup File
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
