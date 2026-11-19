import { RoutineTemplate } from '../data/exerciseLibrary';
import { ScheduledWorkoutItem, WeeklyBlueprint } from './workoutScheduler';
import { BiometricSnapshot } from './fitnessStorage';

export interface MergeResult<T> {
  merged: T[];
  addedCount: number;
  duplicateCount: number;
}

function workoutSignature(w: {
  date?: string;
  title?: string;
  totalVolume?: number;
  totalSets?: number;
}): string {
  const isoSec = (w.date || '').slice(0, 19);
  const title = (w.title || '').trim().toLowerCase();
  return `${isoSec}|${title}|${w.totalVolume ?? 0}|${w.totalSets ?? 0}`;
}

export function mergeWorkoutHistories<
  T extends {
    id: string;
    date: string;
    title: string;
    totalVolume: number;
    totalSets: number;
  }
>(existing: T[], incoming: T[]): MergeResult<T> {
  const seenIds = new Set(existing.map((w) => w.id).filter(Boolean));
  const seenSigs = new Set(existing.map(workoutSignature));

  const additions: T[] = [];
  let duplicateCount = 0;

  for (const item of incoming) {
    if (!item || !item.date) continue;
    const sig = workoutSignature(item);
    if ((item.id && seenIds.has(item.id)) || seenSigs.has(sig)) {
      duplicateCount += 1;
      continue;
    }
    if (item.id) seenIds.add(item.id);
    seenSigs.add(sig);
    additions.push(item);
  }

  const merged = [...existing, ...additions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return {
    merged,
    addedCount: additions.length,
    duplicateCount,
  };
}

export const ROUTINES_STORAGE_KEY = 'mit2fit_workout_routines_v4';
const ROUTINE_CODE_PREFIX = 'MIT2FIT-ROUTINES:';

function customRoutineSignature(r: RoutineTemplate): string {
  const name = (r.name || '').trim().toLowerCase();
  const ids = (r.exerciseIds || []).join(',');
  const cfgSig = (r.exerciseConfigs || [])
    .map((c) => `${c.exerciseId}:${c.targetSets}x${c.targetReps}@${c.targetWeight}`)
    .join(',');
  return `${name}|${ids}|${cfgSig}`;
}

export function mergeRoutineLibraries(
  existing: RoutineTemplate[],
  incoming: RoutineTemplate[]
): { merged: RoutineTemplate[]; addedCount: number; duplicateCount: number } {
  const merged = [...existing];
  const indexById = new Map<string, number>();
  const seenSigs = new Set<string>();

  existing.forEach((r, idx) => {
    if (r?.id) indexById.set(r.id, idx);
    seenSigs.add(customRoutineSignature(r));
  });

  let addedCount = 0;
  let duplicateCount = 0;

  for (const item of incoming) {
    if (!item || !item.id || !Array.isArray(item.exerciseIds)) continue;
    const sig = customRoutineSignature(item);
    const existingIdx = indexById.get(item.id);

    if (existingIdx !== undefined) {
      const current = merged[existingIdx];
      // Allow a restored custom override to replace an untouched stock preset
      if (item.isCustom && !current.isCustom) {
        merged[existingIdx] = { ...item, isCustom: true, level: item.level || 'Intermediate' };
        seenSigs.add(sig);
        addedCount += 1;
        continue;
      }
      duplicateCount += 1;
      continue;
    }

    if (seenSigs.has(sig)) {
      duplicateCount += 1;
      continue;
    }

    const normalized: RoutineTemplate = {
      ...item,
      isCustom: item.isCustom ?? true,
      level: item.level || 'Intermediate',
    };
    indexById.set(normalized.id, merged.length);
    seenSigs.add(sig);
    merged.push(normalized);
    addedCount += 1;
  }

  return {
    merged,
    addedCount,
    duplicateCount,
  };
}

export function mergeWithDefaultRoutines(
  defaults: RoutineTemplate[],
  incoming: RoutineTemplate[]
): RoutineTemplate[] {
  const normalizedIncoming = incoming
    .filter((r) => r && r.id && Array.isArray(r.exerciseIds))
    .map((r) => ({ ...r, level: r.level || 'Intermediate' }));
  const incomingById = new Map(normalizedIncoming.map((r) => [r.id, r]));
  const defaultIds = new Set(defaults.map((d) => d.id));
  const mergedDefaults = defaults.map((d) => incomingById.get(d.id) || d);
  const extraRoutines = normalizedIncoming.filter((r) => !defaultIds.has(r.id));
  return [...mergedDefaults, ...extraRoutines];
}

export function extractRoutinesFromParsed(parsed: unknown): RoutineTemplate[] {
  if (!parsed) return [];
  const rawList: unknown[] = Array.isArray(parsed)
    ? parsed
    : typeof parsed === 'object'
    ? [
        ...(Array.isArray((parsed as { customRoutines?: unknown[] }).customRoutines)
          ? (parsed as { customRoutines: unknown[] }).customRoutines
          : []),
        ...(Array.isArray((parsed as { routines?: unknown[] }).routines)
          ? (parsed as { routines: unknown[] }).routines
          : []),
      ]
    : [];

  const seenIds = new Set<string>();
  const valid: RoutineTemplate[] = [];
  for (const item of rawList) {
    if (
      item &&
      typeof item === 'object' &&
      typeof (item as RoutineTemplate).id === 'string' &&
      typeof (item as RoutineTemplate).name === 'string' &&
      Array.isArray((item as RoutineTemplate).exerciseIds)
    ) {
      const r = item as RoutineTemplate;
      if (seenIds.has(r.id)) continue;
      seenIds.add(r.id);
      valid.push(r);
    }
  }
  return valid;
}

export function encodeRoutineBackupCode(customRoutines: RoutineTemplate[]): string {
  const payload = {
    appName: 'Mit2Fit',
    type: 'custom-routines',
    version: 1,
    exportedAt: new Date().toISOString(),
    customRoutines: customRoutines.map((r) => ({ ...r, isCustom: true })),
  };
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `${ROUTINE_CODE_PREFIX}${btoa(binary)}`;
}

export function decodeRoutineBackupInput(rawInput: string): RoutineTemplate[] {
  const trimmed = rawInput.trim();
  if (!trimmed) return [];

  let jsonText = trimmed;
  if (trimmed.startsWith(ROUTINE_CODE_PREFIX)) {
    const encoded = trimmed.slice(ROUTINE_CODE_PREFIX.length).trim();
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    jsonText = new TextDecoder().decode(bytes);
  }

  const parsed = JSON.parse(jsonText);
  return extractRoutinesFromParsed(parsed).map((r) => ({ ...r, isCustom: true }));
}

export function loadStoredCustomRoutinesFromStorage(): RoutineTemplate[] {
  try {
    const saved =
      localStorage.getItem(ROUTINES_STORAGE_KEY) ||
      localStorage.getItem('mit2fit_workout_routines_v3');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is RoutineTemplate =>
        Boolean(r && r.isCustom && typeof r.id === 'string' && Array.isArray(r.exerciseIds))
    );
  } catch {
    return [];
  }
}

