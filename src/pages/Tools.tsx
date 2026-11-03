import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
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
  ChevronRight
} from 'lucide-react';

type ToolType = 'DASHBOARD' | 'WHR' | 'BMI' | 'BODYFAT' | 'CALORIES' | 'MACROS' | 'WATER';

export default function Tools() {
  const [activeTool, setActiveTool] = useState<ToolType>('DASHBOARD');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [nutritionGoal, setNutritionGoal] = useState<'cut' | 'maintain' | 'bulk'>('maintain');
  
  // Starting Point / Baseline Profile Entry (stored in metric for calculation fidelity)
  const [weightKg, setWeightKg] = useState(76);
  const [heightCm, setHeightCm] = useState(178);
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState(1.55); // Moderately active default
  const [waistCm, setWaistCm] = useState(82); // ~32.3 inches
  const [hipCm, setHipCm] = useState(98);   // ~38.6 inches

  // Conversion Helpers
  const kgToLbs = (kg: number) => Math.round(kg * 2.20462);
  const lbsToKg = (lbs: number) => lbs / 2.20462;
  const cmToIn = (cm: number) => (cm * 0.393701).toFixed(1);
  const inToCm = (inches: number) => inches / 0.393701;

  // 1. BMI Calculation
  const calculateBMIValue = () => {
    const heightInMeters = heightCm / 100;
    return weightKg / (heightInMeters * heightInMeters);
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

  // 2. Body Fat % Calculation (Deurenberg Formula)
  const calculateBodyFatValue = () => {
    const bmi = calculateBMIValue();
    const genderFactor = gender === 'male' ? 1 : 0;
    const bodyFat = (1.20 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4;
    return Math.max(3, bodyFat);
  };

  const calculateBodyFat = () => {
    return calculateBodyFatValue().toFixed(1);
  };

  const getBodyFatCategory = (bf: number) => {
    if (gender === 'male') {
      if (bf < 6) return { label: 'Essential Fat', color: 'text-sky-400', badgeBg: 'bg-sky-400/10 border-sky-400/30' };
      if (bf < 14) return { label: 'Athletic', color: 'text-brand', badgeBg: 'bg-brand/10 border-brand/30' };
      if (bf < 18) return { label: 'Fitness', color: 'text-brand opacity-90', badgeBg: 'bg-brand/10 border-brand/30' };
      if (bf < 25) return { label: 'Moderate', color: 'text-amber-400', badgeBg: 'bg-amber-400/10 border-amber-400/30' };
      return { label: 'Elevated', color: 'text-rose-500', badgeBg: 'bg-rose-500/10 border-rose-500/30' };
    } else {
      if (bf < 14) return { label: 'Essential Fat', color: 'text-sky-400', badgeBg: 'bg-sky-400/10 border-sky-400/30' };
      if (bf < 21) return { label: 'Athletic', color: 'text-brand', badgeBg: 'bg-brand/10 border-brand/30' };
      if (bf < 25) return { label: 'Fitness', color: 'text-brand opacity-90', badgeBg: 'bg-brand/10 border-brand/30' };
      if (bf < 32) return { label: 'Moderate', color: 'text-amber-400', badgeBg: 'bg-amber-400/10 border-amber-400/30' };
      return { label: 'Elevated', color: 'text-rose-500', badgeBg: 'bg-rose-500/10 border-rose-500/30' };
    }
  };

  // 3. Waist-to-Hip Ratio (WHR) Calculation (World Health Organization Standards)
  const calculateWHRValue = () => {
    if (hipCm <= 0) return 0.85;
    return waistCm / hipCm;
  };

  const calculateWHR = () => {
    return calculateWHRValue().toFixed(2);
  };

  const getWHRAnalysis = () => {
    const whr = calculateWHRValue();
    const isMale = gender === 'male';

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
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;
    return Math.round(bmr);
  };

  const calculateTDEE = () => {
    return Math.round(calculateBMR() * activity);
  };

  // 5. Water Hydration Calculation
  const calculateWater = () => {
    const liters = weightKg * 0.033;
    return unitSystem === 'metric' ? liters.toFixed(1) : (liters * 33.814).toFixed(0);
  };

  // 6. Macro Calculation
  const calculateMacros = () => {
    const tdee = calculateTDEE();
    const ratios = {
      cut: { p: 0.35, f: 0.25, c: 0.40, calAdj: -500 },
      maintain: { p: 0.30, f: 0.30, c: 0.40, calAdj: 0 },
      bulk: { p: 0.25, f: 0.25, c: 0.50, calAdj: 300 }
    }[nutritionGoal];

    const targetCalories = Math.max(1200, tdee + ratios.calAdj);
    
    return {
      calories: targetCalories,
      protein: Math.round((targetCalories * ratios.p) / 4),
      fats: Math.round((targetCalories * ratios.f) / 9),
      carbs: Math.round((targetCalories * ratios.c) / 4)
    };
  };

  // 7. Multi-Factor Health & Fitness Profile Analysis (Cross-referencing BMI, WHR, Body Fat, and Activity)
  const getConsolidatedProfileAnalysis = () => {
    const bmi = calculateBMIValue();
    const bf = calculateBodyFatValue();
    const whrData = getWHRAnalysis();
    const isMale = gender === 'male';

    let archetype = 'Balanced Conditioning';
    let summary = '';
    let recommendation = '';
    let priority: 'strength' | 'recomp' | 'hypertrophy' | 'fat-loss' = 'recomp';

    const isAthleticBF = isMale ? bf <= 15 : bf <= 23;
    const isHighBF = isMale ? bf >= 25 : bf >= 32;
    const isLowWHR = whrData.riskLevel === 'low';
    const isHighWHR = whrData.riskLevel === 'high';

    if (bmi >= 25 && isAthleticBF && isLowWHR) {
      // High BMI due to muscle mass, not adiposity
      archetype = 'High Muscular Density (Athletic Overload)';
      summary = `Scale weight indicates a high BMI (${bmi.toFixed(1)}), but your favorable Waist-to-Hip ratio (${whrData.whr}) and low body fat (${bf.toFixed(1)}%) demonstrate substantial muscular development rather than visceral or central adiposity. Standard BMI charts falsely categorize this build as overweight.`;
      recommendation = 'Maintain heavy compound resistance training with progressive overload. Fuel with maintenance or lean surplus macros to support dense myofibrillar hypertrophy.';
      priority = 'hypertrophy';
    } else if (bmi < 25 && isHighWHR) {
      // Normal weight obesity / Central Adiposity
      archetype = 'Metabolic Caution (Normal Weight Central Adiposity)';
      summary = `While overall BMI (${bmi.toFixed(1)}) falls within standard ranges, your elevated Waist-to-Hip ratio (${whrData.whr}) indicates visceral fat deposition around core abdominal organs. This pattern is clinically correlated with insulin resistance and elevated cardiovascular strain despite normal scale weight.`;
      recommendation = 'Prioritize progressive resistance training 3-4 days/week to build metabolically active muscle, pair with daily 8k-10k step threshold and moderate carbohydrate timing.';
      priority = 'recomp';
    } else if (isHighBF || isHighWHR) {
      archetype = 'Cardio-Metabolic Optimization Required';
      summary = `Both estimated adiposity (${bf.toFixed(1)}%) and waist distribution (${whrData.whr}) indicate higher central storage. Reducing abdominal circumference through a steady nutritional deficit will drastically improve resting blood pressure, insulin sensitivity, and joint longevity.`;
      recommendation = 'Execute a structured 400-500 kcal deficit with high protein intake (1.8-2.2g/kg). Focus on resistance training to preserve lean mass while mobilizing adipose reserves.';
      priority = 'fat-loss';
    } else if (isAthleticBF && isLowWHR) {
      archetype = 'Optimal Functional Athlete';
      summary = `Your biometric markers demonstrate excellent physical conditioning. Low waist-to-hip ratio (${whrData.whr}), optimal body fat (${bf.toFixed(1)}%), and balanced BMI reflect strong cardiovascular and metabolic resilience with minimal visceral risk.`;
      recommendation = 'You are in an optimal physical baseline. Target sport-specific performance milestones, strength peaks, or structured lean mass accumulation.';
      priority = 'strength';
    } else {
      archetype = 'Healthy Baseline (Recomposition Ready)';
      summary = `Your baseline vitals are well within healthy physiological ranges. With an active energy expenditure and balanced WHR (${whrData.whr}), your metabolism is primed for body recomposition—building lean contractile mass while trimming trace abdominal fat.`;
      recommendation = 'Follow a slight caloric deficit or maintenance phase with progressive resistance programming. Track weekly waist circumference as your primary non-scale victory metric.';
      priority = 'recomp';
    }

    return { archetype, summary, recommendation, priority, whrData };
  };

  const profileAnalysis = getConsolidatedProfileAnalysis();
  const macroData = calculateMacros();
  const whrData = getWHRAnalysis();

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-32 bg-paper text-ink min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <header className="mb-10 md:mb-14 border-b border-edge pb-8 md:pb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 bg-brand rounded-full animate-pulse" />
                <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.35em]">
                  Mit2Fit Optimization Lab
                </span>
              </div>
              <h1 className="text-3xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase">
                Performance <span className="text-brand">Analytics.</span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mt-4 leading-relaxed font-sans">
                Unified biometric intelligence. Enter your baseline metrics once to generate a consolidated 
                health dashboard, waist-to-hip ratio analysis, and personalized metabolic targets.
              </p>
            </div>
            
            {/* Unit Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold tracking-widest hidden sm:inline">
                Units:
              </span>
              <div className="flex bg-surface p-1 border border-edge">
                <button 
                  onClick={() => setUnitSystem('metric')}
                  className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    unitSystem === 'metric' ? 'bg-brand text-black' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Metric (kg/cm)
                </button>
                <button 
                  onClick={() => setUnitSystem('imperial')}
                  className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    unitSystem === 'imperial' ? 'bg-brand text-black' : 'text-zinc-500 hover:text-white'
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
                <User size={14} /> Unified Starting Point Entry
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase text-white mt-1">
                Your Baseline Biometric Profile
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Adjusting values below updates the entire dashboard and individual calculator diagnostics in real time.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Gender:</span>
              <div className="flex border border-edge bg-paper p-1">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                    gender === 'male' ? 'bg-brand text-black' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                    gender === 'female' ? 'bg-brand text-black' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Weight */}
            <div className="space-y-2 bg-paper/60 p-4 border border-edge">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-zinc-500 font-bold">Weight</span>
                <span className="text-brand font-bold text-sm">
                  {unitSystem === 'metric' ? `${weightKg} kg` : `${kgToLbs(weightKg)} lbs`}
                </span>
              </div>
              <input 
                type="range" 
                min={unitSystem === 'metric' ? 40 : 90} 
                max={unitSystem === 'metric' ? 160 : 350} 
                value={unitSystem === 'metric' ? weightKg : kgToLbs(weightKg)} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWeightKg(unitSystem === 'metric' ? val : lbsToKg(val));
                }}
                className="w-full accent-brand cursor-pointer" 
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                <span>{unitSystem === 'metric' ? '40kg' : '90lbs'}</span>
                <span>{unitSystem === 'metric' ? '160kg' : '350lbs'}</span>
              </div>
            </div>

            {/* Height */}
            <div className="space-y-2 bg-paper/60 p-4 border border-edge">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-zinc-500 font-bold">Height</span>
                <span className="text-brand font-bold text-sm">
                  {unitSystem === 'metric' ? `${heightCm} cm` : `${cmToIn(heightCm)} in`}
                </span>
              </div>
              <input 
                type="range" 
                min={unitSystem === 'metric' ? 140 : 55} 
                max={unitSystem === 'metric' ? 220 : 86} 
                value={unitSystem === 'metric' ? heightCm : Number(cmToIn(heightCm))} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setHeightCm(unitSystem === 'metric' ? val : inToCm(val));
                }}
                className="w-full accent-brand cursor-pointer" 
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                <span>{unitSystem === 'metric' ? '140cm' : '55in'}</span>
                <span>{unitSystem === 'metric' ? '220cm' : '86in'}</span>
              </div>
            </div>

            {/* Waist Circumference */}
            <div className="space-y-2 bg-paper/60 p-4 border border-edge">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-zinc-500 font-bold">Waist (Narrowest / Navel)</span>
                <span className="text-brand font-bold text-sm">
                  {unitSystem === 'metric' ? `${waistCm} cm` : `${cmToIn(waistCm)} in`}
                </span>
              </div>
              <input 
                type="range" 
                min={unitSystem === 'metric' ? 50 : 20} 
                max={unitSystem === 'metric' ? 140 : 55} 
                value={unitSystem === 'metric' ? waistCm : Number(cmToIn(waistCm))} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWaistCm(unitSystem === 'metric' ? val : inToCm(val));
                }}
                className="w-full accent-brand cursor-pointer" 
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                <span>{unitSystem === 'metric' ? '50cm' : '20in'}</span>
                <span>{unitSystem === 'metric' ? '140cm' : '55in'}</span>
              </div>
            </div>

            {/* Hip Circumference */}
            <div className="space-y-2 bg-paper/60 p-4 border border-edge">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-zinc-500 font-bold">Hips (Widest Point)</span>
                <span className="text-brand font-bold text-sm">
                  {unitSystem === 'metric' ? `${hipCm} cm` : `${cmToIn(hipCm)} in`}
                </span>
              </div>
              <input 
                type="range" 
                min={unitSystem === 'metric' ? 60 : 24} 
                max={unitSystem === 'metric' ? 160 : 63} 
                value={unitSystem === 'metric' ? hipCm : Number(cmToIn(hipCm))} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setHipCm(unitSystem === 'metric' ? val : inToCm(val));
                }}
                className="w-full accent-brand cursor-pointer" 
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                <span>{unitSystem === 'metric' ? '60cm' : '24in'}</span>
                <span>{unitSystem === 'metric' ? '160cm' : '63in'}</span>
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2 bg-paper/60 p-4 border border-edge">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-zinc-500 font-bold">Age</span>
                <span className="text-brand font-bold text-sm">{age} yrs</span>
              </div>
              <input 
                type="range" 
                min="16" 
                max="85" 
                value={age} 
                onChange={(e) => setAge(Number(e.target.value))}
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
                <span className="text-brand font-bold text-sm">x{activity}</span>
              </div>
              <select 
                value={activity} 
                onChange={(e) => setActivity(Number(e.target.value))}
                className="w-full bg-black border border-edge p-2.5 text-[10px] font-mono text-zinc-300 uppercase outline-none focus:border-brand"
              >
                <option value="1.2">Sedentary (Desk Work)</option>
                <option value="1.375">Lightly Active (1-3 days/wk)</option>
                <option value="1.55">Moderately Active (3-5 days/wk)</option>
                <option value="1.725">Very Active (6-7 days/wk)</option>
                <option value="1.9">Extreme (2x Daily / Athlete)</option>
              </select>
              <div className="text-[9px] font-mono text-zinc-600">Used for BMR / TDEE calculation</div>
            </div>

            {/* Nutrition Phase Goal */}
            <div className="space-y-2 bg-paper/60 p-4 border border-edge lg:col-span-2">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-zinc-500 font-bold">Target Nutrition Phase</span>
                <span className="text-brand font-bold text-sm uppercase">{nutritionGoal}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['cut', 'maintain', 'bulk'] as const).map((g) => (
                  <button 
                    key={g}
                    type="button"
                    onClick={() => setNutritionGoal(g)}
                    className={`py-2 px-3 border text-[10px] font-black uppercase tracking-wider transition-all ${
                      nutritionGoal === g 
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
        {/* NAVIGATION: Tab Selector (Consolidated Dashboard + Individual Tools) */}
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

          <span className="text-zinc-700 mx-2 hidden sm:inline">|</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hidden sm:inline">
            Deep-Dive Calculators:
          </span>

          {[
            { id: 'WHR', icon: <Scale size={14} />, label: 'Waist-to-Hip' },
            { id: 'BMI', icon: <User size={14} />, label: 'BMI' },
            { id: 'BODYFAT', icon: <Calculator size={14} />, label: 'Body Fat %' },
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
                  {unitSystem === 'metric' ? `${weightKg}kg / ${heightCm}cm` : `${kgToLbs(weightKg)}lbs / ${cmToIn(heightCm)}in`}
                </div>
              </div>

              {/* Body Fat % Tile */}
              <div 
                onClick={() => setActiveTool('BODYFAT')}
                className="bg-surface border border-edge p-5 hover:border-brand/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Body Fat Est.</span>
                  <Calculator size={14} className="text-brand group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl font-black tracking-tight text-white mb-2">
                  {calculateBodyFat()}<span className="text-base text-brand ml-0.5">%</span>
                </div>
                <div className={`inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold border ${getBodyFatCategory(Number(calculateBodyFat())).badgeBg} ${getBodyFatCategory(Number(calculateBodyFat())).color}`}>
                  {getBodyFatCategory(Number(calculateBodyFat())).label}
                </div>
                <div className="mt-3 text-[10px] font-mono text-zinc-500">
                  Age {age} • {gender.toUpperCase()}
                </div>
              </div>

              {/* TDEE / Maintenance Tile */}
              <div 
                onClick={() => setActiveTool('CALORIES')}
                className="bg-surface border border-edge p-5 hover:border-brand/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">TDEE / Cal</span>
                  <Flame size={14} className="text-brand group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl font-black tracking-tight text-white mb-2">
                  {calculateTDEE()}
                </div>
                <div className="inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold border border-zinc-700 bg-zinc-800 text-zinc-300">
                  BMR: {calculateBMR()} cal
                </div>
                <div className="mt-3 text-[10px] font-mono text-zinc-500">
                  Activity Factor x{activity}
                </div>
              </div>

              {/* Target Calories & Goal Tile */}
              <div 
                onClick={() => setActiveTool('MACROS')}
                className="bg-surface border border-edge p-5 hover:border-brand/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Daily Macro Cal</span>
                  <PieChart size={14} className="text-brand group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl font-black tracking-tight text-brand mb-2">
                  {macroData.calories}
                </div>
                <div className="inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold border border-brand/30 bg-brand/10 text-brand">
                  {nutritionGoal.toUpperCase()} PHASE
                </div>
                <div className="mt-3 text-[10px] font-mono text-zinc-500">
                  P:{macroData.protein}g • F:{macroData.fats}g • C:{macroData.carbs}g
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
                  {calculateWater()}<span className="text-sm text-zinc-400 font-mono ml-1">{unitSystem === 'metric' ? 'L' : 'oz'}</span>
                </div>
                <div className="inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold border border-sky-500/30 bg-sky-500/10 text-sky-400">
                  DAILY INTAKE
                </div>
                <div className="mt-3 text-[10px] font-mono text-zinc-500">
                  Total Mass Indexed
                </div>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* INTEGRATED HEALTH & FITNESS PROFILE RISK ANALYSIS CARD */}
            {/* ========================================================================= */}
            <div className="bg-surface border border-edge overflow-hidden">
              <div className="p-6 md:p-8 border-b border-edge bg-black/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-brand/10 border border-brand/40 flex items-center justify-center text-brand">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand font-black block">
                      Multi-Factor Biometric Synthesis
                    </span>
                    <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase text-white">
                      Consolidated Health & Fitness Risk Analysis
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
                      Cross-Indexed Physiological Evaluation
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
                        <span>Low Risk (&lt;{gender === 'male' ? '0.90' : '0.80'})</span>
                        <span>High Risk (&ge;{gender === 'male' ? '1.00' : '0.85'})</span>
                      </div>
                    </div>

                    <div className="p-4 bg-black/50 border border-edge space-y-2">
                      <div className="flex justify-between text-[10px] font-mono uppercase">
                        <span className="text-zinc-400">Body Fat Percentage</span>
                        <span className="font-bold text-brand">{calculateBodyFat()}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 overflow-hidden flex">
                        <div className="bg-brand h-full" style={{ width: `${Math.min(100, Math.max(10, (calculateBodyFatValue() / 40) * 100))}%` }} />
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                        <span>Athletic (&lt;{gender === 'male' ? '14%' : '21%'})</span>
                        <span>Elevated (&gt;{gender === 'male' ? '25%' : '32%'})</span>
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
                      {nutritionGoal.toUpperCase()}
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
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-brand inline-block rounded-full" /> Pro</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-400 inline-block rounded-full" /> Fat</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-sky-400 inline-block rounded-full" /> Carb</span>
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

            {/* Quick Link to Exercise Tracker */}
            <div className="bg-surface border border-edge p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-brand/10 border border-brand/30 flex items-center justify-center text-brand">
                  <Dumbbell size={22} />
                </div>
                <div>
                  <h4 className="text-base font-black uppercase tracking-tight text-white">
                    Apply Calculated Metrics In Exercise Tracker
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Manage active routines, log custom exercises, view animated biomechanics, and apply 1-tap progressive overload.
                  </p>
                </div>
              </div>

              <Link
                to="/tracker"
                className="px-6 py-3 bg-white text-black hover:bg-brand transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 shrink-0"
              >
                Open Workout Tracker <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: INDIVIDUAL CALCULATOR DEEP DIVES */}
        {/* ========================================================================= */}
        {activeTool !== 'DASHBOARD' && (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sidebar quick switch */}
            <div className="lg:col-span-3 space-y-1">
              <button
                onClick={() => setActiveTool('DASHBOARD')}
                className="w-full p-4 flex items-center gap-3 text-xs font-black uppercase tracking-wider bg-surface border border-edge text-brand hover:bg-brand hover:text-black transition-all mb-4"
              >
                <Layers size={16} /> ← Return To Dashboard
              </button>

              {[
                { id: 'WHR', icon: <Scale size={16} />, label: 'Waist-to-Hip Ratio' },
                { id: 'BMI', icon: <User size={16} />, label: 'Body Mass Index' },
                { id: 'BODYFAT', icon: <Calculator size={16} />, label: 'Body Fat %' },
                { id: 'CALORIES', icon: <Flame size={16} />, label: 'Metabolism / TDEE' },
                { id: 'MACROS', icon: <PieChart size={16} />, label: 'Macronutrients' },
                { id: 'WATER', icon: <Droplets size={16} />, label: 'Hydration Target' },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id as ToolType)}
                  className={`w-full p-4 flex items-center justify-between text-xs font-black uppercase tracking-wider transition-all border ${
                    activeTool === tool.id 
                      ? 'bg-brand text-black border-brand' 
                      : 'bg-surface text-zinc-400 hover:text-white border-edge'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {tool.icon} {tool.label}
                  </span>
                  <ChevronRight size={14} />
                </button>
              ))}

              <Link
                to="/tracker"
                className="w-full p-4 mt-6 flex flex-col gap-1 bg-brand/10 border border-brand/40 text-brand hover:bg-brand hover:text-black transition-all group block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Dumbbell size={14} /> Workout Tracker
                  </span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-[9px] font-mono uppercase text-zinc-400 group-hover:text-black">
                  Active routines, sets & history auto-fill →
                </span>
              </Link>
            </div>

            {/* Individual Tool Details Card */}
            <div className="lg:col-span-9 bg-surface border border-edge p-6 md:p-12">
              <motion.div
                key={activeTool + unitSystem}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-2 gap-10 md:gap-14 items-center"
              >
                {/* Left Controls & Context */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-brand font-mono text-[10px] uppercase tracking-widest font-bold">
                    <Calculator size={14} /> Deep-Dive Configuration
                  </div>

                  {/* WHR SPECIFIC VIEW */}
                  {activeTool === 'WHR' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                          Waist-To-Hip Ratio (WHR)
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          WHR is recognized by the World Health Organization as a superior indicator of visceral adiposity 
                          and cardiovascular risk compared to standard BMI, identifying abdominal fat vs peripheral fat distribution.
                        </p>
                      </div>

                      <div className="space-y-4 bg-paper p-4 border border-edge">
                        <div className="flex justify-between text-[10px] font-mono uppercase">
                          <span className="text-zinc-500 font-bold">Waist: {unitSystem === 'metric' ? `${waistCm}cm` : `${cmToIn(waistCm)}in`}</span>
                          <span className="text-zinc-500 font-bold">Hips: {unitSystem === 'metric' ? `${hipCm}cm` : `${cmToIn(hipCm)}in`}</span>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-mono uppercase text-zinc-500">Waist Circumference</label>
                          <input 
                            type="range" 
                            min={unitSystem === 'metric' ? 50 : 20} 
                            max={unitSystem === 'metric' ? 140 : 55} 
                            value={unitSystem === 'metric' ? waistCm : Number(cmToIn(waistCm))} 
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setWaistCm(unitSystem === 'metric' ? val : inToCm(val));
                            }}
                            className="w-full accent-brand" 
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-mono uppercase text-zinc-500">Hip Circumference</label>
                          <input 
                            type="range" 
                            min={unitSystem === 'metric' ? 60 : 24} 
                            max={unitSystem === 'metric' ? 160 : 63} 
                            value={unitSystem === 'metric' ? hipCm : Number(cmToIn(hipCm))} 
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setHipCm(unitSystem === 'metric' ? val : inToCm(val));
                            }}
                            className="w-full accent-brand" 
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-black/40 border border-edge text-[10px] font-mono text-zinc-400 space-y-1">
                        <div>• WHO Normal/Low: Men &lt; 0.90 | Women &lt; 0.80</div>
                        <div>• WHO Moderate: Men 0.90-0.99 | Women 0.80-0.84</div>
                        <div>• WHO High Risk: Men &ge; 1.00 | Women &ge; 0.85</div>
                      </div>
                    </div>
                  )}

                  {/* BMI SPECIFIC VIEW */}
                  {activeTool === 'BMI' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                          Body Mass Index (BMI)
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          A baseline ratio of mass to height. While useful for general epidemiological baselines, 
                          athletes should cross-reference with WHR and Body Fat to avoid muscle mass false-positives.
                        </p>
                      </div>

                      <div className="space-y-4 bg-paper p-4 border border-edge">
                        <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
                          <span>Weight: {unitSystem === 'metric' ? `${weightKg}kg` : `${kgToLbs(weightKg)}lbs`}</span>
                          <span>Height: {unitSystem === 'metric' ? `${heightCm}cm` : `${cmToIn(heightCm)}in`}</span>
                        </div>
                        <input 
                          type="range" 
                          min={unitSystem === 'metric' ? 40 : 90} 
                          max={unitSystem === 'metric' ? 150 : 330} 
                          value={unitSystem === 'metric' ? weightKg : kgToLbs(weightKg)} 
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setWeightKg(unitSystem === 'metric' ? val : lbsToKg(val));
                          }}
                          className="w-full accent-brand" 
                        />
                        <input 
                          type="range" 
                          min={unitSystem === 'metric' ? 140 : 55} 
                          max={unitSystem === 'metric' ? 220 : 86} 
                          value={unitSystem === 'metric' ? heightCm : Number(cmToIn(heightCm))} 
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setHeightCm(unitSystem === 'metric' ? val : inToCm(val));
                          }}
                          className="w-full accent-brand" 
                        />
                      </div>
                    </div>
                  )}

                  {/* BODY FAT SPECIFIC VIEW */}
                  {activeTool === 'BODYFAT' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                          Body Fat Estimation
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          Calculated via the Deurenberg formula factoring in sex-specific fat distribution, age, and height-to-weight proportions.
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <button 
                          onClick={() => setGender('male')}
                          className={`flex-1 p-3 border text-[10px] font-black uppercase tracking-widest transition-all ${
                            gender === 'male' ? 'border-brand text-brand bg-brand/5' : 'border-edge text-zinc-600'
                          }`}
                        >
                          MALE
                        </button>
                        <button 
                          onClick={() => setGender('female')}
                          className={`flex-1 p-3 border text-[10px] font-black uppercase tracking-widest transition-all ${
                            gender === 'female' ? 'border-brand text-brand bg-brand/5' : 'border-edge text-zinc-600'
                          }`}
                        >
                          FEMALE
                        </button>
                      </div>

                      <div className="space-y-4 bg-paper p-4 border border-edge">
                        <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
                          <span>Age: {age} yrs</span>
                          <span>Weight: {unitSystem === 'metric' ? `${weightKg}kg` : `${kgToLbs(weightKg)}lbs`}</span>
                        </div>
                        <input 
                          type="range" min="15" max="80" value={age} 
                          onChange={(e) => setAge(Number(e.target.value))}
                          className="w-full accent-brand" 
                        />
                        <input 
                          type="range" 
                          min={unitSystem === 'metric' ? 40 : 90} 
                          max={unitSystem === 'metric' ? 150 : 330} 
                          value={unitSystem === 'metric' ? weightKg : kgToLbs(weightKg)} 
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setWeightKg(unitSystem === 'metric' ? val : lbsToKg(val));
                          }}
                          className="w-full accent-brand" 
                        />
                      </div>
                    </div>
                  )}

                  {/* CALORIES / TDEE SPECIFIC VIEW */}
                  {activeTool === 'CALORIES' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                          Metabolic Expenditure
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          Mifflin-St Jeor equation calculating Basal Metabolic Rate (BMR) scaled by physical activity coefficient.
                        </p>
                      </div>

                      <div className="space-y-4 bg-paper p-4 border border-edge">
                        <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
                          <span>Activity Factor: x{activity}</span>
                        </div>
                        <select 
                          value={activity} 
                          onChange={(e) => setActivity(Number(e.target.value))}
                          className="w-full bg-black border border-edge p-3 text-[10px] font-mono text-zinc-300 uppercase outline-none focus:border-brand"
                        >
                          <option value="1.2">Sedentary (Desk work)</option>
                          <option value="1.375">Lightly Active (1-3 days/wk)</option>
                          <option value="1.55">Moderately Active (3-5 days/wk)</option>
                          <option value="1.725">Very Active (6-7 days/wk)</option>
                          <option value="1.9">Extreme Athlete (2x training/day)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* MACROS SPECIFIC VIEW */}
                  {activeTool === 'MACROS' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                          Macronutrient Allocation
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          High-protein partitioned macronutrient ratios tailored for muscle retention and metabolic efficiency.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {(['cut', 'maintain', 'bulk'] as const).map((g) => (
                          <button 
                            key={g}
                            onClick={() => setNutritionGoal(g)}
                            className={`flex-1 p-3 border text-[10px] font-black uppercase tracking-widest transition-all ${
                              nutritionGoal === g ? 'border-brand text-brand bg-brand/10' : 'border-edge text-zinc-600'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WATER SPECIFIC VIEW */}
                  {activeTool === 'WATER' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                          Hydration Index
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          Baseline water intake scaled to intracellular hydration demands of lean mass.
                        </p>
                      </div>
                      <div className="p-4 bg-paper border border-edge text-xs font-mono text-zinc-400">
                        Total Body Weight: {unitSystem === 'metric' ? `${weightKg} kg` : `${kgToLbs(weightKg)} lbs`}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-edge flex items-center gap-3 text-zinc-600">
                    <Info size={16} />
                    <p className="text-[9px] uppercase tracking-widest font-mono">
                      All variables synchronize automatically with the Consolidated Dashboard.
                    </p>
                  </div>
                </div>

                {/* Right Result Display Box */}
                <div className="bg-black border border-edge p-8 md:p-12 text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 -skew-x-[20deg] translate-x-1/2 -translate-y-1/2 group-hover:bg-brand/10 transition-colors" />

                  {activeTool === 'WHR' && (
                    <>
                      <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Waist-To-Hip Ratio</h3>
                      <div className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter mb-4 text-white">
                        {calculateWHR()}
                      </div>
                      <div className={`text-xl font-black uppercase tracking-tighter italic mb-2 ${whrData.riskColor}`}>
                        {whrData.riskLabel}
                      </div>
                      <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                        Fat Distribution: {whrData.distribution}
                      </div>
                    </>
                  )}

                  {activeTool === 'BMI' && (
                    <>
                      <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Your BMI Estimate</h3>
                      <div className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter mb-4">{calculateBMI()}</div>
                      <div className={`text-xl font-black uppercase tracking-tighter italic ${getBMICategory(Number(calculateBMI())).color}`}>
                        {getBMICategory(Number(calculateBMI())).label}
                      </div>
                    </>
                  )}

                  {activeTool === 'BODYFAT' && (
                    <>
                      <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Estimated Body Fat</h3>
                      <div className="text-6xl sm:text-8xl md:text-[7rem] font-black tracking-tighter mb-4 leading-none">{calculateBodyFat()}<span className="text-4xl text-brand shrink-0">%</span></div>
                      <div className={`text-xl font-black uppercase tracking-tighter italic ${getBodyFatCategory(Number(calculateBodyFat())).color}`}>
                        {getBodyFatCategory(Number(calculateBodyFat())).label}
                      </div>
                    </>
                  )}

                  {activeTool === 'CALORIES' && (
                    <>
                      <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Estimated TDEE</h3>
                      <div className="text-6xl sm:text-8xl md:text-[7rem] font-black tracking-tighter mb-4 leading-none uppercase">{calculateTDEE()}</div>
                      <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest italic">Calories / Day for Maintenance</div>
                    </>
                  )}

                  {activeTool === 'MACROS' && (
                    <div className="space-y-6">
                      <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Daily Targets</h3>
                      <div className="text-5xl md:text-7xl font-black tracking-tighter mb-6 italic text-brand leading-none">
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
                      <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Hydration Target</h3>
                      <div className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter mb-4">{calculateWater()}</div>
                      <div className="text-xl font-black uppercase tracking-tighter italic text-brand">
                        {unitSystem === 'metric' ? 'Liters / Day' : 'Fl Oz / Day'}
                      </div>
                    </>
                  )}

                  <Link 
                    to="/consultation"
                    className="mt-10 w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border border-edge py-4 hover:border-brand hover:text-brand transition-all font-mono"
                  >
                    Optimize via Consultation <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
