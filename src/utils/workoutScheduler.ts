import {
  EXERCISE_DATABASE,
  ExperienceLevel,
  RoutineTemplate,
  SplitCategory,
} from '../data/exerciseLibrary';
import {
  ROUTINE_DEFINITIONS,
  buildParametricRoutine,
} from '../data/routineLookupTable';

export type ScheduledSourceType = 'parametric' | 'custom_routine' | 'ad_hoc';

export interface ScheduledWorkoutItem {
  id: string;
  date: string; // YYYY-MM-DD (local time)
  sourceType: ScheduledSourceType;
  routineId?: string; // parametric defId (e.g. 'upper-split') or RoutineTemplate.id
  level?: ExperienceLevel;
  title: string;
  split: SplitCategory | 'Custom';
  time: string; // HH:MM (24h)
  durationMin: number;
  reminderMinutesBefore: number; // 0, 15, 30, 60, or -1 for disabled
  notes?: string;
  customExerciseIds?: string[];
  status: 'scheduled' | 'completed';
  notifiedAt?: string;
}

export interface WeeklyBlueprintSlot {
  enabled: boolean;
  sourceType: 'parametric' | 'custom_routine';
  routineId: string;
  level: ExperienceLevel;
  title: string;
  split: SplitCategory | 'Custom';
  time: string;
  durationMin: number;
  reminderMinutesBefore: number;
}

export type WeeklyBlueprint = Record<number, WeeklyBlueprintSlot | null>; // 0 (Sun) - 6 (Sat)

export const SCHEDULE_STORAGE_KEY = 'mit2fit_monthly_schedule_v1';
export const BLUEPRINT_STORAGE_KEY = 'mit2fit_weekly_blueprint_v1';

export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function getMonthCalendarCells(year: number, monthIndex: number): { dateKey: string; day: number; inMonth: boolean; dayOfWeek: number }[] {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  // Monday-start grid: Mon=0 ... Sun=6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const cells: { dateKey: string; day: number; inMonth: boolean; dayOfWeek: number }[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    const prevDate = new Date(year, monthIndex, -i);
    cells.push({
      dateKey: toLocalDateKey(prevDate),
      day: prevDate.getDate(),
      inMonth: false,
      dayOfWeek: prevDate.getDay(),
    });
  }

  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, monthIndex, day);
    cells.push({
      dateKey: toLocalDateKey(d),
      day,
      inMonth: true,
      dayOfWeek: d.getDay(),
    });
  }

  const trailingCount = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= trailingCount; i++) {
    const nextDate = new Date(year, monthIndex + 1, i);
    cells.push({
      dateKey: toLocalDateKey(nextDate),
      day: nextDate.getDate(),
      inMonth: false,
      dayOfWeek: nextDate.getDay(),
    });
  }

  return cells;
}

export function getDefaultWeeklyBlueprint(): WeeklyBlueprint {
  const defUpper = ROUTINE_DEFINITIONS.find((d) => d.id === 'upper-split') || ROUTINE_DEFINITIONS[0];
  const defLower = ROUTINE_DEFINITIONS.find((d) => d.id === 'lower-split') || ROUTINE_DEFINITIONS[0];
  const defPush = ROUTINE_DEFINITIONS.find((d) => d.id === 'push-split') || ROUTINE_DEFINITIONS[0];
  const defPull = ROUTINE_DEFINITIONS.find((d) => d.id === 'pull-split') || ROUTINE_DEFINITIONS[0];

  return {
    0: null, // Sun - Rest
    1: {
      enabled: true,
      sourceType: 'parametric',
      routineId: defUpper.id,
      level: 'Intermediate',
      title: defUpper.name,
      split: defUpper.split,
      time: '07:00',
      durationMin: defUpper.estimatedDurationMin,
      reminderMinutesBefore: 30,
    },
    2: {
      enabled: true,
      sourceType: 'parametric',
      routineId: defLower.id,
      level: 'Intermediate',
      title: defLower.name,
      split: defLower.split,
      time: '07:00',
      durationMin: defLower.estimatedDurationMin,
      reminderMinutesBefore: 30,
    },
    3: null, // Wed - Rest
    4: {
      enabled: true,
      sourceType: 'parametric',
      routineId: defPush.id,
      level: 'Intermediate',
      title: defPush.name,
      split: defPush.split,
      time: '07:00',
      durationMin: defPush.estimatedDurationMin,
      reminderMinutesBefore: 30,
    },
    5: {
      enabled: true,
      sourceType: 'parametric',
      routineId: defPull.id,
      level: 'Intermediate',
      title: defPull.name,
      split: defPull.split,
      time: '07:00',
      durationMin: defPull.estimatedDurationMin,
      reminderMinutesBefore: 30,
    },
    6: null, // Sat - Rest
  };
}

