/**
 * MIT2FIT Unified Fitness & Biometrics Persistence Engine
 * Seamless, zero-login, 100% private client-side storage
 * Synchronizes profiles, snapshots, body composition, and history across Tools, Dashboard, and Tracker.
 */

export type BodyFatMethod = 'navy' | 'deurenberg';

export interface BiometricProfile {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'male' | 'female';
  activity: number;
  waistCm: number;
  hipCm: number;
  neckCm: number; // For U.S. Navy Anthropometric Body Composition formula
  bodyFatMethod: BodyFatMethod;
  unitSystem: 'metric' | 'imperial';
  nutritionGoal: 'cut' | 'maintain' | 'bulk';
  protocolKey?: string;
  notes?: string;
  updatedAt: string;
}

export interface BiometricSnapshot {
  id: string;
  date: string; // ISO string
  weightKg: number;
  heightCm: number;
  waistCm: number;
  hipCm: number;
  neckCm: number;
  whr: number;
  bmi: number;
  bodyFat: number;
  leanMassKg: number;
  fatMassKg: number;
  bodyFatMethod: BodyFatMethod;
  tdee: number;
  targetCalories: number;
  goal: 'cut' | 'maintain' | 'bulk';
  notes?: string;
}

export const PROFILE_STORAGE_KEY = 'mit2fit_biometric_profile_v2';
export const HISTORY_STORAGE_KEY = 'mit2fit_biometric_history_v2';
export const PROTOCOL_KEY_STORAGE = 'mit2fit_protocol_key';

// Standard international conversion constants
export const CM_PER_INCH = 2.54;
export const LBS_PER_KG = 2.20462262;

export const cmToIn = (cm: number): string => (cm / CM_PER_INCH).toFixed(1);
export const inToCm = (inches: number): number => Math.round((inches * CM_PER_INCH) * 10) / 10;
export const kgToLbs = (kg: number): number => Math.round((kg * LBS_PER_KG) * 10) / 10;
export const lbsToKg = (lbs: number): number => Math.round((lbs / LBS_PER_KG) * 10) / 10;

export const DEFAULT_PROFILE: BiometricProfile = {
  weightKg: 76,
  heightCm: 178,
  age: 28,
  gender: 'male',
  activity: 1.55,
  waistCm: 82,
  hipCm: 98,
  neckCm: 38,
  bodyFatMethod: 'navy',
  unitSystem: 'metric',
  nutritionGoal: 'maintain',
  protocolKey: 'MIT-FIT-782',
  updatedAt: new Date().toISOString()
};

/**
 * U.S. Navy Anthropometric Body Fat Formula
 * Accounts directly for circumferences (waist, neck, hip) vs height.
 * Captures true adipose reduction when muscle is maintained, unlike crude BMI models.
 */
export function calculateNavyBodyFat(
  gender: 'male' | 'female',
  heightCm: number,
  waistCm: number,
  hipCm: number,
  neckCm: number
): number {
  if (heightCm <= 0 || waistCm <= 0 || neckCm <= 0) return 15.0;

  if (gender === 'male') {
    const diff = waistCm - neckCm;
    if (diff <= 0) return 6.0;
    // Siri Body Density Equation for Men (Hodgdon & Beckett / Naval Health Research Center)
    const density = 1.0324 - (0.19077 * Math.log10(diff)) + (0.15456 * Math.log10(heightCm));
    const bf = (495 / density) - 450;
    return Math.max(3.0, Math.min(55.0, Math.round(bf * 10) / 10));
  } else {
    const circ = waistCm + hipCm - neckCm;
    if (circ <= 0) return 14.0;
    // Siri Body Density Equation for Women
    const density = 1.29579 - (0.35004 * Math.log10(circ)) + (0.22100 * Math.log10(heightCm));
    const bf = (495 / density) - 450;
    return Math.max(8.0, Math.min(60.0, Math.round(bf * 10) / 10));
  }
}

/**
 * Deurenberg BMI-based formula (baseline reference)
 */
