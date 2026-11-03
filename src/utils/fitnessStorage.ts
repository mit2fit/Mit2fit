/**
 * MIT2FIT Unified Fitness & Biometrics Persistence Engine
 * Seamless, zero-login, 100% private client-side storage
 * Synchronizes profiles, snapshots, and history across Tools, Dashboard, and Tracker.
 */

export interface BiometricProfile {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'male' | 'female';
  activity: number;
  waistCm: number;
  hipCm: number;
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
  whr: number;
  bmi: number;
  bodyFat: number;
  tdee: number;
  targetCalories: number;
  goal: 'cut' | 'maintain' | 'bulk';
  notes?: string;
}

export const PROFILE_STORAGE_KEY = 'mit2fit_biometric_profile_v2';
export const HISTORY_STORAGE_KEY = 'mit2fit_biometric_history_v2';
export const PROTOCOL_KEY_STORAGE = 'mit2fit_protocol_key';

export const DEFAULT_PROFILE: BiometricProfile = {
  weightKg: 76,
  heightCm: 178,
  age: 28,
  gender: 'male',
  activity: 1.55,
  waistCm: 82,
  hipCm: 98,
  unitSystem: 'metric',
  nutritionGoal: 'maintain',
  protocolKey: 'MIT-FIT-782',
  updatedAt: new Date().toISOString()
};

// Seed realistic progression history so user immediately has context and historical trajectory
export const SEED_BIOMETRIC_HISTORY: BiometricSnapshot[] = [
  {
    id: 'snap-seed-1',
    date: new Date(Date.now() - 21 * 86400000).toISOString(),
    weightKg: 78.2,
    heightCm: 178,
    waistCm: 84.5,
    hipCm: 98.0,
    whr: 0.86,
    bmi: 24.7,
    bodyFat: 17.6,
    tdee: 2580,
    targetCalories: 2080,
    goal: 'cut',
    notes: 'Initial protocol baseline check-in. Started clean nutrition and double progression.'
  },
  {
    id: 'snap-seed-2',
    date: new Date(Date.now() - 10 * 86400000).toISOString(),
    weightKg: 77.0,
    heightCm: 178,
    waistCm: 83.0,
    hipCm: 98.0,
    whr: 0.85,
    bmi: 24.3,
    bodyFat: 16.8,
    tdee: 2550,
    targetCalories: 2050,
    goal: 'cut',
    notes: 'Waist down 1.5cm. Strength sustained on compound presses.'
  },
  {
    id: 'snap-seed-3',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    weightKg: 76.0,
    heightCm: 178,
    waistCm: 82.0,
    hipCm: 98.0,
    whr: 0.84,
    bmi: 24.0,
    bodyFat: 16.1,
    tdee: 2520,
    targetCalories: 2520,
    goal: 'maintain',
    notes: 'Transitioned to maintenance phase. Waist-to-hip ratio in optimal low-risk zone.'
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
        return { ...DEFAULT_PROFILE, ...parsed, protocolKey: key };
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
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load biometric history', e);
  }
  // If no history exists, use seed history
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
  let csv = 'Date,Weight,Height,Waist,Hip,WHR,BMI,BodyFat_Pct,TDEE,Target_Calories,Goal,Notes\n';
  history.forEach(item => {
    const date = new Date(item.date).toISOString().split('T')[0];
    const weightStr = unitSystem === 'metric' ? `${item.weightKg} kg` : `${Math.round(item.weightKg * 2.20462)} lbs`;
    const heightStr = unitSystem === 'metric' ? `${item.heightCm} cm` : `${(item.heightCm * 0.393701).toFixed(1)} in`;
    const waistStr = unitSystem === 'metric' ? `${item.waistCm} cm` : `${(item.waistCm * 0.393701).toFixed(1)} in`;
    const hipStr = unitSystem === 'metric' ? `${item.hipCm} cm` : `${(item.hipCm * 0.393701).toFixed(1)} in`;
    const notesClean = (item.notes || '').replace(/"/g, '""');

    csv += `"${date}","${weightStr}","${heightStr}","${waistStr}","${hipStr}",${item.whr},${item.bmi},${item.bodyFat},${item.tdee},${item.targetCalories},"${item.goal}","${notesClean}"\n`;
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
    : `${Math.round(profile.weightKg * 2.20462)} lbs`;
  const waistDisplay = unitSystem === 'metric' 
    ? `${profile.waistCm} cm` 
    : `${(profile.waistCm * 0.393701).toFixed(1)} in`;
  const hipDisplay = unitSystem === 'metric' 
    ? `${profile.hipCm} cm` 
    : `${(profile.hipCm * 0.393701).toFixed(1)} in`;

  const whr = (profile.hipCm > 0 ? profile.waistCm / profile.hipCm : 0.85).toFixed(2);
  const heightM = profile.heightCm / 100;
  const bmi = (profile.weightKg / (heightM * heightM)).toFixed(1);
  const bfFactor = profile.gender === 'male' ? 1 : 0;
  const bodyFat = Math.max(3, (1.20 * Number(bmi)) + (0.23 * profile.age) - (10.8 * bfFactor) - 5.4).toFixed(1);

  let txt = `📊 MIT2FIT Biometric Performance Report\n`;
  txt += `🔑 Protocol Key: ${profile.protocolKey || 'MIT-SECURE'}\n`;
  txt += `📅 Date: ${dateStr}\n\n`;

  txt += `⚡ Biometric Baseline:\n`;
  txt += `• Weight: ${weightDisplay} | Height: ${profile.heightCm} cm\n`;
  txt += `• Age: ${profile.age} yrs | Gender: ${profile.gender.toUpperCase()}\n`;
  txt += `• Waist: ${waistDisplay} | Hip: ${hipDisplay}\n`;
  txt += `• Waist-to-Hip Ratio (WHR): ${whr}\n`;
  txt += `• Body Fat Estimate: ${bodyFat}%\n`;
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
