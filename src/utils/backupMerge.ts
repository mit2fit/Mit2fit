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

function customRoutineSignature(r: RoutineTemplate): string {
  const name = (r.name || '').trim().toLowerCase();
  const ids = (r.exerciseIds || []).join(',');
  return `${name}|${ids}`;
}

export function mergeRoutineLibraries(
  existing: RoutineTemplate[],
  incoming: RoutineTemplate[]
): { merged: RoutineTemplate[]; addedCount: number; duplicateCount: number } {
  const seenIds = new Set(existing.map((r) => r.id));
  const seenSigs = new Set(existing.map(customRoutineSignature));

  const additions: RoutineTemplate[] = [];
  let duplicateCount = 0;

  for (const item of incoming) {
    if (!item || !item.id || !Array.isArray(item.exerciseIds)) continue;
    // Skip non-custom defaults unless missing
    if (!item.isCustom && seenIds.has(item.id)) {
      duplicateCount += 1;
      continue;
    }
    const sig = customRoutineSignature(item);
    if (seenIds.has(item.id) || seenSigs.has(sig)) {
      duplicateCount += 1;
      continue;
    }
    seenIds.add(item.id);
    seenSigs.add(sig);
    additions.push({ ...item, isCustom: item.isCustom ?? true });
  }

  return {
    merged: [...existing, ...additions],
    addedCount: additions.length,
    duplicateCount,
  };
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