export function calculateDeurenbergBodyFat(
  gender: 'male' | 'female',
  age: number,
  bmi: number
): number {
  const genderFactor = gender === 'male' ? 1 : 0;
  const bf = (1.20 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4;
  return Math.max(3.0, Math.round(bf * 10) / 10);
}

/**
 * Partition weight into Lean Body Mass (LBM) and Fat Mass (FM)
 */
export function calculateBodyComposition(weightKg: number, bodyFatPct: number) {
  const fatMassKg = Math.round((weightKg * (bodyFatPct / 100)) * 10) / 10;
  const leanMassKg = Math.round((weightKg - fatMassKg) * 10) / 10;
  return { leanMassKg, fatMassKg };
}

export interface RecompositionAnalysis {
  deltaWeightKg: number;
  deltaFatMassKg: number;
  deltaLeanMassKg: number;
  classification: 'elite_recomp' | 'clean_fat_loss' | 'lean_hypertrophy' | 'catabolic_loss' | 'neutral';
  headline: string;
  detail: string;
}

/**
 * Evaluates whether weight loss preserved muscle or suffered catabolism
 */
export function evaluateRecompositionDelta(
  current: BiometricSnapshot,
  previous: BiometricSnapshot
): RecompositionAnalysis {
  const deltaWeightKg = Math.round((current.weightKg - previous.weightKg) * 10) / 10;
  const deltaFatMassKg = Math.round((current.fatMassKg - previous.fatMassKg) * 10) / 10;
  const deltaLeanMassKg = Math.round((current.leanMassKg - previous.leanMassKg) * 10) / 10;

  if (deltaWeightKg < 0) {
    // Weight was lost
    if (deltaFatMassKg < 0 && deltaLeanMassKg >= 0) {
      return {
        deltaWeightKg,
        deltaFatMassKg,
        deltaLeanMassKg,
        classification: 'elite_recomp',
        headline: 'Elite Muscle Recomposition',
        detail: `100% of weight lost was adipose tissue (-${Math.abs(deltaFatMassKg)} kg fat), while preserving or adding +${deltaLeanMassKg} kg of dense lean contractile mass.`
      };
    } else if (deltaFatMassKg < 0 && deltaLeanMassKg > -0.4) {
      return {
        deltaWeightKg,
        deltaFatMassKg,
        deltaLeanMassKg,
        classification: 'clean_fat_loss',
        headline: 'High-Fidelity Adipose Depletion',
        detail: `Dominant fat oxidation (-${Math.abs(deltaFatMassKg)} kg fat) with minimal lean mass fluctuation (-${Math.abs(deltaLeanMassKg)} kg). Excellent muscular retention.`
      };
    } else if (deltaLeanMassKg <= -0.5 && deltaFatMassKg >= 0) {
      return {
        deltaWeightKg,
        deltaFatMassKg,
        deltaLeanMassKg,
        classification: 'catabolic_loss',
        headline: 'Catabolic Muscle Loss Warning',
        detail: `Weight dropped but fat mass was preserved, resulting in -${Math.abs(deltaLeanMassKg)} kg of lean tissue loss. Increase dietary protein (2g/kg) and progressive resistance load.`
      };
    } else {
      return {
        deltaWeightKg,
        deltaFatMassKg,
        deltaLeanMassKg,
        classification: 'clean_fat_loss',
        headline: 'Caloric Deficit Depletion',
        detail: `Lost ${Math.abs(deltaFatMassKg)} kg fat and ${Math.abs(deltaLeanMassKg)} kg lean weight (glycogen/water/contractile).`
      };
    }
  } else if (deltaWeightKg > 0) {
    // Weight was gained
    if (deltaLeanMassKg > deltaFatMassKg && deltaLeanMassKg > 0) {
      return {
        deltaWeightKg,
        deltaFatMassKg,
        deltaLeanMassKg,
        classification: 'lean_hypertrophy',
        headline: 'Lean Hypertrophic Accumulation',
        detail: `High tissue partitioning efficiency: +${deltaLeanMassKg} kg of new lean mass added with only +${Math.max(0, deltaFatMassKg)} kg fat.`
      };
    } else {
      return {
        deltaWeightKg,
        deltaFatMassKg,
        deltaLeanMassKg,
        classification: 'neutral',
        headline: 'Caloric Surplus Accrual',
        detail: `Weight increased by +${deltaWeightKg} kg (+${deltaFatMassKg} kg fat, +${deltaLeanMassKg} kg lean).`
      };
    }
  }

  return {
    deltaWeightKg,
    deltaFatMassKg,
    deltaLeanMassKg,
    classification: 'neutral',
    headline: 'Biometric Maintenance',
    detail: 'Weight and tissue partitioning remain completely stable.'
  };
}

// Seed realistic progression history showing true muscle preservation & recomposition
export const SEED_BIOMETRIC_HISTORY: BiometricSnapshot[] = [
  {
    id: 'snap-seed-1',
    date: new Date(Date.now() - 21 * 86400000).toISOString(),
    weightKg: 78.2,
    heightCm: 178,
    waistCm: 85.0,
    hipCm: 98.0,
    neckCm: 38.0,
    whr: 0.87,
    bmi: 24.7,
    bodyFat: 15.6,
    leanMassKg: 66.0,
    fatMassKg: 12.2,
    bodyFatMethod: 'navy',
    tdee: 2580,
    targetCalories: 2080,
    goal: 'cut',
    notes: 'Starting baseline check-in. Initiated high-protein resistance training & 400 kcal deficit.'
  },
  {
    id: 'snap-seed-2',
    date: new Date(Date.now() - 10 * 86400000).toISOString(),
    weightKg: 77.0,
    heightCm: 178,
    waistCm: 83.0,
    hipCm: 98.0,
    neckCm: 38.0,
    whr: 0.85,
    bmi: 24.3,
    bodyFat: 14.1,
    leanMassKg: 66.1,
    fatMassKg: 10.9,
    bodyFatMethod: 'navy',
    tdee: 2550,
    targetCalories: 2050,
    goal: 'cut',
    notes: 'Waist down 2cm. Compound lifts intact. 100% of weight lost was adipose tissue (Lean mass preserved).'
  },
  {
    id: 'snap-seed-3',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    weightKg: 76.0,
    heightCm: 178,
    waistCm: 81.5,
    hipCm: 98.0,
    neckCm: 38.2,
    whr: 0.83,
    bmi: 24.0,
    bodyFat: 12.8,
    leanMassKg: 66.3,
    fatMassKg: 9.7,
    bodyFatMethod: 'navy',
    tdee: 2520,
    targetCalories: 2520,
    goal: 'maintain',
    notes: 'Elite recomposition achieved. Waist-to-hip ratio 0.83, body fat 12.8% while adding 0.3kg lean muscle.'
  }
];

export function generateProtocolKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const num = Math.floor(100 + Math.random() * 900);
  return `MIT-${rand}-${num}`;
}

