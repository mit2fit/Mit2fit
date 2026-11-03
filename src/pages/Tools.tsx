import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Droplets, 
  Flame, 
  User, 
  Info, 
  ArrowRight, 
  PieChart, 
  Dumbbell, 
  Activity, 
  Heart, 
  Scale, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  ChevronRight,
  HardDrive,
  Share2,
  Download,
  Upload,
  History,
  Calendar,
  TrendingUp,
  TrendingDown,
  Copy,
  Check,
  Mail,
  MessageCircle,
  FileSpreadsheet,
  Trash2,
  Save,
  RefreshCw,
  X,
  Clock,
  Plus,
  ShieldCheck,
  Key,
  Shield,
  Zap
} from 'lucide-react';
import { 
  BiometricProfile, 
  BiometricSnapshot, 
  BodyFatMethod,
  loadStoredProfile, 
  saveStoredProfile, 
  loadStoredBiometricHistory, 
  saveStoredBiometricHistory, 
  loadStoredProtocolKey, 
  saveStoredProtocolKey,
  generateProtocolKey,
  calculateNavyBodyFat,
  calculateDeurenbergBodyFat,
  calculateBodyComposition,
  evaluateRecompositionDelta,
  exportBiometricsCSV, 
  formatBiometricsTextReport,
  PROFILE_STORAGE_KEY,
  HISTORY_STORAGE_KEY
} from '../utils/fitnessStorage';

type ToolType = 'DASHBOARD' | 'HISTORY' | 'WHR' | 'BMI' | 'BODYFAT' | 'CALORIES' | 'MACROS' | 'WATER';