export function buildPresetBlueprint(
  presetKey: 'upper-lower-4' | 'ppl-3' | 'full-body-3',
  level: ExperienceLevel,
  defaultTime: string,
  reminderMinutesBefore: number
): WeeklyBlueprint {
  const makeSlot = (defId: string): WeeklyBlueprintSlot => {
    const def = ROUTINE_DEFINITIONS.find((d) => d.id === defId) || ROUTINE_DEFINITIONS[0];
    return {
      enabled: true,
      sourceType: 'parametric',
      routineId: def.id,
      level,
      title: def.name,
      split: def.split,
      time: defaultTime,
      durationMin: def.estimatedDurationMin,
      reminderMinutesBefore,
    };
  };

  if (presetKey === 'upper-lower-4') {
    return {
      0: null,
      1: makeSlot('upper-split'),
      2: makeSlot('lower-split'),
      3: null,
      4: makeSlot('upper-split'),
      5: makeSlot('lower-split'),
      6: null,
    };
  }

  if (presetKey === 'ppl-3') {
    return {
      0: null,
      1: makeSlot('push-split'),
      2: null,
      3: makeSlot('pull-split'),
      4: null,
      5: makeSlot('lower-split'),
      6: null,
    };
  }

  return {
    0: null,
    1: makeSlot('full-body'),
    2: null,
    3: makeSlot('full-body'),
    4: null,
    5: makeSlot('core-conditioning'),
    6: null,
  };
}

export function loadStoredSchedule(): ScheduledWorkoutItem[] {
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore parse error
  }
  return [];
}

export function loadStoredBlueprint(): WeeklyBlueprint {
  try {
    const raw = localStorage.getItem(BLUEPRINT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    // Ignore parse error
  }
  return getDefaultWeeklyBlueprint();
}

export function generateMonthFromBlueprint(
  year: number,
  monthIndex: number,
  blueprint: WeeklyBlueprint,
  existingItems: ScheduledWorkoutItem[],
  options: { onlyUpcoming: boolean; overwriteExisting: boolean }
): ScheduledWorkoutItem[] {
  const todayKey = toLocalDateKey(new Date());
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const existingByDate = new Map(existingItems.map((item) => [item.date, item]));
  const generatedMap = new Map(existingItems.map((item) => [item.date, item]));

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, monthIndex, day);
    const dateKey = toLocalDateKey(dateObj);
    if (options.onlyUpcoming && dateKey < todayKey) continue;

    const slot = blueprint[dateObj.getDay()];
    const hasExisting = existingByDate.has(dateKey);

    if (hasExisting && !options.overwriteExisting) {
      continue;
    }

    if (!slot || !slot.enabled) {
      if (options.overwriteExisting && hasExisting) {
        const current = existingByDate.get(dateKey);
        if (current?.status !== 'completed') {
          generatedMap.delete(dateKey);
        }
      }
      continue;
    }

    const previous = existingByDate.get(dateKey);
    if (previous?.status === 'completed') continue;

    generatedMap.set(dateKey, {
      id: previous?.id || `sched-${dateKey}-${Date.now()}-${day}`,
      date: dateKey,
      sourceType: slot.sourceType,
      routineId: slot.routineId,
      level: slot.level,
      title: slot.title,
      split: slot.split,
      time: slot.time,
      durationMin: slot.durationMin,
      reminderMinutesBefore: slot.reminderMinutesBefore,
      status: 'scheduled',
    });
  }

  return Array.from(generatedMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function resolveScheduledExercisesSummary(
  item: ScheduledWorkoutItem,
  routines: RoutineTemplate[]
): string[] {
  if (item.sourceType === 'parametric' && item.routineId) {
    const routine = buildParametricRoutine(item.routineId, item.level || 'Intermediate');
    return routine.exerciseIds.map((exId) => {
      const def = EXERCISE_DATABASE.find((e) => e.id === exId);
      const cfg = routine.exerciseConfigs?.find((c) => c.exerciseId === exId);
      return `${def?.name || exId}${cfg ? ` (${cfg.targetSets}x${cfg.targetReps})` : ''}`;
    });
  }

  if (item.sourceType === 'custom_routine' && item.routineId) {
    const routine = routines.find((r) => r.id === item.routineId);
    if (routine) {
      return routine.exerciseIds.map((exId) => {
        const def = EXERCISE_DATABASE.find((e) => e.id === exId);
        const cfg = routine.exerciseConfigs?.find((c) => c.exerciseId === exId);
        return `${def?.name || exId}${cfg ? ` (${cfg.targetSets}x${cfg.targetReps})` : ''}`;
      });
    }
  }

  if (item.customExerciseIds && item.customExerciseIds.length > 0) {
    return item.customExerciseIds.map((exId) => {
      const def = EXERCISE_DATABASE.find((e) => e.id === exId);
      return def?.name || exId;
    });
  }

  return ['Open Mit2Fit Tracker to log your sets and progressive overload targets.'];
}

function formatICSDateTime(dateKey: string, timeStr: string, addMinutes = 0): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const [hh, mm] = (timeStr || '07:00').split(':').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, hh || 7, (mm || 0) + addMinutes, 0);

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
}

function formatICSUtcStamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
}

function escapeICSText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

export function generateScheduleICS(
  items: ScheduledWorkoutItem[],
  routines: RoutineTemplate[]
): string {
  const stamp = formatICSUtcStamp();
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mit2Fit//Workout Calendar Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Mit2Fit Workout Schedule',
  ];

  items.forEach((item) => {
    const dtStart = formatICSDateTime(item.date, item.time, 0);
    const dtEnd = formatICSDateTime(item.date, item.time, item.durationMin || 55);
    const exercises = resolveScheduledExercisesSummary(item, routines);
    const descriptionParts = [
      `Mit2Fit Scheduled Workout (${item.split}${item.level ? ` - ${item.level}` : ''})`,
      '',
      'Exercises:',
      ...exercises.map((ex, i) => `${i + 1}. ${ex}`),
    ];
    if (item.notes) {
      descriptionParts.push('', `Notes: ${item.notes}`);
    }

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${item.id}@mit2fit.app`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEnd}`);
    lines.push(`SUMMARY:${escapeICSText(`Workout: ${item.title}`)}`);
    lines.push(`DESCRIPTION:${escapeICSText(descriptionParts.join('\n'))}`);
    lines.push('STATUS:CONFIRMED');

    if (item.reminderMinutesBefore >= 0) {
      lines.push('BEGIN:VALARM');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:${escapeICSText(`Time for ${item.title}`)}`);
      lines.push(`TRIGGER:-PT${Math.max(0, item.reminderMinutesBefore)}M`);
      lines.push('END:VALARM');
    }

    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadScheduleICS(
  items: ScheduledWorkoutItem[],
  routines: RoutineTemplate[],
  filename: string
): boolean {
  if (items.length === 0) return false;
  const content = generateScheduleICS(items, routines);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

export function buildGoogleCalendarUrl(
  item: ScheduledWorkoutItem,
  routines: RoutineTemplate[]
): string {
  const start = formatICSDateTime(item.date, item.time, 0);
  const end = formatICSDateTime(item.date, item.time, item.durationMin || 55);
  const exercises = resolveScheduledExercisesSummary(item, routines);
  const details = [
    `Mit2Fit Scheduled Workout (${item.split}${item.level ? ` - ${item.level}` : ''})`,
    '',
    'Planned Movements:',
    ...exercises.map((e, i) => `${i + 1}. ${e}`),
    ...(item.notes ? ['', `Notes: ${item.notes}`] : []),
  ].join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Workout: ${item.title}`,
    dates: `${start}/${end}`,
    details,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