export function loadStoredProtocolKey(): string {
  try {
    const saved = localStorage.getItem(PROTOCOL_KEY_STORAGE);
    if (saved && saved.trim().length > 0) {
      return saved.trim().toUpperCase();
    }
  } catch (e) {
    console.error('Failed to read protocol key', e);
  }
  const fresh = generateProtocolKey();
  try {
    localStorage.setItem(PROTOCOL_KEY_STORAGE, fresh);
  } catch (e) {}
  return fresh;
}

export function saveStoredProtocolKey(key: string): void {
  try {
    localStorage.setItem(PROTOCOL_KEY_STORAGE, key.toUpperCase());
  } catch (e) {
    console.error('Failed to save protocol key', e);
  }
}

export function loadStoredProfile(): BiometricProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.weightKg === 'number') {
        const key = parsed.protocolKey || loadStoredProtocolKey();
        return {
          ...DEFAULT_PROFILE,
          neckCm: parsed.neckCm || (parsed.gender === 'female' ? 34 : 38),
          bodyFatMethod: parsed.bodyFatMethod || 'navy',
          ...parsed,
          protocolKey: key
        };
      }
    }
  } catch (e) {
    console.error('Failed to load profile', e);
  }
  const key = loadStoredProtocolKey();
  return { ...DEFAULT_PROFILE, protocolKey: key };
}

export function saveStoredProfile(profile: BiometricProfile): void {
  try {
    const updated = {
      ...profile,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    if (profile.protocolKey) {
      localStorage.setItem(PROTOCOL_KEY_STORAGE, profile.protocolKey);
    }
  } catch (e) {
    console.error('Failed to persist profile', e);
  }
}

export function loadStoredBiometricHistory(): BiometricSnapshot[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure snapshots have leanMassKg and fatMassKg
        return parsed.map((item: any) => {
          const bf = item.bodyFat || 15;
          const { leanMassKg, fatMassKg } = calculateBodyComposition(item.weightKg, bf);
          return {
            ...item,
            neckCm: item.neckCm || 38,
            bodyFatMethod: item.bodyFatMethod || 'navy',
            leanMassKg: item.leanMassKg || leanMassKg,
            fatMassKg: item.fatMassKg || fatMassKg
          };
        });
      }
    }
  } catch (e) {
    console.error('Failed to load biometric history', e);
  }
  return SEED_BIOMETRIC_HISTORY;
}

export function saveStoredBiometricHistory(history: BiometricSnapshot[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save biometric history', e);
  }
}