export default function Tools() {
  const [activeTool, setActiveTool] = useState<ToolType>('DASHBOARD');
  
  // Load persistent profile state or URL parameters
  const [profile, setProfile] = useState<BiometricProfile>(() => {
    const stored = loadStoredProfile();
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('w')) {
        const w = parseFloat(params.get('w') || '');
        if (!isNaN(w) && w >= 30 && w <= 250) stored.weightKg = w;
      }
      if (params.has('h')) {
        const h = parseFloat(params.get('h') || '');
        if (!isNaN(h) && h >= 100 && h <= 250) stored.heightCm = h;
      }
      if (params.has('a')) {
        const a = parseInt(params.get('a') || '');
        if (!isNaN(a) && a >= 10 && a <= 100) stored.age = a;
      }
      if (params.has('g')) {
        const g = params.get('g');
        if (g === 'male' || g === 'female') stored.gender = g;
      }
      if (params.has('waist')) {
        const waist = parseFloat(params.get('waist') || '');
        if (!isNaN(waist) && waist >= 40 && waist <= 200) stored.waistCm = waist;
      }
      if (params.has('hip')) {
        const hip = parseFloat(params.get('hip') || '');
        if (!isNaN(hip) && hip >= 50 && hip <= 250) stored.hipCm = hip;
      }
      if (params.has('neck')) {
        const neck = parseFloat(params.get('neck') || '');
        if (!isNaN(neck) && neck >= 20 && neck <= 70) stored.neckCm = neck;
      }
      if (params.has('key')) {
        const k = params.get('key');
        if (k && k.length >= 4) stored.protocolKey = k.toUpperCase();
      }
      if (params.has('method')) {
        const m = params.get('method');
        if (m === 'navy' || m === 'deurenberg') stored.bodyFatMethod = m;
      }
    } catch (e) {
      console.error('URL param parsing error', e);
    }
    return stored;
  });

  // History timeline state from localStorage
  const [history, setHistory] = useState<BiometricSnapshot[]>(loadStoredBiometricHistory);

  // Portal & Modal States
  const [isDataPortalOpen, setIsDataPortalOpen] = useState(false);
  const [alertNotice, setAlertNotice] = useState<string | null>(null);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [checkinNote, setCheckinNote] = useState('');
  
  // In-app confirmation modal (eliminates window.confirm)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    isDanger?: boolean;
    onConfirm: () => void;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-persist profile state to localStorage whenever modified
  useEffect(() => {
    saveStoredProfile(profile);

    // Synchronize to mit2fit_benchmarks for Dashboard interoperability
    try {
      const existingBenchRaw = localStorage.getItem('mit2fit_benchmarks');
      const existingBench = existingBenchRaw ? JSON.parse(existingBenchRaw) : {};
      const heightInches = Math.round(profile.heightCm * 0.393701);
      const weightLbs = Math.round(profile.weightKg * 2.20462);
      const lifestyle = profile.activity >= 1.7 ? 'athlete' : profile.activity >= 1.4 ? 'active' : 'sedentary';
      localStorage.setItem('mit2fit_benchmarks', JSON.stringify({
        ...existingBench,
        age: profile.age,
        height: heightInches,
        bodyWeight: weightLbs,
        lifestyle,
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {
      console.error('Failed to sync benchmarks', e);
    }
  }, [profile]);

  // Auto-persist history state to localStorage
  useEffect(() => {
    saveStoredBiometricHistory(history);
  }, [history]);

  // Conversion Helpers
  const kgToLbs = (kg: number) => Math.round(kg * 2.20462);
  const lbsToKg = (lbs: number) => Math.round((lbs / 2.20462) * 10) / 10;
  const cmToIn = (cm: number) => (cm * 0.393701).toFixed(1);
  const inToCm = (inches: number) => Math.round((inches / 0.393701) * 10) / 10;

  // 1. BMI Calculation
  const calculateBMIValue = () => {
    const heightInMeters = profile.heightCm / 100;
    return profile.weightKg / (heightInMeters * heightInMeters);
  };

  const calculateBMI = () => {
    return calculateBMIValue().toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-sky-400', badgeBg: 'bg-sky-400/10 border-sky-400/30' };
    if (bmi < 25) return { label: 'Optimal', color: 'text-brand', badgeBg: 'bg-brand/10 border-brand/30' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-amber-400', badgeBg: 'bg-amber-400/10 border-amber-400/30' };
    return { label: 'Obese', color: 'text-rose-500', badgeBg: 'bg-rose-500/10 border-rose-500/30' };
  };

  // 2. Refined Body Fat % Calculation (Navy Anthropometric vs Deurenberg)
  const calculateBodyFatValue = (method: BodyFatMethod = profile.bodyFatMethod) => {
    if (method === 'navy') {
      return calculateNavyBodyFat(
        profile.gender, 
        profile.heightCm, 
        profile.waistCm, 
        profile.hipCm, 
        profile.neckCm || (profile.gender === 'female' ? 34 : 38)
      );
    }
    return calculateDeurenbergBodyFat(profile.gender, profile.age, calculateBMIValue());
  };

  const calculateBodyFat = (method?: BodyFatMethod) => {
    return calculateBodyFatValue(method).toFixed(1);
  };

  // Tissue Partitioning (Lean Muscle Mass vs Fat Mass)
  const getBodyComposition = (method: BodyFatMethod = profile.bodyFatMethod) => {
    const bf = calculateBodyFatValue(method);
    return calculateBodyComposition(profile.weightKg, bf);
  };

  const bodyComposition = getBodyComposition();

  const getBodyFatCategory = (bf: number) => {
    if (profile.gender === 'male') {
      if (bf < 6) return { label: 'Essential Fat', color: 'text-sky-400', badgeBg: 'bg-sky-400/10 border-sky-400/30' };
      if (bf < 14) return { label: 'Athletic (Muscular)', color: 'text-brand', badgeBg: 'bg-brand/10 border-brand/30' };
      if (bf < 18) return { label: 'Fitness Leanness', color: 'text-brand opacity-90', badgeBg: 'bg-brand/10 border-brand/30' };
      if (bf < 25) return { label: 'Moderate', color: 'text-amber-400', badgeBg: 'bg-amber-400/10 border-amber-400/30' };
      return { label: 'Elevated Adiposity', color: 'text-rose-500', badgeBg: 'bg-rose-500/10 border-rose-500/30' };
    } else {
      if (bf < 14) return { label: 'Essential Fat', color: 'text-sky-400', badgeBg: 'bg-sky-400/10 border-sky-400/30' };
      if (bf < 21) return { label: 'Athletic (Muscular)', color: 'text-brand', badgeBg: 'bg-brand/10 border-brand/30' };
      if (bf < 25) return { label: 'Fitness Leanness', color: 'text-brand opacity-90', badgeBg: 'bg-brand/10 border-brand/30' };
      if (bf < 32) return { label: 'Moderate', color: 'text-amber-400', badgeBg: 'bg-amber-400/10 border-amber-400/30' };
      return { label: 'Elevated Adiposity', color: 'text-rose-500', badgeBg: 'bg-rose-500/10 border-rose-500/30' };
    }
  };

  // 3. Waist-to-Hip Ratio (WHR) Calculation (World Health Organization Standards)
  const calculateWHRValue = () => {
    if (profile.hipCm <= 0) return 0.85;
    return profile.waistCm / profile.hipCm;
  };

  const calculateWHR = () => {
    return calculateWHRValue().toFixed(2);
  };

  const getWHRAnalysis = () => {
    const whr = calculateWHRValue();
    const isMale = profile.gender === 'male';

    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    let riskLabel = 'Low Metabolic Risk';
    let riskColor = 'text-brand';
    let riskBadge = 'bg-brand/10 border-brand/40 text-brand';
    let distribution = 'Balanced / Gynoid (Peripheral)';

    if (isMale) {
      if (whr < 0.90) {
        riskLevel = 'low';
        riskLabel = 'Low Health Risk (<0.90)';
        riskColor = 'text-brand';
        riskBadge = 'bg-brand/10 border-brand/30 text-brand';
        distribution = 'Favorable Lean Ratio';
      } else if (whr <= 0.99) {
        riskLevel = 'moderate';
        riskLabel = 'Moderate Health Risk (0.90 - 0.99)';
        riskColor = 'text-amber-400';
        riskBadge = 'bg-amber-400/10 border-amber-400/30 text-amber-400';
        distribution = 'Early Abdominal Accumulation';
      } else {
        riskLevel = 'high';
        riskLabel = 'High Health Risk (≥1.00)';
        riskColor = 'text-rose-500';
        riskBadge = 'bg-rose-500/10 border-rose-500/30 text-rose-500';
        distribution = 'Android (Central / Visceral Fat Predominance)';
      }
    } else {
      if (whr < 0.80) {
        riskLevel = 'low';
        riskLabel = 'Low Health Risk (<0.80)';
        riskColor = 'text-brand';
        riskBadge = 'bg-brand/10 border-brand/30 text-brand';
        distribution = 'Gynoid / Favorable Curve';
      } else if (whr <= 0.84) {
        riskLevel = 'moderate';
        riskLabel = 'Moderate Health Risk (0.80 - 0.84)';
        riskColor = 'text-amber-400';
        riskBadge = 'bg-amber-400/10 border-amber-400/30 text-amber-400';
        distribution = 'Transitional Body Distribution';
      } else {
        riskLevel = 'high';
        riskLabel = 'High Health Risk (≥0.85)';
        riskColor = 'text-rose-500';
        riskBadge = 'bg-rose-500/10 border-rose-500/30 text-rose-500';
        distribution = 'Android (Abdominal / Visceral Fat Predominance)';
      }
    }

    return { whr: whr.toFixed(2), riskLevel, riskLabel, riskColor, riskBadge, distribution };
  };

  // 4. BMR and TDEE Calculations
  const calculateBMR = () => {
    let bmr = (10 * profile.weightKg) + (6.25 * profile.heightCm) - (5 * profile.age);
    bmr = profile.gender === 'male' ? bmr + 5 : bmr - 161;
    return Math.round(bmr);
  };

  const calculateTDEE = () => {
    return Math.round(calculateBMR() * profile.activity);
  };

  // 5. Water Hydration Calculation
  const calculateWater = () => {
    const liters = profile.weightKg * 0.033;
    return profile.unitSystem === 'metric' ? liters.toFixed(1) : (liters * 33.814).toFixed(0);
  };

  // 6. Macro Calculation
  const calculateMacros = () => {
    const tdee = calculateTDEE();
    const ratios = {
      cut: { p: 0.35, f: 0.25, c: 0.40, calAdj: -500 },
      maintain: { p: 0.30, f: 0.30, c: 0.40, calAdj: 0 },
      bulk: { p: 0.25, f: 0.25, c: 0.50, calAdj: 300 }
    }[profile.nutritionGoal];

    const targetCalories = Math.max(1200, tdee + ratios.calAdj);
    
    return {
      calories: targetCalories,
      protein: Math.round((targetCalories * ratios.p) / 4),
      fats: Math.round((targetCalories * ratios.f) / 9),
      carbs: Math.round((targetCalories * ratios.c) / 4)
    };
  };

  // 7. Multi-Factor Health & Recomposition Analysis
  const getConsolidatedProfileAnalysis = () => {
    const bmi = calculateBMIValue();
    const bf = calculateBodyFatValue();
    const whrData = getWHRAnalysis();
    const isMale = profile.gender === 'male';

    let archetype = 'Balanced Conditioning';
    let summary = '';
    let recommendation = '';
    let priority: 'strength' | 'recomp' | 'hypertrophy' | 'fat-loss' = 'recomp';

    const isAthleticBF = isMale ? bf <= 15 : bf <= 23;
    const isHighBF = isMale ? bf >= 25 : bf >= 32;
    const isLowWHR = whrData.riskLevel === 'low';
    const isHighWHR = whrData.riskLevel === 'high';

    if (bmi >= 25 && isAthleticBF && isLowWHR) {
      archetype = 'High Muscular Density (Athletic Overload)';
      summary = `Scale weight indicates a high BMI (${bmi.toFixed(1)}), but your U.S. Navy circumference analysis (${bf.toFixed(1)}% body fat) and favorable Waist-to-Hip ratio (${whrData.whr}) prove substantial contractile muscle density rather than visceral fat. Standard BMI charts falsely categorize this build as overweight.`;
      recommendation = 'Maintain heavy compound resistance training with progressive overload. Fuel with maintenance or lean surplus macros to support dense myofibrillar hypertrophy while keeping waist circumference tight.';
      priority = 'hypertrophy';
    } else if (bmi < 25 && isHighWHR) {
      archetype = 'Metabolic Caution (Normal Weight Central Adiposity)';
      summary = `While overall BMI (${bmi.toFixed(1)}) falls within standard ranges, your elevated Waist-to-Hip ratio (${whrData.whr}) indicates visceral fat deposition around core abdominal organs. This pattern is clinically correlated with insulin resistance despite normal scale weight.`;
      recommendation = 'Prioritize progressive resistance training 3-4 days/week to build metabolically active muscle, pair with daily 8k-10k step threshold and moderate carbohydrate timing.';
      priority = 'recomp';
    } else if (isHighBF || isHighWHR) {
      archetype = 'Cardio-Metabolic Optimization Required';
      summary = `Estimated adiposity (${bf.toFixed(1)}%) and waist circumference indicate higher central storage. Reducing abdominal inches while preserving lean contractile mass through resistance training will drastically improve resting blood pressure and insulin sensitivity.`;
      recommendation = 'Execute a structured 400-500 kcal deficit with high protein intake (1.8-2.2g/kg). Focus on resistance training to preserve lean mass while mobilizing adipose reserves.';
      priority = 'fat-loss';
    } else if (isAthleticBF && isLowWHR) {
      archetype = 'Optimal Functional Athlete';
      summary = `Your biometric markers demonstrate excellent body recomposition. Low waist-to-hip ratio (${whrData.whr}), optimal body fat (${bf.toFixed(1)}%), and ${profile.unitSystem === 'metric' ? `${bodyComposition.leanMassKg} kg` : `${Math.round(bodyComposition.leanMassKg * 2.20462)} lbs`} of lean mass reflect strong cardiovascular and muscular resilience.`;
      recommendation = 'You are in an optimal physical baseline. Target sport-specific performance milestones, strength peaks, or structured lean mass accumulation.';
      priority = 'strength';
    } else {
      archetype = 'Healthy Baseline (Recomposition Ready)';
      summary = `Your baseline vitals are well within healthy physiological ranges. With an active energy expenditure and balanced WHR (${whrData.whr}), your metabolism is primed for body recomposition—building lean contractile mass while trimming trace abdominal fat.`;
      recommendation = 'Follow a slight caloric deficit or maintenance phase with progressive resistance programming. Track weekly waist circumference and lean mass partitioning as your non-scale victory metrics.';
      priority = 'recomp';
    }

    return { archetype, summary, recommendation, priority, whrData };
  };

  const profileAnalysis = getConsolidatedProfileAnalysis();
  const macroData = calculateMacros();
  const whrData = getWHRAnalysis();

  // Log current biometric check-in snapshot to timeline
  const handleLogSnapshot = (customNote?: string) => {
    const whr = Number(calculateWHR());
    const bmi = Number(calculateBMI());
    const bf = Number(calculateBodyFat());
    const { leanMassKg, fatMassKg } = calculateBodyComposition(profile.weightKg, bf);
    const tdee = calculateTDEE();
    const targetCalories = macroData.calories;

    const snapshotWeightFormatted = profile.unitSystem === 'metric' 
      ? `${profile.weightKg}kg` 
      : `${kgToLbs(profile.weightKg)}lbs`;

    const newSnapshot: BiometricSnapshot = {
      id: `snap-${Date.now()}`,
      date: new Date().toISOString(),
      weightKg: profile.weightKg,
      heightCm: profile.heightCm,
      waistCm: profile.waistCm,
      hipCm: profile.hipCm,
      neckCm: profile.neckCm || (profile.gender === 'female' ? 34 : 38),
      whr,
      bmi,
      bodyFat: bf,
      leanMassKg,
      fatMassKg,
      bodyFatMethod: profile.bodyFatMethod,
      tdee,
      targetCalories,
      goal: profile.nutritionGoal,
      notes: customNote?.trim() || `Check-in: ${profile.nutritionGoal.toUpperCase()} phase (${snapshotWeightFormatted}, BF ${bf}%, Lean: ${profile.unitSystem === 'metric' ? `${leanMassKg}kg` : `${Math.round(leanMassKg * 2.20462)}lbs`})`
    };

    const updated = [newSnapshot, ...history];
    setHistory(updated);
    saveStoredBiometricHistory(updated);
    setIsCheckinModalOpen(false);
    setCheckinNote('');
    setAlertNotice('Biometric snapshot logged to your progress timeline!');
    setTimeout(() => setAlertNotice(null), 3500);
  };

  // Delete an individual snapshot
  const handleDeleteSnapshot = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    saveStoredBiometricHistory(updated);
    setAlertNotice('Snapshot removed from timeline.');
    setTimeout(() => setAlertNotice(null), 3000);
  };

  // Clear all history logs
  const handleClearAllHistory = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear Biometric History?',
      message: 'This will erase all logged check-ins from your local timeline. Your baseline profile values will remain intact. This action cannot be undone.',
      confirmText: 'Clear All Check-ins',
      isDanger: true,
      onConfirm: () => {
        setHistory([]);
        saveStoredBiometricHistory([]);
        setConfirmModal(null);
        setAlertNotice('All check-in history cleared.');
        setTimeout(() => setAlertNotice(null), 3000);
      }
    });
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

  // Copy shareable link
  const handleCopyShareLink = () => {
    try {
      const url = new URL(window.location.origin + '/tools');
      url.searchParams.set('w', profile.weightKg.toString());
      url.searchParams.set('h', profile.heightCm.toString());
      url.searchParams.set('a', profile.age.toString());
      url.searchParams.set('g', profile.gender);
      url.searchParams.set('waist', profile.waistCm.toString());
      url.searchParams.set('hip', profile.hipCm.toString());
      url.searchParams.set('neck', (profile.neckCm || 38).toString());
      url.searchParams.set('method', profile.bodyFatMethod);
      url.searchParams.set('key', profile.protocolKey || 'MIT-FIT-782');
      navigator.clipboard.writeText(url.toString());
      setAlertNotice('Share link with your current metrics copied to clipboard!');
      setTimeout(() => setAlertNotice(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const backupData = {
      profile,
      history,
      exportedAt: new Date().toISOString(),
      app: 'MIT2FIT-OPTIMIZATION-LAB'
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mit2fit-biometrics-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setAlertNotice('Backup JSON exported successfully.');
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
        if (parsed.profile && typeof parsed.profile.weightKg === 'number') {
          setProfile(parsed.profile);
          saveStoredProfile(parsed.profile);
        }
        if (Array.isArray(parsed.history)) {
          setHistory(parsed.history);
          saveStoredBiometricHistory(parsed.history);
        }
        setAlertNotice('Biometric backup restored successfully!');
        setTimeout(() => setAlertNotice(null), 3500);
      } catch (err) {
        setAlertNotice('Failed to import backup file. Invalid JSON format.');
        setTimeout(() => setAlertNotice(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Regenerate Protocol Key
  const handleRegenerateKey = () => {
    const newKey = generateProtocolKey();
    const updated = { ...profile, protocolKey: newKey };
    setProfile(updated);
    saveStoredProtocolKey(newKey);
    setAlertNotice(`Protocol Key updated to ${newKey}`);
    setTimeout(() => setAlertNotice(null), 3000);
  };

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-32 bg-paper text-ink min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Floating Toast Alert */}
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

        {/* Header */}
        <header className="mb-10 md:mb-14 border-b border-edge pb-8 md:pb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 bg-brand rounded-full animate-pulse" />
                <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.35em]">
                  Mit2Fit Optimization Lab
                </span>
                <span className="text-zinc-700 hidden sm:inline">•</span>
                <span className="text-[10px] font-mono text-brand font-bold uppercase tracking-widest hidden sm:inline">
                  Key: {profile.protocolKey || 'MIT-FIT-782'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase">
                Performance <span className="text-brand">Analytics.</span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mt-4 leading-relaxed font-sans">
                Unified biometric intelligence. Features the refined U.S. Navy Anthropometric Body Composition formula—distinguishing 
                true fat loss from muscle preservation during body recomposition.
              </p>
            </div>
            
            {/* Header Action Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Log Snapshot Button */}
              <button
                type="button"
                onClick={() => setIsCheckinModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-brand/10 hover:bg-brand/20 border border-brand/40 text-brand text-[10px] font-black uppercase tracking-widest transition-all"
                title="Save current biometrics as a timestamped snapshot"
              >
                <Plus size={14} />
                <span>Log Check-in</span>
              </button>

              {/* Save & Share Data Portal Button */}
              <button
                type="button"
                onClick={() => setIsDataPortalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-surface hover:bg-zinc-800 border border-edge text-zinc-200 text-[10px] font-black uppercase tracking-widest transition-all"
                title="Open Device Storage & Export / Share Portal"
              >
                <HardDrive size={14} className="text-brand" />
                <span>Save & Share</span>
              </button>

              {/* Unit Toggle */}
              <div className="flex bg-surface p-1 border border-edge">
                <button 
                  onClick={() => setProfile({ ...profile, unitSystem: 'metric' })}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    profile.unitSystem === 'metric' ? 'bg-brand text-black' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Metric (kg/cm)
                </button>
                <button 
                  onClick={() => setProfile({ ...profile, unitSystem: 'imperial' })}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    profile.unitSystem === 'imperial' ? 'bg-brand text-black' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Imperial (lbs/in)
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* STARTING POINT ENTRY: Unified Biometric Profile Input Card */}
        {/* ========================================================================= */}
        <section className="mb-12 bg-surface border border-edge relative overflow-hidden">
          <div className="p-6 md:p-8 border-b border-edge bg-black/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-brand font-mono text-[10px] uppercase tracking-widest font-black">
                <User size={14} /> Baseline Measurements (Auto-Saved)
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase text-white mt-1">
                Anthropometric & Biometric Inputs
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Neck and waist circumferences are used by the U.S. Navy formula to accurately isolate fat loss from lean muscle.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Gender:</span>
                <div className="flex border border-edge bg-paper p-1">
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, gender: 'male' })}
                    className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                      profile.gender === 'male' ? 'bg-brand text-black' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, gender: 'female' })}
                    className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                      profile.gender === 'female' ? 'bg-brand text-black' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLogSnapshot()}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-brand/10 hover:bg-brand/20 border border-brand/40 text-brand text-[10px] font-mono uppercase font-bold tracking-wider"
              >
                <Clock size={12} /> Log Snapshot
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            
            {/* Weight */}
            <div className="space-y-2 bg-paper/60 p-4 border border-edge">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-zinc-500 font-bold">Total Weight</span>
                <span className="text-brand font-bold text-sm">
                  {profile.unitSystem === 'metric' ? `${profile.weightKg} kg` : `${kgToLbs(profile.weightKg)} lbs`}
                </span>
              </div>
              <input 
                type="range" 
                min={profile.unitSystem === 'metric' ? 40 : 90} 
                max={profile.unitSystem === 'metric' ? 160 : 350} 
                value={profile.unitSystem === 'metric' ? profile.weightKg : kgToLbs(profile.weightKg)} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setProfile({ 
                    ...profile, 
                    weightKg: profile.unitSystem === 'metric' ? val : lbsToKg(val) 
                  });
                }}
                className="w-full accent-brand cursor-pointer" 
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                <span>{profile.unitSystem === 'metric' ? '40kg' : '90lbs'}</span>
                <span>{profile.unitSystem === 'metric' ? '160kg' : '350lbs'}</span>
              </div>
            </div>

            {/* Height */}
            <div className="space-y-2 bg-paper/60 p-4 border border-edge">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-zinc-500 font-bold">Height</span>
                <span className="text-brand font-bold text-sm">
                  {profile.unitSystem === 'metric' ? `${profile.heightCm} cm` : `${cmToIn(profile.heightCm)} in`}
                </span>
              </div>
              <input 
                type="range" 
                min={profile.unitSystem === 'metric' ? 130 : 51} 
                max={profile.unitSystem === 'metric' ? 220 : 86} 
                value={profile.unitSystem === 'metric' ? profile.heightCm : Number(cmToIn(profile.heightCm))} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setProfile({ 
                    ...profile, 
                    heightCm: profile.unitSystem === 'metric' ? val : Math.round(inToCm(val)) 
                  });
                }}
                className="w-full accent-brand cursor-pointer" 
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                <span>{profile.unitSystem === 'metric' ? '130cm' : '51in'}</span>
                <span>{profile.unitSystem === 'metric' ? '220cm' : '86in'}</span>
              </div>
            </div>

            {/* Waist Circumference */}
            <div className="space-y-2 bg-paper/60 p-4 border border-edge">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-zinc-500 font-bold flex items-center gap-1">
                  Waist <span className="text-[9px] text-brand border border-brand/30 px-1 rounded">Fat Marker</span>
                </span>
                <span className="text-brand font-bold text-sm">
                  {profile.unitSystem === 'metric' ? `${profile.waistCm} cm` : `${cmToIn(profile.waistCm)} in`}
                </span>
              </div>
              <input 
                type="range" 
                min={profile.unitSystem === 'metric' ? 50 : 20} 
                max={profile.unitSystem === 'metric' ? 150 : 60} 
                value={profile.unitSystem === 'metric' ? profile.waistCm : Number(cmToIn(profile.waistCm))} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setProfile({ 
                    ...profile, 
                    waistCm: profile.unitSystem === 'metric' ? val : Math.round(inToCm(val)) 
                  });
                }}
                className="w-full accent-brand cursor-pointer" 
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                <span>{profile.unitSystem === 'metric' ? '50cm' : '20in'}</span>
                <span>{profile.unitSystem === 'metric' ? '150cm' : '60in'}</span>
              </div>
            </div>

            {/* Neck Circumference (Essential for Navy Body Fat) */}
            <div className="space-y-2 bg-paper/60 p-4 border border-edge">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-zinc-500 font-bold flex items-center gap-1">
                  Neck <span className="text-[9px] text-cyan-400 border border-cyan-400/30 px-1 rounded">Muscle Anchor</span>
                </span>
                <span className="text-cyan-400 font-bold text-sm">
                  {profile.unitSystem === 'metric' ? `${profile.neckCm || 38} cm` : `${cmToIn(profile.neckCm || 38)} in`}
                </span>
              </div>
              <input 
                type="range" 
                min={profile.unitSystem === 'metric' ? 25 : 10} 
                max={profile.unitSystem === 'metric' ? 60 : 24} 
                value={profile.unitSystem === 'metric' ? (profile.neckCm || 38) : Number(cmToIn(profile.neckCm || 38))} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setProfile({ 
                    ...profile, 
                    neckCm: profile.unitSystem === 'metric' ? val : Math.round(inToCm(val)) 
                  });
                }}
                className="w-full accent-cyan-400 cursor-pointer" 
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                <span>{profile.unitSystem === 'metric' ? '25cm' : '10in'}</span>
                <span>{profile.unitSystem === 'metric' ? '60cm' : '24in'}</span>
              </div>
            </div>

            {/* Hip Circumference */}
            <div className="space-y-2 bg-paper/60 p-4 border border-edge">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-zinc-500 font-bold">Hip</span>
                <span className="text-brand font-bold text-sm">
                  {profile.unitSystem === 'metric' ? `${profile.hipCm} cm` : `${cmToIn(profile.hipCm)} in`}
                </span>
              </div>
              <input 
                type="range" 
                min={profile.unitSystem === 'metric' ? 60 : 24} 
                max={profile.unitSystem === 'metric' ? 160 : 64} 
                value={profile.unitSystem === 'metric' ? profile.hipCm : Number(cmToIn(profile.hipCm))} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setProfile({ 
                    ...profile, 
                    hipCm: profile.unitSystem === 'metric' ? val : Math.round(inToCm(val)) 
                  });
                }}
                className="w-full accent-brand cursor-pointer" 
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                <span>{profile.unitSystem === 'metric' ? '60cm' : '24in'}</span>
                <span>{profile.unitSystem === 'metric' ? '160cm' : '64in'}</span>
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2 bg-paper/60 p-4 border border-edge">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-zinc-500 font-bold">Age</span>
                <span className="text-brand font-bold text-sm">{profile.age} yrs</span>
              </div>
              <input 
                type="range" 
                min="16" 
                max="85" 
                value={profile.age} 
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                className="w-full accent-brand cursor-pointer" 
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                <span>16 yrs</span>
                <span>85 yrs</span>
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-2 bg-paper/60 p-4 border border-edge">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-zinc-500 font-bold">Activity Factor</span>
                <span className="text-brand font-bold text-sm">x{profile.activity}</span>
              </div>
              <select 
                value={profile.activity} 
                onChange={(e) => setProfile({ ...profile, activity: Number(e.target.value) })}
                className="w-full bg-black border border-edge p-2.5 text-[10px] font-mono text-zinc-300 uppercase outline-none focus:border-brand"
              >
                <option value="1.2">Sedentary (Desk Work)</option>
                <option value="1.375">Lightly Active (1-3 days/wk)</option>
                <option value="1.55">Moderately Active (3-5 days/wk)</option>
                <option value="1.725">Very Active (6-7 days/wk)</option>
                <option value="1.9">Extreme (2x Daily / Athlete)</option>
              </select>
              <div className="text-[9px] font-mono text-zinc-600">BMR / TDEE multiplier</div>
            </div>

            {/* Body Fat Calculation Formula Selector */}
            <div className="space-y-2 bg-paper/60 p-4 border border-edge lg:col-span-1">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-zinc-500 font-bold">Body Fat Formula</span>
                <span className="text-brand font-bold text-[10px] uppercase">{profile.bodyFatMethod === 'navy' ? 'Navy (Accurate)' : 'Deurenberg'}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, bodyFatMethod: 'navy' })}
                  className={`py-2 px-2 text-[9px] font-bold uppercase tracking-wider rounded border transition ${
                    profile.bodyFatMethod === 'navy'
                      ? 'bg-brand text-black border-brand'
                      : 'bg-black/50 text-zinc-400 border-edge hover:text-white'
                  }`}
                  title="U.S. Navy Method: Measures circumference changes, accurately distinguishing fat loss from muscle preservation"
                >
                  U.S. Navy (Best)
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, bodyFatMethod: 'deurenberg' })}
                  className={`py-2 px-2 text-[9px] font-bold uppercase tracking-wider rounded border transition ${
                    profile.bodyFatMethod === 'deurenberg'
                      ? 'bg-brand text-black border-brand'
                      : 'bg-black/50 text-zinc-400 border-edge hover:text-white'
                  }`}
                  title="Deurenberg Formula: Crude estimation derived only from BMI and Age"
                >
                  BMI-Based
                </button>
              </div>
              <div className="text-[9px] font-mono text-zinc-500">Navy captures true recomposition</div>
            </div>

            {/* Nutrition Phase Goal */}
            <div className="space-y-2 bg-paper/60 p-4 border border-edge lg:col-span-2">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-zinc-500 font-bold">Target Nutrition Phase</span>
                <span className="text-brand font-bold text-sm uppercase">{profile.nutritionGoal}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['cut', 'maintain', 'bulk'] as const).map((g) => (
                  <button 
                    key={g}
                    type="button"
                    onClick={() => setProfile({ ...profile, nutritionGoal: g })}
                    className={`py-2 px-3 border text-[10px] font-black uppercase tracking-wider transition-all ${
                      profile.nutritionGoal === g 
                        ? 'border-brand text-brand bg-brand/10' 
                        : 'border-edge text-zinc-500 hover:text-white bg-black/40'
                    }`}
                  >
                    {g === 'cut' ? 'Fat Loss (-500)' : g === 'maintain' ? 'Maintenance' : 'Lean Bulk (+300)'}
                  </button>
                ))}
              </div>
              <div className="text-[9px] font-mono text-zinc-600">Sets caloric deficit/surplus & protein targets</div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* NAVIGATION: Tab Selector (Consolidated Dashboard, History & Calculators) */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-edge pb-4">
          <button
            onClick={() => setActiveTool('DASHBOARD')}
            className={`px-5 py-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${
              activeTool === 'DASHBOARD'
                ? 'bg-brand text-black shadow-lg shadow-brand/20'
                : 'bg-surface text-zinc-400 hover:text-white border border-edge'
            }`}
          >
            <Layers size={16} /> Consolidated Dashboard
          </button>

          <button
            onClick={() => setActiveTool('HISTORY')}
            className={`px-5 py-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${
              activeTool === 'HISTORY'
                ? 'bg-brand text-black shadow-lg shadow-brand/20'
                : 'bg-surface text-zinc-400 hover:text-white border border-edge'
            }`}
          >
            <History size={16} /> Progress & Recomposition Timeline ({history.length})
          </button>

          <span className="text-zinc-700 mx-2 hidden sm:inline">|</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hidden sm:inline">
            Deep-Dive Calculators:
          </span>

          {[
            { id: 'BODYFAT', icon: <Calculator size={14} />, label: 'Body Fat % & Lean Mass' },
            { id: 'WHR', icon: <Scale size={14} />, label: 'Waist-to-Hip' },
            { id: 'BMI', icon: <User size={14} />, label: 'BMI' },
            { id: 'CALORIES', icon: <Flame size={14} />, label: 'Metabolism / TDEE' },
            { id: 'MACROS', icon: <PieChart size={14} />, label: 'Macros' },
            { id: 'WATER', icon: <Droplets size={14} />, label: 'Hydration' },
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as ToolType)}
              className={`px-3.5 py-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                activeTool === tool.id
                  ? 'bg-white text-black font-black'
                  : 'bg-paper text-zinc-500 hover:text-white border border-edge/60'
              }`}
            >
              {tool.icon} {tool.label}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: CONSOLIDATED DASHBOARD (PRIMARY DEFAULT VIEW) */}
        {/* ========================================================================= */}
        {activeTool === 'DASHBOARD' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* Metric Tiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              
              {/* Refined Body Fat % & Tissue Partitioning Tile */}
              <div 
                onClick={() => setActiveTool('BODYFAT')}
                className="bg-surface border border-brand/40 p-5 hover:border-brand transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-brand">Body Fat %</span>
                  <Calculator size={14} className="text-brand group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl font-black tracking-tight text-white mb-2">
                  {calculateBodyFat()}<span className="text-lg text-brand">%</span>
                </div>
                <div className={`inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold border ${getBodyFatCategory(Number(calculateBodyFat())).badgeBg} ${getBodyFatCategory(Number(calculateBodyFat())).color}`}>
                  {getBodyFatCategory(Number(calculateBodyFat())).label}
                </div>
                <div className="mt-3 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                  <span>Lean Mass:</span>
                  <strong className="text-white">
                    {profile.unitSystem === 'metric' ? `${bodyComposition.leanMassKg}kg` : `${kgToLbs(bodyComposition.leanMassKg)}lbs`}
                  </strong>
                </div>
              </div>

              {/* WHR Tile */}
              <div 
                onClick={() => setActiveTool('WHR')}
                className="bg-surface border border-edge p-5 hover:border-brand/60 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Waist-To-Hip</span>
                  <Scale size={14} className="text-brand group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl font-black tracking-tight text-white mb-2">
                  {calculateWHR()}
                </div>
                <div className={`inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold border ${whrData.riskBadge}`}>
                  {whrData.riskLevel.toUpperCase()} RISK
                </div>
                <div className="mt-3 text-[10px] font-mono text-zinc-500 line-clamp-1">
                  {whrData.distribution}
                </div>
              </div>

              {/* BMI Tile */}
              <div 
                onClick={() => setActiveTool('BMI')}
                className="bg-surface border border-edge p-5 hover:border-brand/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">BMI Estimate</span>
                  <User size={14} className="text-brand group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl font-black tracking-tight text-white mb-2">
                  {calculateBMI()}
                </div>
                <div className={`inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold border ${getBMICategory(Number(calculateBMI())).badgeBg} ${getBMICategory(Number(calculateBMI())).color}`}>
                  {getBMICategory(Number(calculateBMI())).label}
                </div>
                <div className="mt-3 text-[10px] font-mono text-zinc-500">
                  {profile.unitSystem === 'metric' ? `${profile.weightKg}kg / ${profile.heightCm}cm` : `${kgToLbs(profile.weightKg)}lbs / ${cmToIn(profile.heightCm)}in`}
                </div>
              </div>

              {/* TDEE Calories Tile */}
              <div 
                onClick={() => setActiveTool('CALORIES')}
                className="bg-surface border border-edge p-5 hover:border-brand/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">TDEE / Burn</span>
                  <Flame size={14} className="text-brand group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl font-black tracking-tight text-white mb-2">
                  {calculateTDEE()}
                </div>
                <div className="inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold border border-zinc-700 bg-zinc-800 text-zinc-300">
                  BMR {calculateBMR()}
                </div>
                <div className="mt-3 text-[10px] font-mono text-zinc-500">
                  x{profile.activity} Activity Factor
                </div>
              </div>

              {/* Nutrition Target Calories Tile */}
              <div 
                onClick={() => setActiveTool('MACROS')}
                className="bg-surface border border-edge p-5 hover:border-brand/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Calorie Target</span>
                  <PieChart size={14} className="text-brand group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl font-black tracking-tight text-brand mb-2">
                  {macroData.calories}
                </div>
                <div className="inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold border border-brand/30 bg-brand/10 text-brand">
                  {profile.nutritionGoal.toUpperCase()} PHASE
                </div>
                <div className="mt-3 text-[10px] font-mono text-zinc-500">
                  {macroData.protein}P / {macroData.fats}F / {macroData.carbs}C
                </div>
              </div>

              {/* Hydration Tile */}
              <div 
                onClick={() => setActiveTool('WATER')}
                className="bg-surface border border-edge p-5 hover:border-brand/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Hydration</span>
                  <Droplets size={14} className="text-brand group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl font-black tracking-tight text-white mb-2">
                  {calculateWater()}<span className="text-sm text-zinc-400 font-mono ml-1">{profile.unitSystem === 'metric' ? 'L' : 'oz'}</span>
                </div>
                <div className="inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold border border-sky-400/30 bg-sky-400/10 text-sky-400">
                  DAILY GOAL
                </div>
                <div className="mt-3 text-[10px] font-mono text-zinc-500">
                  Cellular Hydration Baseline
                </div>
              </div>

            </div>

            {/* Consolidated Deep-Dive Synthesis Panel */}
            <div className="bg-surface border border-edge relative overflow-hidden">
              <div className="p-6 md:p-8 border-b border-edge bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-brand/30 bg-brand/5 flex items-center justify-center text-brand">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-brand font-bold uppercase tracking-widest block">
                      Holistic Diagnostic Synthesis
                    </span>
                    <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase text-white">
                      Body Composition & Recomposition Quality
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Classified Archetype:</span>
                  <span className="px-3 py-1 bg-brand text-black text-xs font-black uppercase tracking-wider">
                    {profileAnalysis.archetype}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Synthesis Diagnostic Commentary */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold mb-2">
                      Clinical & Metabolic Profile Summary
                    </h4>
                    <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-sans">
                      {profileAnalysis.summary}
                    </p>
                  </div>

                  <div className="p-4 bg-paper border border-edge space-y-2">
                    <div className="flex items-center gap-2 text-brand text-xs font-mono font-black uppercase tracking-wider">
                      <Activity size={14} /> Prescribed Protocol Focus
                    </div>
                    <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-sans">
                      {profileAnalysis.recommendation}
                    </p>
                  </div>

                  {/* Body Composition Tissue Split Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-4 bg-black/50 border border-edge space-y-1">
                      <span className="text-[9px] font-mono uppercase text-zinc-500 block">Total Mass</span>
                      <div className="text-xl font-black text-white">
                        {profile.unitSystem === 'metric' ? `${profile.weightKg} kg` : `${kgToLbs(profile.weightKg)} lbs`}
                      </div>
                      <span className="text-[9px] font-mono text-zinc-400">Gross scale weight</span>
                    </div>

                    <div className="p-4 bg-black/50 border border-brand/30 space-y-1">
                      <span className="text-[9px] font-mono uppercase text-brand block font-bold">Lean Muscle & Bone</span>
                      <div className="text-xl font-black text-brand">
                        {profile.unitSystem === 'metric' ? `${bodyComposition.leanMassKg} kg` : `${kgToLbs(bodyComposition.leanMassKg)} lbs`}
                      </div>
                      <span className="text-[9px] font-mono text-zinc-400">
                        {Math.round((bodyComposition.leanMassKg / profile.weightKg) * 100)}% of total mass
                      </span>
                    </div>

                    <div className="p-4 bg-black/50 border border-edge space-y-1">
                      <span className="text-[9px] font-mono uppercase text-amber-400 block font-bold">Adipose Fat Mass</span>
                      <div className="text-xl font-black text-amber-400">
                        {profile.unitSystem === 'metric' ? `${bodyComposition.fatMassKg} kg` : `${kgToLbs(bodyComposition.fatMassKg)} lbs`}
                      </div>
                      <span className="text-[9px] font-mono text-zinc-400">
                        {calculateBodyFat()}% body fat
                      </span>
                    </div>
                  </div>

                  {/* WHR + Body Fat Visual Scales */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-black/50 border border-edge space-y-2">
                      <div className="flex justify-between text-[10px] font-mono uppercase">
                        <span className="text-zinc-400">Waist-To-Hip Ratio</span>
                        <span className="font-bold text-brand">{calculateWHR()}</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 overflow-hidden flex">
                        <div className="bg-brand h-full" style={{ width: `${Math.min(100, Math.max(10, (calculateWHRValue() - 0.6) * 160))}%` }} />
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                        <span>Low Risk (&lt;{profile.gender === 'male' ? '0.90' : '0.80'})</span>
                        <span>High Risk (&ge;{profile.gender === 'male' ? '1.00' : '0.85'})</span>
                      </div>
                    </div>

                    <div className="p-4 bg-black/50 border border-edge space-y-2">
                      <div className="flex justify-between text-[10px] font-mono uppercase">
                        <span className="text-zinc-400">Body Fat ({profile.bodyFatMethod === 'navy' ? 'U.S. Navy' : 'BMI'})</span>
                        <span className="font-bold text-brand">{calculateBodyFat()}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 overflow-hidden flex">
                        <div className="bg-brand h-full" style={{ width: `${Math.min(100, Math.max(10, (calculateBodyFatValue() / 40) * 100))}%` }} />
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                        <span>Athletic (&lt;{profile.gender === 'male' ? '14%' : '21%'})</span>
                        <span>Elevated (&gt;{profile.gender === 'male' ? '25%' : '32%'})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Macro Target & Calorie Breakdown Card */}
                <div className="lg:col-span-5 bg-black border border-edge p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-edge pb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                        Prescribed Daily Target
                      </span>
                      <div className="text-4xl md:text-5xl font-black text-brand tracking-tight mt-1">
                        {macroData.calories} <span className="text-sm text-zinc-400 font-mono font-normal">KCAL</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 border border-brand/30 bg-brand/10 text-brand text-[10px] font-mono uppercase tracking-wider font-bold">
                      {profile.nutritionGoal.toUpperCase()}
                    </span>
                  </div>

                  {/* Macro gram split */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-paper p-3 border border-edge text-center">
                      <div className="text-xl font-black text-white">{macroData.protein}g</div>
                      <div className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider mt-0.5">Protein</div>
                    </div>
                    <div className="bg-paper p-3 border border-edge text-center">
                      <div className="text-xl font-black text-white">{macroData.fats}g</div>
                      <div className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider mt-0.5">Fats</div>
                    </div>
                    <div className="bg-paper p-3 border border-edge text-center">
                      <div className="text-xl font-black text-white">{macroData.carbs}g</div>
                      <div className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider mt-0.5">Carbs</div>
                    </div>
                  </div>

                  {/* Macro Ratio Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-3 bg-zinc-800 flex overflow-hidden">
                      <div className="bg-brand h-full" style={{ width: '35%' }} title="Protein 35%" />
                      <div className="bg-amber-400 h-full" style={{ width: '25%' }} title="Fats 25%" />
                      <div className="bg-sky-400 h-full" style={{ width: '40%' }} title="Carbs 40%" />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-brand inline-block rounded-full" /> Pro 35%</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-400 inline-block rounded-full" /> Fat 25%</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-sky-400 inline-block rounded-full" /> Carb 40%</span>
                    </div>
                  </div>

                  {/* Consultation Link */}
                  <Link 
                    to="/consultation"
                    className="w-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest border border-brand text-brand hover:bg-brand hover:text-black py-4 transition-all font-mono"
                  >
                    Optimize via Consultation <ArrowRight size={14} />
                  </Link>
                </div>

              </div>
            </div>

            {/* Quick Link to Exercise Tracker & Progress Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface border border-edge p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-brand/10 border border-brand/30 flex items-center justify-center text-brand">
                    <Dumbbell size={22} />
                  </div>
                  <div>
                    <h4 className="text-base font-black uppercase tracking-tight text-white">
                      Apply in Exercise Tracker
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Log progressive overload workouts, sync active routines, and auto-adjust targets.
                    </p>
                  </div>
                </div>

                <Link
                  to="/tracker"
                  className="px-5 py-3 bg-white text-black hover:bg-brand transition-all text-xs font-black uppercase tracking-widest flex items-center gap-1 shrink-0"
                >
                  Tracker <ArrowRight size={14} />
                </Link>
              </div>

              <div className="bg-surface border border-edge p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-zinc-800 border border-edge flex items-center justify-center text-brand">
                    <History size={22} />
                  </div>
                  <div>
                    <h4 className="text-base font-black uppercase tracking-tight text-white">
                      Recomposition Timeline
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {history.length} logged check-in snapshot(s). Review Lean Muscle vs Fat Mass changes.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTool('HISTORY')}
                  className="px-5 py-3 bg-brand/10 text-brand border border-brand/30 hover:bg-brand hover:text-black transition-all text-xs font-black uppercase tracking-widest flex items-center gap-1 shrink-0"
                >
                  View Timeline <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: PROGRESS & RECOMPOSITION TIMELINE                                 */}
        {/* ========================================================================= */}
        {activeTool === 'HISTORY' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Timeline Action Header */}
            <div className="bg-surface border border-edge p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-brand font-mono text-[10px] uppercase tracking-widest font-black">
                  <History size={14} /> Biometric & Recomposition Timeline
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
                  Historical Check-in & Tissue Partitioning Records
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Distinguishes true fat loss from muscle loss. Tracks lean muscle preservation against waist reduction over time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckinModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-brand text-black font-black text-xs uppercase tracking-wider hover:brightness-110 transition shadow-lg shadow-brand/20"
                >
                  <Plus size={14} />
                  <span>Log New Check-in</span>
                </button>

                <button
                  type="button"
                  onClick={() => exportBiometricsCSV(history, profile.unitSystem)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 border border-edge text-zinc-300 hover:text-white hover:border-brand/40 text-xs font-bold uppercase tracking-wider transition"
                >
                  <FileSpreadsheet size={14} className="text-cyan-400" />
                  <span>Export CSV</span>
                </button>

                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllHistory}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 border border-edge hover:border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider transition"
                    title="Erase all timeline logs"
                  >
                    <Trash2 size={14} />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>

            {/* History Items List */}
            {history.length === 0 ? (
              <div className="bg-surface border border-edge p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-edge flex items-center justify-center mx-auto text-zinc-500">
                  <History size={24} />
                </div>
                <h4 className="text-lg font-black uppercase tracking-tight text-white">No Check-in Snapshots Yet</h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Click "Log New Check-in" above to record your current measurements as your first timeline entry.
                </p>
                <button
                  type="button"
                  onClick={() => handleLogSnapshot('Initial baseline check-in')}
                  className="px-6 py-3 bg-brand text-black text-xs font-black uppercase tracking-widest"
                >
                  Record First Snapshot
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item, idx) => {
                  const prevItem = history[idx + 1];
                  const recomp = prevItem ? evaluateRecompositionDelta(item, prevItem) : null;
                  const weightDelta = prevItem ? Math.round((item.weightKg - prevItem.weightKg) * 10) / 10 : null;
                  const leanDelta = prevItem ? Math.round((item.leanMassKg - prevItem.leanMassKg) * 10) / 10 : null;
                  const fatDelta = prevItem ? Math.round((item.fatMassKg - prevItem.fatMassKg) * 10) / 10 : null;
                  const whrDelta = prevItem ? Math.round((item.whr - prevItem.whr) * 100) / 100 : null;

                  const dateDisplay = new Date(item.date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <div
                      key={item.id}
                      className="bg-surface border border-edge hover:border-zinc-700 transition-all p-5 md:p-6 rounded-none space-y-4"
                    >
                      {/* Top Bar: Date, Badge, Delete */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-edge/60 pb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="w-2 h-2 rounded-full bg-brand" />
                          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                            {dateDisplay}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            #{history.length - idx}
                          </span>
                          <span className="px-2 py-0.5 border border-brand/30 bg-brand/10 text-brand text-[9px] font-mono uppercase font-bold">
                            {item.goal.toUpperCase()} PHASE
                          </span>
                          <span className="text-[9px] font-mono text-zinc-500 border border-zinc-800 px-1.5 py-0.5">
                            {item.bodyFatMethod === 'navy' ? 'U.S. Navy Method' : 'Deurenberg Method'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteSnapshot(item.id)}
                            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition"
                            title="Delete this snapshot"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Recomposition Verdict Banner if previous snapshot exists */}
                      {recomp && (
                        <div className={`p-3 border rounded-none text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          recomp.classification === 'elite_recomp'
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                            : recomp.classification === 'catabolic_loss'
                            ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                            : recomp.classification === 'lean_hypertrophy'
                            ? 'bg-brand/10 border-brand/40 text-brand'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                        }`}>
                          <div className="flex items-center gap-2">
                            {recomp.classification === 'catabolic_loss' ? (
                              <AlertTriangle size={15} className="text-rose-400 shrink-0" />
                            ) : (
                              <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                            )}
                            <div>
                              <strong className="font-bold">{recomp.headline}: </strong>
                              <span className="text-zinc-300 font-sans">{recomp.detail}</span>
                            </div>
                          </div>

                          <div className="font-mono text-[11px] shrink-0 font-bold flex items-center gap-3">
                            <span className={leanDelta && leanDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                              Lean Mass: {leanDelta && leanDelta > 0 ? `+${profile.unitSystem === 'metric' ? leanDelta : Math.round(leanDelta * 2.20462)}` : `${profile.unitSystem === 'metric' ? leanDelta : Math.round(leanDelta! * 2.20462)}`} {profile.unitSystem === 'metric' ? 'kg' : 'lbs'}
                            </span>
                            <span className={fatDelta && fatDelta <= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                              Fat Mass: {fatDelta && fatDelta > 0 ? `+${profile.unitSystem === 'metric' ? fatDelta : Math.round(fatDelta * 2.20462)}` : `${profile.unitSystem === 'metric' ? fatDelta : Math.round(fatDelta! * 2.20462)}`} {profile.unitSystem === 'metric' ? 'kg' : 'lbs'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Metrics Breakdown Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {/* Weight */}
                        <div className="bg-black/50 p-3 border border-edge">
                          <span className="text-[9px] font-mono uppercase text-zinc-500 block">Total Weight</span>
                          <div className="text-lg font-black text-white mt-0.5">
                            {profile.unitSystem === 'metric' 
                              ? `${item.weightKg} kg` 
                              : `${kgToLbs(item.weightKg)} lbs`}
                          </div>
                          {weightDelta !== null && (
                            <span className={`text-[10px] font-mono font-bold flex items-center gap-0.5 mt-0.5 ${
                              weightDelta <= 0 ? 'text-brand' : 'text-amber-400'
                            }`}>
                              {weightDelta > 0 ? `+${profile.unitSystem === 'metric' ? weightDelta : Math.round(weightDelta * 2.20462)}` : `${profile.unitSystem === 'metric' ? weightDelta : Math.round(weightDelta * 2.20462)}`}
                              {profile.unitSystem === 'metric' ? 'kg' : 'lbs'}
                            </span>
                          )}
                        </div>

                        {/* Lean Mass */}
                        <div className="bg-black/50 p-3 border border-brand/20">
                          <span className="text-[9px] font-mono uppercase text-brand block font-bold">Lean Muscle</span>
                          <div className="text-lg font-black text-brand mt-0.5">
                            {profile.unitSystem === 'metric' 
                              ? `${item.leanMassKg} kg` 
                              : `${kgToLbs(item.leanMassKg)} lbs`}
                          </div>
                          {leanDelta !== null && (
                            <span className={`text-[10px] font-mono font-bold mt-0.5 block ${
                              leanDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {leanDelta > 0 ? `+${profile.unitSystem === 'metric' ? leanDelta : Math.round(leanDelta * 2.20462)}` : `${profile.unitSystem === 'metric' ? leanDelta : Math.round(leanDelta * 2.20462)}`}
                              {profile.unitSystem === 'metric' ? 'kg' : 'lbs'}
                            </span>
                          )}
                        </div>

                        {/* Fat Mass */}
                        <div className="bg-black/50 p-3 border border-edge">
                          <span className="text-[9px] font-mono uppercase text-amber-400 block font-bold">Adipose Fat</span>
                          <div className="text-lg font-black text-amber-400 mt-0.5">
                            {profile.unitSystem === 'metric' 
                              ? `${item.fatMassKg} kg` 
                              : `${kgToLbs(item.fatMassKg)} lbs`}
                          </div>
                          {fatDelta !== null && (
                            <span className={`text-[10px] font-mono font-bold mt-0.5 block ${
                              fatDelta <= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {fatDelta > 0 ? `+${profile.unitSystem === 'metric' ? fatDelta : Math.round(fatDelta * 2.20462)}` : `${profile.unitSystem === 'metric' ? fatDelta : Math.round(fatDelta * 2.20462)}`}
                              {profile.unitSystem === 'metric' ? 'kg' : 'lbs'}
                            </span>
                          )}
                        </div>

                        {/* Waist Circumference */}
                        <div className="bg-black/50 p-3 border border-edge">
                          <span className="text-[9px] font-mono uppercase text-zinc-500 block">Waist</span>
                          <div className="text-lg font-black text-white mt-0.5">
                            {profile.unitSystem === 'metric' 
                              ? `${item.waistCm} cm` 
                              : `${cmToIn(item.waistCm)} in`}
                          </div>
                          <span className="text-[9px] font-mono text-zinc-500">Circumference</span>
                        </div>

                        {/* Body Fat % */}
                        <div className="bg-black/50 p-3 border border-edge">
                          <span className="text-[9px] font-mono uppercase text-zinc-500 block">Body Fat</span>
                          <div className="text-lg font-black text-white mt-0.5">
                            {item.bodyFat}%
                          </div>
                          <span className="text-[9px] font-mono text-zinc-500">{item.bodyFatMethod === 'navy' ? 'Navy' : 'BMI'}</span>
                        </div>

                        {/* WHR */}
                        <div className="bg-black/50 p-3 border border-edge">
                          <span className="text-[9px] font-mono uppercase text-zinc-500 block">Waist-to-Hip</span>
                          <div className="text-lg font-black text-brand mt-0.5">
                            {item.whr}
                          </div>
                          {whrDelta !== null && (
                            <span className={`text-[10px] font-mono font-bold flex items-center gap-0.5 mt-0.5 ${
                              whrDelta <= 0 ? 'text-brand' : 'text-amber-400'
                            }`}>
                              {whrDelta > 0 ? `+${whrDelta}` : `${whrDelta}`} WHR
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Notes / Context */}
                      {item.notes && (
                        <div className="text-xs text-zinc-400 font-mono bg-paper/60 p-3 border border-edge/60 flex items-start gap-2">
                          <span className="text-brand font-bold">•</span>
                          <span className="italic">{item.notes}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: INDIVIDUAL CALCULATOR DEEP DIVES */}
        {/* ========================================================================= */}
        {activeTool !== 'DASHBOARD' && activeTool !== 'HISTORY' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Diagnostic Theory Context */}
            <div className="lg:col-span-7 bg-surface border border-edge p-6 md:p-10 space-y-6">
              
              {activeTool === 'BODYFAT' && (
                <>
                  <div className="flex items-center gap-2 text-brand font-mono text-xs uppercase tracking-widest font-bold">
                    <Calculator size={16} /> Adipose Tissue & Lean Muscle Diagnostic
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                    U.S. Navy Anthropometric Body Composition Standard
                  </h3>
                  
                  {/* Physiological Difference Highlighted by User */}
                  <div className="p-4 bg-brand/5 border border-brand/30 space-y-2">
                    <div className="flex items-center gap-2 text-brand text-xs font-mono font-bold uppercase tracking-wider">
                      <Zap size={14} /> Muscle Preservation vs. Catabolic Fat Loss
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      When someone engages in progressive resistance training and loses fat while maintaining dense contractile muscle, 
                      their waist circumference drops drastically even if their total scale weight and BMI change minimally. 
                      Under crude BMI-based formulas, this is miscounted as "little to no body fat loss". 
                      The U.S. Navy formula isolates circumferences (waist, neck, hip) against skeletal height, 
                      accurately recognizing that abdominal fat was eliminated while lean mass was preserved!
                    </p>
                  </div>

                  {/* Formula Comparison Toggle */}
                  <div className="p-4 bg-black/40 border border-edge space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                        Active Calculation Formula:
                      </span>
                      <div className="flex border border-edge bg-paper p-0.5">
                        <button
                          type="button"
                          onClick={() => setProfile({ ...profile, bodyFatMethod: 'navy' })}
                          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                            profile.bodyFatMethod === 'navy' ? 'bg-brand text-black font-black' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          U.S. Navy Method
                        </button>
                        <button
                          type="button"
                          onClick={() => setProfile({ ...profile, bodyFatMethod: 'deurenberg' })}
                          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                            profile.bodyFatMethod === 'deurenberg' ? 'bg-brand text-black font-black' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          Deurenberg (BMI)
                        </button>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-zinc-400 space-y-1 pt-1 border-t border-edge/60">
                      <div>• U.S. Navy Body Fat: <strong className="text-brand">{calculateBodyFat('navy')}%</strong> (Circumference-accurate)</div>
                      <div>• Deurenberg BMI Body Fat: <strong className="text-zinc-300">{calculateBodyFat('deurenberg')}%</strong> (Crude BMI reference)</div>
                    </div>
                  </div>

                  {/* Tissue Partitioning Breakdown */}
                  <div className="p-4 bg-paper border border-edge space-y-3">
                    <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">
                      Calculated Tissue Partitioning:
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center font-mono">
                      <div className="bg-black/60 p-3 border border-brand/30">
                        <span className="text-[10px] text-brand block uppercase font-bold">Lean Body Mass</span>
                        <div className="text-2xl font-black text-white mt-1">
                          {profile.unitSystem === 'metric' ? `${bodyComposition.leanMassKg} kg` : `${kgToLbs(bodyComposition.leanMassKg)} lbs`}
                        </div>
                        <span className="text-[9px] text-zinc-500">Contractile muscle, organs, bone</span>
                      </div>
                      <div className="bg-black/60 p-3 border border-edge">
                        <span className="text-[10px] text-amber-400 block uppercase font-bold">Stored Adipose Fat</span>
                        <div className="text-2xl font-black text-amber-400 mt-1">
                          {profile.unitSystem === 'metric' ? `${bodyComposition.fatMassKg} kg` : `${kgToLbs(bodyComposition.fatMassKg)} lbs`}
                        </div>
                        <span className="text-[9px] text-zinc-500">Metabolic lipid reserves</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTool === 'WHR' && (
                <>
                  <div className="flex items-center gap-2 text-brand font-mono text-xs uppercase tracking-widest font-bold">
                    <Scale size={16} /> Central Adiposity Diagnostic
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                    Waist-To-Hip Ratio (WHR) Standard
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                    According to the World Health Organization (WHO), the waist-to-hip ratio is a clinical indicator 
                    of intra-abdominal visceral adipose tissue. Central visceral fat around core organs is significantly 
                    more metabolically active and pathological than peripheral subcutaneous fat stored in the hips and thighs.
                  </p>

                  <div className="p-4 bg-black/40 border border-edge space-y-3">
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      WHO Risk Classifications:
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono text-zinc-400">
                      <div>
                        <strong className="text-brand block">Men:</strong>
                        <div>&lt; 0.90 : Low Risk</div>
                        <div>0.90 - 0.99 : Moderate Risk</div>
                        <div>&ge; 1.00 : High Risk</div>
                      </div>
                      <div>
                        <strong className="text-brand block">Women:</strong>
                        <div>&lt; 0.80 : Low Risk</div>
                        <div>0.80 - 0.84 : Moderate Risk</div>
                        <div>&ge; 0.85 : High Risk</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-paper border border-edge">
                    <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold mb-1">
                      Current Classification
                    </div>
                    <div className="text-lg font-black text-white uppercase">
                      {whrData.riskLabel}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">
                      Body Distribution: <strong className="text-brand">{whrData.distribution}</strong>
                    </div>
                  </div>
                </>
              )}

              {activeTool === 'BMI' && (
                <>
                  <div className="flex items-center gap-2 text-brand font-mono text-xs uppercase tracking-widest font-bold">
                    <User size={16} /> Anthropometric Baseline
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                    Body Mass Index (BMI) Diagnostic
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                    BMI correlates total body mass to height. While valuable for broad epidemiological screening, 
                    BMI cannot differentiate between skeletal muscle density and adipose tissue. At Mit2Fit, 
                    we cross-reference your BMI with your Waist-to-Hip ratio to prevent misdiagnosing muscular athletes.
                  </p>

                  <div className="p-4 bg-paper border border-edge space-y-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">
                      World Health Ranges
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                      <div className="bg-black/50 p-2 border border-edge">
                        <div className="text-sky-400 font-bold">&lt; 18.5</div>
                        <div className="text-[10px] text-zinc-500">Underweight</div>
                      </div>
                      <div className="bg-black/50 p-2 border border-edge">
                        <div className="text-brand font-bold">18.5 - 24.9</div>
                        <div className="text-[10px] text-zinc-500">Optimal</div>
                      </div>
                      <div className="bg-black/50 p-2 border border-edge">
                        <div className="text-amber-400 font-bold">25.0 - 29.9</div>
                        <div className="text-[10px] text-zinc-500">Overweight</div>
                      </div>
                      <div className="bg-black/50 p-2 border border-edge">
                        <div className="text-rose-500 font-bold">&ge; 30.0</div>
                        <div className="text-[10px] text-zinc-500">Obese</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTool === 'CALORIES' && (
                <>
                  <div className="flex items-center gap-2 text-brand font-mono text-xs uppercase tracking-widest font-bold">
                    <Flame size={16} /> Energetic Expenditure
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                    Mifflin-St Jeor TDEE Model
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                    Basal Metabolic Rate (BMR) represents the caloric energy required for vital autonomic functions 
                    at complete physical rest. Multiplied by your activity coefficient, Total Daily Energy Expenditure (TDEE) 
                    establishes your metabolic equilibrium point.
                  </p>
                </>
              )}

              {activeTool === 'MACROS' && (
                <>
                  <div className="flex items-center gap-2 text-brand font-mono text-xs uppercase tracking-widest font-bold">
                    <PieChart size={16} /> Substrate Partitioning
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                    Macronutrient Energy Density
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                    Protein (4 kcal/g) provides essential amino acids for myofibrillar repair and preserves lean mass. 
                    Carbohydrates (4 kcal/g) fuel high-intensity glycolytic output during progressive overload. 
                    Fats (9 kcal/g) support hormonal synthesis and fat-soluble vitamin absorption.
                  </p>
                </>
              )}

              {activeTool === 'WATER' && (
                <>
                  <div className="flex items-center gap-2 text-brand font-mono text-xs uppercase tracking-widest font-bold">
                    <Droplets size={16} /> Intracellular Hydration
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                    Volumetric Fluid Balance
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                    Even a 2% drop in baseline hydration impairs muscular torque production and central nervous system 
                    rate coding. Maintaining 33ml per kilogram of body weight ensures optimal blood plasma volume and cellular osmolarity.
                  </p>
                </>
              )}

              <div className="pt-4 border-t border-edge flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>Calculations updated in real time from baseline profile</span>
                <button
                  type="button"
                  onClick={() => setActiveTool('DASHBOARD')}
                  className="text-brand hover:underline font-bold"
                >
                  Return to Dashboard &rarr;
                </button>
              </div>

            </div>

            {/* Output Display Card */}
            <div className="lg:col-span-5 bg-black border border-edge p-6 md:p-10 relative overflow-hidden">
              <div className="space-y-6">
                
                {activeTool === 'BODYFAT' && (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                        Calculated Body Fat
                      </h3>
                      <span className="text-[10px] font-mono text-brand font-bold uppercase">
                        {profile.bodyFatMethod === 'navy' ? 'U.S. Navy Method' : 'BMI Model'}
                      </span>
                    </div>
                    <div className="text-6xl sm:text-8xl md:text-[7rem] font-black tracking-tighter leading-none text-white">
                      {calculateBodyFat()}<span className="text-4xl text-brand shrink-0">%</span>
                    </div>
                    <div className={`text-xl font-black uppercase tracking-tight italic ${getBodyFatCategory(Number(calculateBodyFat())).color}`}>
                      {getBodyFatCategory(Number(calculateBodyFat())).label}
                    </div>

                    <div className="pt-4 border-t border-edge/60 space-y-2">
                      <div className="text-xs font-mono uppercase text-zinc-500 font-bold">Mass Breakdown:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2.5 bg-paper border border-brand/20">
                          <span className="text-[10px] text-zinc-500 block">Lean Mass:</span>
                          <strong className="text-brand text-sm">
                            {profile.unitSystem === 'metric' ? `${bodyComposition.leanMassKg} kg` : `${kgToLbs(bodyComposition.leanMassKg)} lbs`}
                          </strong>
                        </div>
                        <div className="p-2.5 bg-paper border border-edge">
                          <span className="text-[10px] text-zinc-500 block">Fat Mass:</span>
                          <strong className="text-amber-400 text-sm">
                            {profile.unitSystem === 'metric' ? `${bodyComposition.fatMassKg} kg` : `${kgToLbs(bodyComposition.fatMassKg)} lbs`}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTool === 'WHR' && (
                  <>
                    <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                      Calculated Waist-to-Hip Ratio
                    </h3>
                    <div className="text-6xl sm:text-8xl md:text-[7rem] font-black tracking-tighter leading-none text-white">
                      {calculateWHR()}
                    </div>
                    <div className={`text-xl font-black uppercase tracking-tight italic ${whrData.riskColor}`}>
                      {whrData.riskLabel}
                    </div>
                    <div className="text-xs font-mono text-zinc-400">
                      Waist: {profile.unitSystem === 'metric' ? `${profile.waistCm}cm` : `${cmToIn(profile.waistCm)}in`} | 
                      Hip: {profile.unitSystem === 'metric' ? `${profile.hipCm}cm` : `${cmToIn(profile.hipCm)}in`}
                    </div>
                  </>
                )}

                {activeTool === 'BMI' && (
                  <>
                    <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                      Body Mass Index
                    </h3>
                    <div className="text-6xl sm:text-8xl md:text-[7rem] font-black tracking-tighter leading-none text-white">
                      {calculateBMI()}
                    </div>
                    <div className={`text-xl font-black uppercase tracking-tight italic ${getBMICategory(Number(calculateBMI())).color}`}>
                      {getBMICategory(Number(calculateBMI())).label}
                    </div>
                  </>
                )}

                {activeTool === 'CALORIES' && (
                  <>
                    <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                      Estimated TDEE
                    </h3>
                    <div className="text-6xl sm:text-8xl md:text-[7rem] font-black tracking-tighter leading-none uppercase text-white">
                      {calculateTDEE()}
                    </div>
                    <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest italic">
                      Calories / Day for Maintenance
                    </div>
                  </>
                )}

                {activeTool === 'MACROS' && (
                  <div className="space-y-6">
                    <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                      Daily Targets ({profile.nutritionGoal.toUpperCase()})
                    </h3>
                    <div className="text-5xl md:text-7xl font-black tracking-tighter italic text-brand leading-none">
                      {macroData.calories} <span className="text-xl text-white not-italic opacity-40">CAL/DAY</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-paper p-3 border border-edge">
                        <div className="text-xl font-black tracking-tighter text-white">{macroData.protein}g</div>
                        <div className="text-[9px] font-mono uppercase text-zinc-500 tracking-widest">Protein</div>
                      </div>
                      <div className="bg-paper p-3 border border-edge">
                        <div className="text-xl font-black tracking-tighter text-white">{macroData.fats}g</div>
                        <div className="text-[9px] font-mono uppercase text-zinc-500 tracking-widest">Fats</div>
                      </div>
                      <div className="bg-paper p-3 border border-edge">
                        <div className="text-xl font-black tracking-tighter text-white">{macroData.carbs}g</div>
                        <div className="text-[9px] font-mono uppercase text-zinc-500 tracking-widest">Carbs</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTool === 'WATER' && (
                  <>
                    <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                      Hydration Target
                    </h3>
                    <div className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white">
                      {calculateWater()}
                    </div>
                    <div className="text-xl font-black uppercase tracking-tight italic text-brand">
                      {profile.unitSystem === 'metric' ? 'Liters / Day' : 'Fl Oz / Day'}
                    </div>
                  </>
                )}

                {/* Consultation Link */}
                <Link 
                  to="/consultation"
                  className="mt-8 w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border border-edge py-4 hover:border-brand hover:text-brand transition-all font-mono"
                >
                  Optimize via Consultation <ArrowRight size={14} />
                </Link>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: LOG CHECK-IN SNAPSHOT MODAL */}
      {/* ========================================================================= */}
      {isCheckinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Log Biometric Snapshot</h3>
                  <p className="text-xs text-stone-400">Save current measurements & body composition</p>
                </div>
              </div>
              <button
                onClick={() => setIsCheckinModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3 text-xs">
              <div className="text-stone-400 uppercase tracking-wider text-[10px] font-bold">Snapshot Summary:</div>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <div>Weight: <strong className="text-white">{profile.unitSystem === 'metric' ? `${profile.weightKg} kg` : `${kgToLbs(profile.weightKg)} lbs`}</strong></div>
                <div>Body Fat: <strong className="text-brand">{calculateBodyFat()}%</strong></div>
                <div>Lean Muscle: <strong className="text-white">{profile.unitSystem === 'metric' ? `${bodyComposition.leanMassKg} kg` : `${kgToLbs(bodyComposition.leanMassKg)} lbs`}</strong></div>
                <div>Fat Mass: <strong className="text-amber-400">{profile.unitSystem === 'metric' ? `${bodyComposition.fatMassKg} kg` : `${kgToLbs(bodyComposition.fatMassKg)} lbs`}</strong></div>
                <div>Waist / WHR: <strong className="text-white">{profile.unitSystem === 'metric' ? `${profile.waistCm}cm` : `${cmToIn(profile.waistCm)}in`} / {calculateWHR()}</strong></div>
                <div>Phase: <strong className="text-brand uppercase">{profile.nutritionGoal}</strong></div>
              </div>
            </div>

            <div>
              <label className="block text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">
                Check-in Notes (Optional)
              </label>
              <textarea
                value={checkinNote}
                onChange={(e) => setCheckinNote(e.target.value)}
                placeholder="e.g. Waist down 1.5cm, strength maintained on squat and press, high energy..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-brand h-20 resize-none font-mono"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsCheckinModalOpen(false)}
                className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleLogSnapshot(checkinNote)}
                className="flex-1 py-3 bg-brand hover:brightness-110 text-black rounded-xl text-xs font-black uppercase tracking-wider transition"
              >
                Save to Timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DEVICE STORAGE & EXPORT / SHARE PORTAL (MATCHING TRACKER) */}
      {/* ========================================================================= */}
      {isDataPortalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Device Storage & Share Portal</h3>
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

            {/* Protocol Access Key Card */}
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
                  title="Generate a new key"
                >
                  <RefreshCw size={11} /> Regenerate
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-black border border-stone-800 px-3 py-2 font-mono text-brand font-bold text-sm tracking-widest text-center rounded-xl">
                  {profile.protocolKey || 'MIT-FIT-782'}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(profile.protocolKey || 'MIT-FIT-782', 'Protocol Key')}
                  className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Copy size={13} /> Copy
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-800/80">
                <span>Storage Key: <strong className="font-mono text-stone-400">{PROFILE_STORAGE_KEY}</strong></span>
                <span>Logged Check-ins: <strong className="font-mono text-brand">{history.length}</strong></span>
              </div>
            </div>

            {/* Send & Share Options */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Send & Share Options:
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    const text = formatBiometricsTextReport(profile, history[0], profile.unitSystem);
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
                    const text = formatBiometricsTextReport(profile, history[0], profile.unitSystem);
                    handleSendEmail(`MIT2FIT Biometric Performance Report`, text);
                    setIsDataPortalOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-stone-950 hover:bg-amber-950/40 border border-stone-800 hover:border-amber-500/40 rounded-xl transition text-stone-200"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Email to Coach / Self</span>
                </button>

                <button
                  onClick={() => {
                    handleCopyShareLink();
                    setIsDataPortalOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-stone-950 hover:bg-brand/10 border border-stone-800 hover:border-brand/40 rounded-xl transition text-stone-200"
                >
                  <Share2 className="w-4 h-4 text-brand" />
                  <span>Copy Share Link</span>
                </button>

                <button
                  onClick={() => {
                    const text = formatBiometricsTextReport(profile, history[0], profile.unitSystem);
                    handleCopyText(text, 'Biometric report');
                    setIsDataPortalOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl transition text-stone-200"
                >
                  <Copy className="w-4 h-4 text-zinc-300" />
                  <span>Copy Summary</span>
                </button>

                <button
                  onClick={() => {
                    exportBiometricsCSV(history, profile.unitSystem);
                    setIsDataPortalOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-stone-950 hover:bg-cyan-950/40 border border-stone-800 hover:border-cyan-500/40 rounded-xl transition text-stone-200"
                >
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  <span>Export CSV (Excel)</span>
                </button>

                <button
                  onClick={() => {
                    handleExportBackup();
                    setIsDataPortalOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl transition text-stone-200"
                >
                  <Download className="w-4 h-4 text-brand" />
                  <span>Backup File (JSON)</span>
                </button>
              </div>
            </div>

            {/* Restore from File & Danger Zone */}
            <div className="pt-3 border-t border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">Need to move profile & history to another device?</span>
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

              {history.length > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-stone-800/60">
                  <span className="text-xs text-stone-500">Accidentally logged data or want a fresh start?</span>
                  <button
                    onClick={() => {
                      setIsDataPortalOpen(false);
                      handleClearAllHistory();
                    }}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear All Check-ins
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: IN-APP CONFIRMATION MODAL (SANDBOX-SAFE, NO WINDOW.CONFIRM)     */}
      {/* ========================================================================= */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                confirmModal.isDanger ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-brand/10 text-brand border border-brand/20'
              }`}>
                {confirmModal.isDanger ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <h3 className="text-base font-bold text-white">{confirmModal.title}</h3>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              {confirmModal.message}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl border border-stone-800 text-stone-400 hover:text-white text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  confirmModal.isDanger 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20' 
                    : 'bg-brand text-black hover:brightness-110'
                }`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