export function mergeStoredCustomRoutinesFromStorage(
  incomingCustomRoutines: RoutineTemplate[]
): { addedCount: number; duplicateCount: number } {
  if (!incomingCustomRoutines.length) return { addedCount: 0, duplicateCount: 0 };
  try {
    const saved =
      localStorage.getItem(ROUTINES_STORAGE_KEY) ||
      localStorage.getItem('mit2fit_workout_routines_v3');
    const existing: RoutineTemplate[] = saved ? JSON.parse(saved) : [];
    const normalizedExisting = Array.isArray(existing) ? existing : [];
    const res = mergeRoutineLibraries(
      normalizedExisting,
      incomingCustomRoutines.map((r) => ({ ...r, isCustom: true }))
    );
    localStorage.setItem(ROUTINES_STORAGE_KEY, JSON.stringify(res.merged));
    return { addedCount: res.addedCount, duplicateCount: res.duplicateCount };
  } catch {
    return { addedCount: 0, duplicateCount: 0 };
  }
}

export function mergeScheduledWorkouts(
  existing: ScheduledWorkoutItem[],
  incoming: ScheduledWorkoutItem[]
): { merged: ScheduledWorkoutItem[]; addedCount: number; updatedCount: number } {
  const byDate = new Map<string, ScheduledWorkoutItem>();
  existing.forEach((item) => {
    if (item?.date) byDate.set(item.date, item);
  });

  let addedCount = 0;
  let updatedCount = 0;

  for (const item of incoming) {
    if (!item?.date) continue;
    const current = byDate.get(item.date);
    if (!current) {
      byDate.set(item.date, item);
      addedCount += 1;
    } else if (current.status === 'scheduled' && item.status === 'completed') {
      byDate.set(item.date, { ...current, status: 'completed' });
      updatedCount += 1;
    }
  }

  const merged = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
  return { merged, addedCount, updatedCount };
}

export function mergeWeeklyBlueprints(
  existing: WeeklyBlueprint,
  incoming: WeeklyBlueprint
): WeeklyBlueprint {
  const merged: WeeklyBlueprint = { ...existing };
  Object.keys(incoming).forEach((k) => {
    const idx = Number(k);
    if (!merged[idx] && incoming[idx]) {
      merged[idx] = incoming[idx];
    }
  });
  return merged;
}

function biometricSignature(s: BiometricSnapshot): string {
  const isoSec = (s.date || '').slice(0, 19);
  return `${isoSec}|${s.weightKg}|${s.bodyFat}|${s.waistCm}`;
}

export function mergeBiometricHistories(
  existing: BiometricSnapshot[],
  incoming: BiometricSnapshot[]
): MergeResult<BiometricSnapshot> {
  const seenIds = new Set(existing.map((s) => s.id).filter(Boolean));
  const seenSigs = new Set(existing.map(biometricSignature));

  const additions: BiometricSnapshot[] = [];
  let duplicateCount = 0;

  for (const item of incoming) {
    if (!item || !item.date) continue;
    const sig = biometricSignature(item);
    if ((item.id && seenIds.has(item.id)) || seenSigs.has(sig)) {
      duplicateCount += 1;
      continue;
    }
    if (item.id) seenIds.add(item.id);
    seenSigs.add(sig);
    additions.push(item);
  }

  const merged = [...existing, ...additions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return {
    merged,
    addedCount: additions.length,
    duplicateCount,
  };
}