export function exportBiometricsCSV(history: BiometricSnapshot[], unitSystem: 'metric' | 'imperial' = 'metric') {
  let csv = 'Date,Weight,Height,Waist,Hip,Neck,WHR,BMI,BodyFat_Pct,Method,LeanMass,FatMass,TDEE,Target_Calories,Goal,Notes\n';
  history.forEach(item => {
    const date = new Date(item.date).toISOString().split('T')[0];
    const weightStr = unitSystem === 'metric' ? `${item.weightKg} kg` : `${kgToLbs(item.weightKg)} lbs`;
    const heightStr = unitSystem === 'metric' ? `${item.heightCm} cm` : `${cmToIn(item.heightCm)} in`;
    const waistStr = unitSystem === 'metric' ? `${item.waistCm} cm` : `${cmToIn(item.waistCm)} in`;
    const hipStr = unitSystem === 'metric' ? `${item.hipCm} cm` : `${cmToIn(item.hipCm)} in`;
    const neckStr = unitSystem === 'metric' ? `${item.neckCm || 38} cm` : `${cmToIn(item.neckCm || 38)} in`;
    const leanStr = unitSystem === 'metric' ? `${item.leanMassKg} kg` : `${kgToLbs(item.leanMassKg)} lbs`;
    const fatStr = unitSystem === 'metric' ? `${item.fatMassKg} kg` : `${kgToLbs(item.fatMassKg)} lbs`;
    const notesClean = (item.notes || '').replace(/"/g, '""');

    csv += `"${date}","${weightStr}","${heightStr}","${waistStr}","${hipStr}","${neckStr}",${item.whr},${item.bmi},${item.bodyFat},"${item.bodyFatMethod || 'navy'}","${leanStr}","${fatStr}",${item.tdee},${item.targetCalories},"${item.goal}","${notesClean}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mit2fit-biometrics-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function formatBiometricsTextReport(
  profile: BiometricProfile,
  latestSnapshot?: BiometricSnapshot | null,
  unitSystem: 'metric' | 'imperial' = 'metric'
): string {
  const dateStr = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const weightDisplay = unitSystem === 'metric' 
    ? `${profile.weightKg} kg` 
    : `${kgToLbs(profile.weightKg)} lbs`;
  const waistDisplay = unitSystem === 'metric' 
    ? `${profile.waistCm} cm` 
    : `${cmToIn(profile.waistCm)} in`;
  const hipDisplay = unitSystem === 'metric' 
    ? `${profile.hipCm} cm` 
    : `${cmToIn(profile.hipCm)} in`;
  const neckDisplay = unitSystem === 'metric' 
    ? `${profile.neckCm} cm` 
    : `${cmToIn(profile.neckCm)} in`;

  const whr = (profile.hipCm > 0 ? profile.waistCm / profile.hipCm : 0.85).toFixed(2);
  const heightM = profile.heightCm / 100;
  const bmi = (profile.weightKg / (heightM * heightM)).toFixed(1);
  
  const bodyFat = profile.bodyFatMethod === 'navy'
    ? calculateNavyBodyFat(profile.gender, profile.heightCm, profile.waistCm, profile.hipCm, profile.neckCm)
    : calculateDeurenbergBodyFat(profile.gender, profile.age, Number(bmi));

  const { leanMassKg, fatMassKg } = calculateBodyComposition(profile.weightKg, bodyFat);
  const leanDisplay = unitSystem === 'metric' ? `${leanMassKg} kg` : `${kgToLbs(leanMassKg)} lbs`;
  const fatDisplay = unitSystem === 'metric' ? `${fatMassKg} kg` : `${kgToLbs(fatMassKg)} lbs`;

  let txt = `📊 MIT2FIT Biometric Performance Report\n`;
  txt += `🔑 Protocol Key: ${profile.protocolKey || 'MIT-SECURE'}\n`;
  txt += `📅 Date: ${dateStr}\n\n`;

  txt += `⚡ Biometric & Body Composition Baseline:\n`;
  txt += `• Weight: ${weightDisplay} | Height: ${profile.heightCm} cm\n`;
  txt += `• Age: ${profile.age} yrs | Gender: ${profile.gender.toUpperCase()}\n`;
  txt += `• Waist: ${waistDisplay} | Hip: ${hipDisplay} | Neck: ${neckDisplay}\n`;
  txt += `• Waist-to-Hip Ratio (WHR): ${whr}\n`;
  txt += `• Body Fat (${profile.bodyFatMethod === 'navy' ? 'U.S. Navy Anthropometric' : 'Deurenberg'}): ${bodyFat}%\n`;
  txt += `• Lean Muscle & Bone Mass: ${leanDisplay}\n`;
  txt += `• Stored Fat Mass: ${fatDisplay}\n`;
  txt += `• BMI: ${bmi}\n\n`;

  txt += `🎯 Nutrition & Metabolism:\n`;
  txt += `• Phase: ${profile.nutritionGoal.toUpperCase()}\n`;
  txt += `• Activity Multiplier: x${profile.activity}\n`;

  if (latestSnapshot && latestSnapshot.notes) {
    txt += `\n📝 Latest Check-in Notes: "${latestSnapshot.notes}"\n`;
  }

  txt += `\nTracked securely via MIT2FIT Intelligence Protocol.`;
  return txt;
}
